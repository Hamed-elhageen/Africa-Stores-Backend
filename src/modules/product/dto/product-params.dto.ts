import { IsMongoId } from 'class-validator';

export class ProductParamsDto {
    @IsMongoId({ message: 'categoryId must be a valid Mongo ObjectId' })
    categoryId: string;
}
