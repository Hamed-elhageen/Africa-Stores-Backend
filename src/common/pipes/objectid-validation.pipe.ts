import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Types } from 'mongoose';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: string) {
        if (!Types.ObjectId.isValid(value)) {
            throw new ValidationException(
                {
                    id: 'ObjectId is not valid',
                }
            );
        }
        return new Types.ObjectId(value);
    }
}
