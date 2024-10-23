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
import { UserType } from 'src/Libs/shared-modules/enums/user.enum';

export class CreateAdminDto {
  @ApiProperty({
    description: 'User name',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString({ message: 'The name must be a string' })
  readonly name: string;

  @ApiProperty({
    description: 'User email',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'The email is not valid' })
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd!',
  })
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength(50, { message: 'The password cannot exceed 50 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'The password must contain at least one uppercase letter and one number',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Administrator phone number',
    example: '+54 9 123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The phone must be a numeric string' })
  readonly phone?: string;

  @ApiProperty({
    description: 'Administrator document type',
    example: 'DNI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The document type must be a string' })
  readonly typeDocument?: string;

  @ApiProperty({
    description: 'Administrator document number',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The document number must be a string' })
  readonly documentUser?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserType,
    default: UserType.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType, {
    message: 'The role must be one of the following: superadmin, admin, user',
  })
  readonly role?: UserType;
}
