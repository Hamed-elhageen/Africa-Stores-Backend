import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OtpRepository } from 'src/db/repos/otp.repository';
import { OtpModel} from 'src/db/models/otp.model';

@Module({
  imports: [UserModule, OtpModel],
  controllers: [AuthController],
  providers: [AuthService, JwtService, OtpRepository],
})
export class AuthModule { }
