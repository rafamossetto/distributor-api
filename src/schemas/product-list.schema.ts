import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductListDocument = HydratedDocument<ProductList>;

@Schema()
export class ProductList {
  @Prop({ required: true })
  listNumber: number;

  @Prop()
  alias: string;

  @Prop([String])
  productsIds: string[];
}

export const ProductListSchema = SchemaFactory.createForClass(ProductList);