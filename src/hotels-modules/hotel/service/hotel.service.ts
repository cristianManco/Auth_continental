import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from '../entities/hotel.entity';
import { CreateHotelDto, UpdateHotelDto } from '../dtos/export';

@Injectable()  // Indica que esta clase puede ser inyectada como una dependencia.
export class HotelService {
  constructor(@InjectModel(Hotel.name) private model: Model<Hotel>) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    // Método para crear un nuevo hotel. Recibe los datos del hotel en un DTO, los guarda en la base de datos y maneja errores.
    try {
      const createdHotel = new this.model(createHotelDto);
      return createdHotel.save();
    } catch (error) {
      throw new HttpException(
        'Error al crear el hotel', // Mensaje de error si falla la creación.
        HttpStatus.INTERNAL_SERVER_ERROR,  // Código de estado HTTP 500.
      );
    }
  }

  async findAll(): Promise<Hotel[]> {
    // Método para obtener una lista de todos los hoteles. Realiza una consulta a la base de datos y devuelve los resultados.
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Hotel> {
    // Método para obtener un hotel específico por su ID. Si no se encuentra, lanza una excepción.
    const hotel = await this.model.findById(id).exec();
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`); // Excepción si el hotel no se encuentra.
    }
    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    // Método para actualizar los datos de un hotel específico por su ID. Devuelve el hotel actualizado o lanza una excepción si no se encuentra.
    const updatedHotel = await this.model
      .findByIdAndUpdate(id, updateHotelDto, { new: true })
      .exec();
    if (!updatedHotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`); // Excepción si el hotel no se encuentra.
    }
    return updatedHotel;
  }

  async remove(id: string): Promise<void> {
    // Método para eliminar un hotel específico por su ID. Si no se encuentra, lanza una excepción.
    const hotel = await this.model.findByIdAndDelete(id).exec();
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`); // Excepción si el hotel no se encuentra.
    }
  }
}
