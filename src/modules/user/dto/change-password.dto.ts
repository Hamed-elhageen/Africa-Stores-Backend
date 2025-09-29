import {
    IsNotEmpty,
    IsString,
    IsDefined

} from 'class-validator'
import { IsRequiredString } from 'src/common/decorators/validation/is-required-string.decorator.ts';
import { Match } from 'src/common/decorators/validation/match.decorator';
export class ChangePasswordDto {
    @IsRequiredString()
    old_password: string;
    @IsRequiredString()
    new_password: string;
    @IsRequiredString()
    @Match('new_password', { message: 'Passwords must match!' })
    new_password_confirmation: string
}