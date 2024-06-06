import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsOptional()
  currentAccount: number;
}

export class UpdateClientDto extends ClientDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
