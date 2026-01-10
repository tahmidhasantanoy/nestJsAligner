/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import jwtHelper from 'src/utils/jwt.utils';
import { ConfigService } from '@nestjs/config';

// What is the meaning of this : @Injectable()? Without any parameter?
// This is a simple who acccept all requests
export class authGuard implements CanActivate {
  // Why use implements CanActivate ?
  /* async  */ canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    /* 
        This line specifically tells Nest: "I know we are using HTTP,
        so give me the standard request object (which contains headers,
        body, and IP).
    */
    const token = this.extractTokenFromHeader(request);
    // const secretKey = ConfigService.get('app.jwtSecret');

    // console.log(secretKey, 'secretKey');

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      //   Verify token and attach user to request object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payloadx = jwtHelper.verifyToken(token, 'sukhethaklevutekilai');
      //   const payload = await this.jwtService.verifyAsync(token, {
      //     secret: 'MY_SECRET_KEY',
      //   });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request['user'] = payloadx;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  //   Understood
  private extractTokenFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    // console.log(request.headers, 'request');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return type === 'Bearer' ? token : undefined;
  }
}
