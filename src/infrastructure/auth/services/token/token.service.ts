import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  validateTokenAndDecode(authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer'))
      throw new UnauthorizedException('Missing authorization');

    const token = authorization.split(' ')[1];

    try {
      // const validateToken = jwtHelper.validateToken(token, secret);
      const validateToken = this.jwtService.verify(token); /* Solve the type issue here */
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
