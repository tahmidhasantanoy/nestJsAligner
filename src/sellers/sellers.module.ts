import { Module } from '@nestjs/common';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './Schemas/product.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],

    /* 
    This registers a MongoDB Model so NestJS can inject it into your service.
    Schema alone ≠ usable
    Schema + forFeature = Model
    Confusing: Is it the model? then why we creating the model in sellersService again?
    */
    controllers: [SellersController],
    providers: [SellersService]
})
export class SellersModule {}
