import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { authGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new authGuard()) // This is a global guard for all routes.
  // Why we are using 'new' keyword here? because we are using a class as a guard and we need to create an instance of the class.
  // Why we call the Guard here? because we are using a class as a guard and we need to create an instance of the class.

  const configService = app.get(ConfigService)
  const port = configService.get('app.port')

  await app.listen(port);
}
bootstrap();
