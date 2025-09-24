import { HttpStatus } from '@nestjs/common';
import { ErrorHandler } from '../../interface/error-handler.interface';
import { ErrorResponse } from '../../interface/response.interface';

export abstract class BaseErrorHandler implements ErrorHandler {
  abstract canHandle(exception: unknown): boolean;
  abstract handle(exception: unknown): ErrorResponse;

  protected createErrorResponse(
    statusCode: HttpStatus,
    code: string,
    message: string,
    details?: unknown
  ): ErrorResponse {
    return {
      success: false,
      statusCode,
      error: {
        code,
        message,
        details,
      },
    };
  }
}
