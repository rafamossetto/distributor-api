import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PricesList } from './';

export type ProductDocument = HydratedDocument<Product>;

// Validator Function
const pricesValidator = (prices: number[]) =>
  Array.isArray(prices) && prices.length && prices.every(price => typeof price === 'number');

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: number;e

  @Prop({ required: true })
  typ: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    validate: {
      validator: pricesValidator,
      message: 'Must be a list of numbers, at least one price',
    },
  })
  prices: [PricesList];
};

export const ProductSchema = SchemaFactory.createForClass(Product);