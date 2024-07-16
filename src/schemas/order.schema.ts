import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

enum OrderTypeEnum {
  ORDER = 'order',
  REMIT = 'remit',
}

@Schema({ versionKey: false })
export class Order {
  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true, type: [Product] })
  products: Product[];

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, enum: OrderTypeEnum, default: OrderTypeEnum.ORDER })
  type: OrderTypeEnum;

  @Prop({ required: true })
  documentNumber: number;

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  clientNumber: number;

  @Prop({ required: true })
  selectedList: number; 

  @Prop({ required: true, type: String })
  userId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
