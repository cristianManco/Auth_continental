import { Hotel, HotelSchema } from './entities/hotel.entity';
import { Module } from '@nestjs/common';
import { HotelService } from './service/hotel.service';
import { HotelController } from './controller/hotel.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hotel.name,
        schema: HotelSchema,
      },
    ]),
  ],
  providers: [HotelService],
  controllers: [HotelController],
  exports: [HotelService],
})
export class HotelModule {}
