
import { IsRequiredString } from 'src/common/decorators/validation/is-required-string.decorator.ts';
import { IsStrongPassword } from 'src/common/decorators/validation/is-strong-password.decorator';
import { Match } from 'src/common/decorators/validation/match.decorator';
export class ChangePasswordDto {
    @IsRequiredString()
    old_password: string;
    @IsRequiredString()
    @IsStrongPassword()
    new_password: string;
    @IsRequiredString()
    @Match('new_password', { message: 'Passwords must match!' })
    new_password_confirmation: string
}