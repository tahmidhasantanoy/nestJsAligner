import { Body, Controller, Post } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { AddProductDto } from './Dto/product-dto';

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
            console.log(error, "error")
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }
}
