import { IsNotEmpty, IsDateString, IsString, IsArray } from 'class-validator';
// import { RouteStatusEnum } from 'src/schemas';

export class RouteDto {
  @IsString()
  @IsArray()
  clients: string;

  // @IsNotEmpty()
  // @IsEnum(RouteStatusEnum)
  // status: RouteStatusEnum;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
