import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './hotel.dto';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
