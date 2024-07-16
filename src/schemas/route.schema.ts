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
  @Prop({ enum: ClientStatusEnum, default: ClientStatusEnum.NOT_VISITED })
  status: ClientStatusEnum;
  
  @Prop({ required: true, type: String })
  userId: string;
}

@Schema({ versionKey: false })
export class Route {
  @Prop({ required: true, type: [RouteClient] })
  clients: RouteClient[];
  
  @Prop({ required: true, type: String })
  userId: string;

  // @Prop({ required: true, enum: RouteStatusEnum })
  // status: RouteStatusEnum;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: Boolean })
  open: boolean;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
