import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = Admin & Document;

export enum UserType {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class Admin {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  typeDocument: string;

  @Prop()
  documentUser: string;

  @Prop({ type: String, enum: UserType, default: UserType.USER })
  role: UserType;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
