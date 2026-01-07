import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, UserDto } from './Dto/user-dto';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }


}
