import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';
import { SuccessResponse } from '../interface/response.interface';

interface MockResponse {
  statusCode: number;
}

interface MockRequest {
  url: string;
}

interface MockHttpContext {
  getResponse(): MockResponse;
  getRequest(): MockRequest;
}

/**
 * @todo: fix this
 */
//@ts-ignore
interface MockExecutionContext extends Partial<ExecutionContext> {
  switchToHttp(): MockHttpContext;
}

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: MockExecutionContext;
  let mockCallHandler: CallHandler<any>;
  let mockResponse: MockResponse;
  let mockRequest: MockRequest;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();

    mockResponse = {
      statusCode: 200,
    };

    mockRequest = {
      url: '/api/bookmarks',
    };

    mockExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn(() => mockResponse),
        getRequest: jest.fn(() => mockRequest),
      })),
    };

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  describe('Success Response Transformation', () => {
    it('should transform data into standardized success response', done => {
      const testData = {
        id: 1,
        url: 'https://nestjs.com',
        title: 'NestJS Framework',
      };

      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any>) => {
        expect(result).toEqual({
          success: true,
          statusCode: 200,
          data: testData,
        });
        done();
      });
    });

    it('should handle null data correctly', done => {
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(null));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any>) => {
        expect(result).toEqual({
          success: true,
          statusCode: 200,
          data: null,
        });
        done();
      });
    });

    it('should handle empty array correctly', done => {
      const emptyArray: any[] = [];
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(emptyArray));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any[]>) => {
        expect(result).toEqual({
          success: true,
          statusCode: 200,
          data: emptyArray,
        });
        done();
      });
    });

    it('should preserve different HTTP status codes', done => {
      const testData = { message: 'Created successfully' };
      mockResponse.statusCode = 201;

      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any>) => {
        expect(result).toEqual({
          success: true,
          statusCode: 201,
          data: testData,
        });
        done();
      });
    });
  });

  describe('Data Types Handling', () => {
    it('should handle string data', done => {
      const stringData = 'Simple string response';
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(stringData));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<string>) => {
        expect(result.data).toBe(stringData);
        expect(result.success).toBe(true);
        expect(result.statusCode).toBe(200);
        done();
      });
    });

    it('should handle number data', done => {
      const numberData = 42;
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(numberData));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<number>) => {
        expect(result.data).toBe(numberData);
        expect(result.success).toBe(true);
        expect(result.statusCode).toBe(200);
        done();
      });
    });

    it('should handle complex object data', done => {
      const complexData = {
        user: {
          id: 1,
          email: 'test@example.com',
          profile: {
            name: 'Test User',
            preferences: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        metadata: {
          lastLogin: '2023-12-07T10:30:00Z',
          permissions: ['read', 'write'],
        },
      };

      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(complexData));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any>) => {
        expect(result.data).toEqual(complexData);
        expect(result.success).toBe(true);
        expect(result.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('Response Structure Validation', () => {
    it('should always include required fields', done => {
      const testData = { test: 'data' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any>) => {
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('statusCode');
        expect(result).toHaveProperty('data');

        expect(typeof result.success).toBe('boolean');
        expect(typeof result.statusCode).toBe('number');

        expect(result.success).toBe(true);

        if (result.message) {
          expect(typeof result.message).toBe('string');
        }

        done();
      });
    });
  });

  describe('Error Cases', () => {
    it('should handle undefined data', done => {
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(undefined));

      const result$ = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      /**
       * @todo: fix this
       */
      //@ts-ignore
      result$.subscribe((result: SuccessResponse<any>) => {
        expect(result).toEqual({
          success: true,
          statusCode: 200,
          data: undefined,
        });
        done();
      });
    });
  });

  describe('Observable Behavior', () => {
    it('should return an Observable', () => {
      const testData = { test: 'data' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      expect(result).toBeInstanceOf(Observable);
    });

    it('should call next.handle() exactly once', () => {
      const testData = { test: 'data' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

      interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });
  });
});
