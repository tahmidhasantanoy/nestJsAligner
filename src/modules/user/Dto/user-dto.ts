export class UserDto {
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SELLER' | 'USER';
}

export class LoginDto {
  email: string;
  password: string;
}

export class createUserDto {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SELLER' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}
