import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("profile")
  profile(@CurrentUser() user :any) {
    return this.userService.profile(user)
  }
}
