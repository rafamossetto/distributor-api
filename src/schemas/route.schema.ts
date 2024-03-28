import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Client } from '../schemas';

export type RouteDocument = HydratedDocument<Route>;

export enum ClientStatusEnum {
  NOT_VISITED = 'NOT_VISITED',
  VISITED = 'VISITED',
  UNSOLD = 'UNSOLD',
}

@Schema({ versionKey: false })
class RouteClient extends Client {
  @Prop({ type: 'enum', default: ClientStatusEnum.NOT_VISITED })
  status: ClientStatusEnum
};

@Schema({ versionKey: false })
export class Route {
  @Prop()
  clients: RouteClient[];

  // @Prop({ required: true, enum: RouteStatusEnum })
  // status: RouteStatusEnum;

  @Prop({ required: true, type: Date })
  date: Date;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
