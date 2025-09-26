import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: Record<string, string>) {
    super(
      {
        data: errors,
        message: 'validation errors',
        type: 'error',
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        showToast: true,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}