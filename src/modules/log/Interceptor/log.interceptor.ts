import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogService } from '../service/log.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);
  constructor(private readonly logService: LogService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const ip = request.ip;
    const endpoint = request.url;
    const method = request.method;
    const id_user = request.user?.id || 'undefined';
    const system_name = request.headers['system-name'] || 'undefined';
    const data = JSON.stringify(request.body) || null;
    const userAgent = request.headers['user-agent'] || 'undefined';
    const host = request.headers['host'] || 'undefined';
    const startTime = Date.now();

    //Authorisation token validation
    const authHeader = request.headers.authorization;
    let accessToken = 'undefined';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    }

    return next.handle().pipe(
      tap(async (responseBody) => {
        const responseTime = Date.now() - startTime;
        const responseStatus = response.statusCode;

        // Log of successful application
        await this.logService.logRequest(
          ip,
          accessToken,
          id_user,
          system_name,
          endpoint,
          method,
          'Request', //Default action
          userAgent,
          host,
          responseStatus,
          responseTime,
          `Response: ${JSON.stringify(responseBody)}`,
          data,
        );
      }),
      catchError((err) => {
        const responseTime = Date.now() - startTime;
        const responseStatus =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Log in case of error
        this.logService
          .logRequest(
            ip,
            accessToken,
            id_user,
            system_name,
            endpoint,
            method,
            'Error', // Action in case of error
            userAgent,
            host,
            responseStatus,
            responseTime,
            `Error: ${err.message}`,
            data,
          )
          .catch((logError) => {
            this.logger.error('Error logging request:', logError.message);
          });

        return throwError(() => err);
      }),
    );
  }
}
