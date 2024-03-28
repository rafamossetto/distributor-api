import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PricesListDto {
  @IsNotEmpty()
  @IsString()
  alias: string;

  @IsNotEmpty()
  @IsNumber()
  percent: number;
}
