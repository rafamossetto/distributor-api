import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PricesListDocument = HydratedDocument<PricesList>;

@Schema()
export class PricesList {
  // Name of list prop
  @Prop({ required: true })
  list: string;

  @Prop({ required: true })
  price: number;
};

export const PricesListSchema = SchemaFactory.createForClass(PricesList);