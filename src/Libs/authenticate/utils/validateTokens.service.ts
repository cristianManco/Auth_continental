import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { BlacklistService } from './blacklist.service';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class ValidateTokenService {
  constructor(
    @InjectModel(Admin.name) private userModel: Model<Admin>,
    private readonly jwtService: JwtService,
    private readonly whiteListService: BlacklistService,
  ) {}

  async validateTokens(token: string, secret: string): Promise<object> {
    try {
      // Usamos el secreto pasado como parámetro
      const isValid = await this.jwtService.verifyAsync(token, { secret });

      const { sub } = isValid as JwtPayload;

      const user = await this.userModel.findOne({ id: sub.id });

      const isValidInWhiteList =
        await this.whiteListService.isTokenBlacklisted(token);

      if (user.deletedAt != null)
        throw new HttpException('User invalid', HttpStatus.NOT_FOUND);

      if (!isValid || !user || isValidInWhiteList)
        throw new HttpException('Invalid token...', HttpStatus.BAD_REQUEST);

      return { message: 'The token is valid!' };
    } catch (err) {
      throw new HttpException(
        `Ups... error: ${err}`,
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
