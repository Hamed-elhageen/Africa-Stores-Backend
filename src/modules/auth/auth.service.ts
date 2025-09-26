import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService,
    private readonly _JwtService: JwtService
  ) { }
  async register(data: CreateUserDto) {
    const { email, password } = data;
    try {
      const user = await this._UserService.create({ ...data });
      await this._MailerService.sendMail({
        from: this._ConfigService.get<string>('MAIL_USER'),
        to: email,
        subject: 'Account Activation welcome to Africa Store',
        text: "activate Your account"
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
}

