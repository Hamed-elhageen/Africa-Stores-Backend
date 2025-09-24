import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService) { }
  async register(data: CreateUserDto) {
    const {email,password}=data;
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
        message: "User registered successfully",
      };
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
