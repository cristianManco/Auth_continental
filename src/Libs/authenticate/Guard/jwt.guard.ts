import {
  Injectable,
  HttpException,
  HttpStatus,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ValidateTokenService } from '../utils/validateTokens.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AtGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: ValidateTokenService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('IsPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // Validate the existence of the authorisation header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        'No Authorization Headers or Invalid Format',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }

    if (typeof accessToken !== 'string') {
      throw new HttpException('Invalid token format', HttpStatus.UNAUTHORIZED);
    }

    let payload;
    try {
      // Try to validate the token with the key JWT_SECRET
      payload = await this.tokenService.validateTokens(
        accessToken,
        process.env.JWT_SECRET,
      );
    } catch (error) {
      // If it fails, try with the key JWT_REFRESH_SECRET
      try {
        payload = await this.tokenService.validateTokens(
          accessToken,
          process.env.JWT_REFRESH_SECRET,
        );
      } catch (err) {
        this.logger.error(`Token validation error: ${err.message}`);
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      this.logger.error(error);
    }

    if (!payload) {
      throw new HttpException(
        'Invalid payload structure',
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Verify token with corresponding secret key
    const isValid = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET,
    });

    const { sub } = isValid as JwtPayload;
    request.body.id = sub.id;
    request.body.role = sub.role;

    try {
      //Verify the roles required for the endpoint
      const validRoles: string[] = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
      if (
        validRoles &&
        validRoles.length > 0 &&
        !validRoles.includes(request.body.role)
      ) {
        throw new HttpException(
          `User needs a valid role: ${validRoles}`,
          HttpStatus.FORBIDDEN,
        );
      }

      // The token is valid and the user has access to
      return true;
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      throw new HttpException(
        `Error during validation: ${error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
