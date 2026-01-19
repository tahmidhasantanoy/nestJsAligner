import { Module } from '@nestjs/common';
import { TokenService } from './services/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [TokenService], // here i give the provider
  exports: [
    TokenService,
    JwtModule,
  ] /* After adding the JwtModule solve the issue */,
  /* Why it solve the issue after adding the JwtModule??
  What is the relation jwtService with jwtModule || jwtService is used in tokenService? */
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
