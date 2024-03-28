import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePriceListDto {
  @IsNotEmpty()
  @IsNumber()
  percent: number;
}


export class UpdatePriceListDto {
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsNotEmpty()
  @IsNumber()
  percent: number;
}

export class DeletePriceListDto {
  @IsNotEmpty()
  @IsNumber()
  number: number;
}