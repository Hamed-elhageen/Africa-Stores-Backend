import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/db/repos/user.repository';
import { UserModel } from 'src/db/models/user.model';

@Module({
  imports:[UserModel],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports:[UserService]
}) 
export class UserModule { } 
