export class UserDto {
    fullName: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'SELLER' | 'USER';
}