import { IsDefined, IsUrl } from "class-validator";

export class RemoveImageDto{
    @IsDefined()
    @IsUrl()
    secure_url: string;
}