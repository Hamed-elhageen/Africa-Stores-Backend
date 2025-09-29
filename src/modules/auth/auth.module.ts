import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OtpRepository } from 'src/db/repos/otp.repository';
import { OtpModel} from 'src/db/models/otp.model';
import { TokenRepository } from 'src/db/repos/token.repository';
import { tokenModel } from 'src/db/models/token.model';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Module({
  imports: [UserModule, OtpModel , tokenModel],
  controllers: [AuthController],
  providers: [AuthService, JwtService, OtpRepository, TokenRepository ,{
    provide:APP_GUARD,  // global 
    useClass:AuthGuard
  }],   
})
export class AuthModule { }
