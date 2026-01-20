import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from 'src/auth/Dto/auth-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() registerDto: RegisterDto) {
    try {
      const newUserinfo = {
        id: Math.random().toString(36).substring(2, 11),
        fullName: registerDto.fullName,
        email: registerDto.email,
        password: registerDto.password,
        role: registerDto.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const resFromService = await this.authService.createUser(newUserinfo);

      if (typeof resFromService === 'object') {
        return {
          success: true,
          message: 'User created successfully',
          data: resFromService,
        };
      } else {
        return {
          success: false,
          message: 'Failed to create user',
          data: null,
        };
      }
    } catch (error) {
      console.log(error.message, 'error');
      return {
        success: false,
        message: error.message as string,
        data: null,
      };
    }
  }

  @Post('login')
  // @UseGuards(authGuard) // This guards is work for only this route.
  async loginUser(@Body() loginDto: LoginDto) {
    console.log(loginDto, 'loginDto from infrastructure');
    try {
      const resFromService = await this.authService.loginUser(loginDto);
      console.log(resFromService, 'resFromService');

      return {
        success: true,
        message: 'Login successful',
        accessToken: resFromService.accessToken,
      };
    } catch (error) {
      console.log(error.message, 'error');
      return {
        success: false,
        message: error.message as string,
        data: null,
      };
    }
  }
}
