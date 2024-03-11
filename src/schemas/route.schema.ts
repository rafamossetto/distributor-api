import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RouteDocument = HydratedDocument<Route>;

type RouteStatus = 'open' | 'closed' | 'unselled';

@Schema()
export class Route {
  @Prop({ required: true })
  client: string;

  @Prop({ required: true })
  status: RouteStatus;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const RouteSchema = SchemaFactory.createForClass(Route);