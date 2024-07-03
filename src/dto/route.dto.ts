import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsString,
  ArrayNotEmpty,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ClientStatusEnum } from 'src/schemas';

class ClientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class RouteDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  clients: ClientDto[];

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}

export class UpdateStatusClientsDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsEnum(ClientStatusEnum)
  status: ClientStatusEnum;
}

export class UpdateClientsRouteDto extends RouteDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class UpdateRouteStatusDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  open: boolean;
}
