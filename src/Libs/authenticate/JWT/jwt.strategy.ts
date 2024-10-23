import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../types/jwtPayload.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        request: Request,
        rawJwtToken: string,
        done: (error: any, secret: string) => void,
      ) => {
        //Decide which secret to use based on the type of token.
        if (rawJwtToken.includes('refreshTokenMarker')) {
          //Use JWT_REFRESH_SECRET for update tokens
          done(null, process.env.JWT_REFRESH_SECRET);
        } else {
          //Using JWT_SECRET for access tokens
          done(null, process.env.JWT_SECRET);
        }
      },
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub?.id;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Aquí usamos el servicio AuthService para validar el usuario
    const user = await this.authService.validateUser(userId);
    if (!user) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }

    // Retornar la información relevante del usuario
    return {
      id: payload.sub.id,
      email: payload.sub.email,
      role: payload.sub.role,
    };
  }
}
