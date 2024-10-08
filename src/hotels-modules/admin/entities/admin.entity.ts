import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Document } from 'mongoose';

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  document: number;

  @Prop({ required: true })
  phone: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Prop({ required: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength(50, {
    message: 'Password cannot exceed 50 characters',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'The password is not secure enough try with more characters',
  })
  @Prop({ required: true })
  password: string;

  @IsOptional()
  @IsEnum(UserType)
  @Prop({ type: String, enum: UserType, default: UserType.USER })
  role: UserType;

  createdAt?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
