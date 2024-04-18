import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false })
export class Order {
  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true, type: [Product] })
  products: Product[];

  @Prop({ required: true, type: Date })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
