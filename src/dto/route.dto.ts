import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { RouteStatusEnum } from 'src/schemas';

export class RouteDto {
  @IsNotEmpty()
  @IsString()
  client: string;

  @IsNotEmpty()
  @IsEnum(RouteStatusEnum)
  status: RouteStatusEnum;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
