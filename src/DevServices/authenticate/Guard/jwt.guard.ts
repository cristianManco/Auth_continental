import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
         
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AtGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('IsPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const validRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );
    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    if (validRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(`User need a valid role: ${validRoles}`);
  }

  handleRequest(err, user, info: Error) {
    if (err || info) {
      console.error(`Error of JWT: ${info?.message || err}`);
      throw new UnauthorizedException(
        'The Access Token is invalid or has expired.',
      );
    }
    if (!user) {
      this.logger.warn('Access denied: Unauthorized access attempt.');
      throw new UnauthorizedException('Access denied.');
    }
    return user;
  }
}
