import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from 'src/auth/Dto/auth-dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import jwtHelper from '../../../utils/jwt.utils';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async createUser(newUserInfo: RegisterDto) {
    try {
      const isExist = await this.userService.findOne({
        email: newUserInfo.email,
      });

      if (isExist) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = (await bcrypt.hash(
        newUserInfo.password,
        10,
      )) as string;

      // Explicitly map all fields to ensure fullName is included
      const userData = {
        ...newUserInfo,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // TODO: Implement createUser method in UserService to save user
      // For now returning null as placeholder
      return null;
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

      console.log(userInfo, 'userInfo'); // null

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
