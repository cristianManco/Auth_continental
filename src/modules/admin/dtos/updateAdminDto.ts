// Código para el DTO de actualización de administrador en la aplicación de la cadena de hoteles
import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './createAdminDto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
