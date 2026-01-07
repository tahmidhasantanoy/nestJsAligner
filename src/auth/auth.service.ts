import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/auth.schema';
import { RegisterDto } from './Dto/auth-dto';
import * as bcrypt from 'bcrypt';
import appConfig from 'src/config/app.config';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private authModel: Model<User>) { }

    async createUser(newUserInfo: any) {
        try {

            const isExist = await this.authModel.findOne({ email: newUserInfo.email })
            if (isExist) {
                throw new ConflictException("User already exists")
            }

            // const configService = appConfig 
            // const hashedPassword = await bcrypt.hash(newUserInfo.password,saltRounds)
            const hashedPassword = await bcrypt.hash(newUserInfo.password, 10)

            // Explicitly map all fields to ensure fullName is included
            const userData = {
                ...newUserInfo,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            console.log(userData, "userData")
            
            // Try using new + save instead of create to get better error messages
            const newUser = new this.authModel(userData); // can't find fullName after this line.
            console.log(newUser, "newUser") // can't find fullName here.
            
            const resFromDB = await newUser.save();
            return resFromDB;

        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }

    async loginUser(loginInfo) {

        try {
            const resFromDB = await this.authModel.findOne({ email: loginInfo.email })
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
