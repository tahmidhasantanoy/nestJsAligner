import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { SellersModule } from './sellers/sellers.module';
import { MongooseModule } from '@nestjs/mongoose';


// console.log(ConfigService)
@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true, // it's accessable for all
      load: [databaseConfig, appConfig]
    }
  ), MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      uri: config.get('database.db_url')
    })
  }), SellersModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
