import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

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


}
