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

    async loginUser(loginInfo) {

        try {
            const resFromDB = await this.userModel.findOne({ email: loginInfo.email })
            if (!resFromDB) {
                return "No User found with this email"
            }

            if (resFromDB.email !== loginInfo.email && resFromDB.password !== loginInfo.password) {
                return "Invalid email or password"
            }
            else {
                return "Login successful"
            }

        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }
}
