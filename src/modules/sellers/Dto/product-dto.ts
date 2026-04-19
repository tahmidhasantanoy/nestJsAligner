export class AddProductDto {
    name: string;
    category: string;
    price: number;
}

export class UpdateProductDto {
    name?: string;
    category?: string;
    price?: number;
}