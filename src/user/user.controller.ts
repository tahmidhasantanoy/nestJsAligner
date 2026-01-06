import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './Dto/user-dto';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async createUser(@Body() userDto: UserDto) {
        try {
            const newUserinfo = {
                id: Math.random().toString(36).substring(2, 11),
                fullName: userDto.fullName,
                email: userDto.email,
                password: userDto.password,
                role: userDto.role,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const resFromService = await this.userService.createUser(newUserinfo)
            if (resFromService) {
                return {
                    success: true,
                    message: "User created successfully",
                    data: resFromService
                }
            }
            else {
                return {
                    success: false,
                    message: "Failed to create user",
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message, "error")
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }
}
