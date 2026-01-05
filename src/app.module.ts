import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true, // it's accessable for all
      load: [databaseConfig]
    }
  )],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
