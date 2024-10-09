import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from '../utils/blacklist.service';
import { Sub } from '../types/sub.type';
import { JwtPayload } from '../types/jwtPayload.type';
import { Tokens } from '../types/tokens.type';
import { AdminService } from 'src/modules/admin/services/admin.service';
import { HashService } from 'src/Libs/shared-modules/encript/encript.service';
import { UserLoginDto } from '../Dtos/login.dto';
import { CreateAdminDto } from 'src/modules/admin/dtos/createAdminDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
    private readonly blackLisToken: BlacklistService,
  ) {}

  async validateUser(payload: JwtPayload) {
    try {
      const user = await this.adminService.findOne(payload.sub.email); // Usa el ID correctamente
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      return user; // Retorna el usuario encontrado
    } catch (error) {
      throw new HttpException(
        'Failed to validate user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: UserLoginDto): Promise<Tokens> {
    const { email, password } = loginDto;

    const user = await this.adminService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isValiPassword = await this.hashService.comparePassword(
      password,
      user.password,
    );
    if (!isValiPassword) {
      throw new HttpException(
        'Invalid credentials password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      // Define el payload del JWT
      const subJwt: Sub = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token: Tokens = await this.getTokens({
        sub: subJwt,
      });

      return token;
    } catch (error) {
      throw new HttpException(
        'Failed to login: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(signUPDto: CreateAdminDto): Promise<Tokens> {
    await this.adminService.validateEmail(signUPDto.email);

    const hashedPassword = await this.hashService.hashing(signUPDto.password);
    try {
      const user = await this.adminService.create({
        ...signUPDto,
        password: hashedPassword,
      });

      // Define el payload del JWT
      const subJwt: Sub = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token: Tokens = await this.getTokens({
        sub: subJwt,
      });

      return token;
    } catch (error) {
      throw new HttpException(
        'Failed to register user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await this.blackLisToken.addToBlacklist(token);
    } catch (error) {
      throw new HttpException(
        'Failed to logout: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new HttpException(
        'JWT_SECRET is not set or is invalid',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const accessTokenOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h',
      };

      const accessToken = await this.signToken(
        jwtPayload,
        secretKey,
        accessTokenOptions,
      );

      return { access_token: accessToken };
    } catch (error) {
      throw new HttpException(
        'Failed to generate tokens: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signToken(payload: JwtPayload, secretKey: string, options: any) {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: secretKey,
        ...options,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to sign token: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
