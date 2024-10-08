// Código para el DTO de creación de administrador en la aplicación de la cadena de hoteles
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;



  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly  document: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength(50, {
    message: 'Password cannot exceed 50 characters',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'The password is not secure enough try with more characters',
  })
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly role: string;
}
