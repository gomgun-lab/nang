import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../interface/response.interface';

export class FallbackExceptionHandler {
  canHandle(): boolean {
    return true;
  }

  handle(exception: unknown): ErrorResponse {
    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}
