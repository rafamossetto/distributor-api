import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ClientDto, UpdateClientDto } from 'src/dto';
import { Client } from 'src/schemas';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  private readonly GET_ALL_SORT_PARAM = 'name';

  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  getAll(): Promise<HydratedDocument<Client>[]> {
    const source = 'ClientsService -> getAll()';

    try {
      return this.clientModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async create(createClientDto: ClientDto): Promise<HydratedDocument<Client>> {
    const source = 'ClientsService -> create()';

    try {
      const codeIncreased = (await this.clientModel.countDocuments()) + 1;
      return this.clientModel.create({
        ...createClientDto,
        code: codeIncreased,
      });
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async update(
    id: string,
    updateParams: UpdateClientDto,
  ): Promise<HydratedDocument<Client>> {
    const source = 'ClientsService -> update()';

    try {
      return this.clientModel.findByIdAndUpdate(id, updateParams);
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }
  async delete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'ClientsService -> delete()';

    try {
      return this.clientModel.deleteOne({ _id: id });
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  deleteAll() {
    return this.clientModel.deleteMany({});
  }
}
