import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export enum ProductMeasurementEnum {
  KILOGRAM = 'kilogram',
  UNIT = 'unit',
}

const pricesValidator = (prices: number[]) =>
  prices.length && prices.every((price) => typeof price === 'number');

@Schema({ versionKey: false })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: number;

  @Prop({ required: true, enum: ProductMeasurementEnum })
  measurement: ProductMeasurementEnum;

  @Prop()
  description: string;

  @Prop()
  units: number;

  @Prop()
  discount: number;

  @Prop()
  quantity: number;

  @Prop({
    required: true,
    validate: {
      validator: pricesValidator,
      message: 'Must be a list of numbers, at least one price',
    },
  })
  prices: number[];

  @Prop({ required: true, type: String })
  userId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
