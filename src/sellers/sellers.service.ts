import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './Schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class SellersService {

    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async addProducts(addproductInfo) {

        try {
            const product = new this.productModel(addproductInfo)
            return product.save()
        } catch (error) {
            console.log(error.message, "error")
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

    async getProductById(productId) {
        try {
            const resFromDB = await this.productModel.findOne({ id: productId })
            return resFromDB;
        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }

    async updateProduct(id, updateProductInfo) {

        try {
            const resFromDB = await this.productModel.findOneAndUpdate({
                id: id
            }, {
                $set: updateProductInfo
            }, {
                new: true, // return the updated document
                runValidators: true, // This is schema validators
            })

            return resFromDB;
        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }

    async deleteProduct(productId) {
        try {
            const resFromDB = await this.productModel.deleteOne({ id: productId })

            if (resFromDB?.acknowledged) {
                return resFromDB;
            }
            else {
                return "Something went wrong";
            }
        } catch (error) {
            console.log(error.message, "error")
            return null;
        }
    }
}
