import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(newUserInfo) {
        try {
            const resFromDB = await this.userModel.create(newUserInfo)
            return resFromDB;
        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }
}
