import {
  IsNumberString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsString,
} from 'class-validator';
import { ProductMeasurementEnum } from 'src/schemas';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  code: number;

  @IsEnum(ProductMeasurementEnum)
  measurement: ProductMeasurementEnum;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  prices: number[];
}
