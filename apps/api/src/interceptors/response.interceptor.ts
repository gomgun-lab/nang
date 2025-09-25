import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '../interface/response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<SuccessResponse<T>> | Promise<Observable<SuccessResponse<T>>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
      }))
    );
  }
}
