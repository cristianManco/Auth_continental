import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './DevServices/persistence/db_config';
import { PersistenceModule } from './DevServices/persistence/persistence.module';
import { AuthModule } from './DevServices/authenticate/auth.module';
import { AdminModule } from './hotels-modules/admin/admin.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './DevServices/authenticate/Guard/jwt.guard';
import { HotelModule } from './hotels-modules/hotel/hotel.module';
import { InterceptorService } from './DevServices/authenticate/services/interceptor/interceptor.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    AuthModule,
    AdminModule,
    HotelModule,
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
      useClass: InterceptorService,
    },
  ],
})
export class AppModule {}