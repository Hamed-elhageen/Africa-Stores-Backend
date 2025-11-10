import { Matches } from 'class-validator';

export function IsStrongPassword() {
    return Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message:
            'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
    });
}
