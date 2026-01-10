import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './Schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(userInfo: { email: string }) {
    try {
      const resFromDB = await this.userModel.findOne({ email: userInfo.email });
      return resFromDB;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findAll() {
    const resFromDB = await this.userModel.find();
    return resFromDB;
  }
}
