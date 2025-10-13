import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationException } from "src/common/exceptions/validation.exception";

@Injectable()
export class ThumbnailRequiredPipe implements PipeTransform {
    transform(value: any) {
        if (!value || !value.thumbnail || value.thumbnail.length === 0) {
            throw new ValidationException({thumbnail: 'Thumbnail image is required'});
        }
        return value;
    }

}