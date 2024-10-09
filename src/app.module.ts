import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './Libs/persistence/db_config';
import { PersistenceModule } from './Libs/persistence/persistence.module';
import { AuthModule } from './Libs/authenticate/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './Libs/authenticate/Guard/jwt.guard';
import { LogModule } from './modules/log/log.module';
import { LogInterceptor } from './modules/log/Interceptor/log.interceptor';
import { InterceptorService } from './Libs/authenticate/utils/interceptor.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    AuthModule,
    AdminModule,
    LogModule,
    PersistenceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InterceptorService,
    },
  ],
})
export class AppModule {}
