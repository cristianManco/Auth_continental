import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignTokenService } from './signToken.service';
import { JwtPayload } from '../types/jwtPayload.type';
import { Tokens } from '../types/tokens.type';

@Injectable()
export class GetTokensService {
  constructor(private readonly token: SignTokenService) {}

  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET;

    if (!secretKey || !refreshSecretKey)
      throw new HttpException(
        'JWT_SECRET or JWT_REFRESH_SECRET is not set',
        HttpStatus.NOT_ACCEPTABLE,
      );

    try {
      const accessTokenOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '2h',
      };
      const refreshTokenOptions = {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      };

      const accessToken = await this.token.signToken(
        jwtPayload,
        secretKey,
        accessTokenOptions,
      );

      const refreshToken = await this.token.signToken(
        jwtPayload,
        refreshSecretKey,
        refreshTokenOptions,
      );

      return await { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      throw new HttpException(
        `Ups... error: ${error}`,
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
