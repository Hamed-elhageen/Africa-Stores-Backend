import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
export const hash = (text: string, saltRound: number = new ConfigService().get("SALT_ROUND")!) =>
    bcrypt.hashSync(text, Number(saltRound))

export const compareHash = (text: string, hash: string) =>
    bcrypt.compareSync(text, hash)


