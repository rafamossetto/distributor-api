import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RouteDocument = HydratedDocument<Route>;

@Schema()
export class Route {
  @Prop()
  id: number;

  @Prop()
  name: number;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const RouteSchema = SchemaFactory.createForClass(Route);