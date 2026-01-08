import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/auth.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './Dto/auth-dto';
import jwtHelper from 'src/utils/jwt.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private authModel: Model<User>,
        private configService: ConfigService) { } // why this   private configService: ConfigService??

    async createUser(newUserInfo: RegisterDto) {
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
            // Exception handling for login user
            const userInfo = await this.authModel.findOne({ email: loginInfo.email })

            if (!userInfo) throw new NotFoundException("No User found with this email")

            const unHashedPwd = await bcrypt.compare(loginInfo.password, userInfo.password)
            if (userInfo.email !== loginInfo.email || unHashedPwd !== true) throw new UnauthorizedException("Invalid email or password")

            const payload = {
                sub: userInfo.fullName,
                email: userInfo.email,
                role: userInfo.role,
            }

            const jwtSecret = this.configService.get('app.jwtSecret')
            const jwtExpiresIn = this.configService.get('app.jwtExpiresIn')

            console.log(jwtSecret, "jwtSecret")
            console.log(jwtExpiresIn, "jwtExpiresIn")

            const accessToken: string = jwtHelper.generateToken(payload, jwtSecret, jwtExpiresIn);
            console.log(accessToken, "accessToken")
            return { accessToken }

        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new InternalServerErrorException('Login failed');
        }
    }
}
