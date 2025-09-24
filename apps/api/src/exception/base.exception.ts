import { HttpException, HttpStatus } from '@nestjs/common';

export interface BaseExceptionPayload {
  code: string;
  message: string;
  statusCode: HttpStatus;
  details?: unknown;
}

export class BaseException extends HttpException {
  public readonly code: string;
  public readonly details?: unknown;

  constructor({ code, message, statusCode, details }: BaseExceptionPayload) {
    super(message, statusCode);
    this.code = code;
    this.details = details;
  }
}
