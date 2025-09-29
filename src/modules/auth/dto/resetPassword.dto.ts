import { IsEmail, IsNotEmpty, IsString, ValidateIf, IsIn } from 'class-validator';
export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    handle: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsNotEmpty()
    @IsString()
    @IsIn([Math.random()], { message: "Passwords must match !" })
    @ValidateIf((obj) => obj.password !== obj.password_confirmation)
    password_confirmation: string
}