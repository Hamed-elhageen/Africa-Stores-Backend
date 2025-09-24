import * as bcrypt from 'bcrypt';
import { config } from "dotenv"
config()
export const hash = (text: string, saltRound: number = Number(process.env.SALT_ROUND)) =>
    bcrypt.hashSync(text, saltRound)


export const compareHash = (text: string, hash: string) =>
    bcrypt.compareSync(text, hash)
