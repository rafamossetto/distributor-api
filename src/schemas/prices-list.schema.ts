import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PricesListDocument = HydratedDocument<PricesList>;

@Schema({ versionKey: false })
export class PricesList {
  @Prop({ required: true })
  number: number;

  @Prop({ required: true, unique: true })
  percent: number;
}

export const PricesListSchema = SchemaFactory.createForClass(PricesList);
