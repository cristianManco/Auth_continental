import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../utils/validateTokens.service';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AtGuard.name);

  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {
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

    const request = await context.switchToHttp().getRequest();
    const authHeader = await request.headers['authorization'];

    console.log(authHeader);

    if (!authHeader) {
      throw new HttpException(
        'No Authorization Headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];

    // Verifica el formato del token
    if (typeof token != 'string') {
      throw new HttpException('Invalid token format', HttpStatus.UNAUTHORIZED);
    }

    if (!token) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await this.tokenService.validateToken(token);
      request.user = payload; // Añade el payload al request

      // Obtiene los roles requeridos para el endpoint
      const validRoles: string[] = this.reflector.get(
        'roles',
        context.getHandler(),
      );

      if (
        validRoles &&
        validRoles.length > 0 &&
        !validRoles.includes(payload.sub.role)
      ) {
        throw new HttpException(
          `User needs a valid role: ${validRoles}`,
          HttpStatus.FORBIDDEN,
        );
      }

      return true; // Token es válido y el usuario tiene acceso
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
