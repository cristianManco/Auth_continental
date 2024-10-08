import { JwtPayload } from './../types/jwtPayload.type';
import { Controller, Body, Post, HttpCode, HttpStatus, UseGuards, Get, InternalServerErrorException,  Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDto, SignUpDto } from '../dtos/export';
import { Public } from 'src/DevServices/decorators/exports';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AtGuard } from '../Guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('token') token: string) {
    await this.authService.logout(token);
    return { message: 'Logout successful' };
  }



  
  @Post('check')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async check(): Promise<boolean> {
    return true;
  }


}
