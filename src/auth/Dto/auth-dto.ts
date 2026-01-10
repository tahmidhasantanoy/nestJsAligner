export class RegisterDto {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SELLER' | 'USER';
}

export class LoginDto {
  email: string;
  password: string;
}
