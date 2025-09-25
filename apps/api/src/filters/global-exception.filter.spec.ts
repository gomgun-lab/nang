import { HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { BaseException } from '../exception/base.exception';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: any;

  beforeEach(async () => {
    filter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/api/bookmarks',
      method: 'GET',
      headers: {},
    };

    mockHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      })),
    };
  });

  describe('BaseException handling', () => {
    it('should handle BaseException correctly', () => {
      const exception = new BaseException({
        code: 'BOOKMARK_NOT_FOUND',
        message: 'Bookmark not found',
        statusCode: HttpStatus.NOT_FOUND,
        details: { id: 123 },
      });

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 404,
          error: {
            code: 'BOOKMARK_NOT_FOUND',
            message: 'Bookmark not found',
            details: { id: 123 },
          },
        })
      );
    });
  });

  describe('Unknown exception handling', () => {
    it('should handle unknown exceptions as internal server error', () => {
      const exception = new Error('Something went wrong');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 500,
          error: expect.objectContaining({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
          }),
        })
      );
    });
  });
});
