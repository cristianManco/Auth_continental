import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/Libs/decorators/public.decorator';
import { UserLoginDto } from '../Dtos/login.dto';
import { CreateAdminDto } from 'src/modules/admin/dtos/createAdminDto';
import { AtGuard } from '../Guard/jwt.guard';
import { RefreshTokenService } from '../utils/refresh.service';
import { firebaseLoginDto } from '../Dtos/firebase.dto';
import { Tokens } from '../types/tokens.type';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    description: 'Login a user',
    type: UserLoginDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'strongPassword123',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        access_token: 'jwt.access.token.here',
      },
    },
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @Public()
  @Post('firebase-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Firebase token and get JWT tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully authenticated',
    type: firebaseLoginDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired Firebase token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token is required',
  })
  @ApiBody({ type: firebaseLoginDto, description: 'Firebase login DTO' })
  async firebaseLogin(
    @Body() firebaseLogin: firebaseLoginDto,
  ): Promise<Tokens> {
    return await this.authService.firebaseLogin(firebaseLogin);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Register a new admin user',
    type: CreateAdminDto,
    examples: {
      example1: {
        value: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'strongPassword123',
          typeDocument: 'CC',
          document: 12345678,
          phone: '123-456-7890',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'Admin user registered successfully',
    schema: {
      example: {
        access_token: 'jwt.access.token.here',
      },
    },
  })
  async register(@Body() signUpDto: CreateAdminDto) {
    return await this.authService.register(signUpDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid refresh token.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description: 'Refresh token for generating new access token',
        },
      },
      required: ['refresh_token'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refresh_token') refresh_token: string,
  ): Promise<Tokens> {
    return await this.refreshTokenService.refreshTokens(refresh_token);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Logout a user',
    type: String,
    examples: {
      example1: {
        value: {
          token: 'jwt.access.token.here',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  async logout(@Body('token') token: string) {
    await this.authService.logout(token);
    return { message: 'Logout successful' };
  }

  @UseGuards(AtGuard)
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Check if the user is authenticated',
    schema: {
      example: true,
    },
  })
  async check(): Promise<boolean> {
    return true;
  }
}
