import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { ClientDto, UpdateClientDto } from 'src/dto/client.dto';
import { Client } from 'src/schemas';
import { ClientsService } from 'src/services';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
@ApiTags('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List All Clients - Sorted By Name A-Z',
    type: [Client],
  })
  async getAllClients(@Req() req): Promise<Client[]> {
    const source = 'ClientsController -> getAllClients()';

    this.logger.log({
      message: '[REQ] GET /clients - getAllClients()',
      source,
    });

    const response = await this.clientsService.getAllByUser(req.user.id);

    this.logger.log({
      message: '[RES] GET /clients - getAllClients()',
      length: response?.length,
      source,
    });

    return response;
  }

  @Post()
@ApiResponse({ status: 201, description: 'Create Client', type: Client })
async createClient(
  @Body() clientDto: ClientDto,
  @Req() req,
): Promise<HydratedDocument<Client>> {
  const source = 'ClientsController -> createClient()';

  this.logger.log({
    message: '[REQ] POST /clients - createClient()',
    source,
    body: clientDto,
  });

  const userId = req.user?.id;

  if (!userId) throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);

  this.logger.log({
    message: 'Extracting userId from JWT',
    userId,
    source,
  });

  // Agregar userId desde req.user.id
  const clientData = { ...clientDto, userId };

  this.logger.log({
    message: 'Creating client with data',
    clientData,
    source,
  });

  const response = await this.clientsService.create(clientData);

  this.logger.log({
    message: '[RES] POST /clients - createClient()',
    response,
    source,
  });

  return response;
}
  

  @Put()
  @ApiResponse({ status: 201, description: 'Update Client', type: [Client] })
  async updateClient(
    @Body() body: UpdateClientDto,
  ): Promise<HydratedDocument<Client>> {
    const source = 'ClientsController -> updateClient()';

    this.logger.log({
      message: '[REQ] PUT /clients - updateClient()',
      source,
      body,
    });

    const { id } = body;

    this.logger.log({
      message: 'Updating client with id',
      id,
      updateParams: body,
      source,
    });

    const response = await this.clientsService.update(id, body);

    this.logger.log({
      message: '[RES] PUT /clients - updateClient()',
      response,
      source,
    });

    return response;
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Delete Client', type: Boolean })
  async deleteClient(@Param('id') id: string): Promise<boolean> {
    const source = 'ClientsController -> deleteClient()';

    this.logger.log({
      message: '[REQ] DELETE /clients - deleteClient()',
      source,
      id,
    });

    const response = await this.clientsService.delete(id);

    this.logger.log({
      message: '[RES] DELETE /clients - deleteClient()',
      response,
      source,
      id,
    });

    return !!response.deletedCount;
  }

  @Delete()
  async deleteClients(
    @Body() body: { admin: boolean },
  ): Promise<{ deletedCount?: number }> {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.clientsService.deleteAll();
  }
}
