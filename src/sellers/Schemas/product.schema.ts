import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//****  Based on this class, data will be stored in the DB. ******/
@Schema() // It's declare Product class is a schema
export class Product extends Document { // Mongo will create a collection "Products" based on class name "Product"

    @Prop({required: true})
    id: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    category: string;

    @Prop({required: true})
    price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product) // Based on the Product class, it will create a schema