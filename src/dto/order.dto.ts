import {
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from 'src/schemas';

class ProductOrderDto extends Product {
  @IsString()
  @IsNotEmpty()
  code: number;
}

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsNumber()
  @IsNotEmpty()
  clientNumber: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @IsNumber()
  @IsNotEmpty()
  selectedList: number;
}
