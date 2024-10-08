import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    description: 'The password should be',
    minimum: 8,
    maximum: 50,
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'password should be minimum 8 characters' })
  @MaxLength(50, {
    message: 'The password must not exceed 50 characters maximum',
  })
  password: string;
}
