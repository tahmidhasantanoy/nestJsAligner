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

  async updateUser(
    id: string,
    updateData: { fullName?: string; email?: string },
  ) {
    const isExist = await this.userModel.findOne({ id: id });

    if (!isExist) return 'User not found';

    const update = await this.userModel.findOneAndUpdate(
      { id: isExist.id },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );
    return update;
  }
}
