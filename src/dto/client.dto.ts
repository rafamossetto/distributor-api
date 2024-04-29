import { IsNotEmpty, IsString, IsPhoneNumber, IsUUID } from 'class-validator';

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

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}

export class UpdateClientDto extends ClientDto {
  @IsNotEmpty()
  @IsString()
  id: string
};