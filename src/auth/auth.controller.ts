import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './Dto/auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    
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
            }

            console.log(newUserinfo, "registerDto")

            const resFromService = await this.authService.createUser(newUserinfo);
            
            if (typeof(resFromService) === 'object') {
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

    @Post('login')
    async loginUser(@Body() loginDto: LoginDto) {
        try {
            const resFromService = await this.authService.loginUser(loginDto)
            if (resFromService) {
                return {
                    success: true,
                    message: "Login successful",
                }
            }
            else {
                return {
                    success: false,
                    message: "Login failed",
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
