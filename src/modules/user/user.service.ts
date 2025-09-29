import { UserRepository } from './../../db/repos/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { compareHash } from 'src/common/security/hash.util';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  async showProfile(user: any) {
    const profile = await this._UserRepository.findOne({ filter: { _id: user._id }, projection: { password: 0, accoutAcctivated: 0 } });
    return {
      data: profile,
      message: "User profile fetched successfully",
    };
  }

  async updateProfile(user: any, data: UpdateUserDto) {
    const profile = await this._UserRepository.findOne({ filter: { _id: user._id }, projection: { password: 0, accoutAcctivated: 0 } });
    return {
      data: profile,
      message: "User profile updated successfully",
    };
  }

  async changePassword(user: any, data: ChangePasswordDto) {
    const userDoc = await this._UserRepository.findOne({ filter: { _id: user._id } });
    if (userDoc) {
      if (!compareHash(data.old_password, userDoc.password)) {
        throw new UnauthorizedException("Invalid old password");
      }
      userDoc.password = data.new_password;
      await userDoc.save();
    }
    return {
      data: {},
      message: "Password updated successfully",
    };
  }




}
