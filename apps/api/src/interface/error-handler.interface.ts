import { ErrorResponse } from './response.interface';

export interface ErrorHandler {
  canHandle(exception: unknown): boolean;
  handle(exception: unknown): ErrorResponse;
}
