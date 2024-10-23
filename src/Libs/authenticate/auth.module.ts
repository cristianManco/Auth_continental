import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './JWT/jwt.strategy';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EncriptModule } from '../shared-modules/share.module';
import { BlacklistService } from './utils/blacklist.service';
import { AdminModule } from 'src/modules/admin/admin.module';
import { InterceptorService } from './utils/interceptor.service';
import { AtGuard } from './Guard/jwt.guard';
import { LogModule } from 'src/modules/log/log.module';
import { GetTokensService } from './utils/getTokens.service';
import { RefreshTokenService } from './utils/refresh.service';
import { SignTokenService } from './utils/signToken.service';
import { ValidateTokenService } from './utils/validateTokens.service';
import { FirebaseModule } from '../firebase/firebase.module';

const providers = [
  AuthService,
  JwtStrategy,
  InterceptorService,
  BlacklistService,
  AtGuard,
  GetTokensService,
  RefreshTokenService,
  SignTokenService,
  ValidateTokenService,
];

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '2h' },
    }),
    EncriptModule,
    AdminModule,
    LogModule,
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [...providers],
  exports: [BlacklistService, ValidateTokenService, JwtModule],
})
export class AuthModule {}
