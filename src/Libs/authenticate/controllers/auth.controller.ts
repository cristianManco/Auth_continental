import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/Libs/decorators/public.decorator';
import { UserLoginDto } from '../Dtos/login.dto';
import { CreateAdminDto } from 'src/modules/admin/dtos/createAdminDto';
import { AtGuard } from '../Guard/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.login(userLoginDto);
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
          document: 12345678,
          phone: '123-456-7890',
          role: 'admin',
        },
      },
    },
  })
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
    return this.authService.register(signUpDto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
