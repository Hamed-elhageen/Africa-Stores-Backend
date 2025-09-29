import { IsEmail } from 'class-validator';
import { IsRequiredString } from 'src/common/decorators/validation/is-required-string.decorator.ts';
import { Match } from 'src/common/decorators/validation/match.decorator';
export class ResetPasswordDto {
    @IsEmail()
    @IsRequiredString()
    handle: string;

    @IsRequiredString()
    code: string;

    @IsRequiredString()
    password: string;

    @IsRequiredString()
    @Match('password', { message: 'Passwords must match!' })
    password_confirmation: string
}