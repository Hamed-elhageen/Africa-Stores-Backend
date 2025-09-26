import { UserRepository } from './../../db/repos/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { compareHash } from 'src/common/security/hash.util';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) { }
  async create(data: CreateUserDto) {
    return this._UserRepository.create({ ...data });
  }
  async validateUser(data:LoginDto){
    const {email,password}=data;
    const user= await this._UserRepository.findOne({filter:{email}})
    if(!user|| !compareHash(password,user.password)){
      throw new UnauthorizedException("Invalid credentials")
    }
    return user;
  }

  async userExistByEmail(handle:string){
    const user = await this._UserRepository.findOne({filter:{email:handle}})
    return user;
  }
  


 
}
