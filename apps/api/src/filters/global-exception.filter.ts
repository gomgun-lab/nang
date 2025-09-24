import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ErrorHandlerFactory } from './factories/error-handler.factory';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorHandlerFactory: ErrorHandlerFactory) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception);
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown) {
    const handler = this.errorHandlerFactory.getHandler(exception);
    return handler.handle(exception);
  }
}
