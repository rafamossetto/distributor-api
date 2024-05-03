import { IsNotEmpty, IsString, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { ProductDto } from './product.dto';
import { Type } from 'class-transformer';
import { Product } from 'src/schemas';


class ProductOrderDto extends Product {
  @IsString()
  @IsNotEmpty()
  code: number
}

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];
}
