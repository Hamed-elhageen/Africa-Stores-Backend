import { IsMongoId, IsNumber, Min } from "class-validator";
import { Types } from "mongoose";

export class AddToCartDto {
    @IsMongoId()
    productId: Types.ObjectId
    @IsNumber()
    @IsNumber()
    @Min(1)
    quantity: number

}
