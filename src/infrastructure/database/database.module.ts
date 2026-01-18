import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db_url = configService.get<string>('agenda.uri');

        console.log(db_url, 'Can you find database_url');

        return {
          uri: db_url,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
