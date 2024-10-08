import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HotelService } from '../service/hotel.service';
import { Hotel } from '../entities/hotel.entity';
import { CreateHotelDto, UpdateHotelDto } from '../dtos/export';
import { Roles } from 'src/DevServices/decorators/exports';

@ApiTags('Hotels')
@ApiBearerAuth()
@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Roles('admin')  // Restringe el acceso a usuarios con rol de 'admin'.
  @Post('new')
  @UsePipes(new ValidationPipe())
  async createHotel(@Body() createHotelDto: CreateHotelDto): Promise<Hotel> {
    return await this.hotelService.create(createHotelDto);
  }


  @Roles('user','admin')
  @Get('all')
  async findAll(): Promise<Hotel[]> {
    return await this.hotelService.findAll();
  }


  @Roles('user','admin')
  @Get(':_id')
  async findOne(@Param('_id') id: string): Promise<Hotel> {
    return await this.hotelService.findOne(id);
  }

  @Roles('admin')
  @Put(':_id')
  async update(
    @Param('_id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ): Promise<Hotel> {
    return await this.hotelService.update(id, updateHotelDto);
  }


  @Roles('admin')
  @Delete(':_id')
  async remove(@Param('_id') id: string): Promise<void> {
    return await this.hotelService.remove(id);
  }
}
