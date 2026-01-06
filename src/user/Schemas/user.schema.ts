import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document { // Why it's extending Document?

    @Prop({required: true})
    id: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true, enum: ['ADMIN', 'SELLER', 'USER'], default: 'USER'})
    role: string;

    @Prop({required: true})
    createdAt: Date;

    @Prop({required: true})
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);