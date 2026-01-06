import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './Schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class SellersService {

    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async addProducts(addproductInfo) {
        console.log(addproductInfo, "newProductInfo")

        try {
            const product = new this.productModel(addproductInfo)
            return product.save()
        } catch (error) {
            console.log(error, "error")
        }
    }

    async getAllProducts() {
        try {
            const resFromDB = await this.productModel.find()
            return resFromDB;
        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }
}
