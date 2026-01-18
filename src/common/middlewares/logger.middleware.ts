import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable() // Dependency Injection (DI).
// the Nest Inversion of Control (IoC) container can "inject" other services directly into your middleware's constructor with @Injectable().
export class loggerMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const checkData = this.configService.get<string>('jwt.secret');
      console.log(`Middle is firing where jwtSecret: ${checkData}`);

      next();
    } catch (error) {
      console.log(error, 'Error in Middleware');
      next(error);
    }
  }
}
