import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { SellersModule } from './sellers/sellers.module';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true, // it's accessable for all
      load: [databaseConfig, appConfig]
    }
  ), MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const dbUrl = config.get('database.db_url' as string);


      console.log("Checking the database config", dbUrl) // mongodb+srv://Learn-nestJs:KdwNUMwAGIInvVe3@cluster0.oc9fgut.mongodb.net/?appName=Cluster0
      
      if (!dbUrl) {
        throw new Error('DB_URL environment variable is not set. Please set it in your .env file.');
      }
      
      if (!dbUrl.startsWith('mongodb://') && !dbUrl.startsWith('mongodb+srv://')) {
        throw new Error(`Invalid MongoDB connection string. It must start with "mongodb://" or "mongodb+srv://". Current value: ${dbUrl}`);
      }
      
      return {
        uri: dbUrl
      };
    }
  }), SellersModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
