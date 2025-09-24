import { BaseErrorHandler } from './base-error.handler';
import { BaseException } from '../../exception/base.exception';
import { ErrorResponse } from '../../interface/response.interface';

export class BaseExceptionHandler extends BaseErrorHandler {
  canHandle(exception: unknown): boolean {
    return exception instanceof BaseException;
  }

  handle(exception: BaseException): ErrorResponse {
    return this.createErrorResponse(
      exception.getStatus(),
      exception.code,
      exception.message,
      exception.details
    );
  }
}
