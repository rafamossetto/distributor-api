import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PricesListDocument = HydratedDocument<PricesList>;

/*
Lista 1 3%
Lista 2 5%
Lista 3 8%
Lista 4 10%
Lista 5 12%
Lista 6 15%
 */

@Schema({ versionKey: false })
export class PricesList {
  @Prop({ required: true, unique: true })
  alias: string;

  @Prop({ required: true, unique: true })
  percent: number;
}

export const PricesListSchema = SchemaFactory.createForClass(PricesList);
