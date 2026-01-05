import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';


// console.log(ConfigService)
@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true, // it's accessable for all
      load: [databaseConfig, appConfig]
    }
  )],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
