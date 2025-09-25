import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ErrorHandlerFactory } from './factories/error-handler.factory';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * @todo: Optimize with singleton pattern for global management
   *
   * Current issues:
   * - New ErrorHandlerFactory instance created per GlobalExceptionFilter instance
   * - Memory waste and unnecessary object creation
   * - Inconsistent handler state across different filter instances
   *
   * Improvement strategies:
   * 1. Implement singleton pattern: ErrorHandlerFactory.getInstance()
   * 2. Use NestJS DI container for global instance sharing
   *
   * Benefits of global management:
   * - Memory efficiency through instance reuse
   * - Consistent error handling logic across application
   * - Centralized configuration and state management
   * - Better performance due to reduced object allocation
   *
   * Recommended implementation:
   * ```typescript
   * // Option 1: Singleton pattern
   * private readonly errorHandlerFactory = ErrorHandlerFactory.getInstance();
   *
   * // Option 2: DI injection (preferred for NestJS)
   * constructor(private readonly errorHandlerFactory: ErrorHandlerFactory) {}
   * ```
   */
  private readonly errorHandlerFactory = new ErrorHandlerFactory();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const {
      statusCode,
      error: { code, message, details },
    } = this.buildErrorResponse(exception);

    response.status(statusCode).json({
      success: false,
      statusCode,
      error: {
        code,
        message,
        details,
      },
    });
  }

  private buildErrorResponse(exception: unknown) {
    const handler = this.errorHandlerFactory.getHandler(exception);
    return handler.handle(exception);
  }
}
