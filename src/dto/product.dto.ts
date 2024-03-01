import { IsNumberString, IsNotEmpty } from 'class-validator';

export class ProductDto {
  id: number;
  
  @IsNotEmpty()
  @IsNumberString()
  code: number;

  @IsNotEmpty()
  description: string;
}