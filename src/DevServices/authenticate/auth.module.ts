import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './JWT/jwt.strategy';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EncriptModule } from '../shared-modules/share.module';
import { AdminModule } from './../../hotels-modules/admin/admin.module';
import { BlacklistService } from './services/blacklist/blacklist.service';
import { InterceptorService } from './services/interceptor/interceptor.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCES_TOKEN_EXPIRE || '1h' },
    }),
    EncriptModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, InterceptorService, AuthService, BlacklistService],
  exports: [BlacklistService],
})
export class AuthModule {}
