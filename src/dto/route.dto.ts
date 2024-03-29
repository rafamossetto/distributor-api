import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsDefined,
  IsNotEmptyObject,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';
// import { RouteStatusEnum } from 'src/schemas';


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
};

export class RouteDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  clients: ClientDto[];

  // @IsNotEmpty()
  // @IsEnum(RouteStatusEnum)
  // status: RouteStatusEnum;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
