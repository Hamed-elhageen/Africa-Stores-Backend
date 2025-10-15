import { Type } from "class-transformer";
import { IsIn, IsInt, Min, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { PaginationDto } from "src/modules/category/dto/pagnition.dto";

class PriceDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min?: number
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max?: number
}
class SortByDto {
    @IsOptional()
    @IsString()
    by?: string
    @IsOptional()
    @IsIn([-1, 1])
    @Type(() => Number)
    dir?: -1 | 1
}
export class FindProductsDto {
    @IsOptional()
    @IsMongoId()
    category?: Types.ObjectId

    @IsOptional()
    @IsString()
    k?: string

    @IsOptional()
    @Type(() => PriceDto)
    @ValidateNested()
    price?: PriceDto

    @IsOptional()
    @Type(() => SortByDto)
    @ValidateNested()
    sort?: SortByDto

    @IsOptional()
    @Type(() => PaginationDto)
    @ValidateNested()
    pagination?: PaginationDto

    @IsOptional()
    @IsString()
    club?: string


}
