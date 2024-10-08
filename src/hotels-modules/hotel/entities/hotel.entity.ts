import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Hotel extends Document {
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  address: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  city: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  country: string;

  createdAt?: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
