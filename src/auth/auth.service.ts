import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserV2 } from './schemas/auth.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './Dto/auth-dto';
import jwtHelper from 'src/utils/jwt.utils';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserV2.name) private authModel: Model<UserV2>,
    private configService: ConfigService,
    private userService: UserService,
  ) {} // why this private configService: ConfigService??

  async createUser(newUserInfo: RegisterDto) {
    console.log(Object.keys(this.authModel.schema.paths), 'SCHEMA PATHS');

    try {
      const isExist = await this.authModel.findOne({
        email: newUserInfo.email,
      });
      if (isExist) {
        throw new ConflictException('User already exists');
      }

      // const configService = appConfig
      // const hashedPassword = await bcrypt.hash(newUserInfo.password,saltRounds)
      const hashedPassword = await bcrypt.hash(newUserInfo.password, 10);

      // Explicitly map all fields to ensure fullName is included
      const userData = {
        ...newUserInfo,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Try using new + save instead of create to get better error messages
      const newUser = new this.authModel(userData);
      console.log(newUser, 'newUser');

      const resFromDB = await newUser.save();
      console.log(resFromDB, 'resFromDB');

      return resFromDB;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message, 'error');
      }
      return null;
    }
  }

  async loginUser(loginInfo: { email: string; password: string }) {
    try {
      // Exception handling for login user
      const userInfo = await this.userService.findOne({
        email: loginInfo.email,
      });

      if (!userInfo)
        throw new NotFoundException('No User found with this email');

      const unHashedPwd = await bcrypt.compare(
        loginInfo.password,
        userInfo.password,
      );

      if (userInfo.email !== loginInfo.email || unHashedPwd !== true)
        throw new UnauthorizedException('Invalid email or password');

      const payload = {
        sub: userInfo.fullName,
        email: userInfo.email,
        role: userInfo.role,
      };

      const jwtSecret = (await this.configService.get('jwt.secret')) as string;
      const jwtExpiresIn = (await this.configService.get(
        'jwt.expiresIn',
      )) as string;

      console.log(jwtSecret, 'jwtSecret');
      console.log(jwtExpiresIn, 'jwtExpiresIn');

      // I want to implement the new one here.
      const accessToken: string = jwtHelper.generateToken(
        payload,
        jwtSecret,
        jwtExpiresIn,
      );

      console.log(accessToken, 'accessToken');
      return { accessToken };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }
}
