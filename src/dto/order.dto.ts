import { IsNotEmpty, IsString, IsArray, IsDate } from 'class-validator';
import { Product } from 'src/schemas';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  @IsArray()
  products: Product[];

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
