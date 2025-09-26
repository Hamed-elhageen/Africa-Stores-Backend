import { IsEmail ,IsNotEmpty, IsString } from "class-validator"

export class VerifyUserDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    handle:string 
    @IsNotEmpty()
    @IsString()
    code:string
}