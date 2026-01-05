import { Injectable } from '@nestjs/common';

@Injectable()
export class SellersService {
    
    addProducts(addproductInfo) {
        console.log(addproductInfo, "newProductInfo")
    }
}
