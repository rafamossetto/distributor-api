import { Type } from 'class-transformer';
import { IsNotEmpty, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Client } from 'src/schemas';
// import { RouteStatusEnum } from 'src/schemas';

export class RouteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Client)
  clients: Client[];

  // @IsNotEmpty()
  // @IsEnum(RouteStatusEnum)
  // status: RouteStatusEnum;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
