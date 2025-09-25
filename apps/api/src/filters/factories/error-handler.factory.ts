import { BaseExceptionHandler } from '../handlers/base-exception.handler';
import { ErrorHandler } from '../../interface/error-handler.interface';

/**
 * @todo: Implement singleton pattern for global instance management
 *
 * Current architecture issues:
 * - Multiple factory instances created across the application
 * - Handler instances duplicated unnecessarily
 * - Potential inconsistency in error handling behavior
 *
 * Singleton implementation plan:
 * ```typescript
 * export class ErrorHandlerFactory {
 *   private static instance: ErrorHandlerFactory;
 *   private readonly handlers: ErrorHandler[] = [
 *     new BaseExceptionHandler(),
 *     new HttpExceptionHandler(),
 *     new PrismaExceptionHandler(),
 *     new FallbackExceptionHandler(),
 *   ];
 *
 *   private constructor() {} // Prevent direct instantiation
 *
 *   static getInstance(): ErrorHandlerFactory {
 *     if (!this.instance) {
 *       this.instance = new ErrorHandlerFactory();
 *     }
 *     return this.instance;
 *   }
 *
 *   getHandler(exception: unknown): ErrorHandler {
 *     return this.handlers.find(h => h.canHandle(exception)) || this.fallbackHandler;
 *   }
 * }
 * ```
 *
 * Alternative: NestJS DI approach
 * - Register as @Injectable() provider in FiltersModule
 * - Inject via constructor in GlobalExceptionFilter
 * - Use APP_FILTER with useExisting for instance reuse
 */
export class ErrorHandlerFactory {
  private readonly handlers: ErrorHandler[] = [new BaseExceptionHandler()];

  getHandler(exception: unknown): ErrorHandler {
    const handler = this.handlers.find(candidate =>
      candidate.canHandle(exception)
    );

    /**
     * @todo: fallback handler (remove '!')
     */
    return handler!;
  }
}
