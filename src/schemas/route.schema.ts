import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RouteDocument = HydratedDocument<Route>;

export enum RouteStatusEnum {
  OPEN = 'open',
  CLOSED = 'closed',
  UNSOLD = 'unsold',
};

@Schema({ versionKey: false })
export class Route {
  @Prop({ required: true })
  client: string;

  @Prop({ required: true, enum: RouteStatusEnum })
  status: RouteStatusEnum;

  @Prop({ required: true, type: Date })
  date: Date;
}

export const RouteSchema = SchemaFactory.createForClass(Route);