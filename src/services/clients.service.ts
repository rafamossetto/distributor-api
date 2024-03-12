import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ClientDto } from 'src/dto';
import { Client } from 'src/schemas';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
  ) { }

  private readonly GET_ALL_SORT_PARAM = 'name';

  getAll(): Promise<HydratedDocument<Client>[]> {
    return this.clientModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
  };

  create(createClientDto: ClientDto): Promise<HydratedDocument<Client>> {
    return this.clientModel.create(createClientDto);
  };

  deleteAll() {
    return this.clientModel.deleteMany({});
  }
}