import { IsEmail} from "class-validator"
import { IsRequiredString } from "src/common/decorators/validation/is-required-string.decorator.ts"

export class LoginDto{
    @IsRequiredString()
    @IsEmail()
    email:string

    @IsRequiredString()
    password:string

}