import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { ProductMeasurementEnum } from 'src/schemas';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(ProductMeasurementEnum)
  measurement: ProductMeasurementEnum;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  price: number;
}
