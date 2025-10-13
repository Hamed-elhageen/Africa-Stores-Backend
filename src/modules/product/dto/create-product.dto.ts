import { IsNumber, Max, Min, IsOptional, IsInt, IsNotEmpty, IsNotEmptyObject, IsDefined } from "class-validator";
import { Type } from "class-transformer";
import { IsRequiredString } from "src/common/decorators/validation/is-required-string.decorator.ts";

export class CreateProductDto {
  @IsRequiredString()
  name: string;

  @IsRequiredString()
  description: string;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stock: number;
  @IsOptional()
  slug:string;
}
