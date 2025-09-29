import { UserRepository } from './../../db/repos/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { compareHash } from 'src/common/security/hash.util';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) { }
  async create(data: CreateUserDto) {
    return this._UserRepository.create({ ...data });
  }
  async validateUser(data: LoginDto) {
    const { email, password } = data;
    const user = await this._UserRepository.findOne({ filter: { email } })
    if (!user || !compareHash(password, user.password)) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return user;
  }

  async userExistByEmail(handle: string) {
    const user = await this._UserRepository.findOne({ filter: { email: handle } })
    return user;
  }

  async profile(user: any) {
    const profile = await this._UserRepository.findOne({ filter: { _id: user._id }, projection: { password: 0, accoutAcctivated: 0 } });
    return {
      data: profile,
      message: "User profile fetched successfully",
    };
  }




}
