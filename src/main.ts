import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { loggerMiddleware } from './common/middlewares/logger.middleware';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
// import { authGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'fatal', 'log', 'verbose'],
    });
    // app.useGlobalGuards(new authGuard()) // This is a global guard for all routes.
    // Why we are using 'new' keyword here? because we are using a class as a guard and we need to create an instance of the class.
    // Why we call the Guard here? because we are using a class as a guard and we need to create an instance of the class.

    app.use(loggerMiddleware); // Global middleware .
    const configService = app.get(ConfigService);

    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
        crossOriginEmbedderPolicy: false,
      }),
    );

    const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
    app.enableCors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'UPDATE', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    const port = configService.get<number>('port') || 5132;
    const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

    console.log(port, 'port check');

    await app.listen(port);

    logger.log(`🚀 Template Service is running on: http://localhost:${port}`);
    logger.log(`📝 Environment: ${nodeEnv}`);
    logger.log(`🌐 Global prefix: /api`);
    logger.log(`🔒 CORS enabled for: *`);
    logger.log(`Check this port: ${port}`)
  } catch (error) {
    console.log(`Bug is happening here: ${error}`);
  }
}

bootstrap();
