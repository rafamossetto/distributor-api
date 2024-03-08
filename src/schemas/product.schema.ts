import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PricesList } from './';

export type ProductDocument = HydratedDocument<Product>;

// Validator Function
const pricesValidator = (prices: number[]) => prices.length > 0;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    validate: {
      validator: pricesValidator,
      message: 'At least one price is mandatory',
    },
  })
  prices: PricesList[];
};

export const ProductSchema = SchemaFactory.createForClass(Product);