import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

interface IDecodedToken {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  validateTokenAndDecode(authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer'))
      throw new UnauthorizedException('Missing authorization');

    const token = authorization.split(' ')[1];

    try {
      // const validateToken = jwtHelper.validateToken(token, secret);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, prettier/prettier
      const validateToken = this.jwtService.verify(token) as IDecodedToken; /* Solve the type issue here */
      /* 
        the secret token come from jwtModule 
        So, the required to give it explicitly.
      */
      return validateToken;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw new UnauthorizedException('Invalid or Expired token');
    }
  }
}
