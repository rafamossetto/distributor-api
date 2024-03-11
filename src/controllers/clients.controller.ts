import { Body, Controller, Delete, ForbiddenException, Get, HttpException, Logger, Post } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { ClientDto } from 'src/dto/client.dto';
import { Client } from 'src/schemas';
import { ClientsService } from 'src/services';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly logger: Logger = new Logger(ClientsController.name),
  ) { }

  @Get()
  async getAllClients(): Promise<Client[]> {
    const source = 'ClientsController -> getAllClients()';

    try {
      this.logger.log({
        message: '[REQ] GET /clients - getAllClients()',
        source,
      });

      const response = await this.clientsService.getAll();

      this.logger.log({
        message: '[RES] GET /clients - getAllClients()',
        response,
        length: response?.length,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw error;
    }
  };

  @Post()
  async createClient(
    @Body() clientDto: ClientDto,
  ): Promise<HydratedDocument<Client>> {
    const source = 'ClientsController -> createClient()';

    try {
      this.logger.log({
        message: '[REQ] POST /clients - createClient()',
        source,
        body: clientDto,
      });

      const response = await this.clientsService.create(clientDto);

      this.logger.log({
        message: '[RES] POST /clients - createClient()',
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  };


  @Delete()
  async deleteClients(
    @Body() body: { admin: boolean },
  ) {

    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.clientsService.deleteAll();
  }
}