import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { ClientDto, UpdateClientDto } from 'src/dto/client.dto';
import { Client } from 'src/schemas';
import { ClientsService } from 'src/services';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('clients')
@ApiTags('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Obtener todos los clientes (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los clientes',
    type: [Client],
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async getAllClientsAdmin(): Promise<Client[]> {
    const source = 'ClientsController -> getAllClientsAdmin()';

    this.logger.log({
      message: '[REQ] GET /clients/all - getAllClientsAdmin()',
      source,
    });

    try {
      const response = await this.clientsService.getAllClients();

      this.logger.log({
        message: '[RES] GET /clients/all - getAllClientsAdmin()',
        length: response?.length,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: '[ERR] GET /clients/all - getAllClientsAdmin()',
        error,
        source,
      });
      throw new InternalServerErrorException(
        'Error al obtener todos los clientes',
      );
    }
  }

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

  @Get('user/:userId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obtener clientes por ID de usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes del usuario especificado',
    type: [Client],
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getClientsByUserId(@Param('userId') userId: string): Promise<Client[]> {
    const source = 'ClientsController -> getClientsByUserId()';

    this.logger.log({
      message: `[REQ] GET /clients/user/${userId} - getClientsByUserId()`,
      source,
      userId,
    });

    try {
      const response = await this.clientsService.getClientsByUserId(userId);

      this.logger.log({
        message: `[RES] GET /clients/user/${userId} - getClientsByUserId()`,
        length: response?.length,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] GET /clients/user/${userId} - getClientsByUserId()`,
        error,
        source,
      });
      throw new InternalServerErrorException(
        'Error al obtener los clientes del usuario',
      );
    }
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

    if (!userId)
      throw new HttpException(
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );

    this.logger.log({
      message: 'Extracting userId from JWT',
      userId,
      source,
    });

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

  @Put('assign/:clientId/:userId')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Asignar cliente a usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cliente asignado con éxito',
    type: Client,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Cliente o usuario no encontrado' })
  async assignClientToUser(
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
  ): Promise<Client> {
    const source = 'ClientsController -> assignClientToUser()';

    this.logger.log({
      message: `[REQ] PUT /clients/assign/${clientId}/${userId} - assignClientToUser()`,
      source,
      clientId,
      userId,
    });

    try {
      const response = await this.clientsService.assignClientToUser(
        clientId,
        userId,
      );

      this.logger.log({
        message: `[RES] PUT /clients/assign/${clientId}/${userId} - assignClientToUser()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] PUT /clients/assign/${clientId}/${userId} - assignClientToUser()`,
        error,
        source,
      });
      throw error;
    }
  }

  @Put('unassign/:clientId/:userId')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Desasignar cliente de usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cliente desasignado con éxito',
    type: Client,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado o no asignado al usuario especificado',
  })
  async unassignClientFromUser(
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
  ): Promise<Client> {
    const source = 'ClientsController -> unassignClientFromUser()';

    this.logger.log({
      message: `[REQ] PUT /clients/unassign/${clientId}/${userId} - unassignClientFromUser()`,
      source,
      clientId,
      userId,
    });

    try {
      const response = await this.clientsService.unassignClientFromUser(
        clientId,
        userId,
      );

      this.logger.log({
        message: `[RES] PUT /clients/unassign/${clientId}/${userId} - unassignClientFromUser()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] PUT /clients/unassign/${clientId}/${userId} - unassignClientFromUser()`,
        error,
        source,
      });
      throw error;
    }
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
