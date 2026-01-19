import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/configuration';
import { SellersModule } from './sellers/sellers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { loggerMiddleware } from './common/middlewares/logger.middleware';
// import { UserController } from './user/user.controller';
import { SellersController } from './sellers/sellers.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './infrastructure/database/database.module';
import { TokenService } from './infrastructure/auth/services/token/token.service';
import { ModuleModule } from './infrastructure/auth/module/module.module';
// import { AuthModule } from './auth/auth.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true, // it's access for all
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
      cache: true, // Avoids re-reading env vars repeatedly.
    }),

    // Cache module
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 100,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get('agenda.uri') as string;

        console.log(dbUrl);

        if (!dbUrl) {
          throw new Error(
            'DB_URL environment variable is not set. Please set it in your .env file.',
          );
        }

        if (
          !dbUrl.startsWith('mongodb://') &&
          !dbUrl.startsWith('mongodb+srv://')
        ) {
          throw new Error(
            `Invalid MongoDB connection string. It must start with "mongodb://" or "mongodb+srv://". Current value: ${dbUrl}`,
          );
        }

        return {
          uri: dbUrl,
        };
      },
    }),
    SellersModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    ModuleModule,
  ],

  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware)
      // .exclude({ path: '', method: RequestMethod.GET }, 'user/*slap')
      .exclude({ path: 'user', method: RequestMethod.GET }, 'user/*slap')
      .forRoutes(SellersController);
    // .forRoutes('*')
    // .forRoutes({ path: 'user/*slap', method: RequestMethod.ALL });
    // .forRoutes(UserController, SellersController); // This middleware will interept for all route.
  }
}
