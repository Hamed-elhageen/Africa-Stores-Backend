import {  IsEmail,  IsNotEmpty, IsString} from "class-validator"
import { IsRequiredString } from "src/common/decorators/validation/is-required-string.decorator.ts";
export class ResendOtpDto {
    @IsEmail()
    @IsRequiredString()
    handle: string;
}