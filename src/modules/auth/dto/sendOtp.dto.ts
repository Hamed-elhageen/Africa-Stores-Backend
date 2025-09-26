import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class SendOtpDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    handle: string
}