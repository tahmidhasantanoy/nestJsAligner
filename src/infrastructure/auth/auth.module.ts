import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './handlers/auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      //   imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [TokenService, AuthService], // if i don't take it in the provider array. What will happened?
  exports: [TokenService, AuthService, JwtModule],
})
export class AuthModule {}

// @Module({
//   imports: [
//     JwtModule.registerAsync({
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('jwt.secret'),
//       }),
//     }),
//   ],
//   providers: [
//     // JwtAuthGuard,

//     // Services
//     TokenService,
//     // RouteClassifierService,
//     // AuthHandlerRegistry,
//     // RbacPermissionService,

//     // Handlers
//     // AdminAuthHandler,
//     // UserAuthHandler,
//     // BusinessAuthHandler,

//     // Registry setup
//     // {
//     //   provide: 'AUTH_HANDLER_SETUP',
//     //   useFactory: () => {
//     //     return;
//     //   },
//     // },
//   ],
//   exports: [
//     JwtModule,
//     TokenService, // Export TokenService
//   ],
// })
// export class AuthModule {}
