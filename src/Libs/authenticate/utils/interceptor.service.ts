import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlacklistService } from './blacklist.service';

@Injectable()
export class InterceptorService implements NestInterceptor {
  constructor(private readonly blacklistService: BlacklistService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    // Check if the token is blacklisted

    if (token) {
      const isBlacklisted =
        await this.blacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('User token is blacklisted.');
      }
    }

    return next.handle();
  }
}
