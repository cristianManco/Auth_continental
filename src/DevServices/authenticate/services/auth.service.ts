import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from './blacklist/blacklist.service';
import { HashService } from 'src/DevServices/shared-modules/encript/encript.service';
import { AdminService } from 'src/hotels-modules/admin/services/admin.service';
import { UserLoginDto, SignUpDto } from '../Dtos/export';
import { Tokens, JwtPayload } from '../types/export';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
    private readonly blackLisToken: BlacklistService,
  ) {}

  async validateUser(payload: JwtPayload) {
    const user = await this.adminService.findOne(payload.sub.toString());
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(loginDto: UserLoginDto): Promise<Tokens> {
    const { email, password } = loginDto;
    const user = await this.adminService.findOneByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.getTokens({
      sub: user.id,
      name: user.name,
      role: user.role,

    });
  }


  async register(signUPDto: SignUpDto): Promise<Tokens> {
    await this.validateEmailForSignUp(signUPDto.email);

    const hashedPassword = await this.hashService.hash(signUPDto.password);

    const user = await this.adminService.create({
      ...signUPDto,
      password: hashedPassword,
    });

    return await this.getTokens({
      sub: user.id,
      name: user.name,
      role: user.role,
<<<<<<< HEAD
=======

>>>>>>> 9be69809c69e48214c8ff8cc73e59843e096378c
    });
  }

  async logout(token: string): Promise<void> {
    await this.blackLisToken.addToBlacklist(token);
  }


  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is not set or is invalid');
    }
    const accessTokenOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h',
    };

    const accessToken = await this.signToken(
      jwtPayload,
      secretKey,
      accessTokenOptions,
    );

    return { access_token: accessToken };
  }

  async signToken(payload: JwtPayload, secretKey: string, options: any) {
    return await this.jwtService.signAsync(payload, {
      secret: secretKey,
      ...options,
    });
  }

  async validateEmailForSignUp(email: string): Promise<boolean | undefined> {
    const user = await this.adminService.findOneByEmailRegister(email);

    if (user) {
      throw new HttpException('Email already exists! Try again', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
