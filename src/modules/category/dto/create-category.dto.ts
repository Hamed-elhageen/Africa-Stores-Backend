import { IsRequiredString } from "src/common/decorators/validation/is-required-string.decorator.ts";

export class CreateCategoryDto {
    @IsRequiredString()
    name: string
}
