import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/db/repos/user.repository';
import { UserModel } from 'src/db/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/db/repos/token.repository';
import { tokenModel } from 'src/db/models/token.model';

@Module({
  imports:[UserModel,tokenModel ],
  controllers: [UserController],
  providers: [UserService, UserRepository , JwtService, TokenRepository],
  exports:[UserService, UserRepository]
}) 
export class UserModule { } 
