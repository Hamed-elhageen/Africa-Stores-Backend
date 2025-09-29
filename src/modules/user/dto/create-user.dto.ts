import { Match } from 'src/common/decorators/validation/match.decorator';
import { IsEmail, IsString } from "class-validator"
import { IsRequiredString } from 'src/common/decorators/validation/is-required-string.decorator.ts';


export class CreateUserDto {
    @IsRequiredString()
    name: string

    @IsRequiredString()
    @IsEmail()
    email: string

    @IsRequiredString()
    password: string

    @IsRequiredString()
    @Match('password', { message: 'Passwords must match!' })
    password_confirmation: string
}
