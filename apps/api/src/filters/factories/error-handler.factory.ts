import { Injectable } from '@nestjs/common';
import { BaseExceptionHandler } from '../handlers/base-exception.handler';
import { ErrorHandler } from '../../interface/error-handler.interface';

@Injectable()
export class ErrorHandlerFactory {
  private readonly handlers: ErrorHandler[] = [new BaseExceptionHandler()];

  getHandler(exception: unknown): ErrorHandler {
    const handler = this.handlers.find(candidate =>
      candidate.canHandle(exception)
    );

    if (!handler) {
      /**
       * @todo: fallback handler
       */
      return new BaseExceptionHandler();
    }

    return handler;
  }
}
