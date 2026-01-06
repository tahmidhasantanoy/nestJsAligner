import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { AddProductDto, UpdateProductDto } from './Dto/product-dto';

@Controller('sellers')
export class SellersController {

    constructor(private readonly sellersService: SellersService) { }


    /*Add seller products*/
    @Post()
    async addProducts(@Body() addProductDto: AddProductDto) {


        try {
            const newProductInfo = {
                id: Math.random().toString(36).substring(2, 11),
                name: addProductDto.name,
                category: addProductDto.category,
                price: addProductDto.price,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const resFromService = await this.sellersService.addProducts(newProductInfo)

            if (resFromService) {
                return {
                    success: true,
                    message: "Product added successfully",
                    data: resFromService
                }
            }
            else {
                return {
                    success: false,
                    message: "Failed to add product",
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message, "error")
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }

    /*Get all products*/
    @Get()
    async getAllProducts() {

        try {
            const resFromService = await this.sellersService.getAllProducts()

            if (resFromService) {
                return {
                    success: true,
                    message: "Products fetched successfully",
                    data: resFromService
                }
            }
            else {
                return {
                    success: false,
                    message: "Failed to fetch products",
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message, "error")
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }

    // Get a product by id
    @Get(':productId')
    async getProductById(@Param('productId') productId: string) {
        try {

            console.log(productId, "productId")
            const resFromService = await this.sellersService.getProductById(productId);

            if (resFromService) {
                return {
                    success: true,
                    message: "Product fetched successfully",
                    data: resFromService
                }
            }
            else {
                return {
                    success: false,
                    message: "This product is not exist",
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message, "error")
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }

    // Update product
    @Patch(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        try {
            const updateProductInfo = {
                name: updateProductDto.name,
                category: updateProductDto.category,
                price: updateProductDto.price,
                updatedAt: new Date(),
            }

            const resFromService = await this.sellersService.updateProduct(id, updateProductInfo)

            if (resFromService) {
                return {
                    success: true,
                    message: "Product updated successfully",
                    data: resFromService
                }
            }
            else {
                return {
                    success: false,
                    message: "Failed to update product",
                    data: null
                }
            }
        } catch (error) {
            console.log(error.message, "error")
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }

    // Delete a product
    @Delete(':id')
    async deleteProduct(@Param('productId') productId: string) {
        try {
            const resFromService = await this.sellersService.deleteProduct(productId)

            if (resFromService) {
                return {
                    success: true,
                    message: "Product deleted successfully",
                }
            }
            else {
                return {
                    success: false,
                    message: "Failed to delete product",
                }
            }
        } catch (error) {
            console.log(error.message, "error")
            return {
                success: false,
                message: error.message,
            }
        }
    }
}
