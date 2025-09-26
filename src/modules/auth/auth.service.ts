import { hash } from './../../common/security/hash.util';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDto } from './dto/sendOtp.dto';
import { OtpRepository } from 'src/db/repos/otp.repository';
import * as randomstring from 'randomstring';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { compareHash } from 'src/common/security/hash.util';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService,
    private readonly _JwtService: JwtService,
    private readonly _OtpRepository: OtpRepository
  ) { }
  async register(data: CreateUserDto) {
    const { email, password } = data;
    try {
      const userExist = await this._UserService.userExistByEmail(email)
      if (userExist) {
        throw new BadRequestException("Email already exists")
      }
      const user = await this._UserService.create({ ...data });
      const otp = await this._OtpRepository.findOne({ filter: { email } })
      if (otp) await otp.deleteOne();
      const newOtp = randomstring.generate({
        length: 4,
        charset: 'numeric'
      })
      // send email 
      await this._MailerService.sendMail({
        from: this._ConfigService.get<string>('MAIL_USER'),
        to: email,
        subject: 'Account Activation welcome to Africa Store',
        html: `<p>Your OTP code is <b>${newOtp}</b></p>`,
      })
      await this._OtpRepository.create({
        code: newOtp,
        handle: email
      })
      return {
        succes: true,
        message: "User registered successfully and user verification sent",
      };
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async login(data: LoginDto) {
    const user = await this._UserService.validateUser(data)
    if (user.accoutAcctivated === false) {
      throw new ForbiddenException("Please verify your account first")
    }
    const token = this._JwtService.sign({ id: user._id },
      {
        secret: this._ConfigService.get<string>('TOKEN_SECRET'),
        expiresIn: this._ConfigService.get<string>('TOKEN_EXPIRES_IN')
      })
    const refresh_token = this._JwtService.sign({ id: user._id },
      {
        secret: this._ConfigService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this._ConfigService.get<string>('REFRESH_TOKEN_EXPIRES_IN')
      })
    return {
      data: {
        user,
        token,
        refresh_token
      },
      message: "User logged in successfully",
      type: "succes",
      code: 200,
      showToast: true
    }
  }

  async sendOtp(data: SendOtpDto) {
    try {
      const { handle } = data
      const user = await this._UserService.userExistByEmail(handle)
      if (user) throw new BadRequestException("Email Already Activated")
      const otp = await this._OtpRepository.findOne({ filter: { handle } })
      if (otp) await otp.deleteOne();
      const newOtp = randomstring.generate({
        length: 4,
        charset: 'numeric'
      })
      // send email 
      await this._MailerService.sendMail({
        from: this._ConfigService.get<string>('MAIL_USER'),
        to: handle,
        subject: 'Account Activation welcome to Africa Store',
        text: newOtp,
      })
      await this._OtpRepository.create({
        code: newOtp,
        handle
      })
      return {
        succes: true,
        message: "Otp sent to email",
      };

    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async verfiyUser(data: VerifyUserDto) {
    const { handle, code } = data;
    const user = await this._UserService.userExistByEmail(handle)
    if (!user) throw new BadRequestException("User not found")
    if(user.accoutAcctivated) throw new BadRequestException("User already verified")
    const otp = await this._OtpRepository.findOne({ filter: { handle } })
    if (!otp) throw new BadRequestException("expired Otp please resend")
    if (!compareHash(code, otp.code)) throw new BadRequestException("Invalid Otp")
    await user.updateOne({ accoutAcctivated: true })
    await otp.deleteOne();
    return {
      success: true,
      message: "User verified successfully login to continue",
      code: 200,
      showToast: true,
    }
  }
  async resendOtp(data: ResendOtpDto) {
    const { handle } = data;
    const user = await this._UserService.userExistByEmail(handle)
    if (!user) throw new BadRequestException("User not found")
    if (user.accoutAcctivated === true) {
      throw new BadRequestException("User already verified")
    }
    const otp = await this._OtpRepository.findOne({ filter: { handle } })
    if (otp) await otp.deleteOne();
    const newOtp = randomstring.generate({
      length: 4,
      charset: 'numeric'
    })
    await this._OtpRepository.create({
      code: newOtp,
      handle
    })
    await this._MailerService.sendMail({
      from: this._ConfigService.get<string>('MAIL_USER'),
      to: handle,
      subject: 'Account Activation - Africa Store',
      html: `<p>Your OTP code is <b>${newOtp}</b></p>`,
    })

    return {
      success: true,
      message: "Otp sent to email",
      code: 200,
      showToast: true
    }
  }

}
