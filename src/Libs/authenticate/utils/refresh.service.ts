import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { GetTokensService } from './getTokens.service';
import { Tokens } from '../types/tokens.type';
import { JwtPayload } from '../types/jwtPayload.type';
import { AdminService } from 'src/modules/admin/services/admin.service';
import * as admin from 'firebase-admin';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly getTokensService: GetTokensService,
    private readonly admin: AdminService,
  ) {}

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    //Verify the refresh token
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    if (!decoded) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const { sub } = decoded as JwtPayload;
    let userRecord;

    //Check if the user exists in the database
    try {
      userRecord = await this.admin.findOneByEmail(sub.email);

      if (userRecord.deletedAt) {
        throw new HttpException(
          'User has been deleted',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new HttpException(
          'Refresh token has expired',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      //Check if the user exists in the firebase
      userRecord = await admin.auth().getUser(sub.id);
    }

    // Ensure that the user exists
    if (!userRecord) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // Check again if the user has been deleted.
    if (userRecord.deletedAt) {
      throw new HttpException('User has been deleted', HttpStatus.UNAUTHORIZED);
    }

    try {
      const newJwtPayload: JwtPayload = {
        sub: {
          id: userRecord.uid || sub.id,
          email: userRecord.email,
          role: userRecord.role || sub.role,
        },
      };

      return await this.getTokensService.getTokens(newJwtPayload);
    } catch (error) {
      //Handling any errors when generating tokens
      if (error instanceof TokenExpiredError) {
        throw new HttpException(
          'Refresh token has expired',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      throw new HttpException(
        `Refresh token failed: ${error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
