import { IsNotEmpty, IsString } from 'class-validator';
import type { Image } from 'src/common/types/image.type';

export class CreateHomeDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    club: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    season: string;
}
