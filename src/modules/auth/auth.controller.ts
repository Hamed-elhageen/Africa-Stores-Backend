import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/sendOtp.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }
  @Post("login")
  login(@Body() data: LoginDto){
    return this.authService.login(data);
  }

  @Post("send_otp")
  sendOtp(@Body() data: SendOtpDto){
    return this.authService.sendOtp(data);
  }

  @Post("verify_user")
  verifyUser(@Body() data: VerifyUserDto){
    return this.authService.verfiyUser(data);
  }
  @Post("verify_user/resend")
  resendOtp(@Body() data: ResendOtpDto){
    return this.authService.resendOtp(data);
  }





}
