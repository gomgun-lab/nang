import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseException } from '../../../exception/base.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add custom logic before authentication
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Convert Passport errors to BaseException
    if (err || !user) {
      throw new BaseException({
        code: 'UNAUTHORIZED',
        message: info?.message || 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    return user;
  }
}
