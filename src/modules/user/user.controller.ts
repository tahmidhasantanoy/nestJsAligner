import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { authGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('findOne')
  @UseGuards(authGuard)
  async findOne(@Body() userInfo: { email: string }) {
    try {
      const resFromService = await this.userService.findOne(userInfo);
      return {
        success: true,
        messsage: 'Find user',
        data: resFromService,
      };
    } catch (error: any) {
      console.log(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const resFromService = await this.userService.findAll();
      return {
        success: true,
        message: 'Find all users',
        data: resFromService,
      };
    } catch (error: any) {
      console.log(error.message);
    }
  }

  @Post('/create-user')
  async createUser(@Body() createUser: any) {
    try {
      const resFromService = await this.userService.createUser(createUser);

      return {
        success: true,
        message: 'User create successfully',
        data: resFromService,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'User create failed',
        data: null,
      };
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: { fullName?: string; email?: string },
  ) {
    return this.userService.updateUser(id, updateData);
  }
}
