import { IsEmail, IsIn, IsNotEmpty, IsString, ValidateIf } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsIn([Math.random()], { message: "Passwords must match !" })
    @ValidateIf((obj) => obj.password !== obj.password_confirmation)
    password_confirmation: string
}
