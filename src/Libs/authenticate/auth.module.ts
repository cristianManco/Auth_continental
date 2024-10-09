import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './JWT/jwt.strategy';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EncriptModule } from '../shared-modules/share.module';
import { BlacklistService } from './utils/blacklist.service';
import { AdminModule } from 'src/modules/admin/admin.module';
import { InterceptorService } from './utils/interceptor.service';
import { TokenService } from './utils/validateTokens.service';
import { AtGuard } from './Guard/jwt.guard';
import { LogModule } from 'src/modules/log/log.module';

const providers = [
  AuthService,
  JwtStrategy,
  InterceptorService,
  BlacklistService,
  TokenService,
  AtGuard,
];

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h' },
    }),
    EncriptModule,
    AdminModule,
    LogModule,
  ],
  controllers: [AuthController],
  providers: [...providers],
  exports: [BlacklistService, TokenService],
})
export class AuthModule {}
