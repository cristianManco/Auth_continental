import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BlacklistService } from '../utils/blacklist.service';
import { Sub } from '../types/sub.type';
import * as admin from 'firebase-admin';
import { Tokens } from '../types/tokens.type';
import { AdminService } from 'src/modules/admin/services/admin.service';
import { HashService } from 'src/Libs/shared-modules/encript/encript.service';
import { UserLoginDto } from '../Dtos/login.dto';
import { CreateAdminDto } from 'src/modules/admin/dtos/createAdminDto';
import { ValidateTokenService } from '../utils/validateTokens.service';
import { GetTokensService } from '../utils/getTokens.service';
import { firebaseLoginDto } from '../Dtos/firebase.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
    private readonly blackLisToken: BlacklistService,
    private readonly validateToken: ValidateTokenService,
    private readonly geTokenService: GetTokensService,
  ) {}

  async firebaseLogin(firebaseLogin: firebaseLoginDto): Promise<Tokens> {
    const { token } = firebaseLogin;

    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Verificar el token de Firebase
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userRecord = await admin.auth().getUser(decodedToken.uid);

      if (!userRecord) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const subJwt: Sub = {
        id: userRecord.uid,
        email: userRecord.email,
        role: 'user',
      };

      const jwtTokens: Tokens = await this.geTokenService.getTokens({
        sub: subJwt,
      });

      return jwtTokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'auth/id-token-expired') {
        throw new HttpException(
          'Firebase token has expired',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        `Failed to authenticate user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(token: string): Promise<object> {
    try {
      const secret = process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET;

      return await this.validateToken.validateTokens(token, secret);
    } catch (err) {
      throw new HttpException(
        `Ups... error: ${err}`,
        HttpStatus.NOT_ACCEPTABLE,
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
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Define el payload del JWT
      const subJwt: Sub = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token: Tokens = await this.geTokenService.getTokens({
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

      const token: Tokens = await this.geTokenService.getTokens({
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
}
