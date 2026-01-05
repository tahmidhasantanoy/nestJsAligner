import { Module } from '@nestjs/common';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './Schemas/product.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
    controllers: [SellersController],
    providers: [SellersService]
})
export class SellersModule {}
