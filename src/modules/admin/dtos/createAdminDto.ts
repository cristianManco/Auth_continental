import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entities/admin.entity';

export class CreateAdminDto {
  @ApiProperty({
    description: 'User name',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena' })
  readonly name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  readonly email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'P@ssw0rd!',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'La contraseña no es lo suficientemente segura, intenta con más caracteres',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Tipo de documento del administrador',
    example: 'DNI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El tipo de documento debe ser una cadena' })
  readonly typeDocument?: string;

  @ApiProperty({
    description: 'Número de documento del administrador',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El número de documento debe ser una cadena' })
  readonly documentUser?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserType,
    default: UserType.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType, {
    message: 'El rol debe ser uno de los siguientes: superadmin, admin, user',
  })
  readonly role?: UserType;
}
