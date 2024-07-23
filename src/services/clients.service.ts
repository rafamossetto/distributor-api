import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ClientDto, UpdateClientDto } from 'src/dto';
import { Client } from 'src/schemas';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  private readonly GET_ALL_SORT_PARAM = 'name';

  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  getAllByUser(userId: string): Promise<HydratedDocument<Client>[]> {
    const source = 'ClientsService -> getAllByUser()';

    try {
      this.logger.log({
        message: 'Fetching all clients for user',
        userId,
        source,
      });

      return this.clientModel.find({ userId }).sort(this.GET_ALL_SORT_PARAM).exec();
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

  async getAllClients(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }
  
  async create(createClientDto: ClientDto & { userId: string }): Promise<HydratedDocument<Client>> {
    const source = 'ClientsService -> create()';

    try {
      const clientsCount = await this.clientModel.countDocuments();

      this.logger.log({
        message: 'Creating client',
        clientData: {
          ...createClientDto,
          clientNumber: clientsCount + 1,
        },
        source,
      });

      return this.clientModel.create({
        ...createClientDto,
        clientNumber: clientsCount + 1,
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
  ): Promise<HydratedDocument<Client> | null> {
    const source = 'ClientsService -> update()';

    try {
      this.logger.log({
        message: 'Updating client with id',
        id,
        updateParams,
        source,
      });

      return this.clientModel
        .findByIdAndUpdate(id, updateParams, { new: true })
        .exec();
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
      this.logger.log({
        message: 'Deleting client with id',
        id,
        source,
      });

      return this.clientModel.deleteOne({ _id: id }).exec();
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

  async deleteAll(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'ClientsService -> deleteAll()';

    try {
      this.logger.log({
        message: 'Deleting all clients',
        source,
      });

      return this.clientModel.deleteMany({}).exec();
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

  async assignClientToUser(clientId: string, userId: string): Promise<Client> {
    const client = await this.clientModel.findByIdAndUpdate(
      clientId,
      { userId: userId },
      { new: true }
    ).exec();
  
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${clientId} no encontrado`);
    }
  
    return client;
  }

  async unassignClientFromUser(clientId: string): Promise<Client> {
    const client = await this.clientModel.findByIdAndUpdate(
      clientId,
      { $unset: { userId: "" } },
      { new: true }
    ).exec();
  
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${clientId} no encontrado`);
    }
  
    return client;
  }
}
