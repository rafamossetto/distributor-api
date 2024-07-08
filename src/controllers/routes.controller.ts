import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import {
  RouteDto,
  UpdateStatusClientsDto,
  UpdateClientsRouteDto,
  UpdateRouteStatusDto,
} from 'src/dto';
import { Route } from 'src/schemas';
import { RoutesService } from 'src/services';

@Controller('routes')
@ApiTags('routes')
export class RoutesController {
  private readonly logger = new Logger(RoutesController.name);

  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List Route By startDate & endDate',
    type: [Route],
  })
  async getAllRoutes(
    @Query() params?: { startDate?: string; endDate?: string },
  ): Promise<Route[]> {
    const source = 'RoutesController -> getAllRoutes()';

    this.logger.log({
      message: '[REQ] GET /routes - getAllRoutes()',
      params,
      source,
    });

    const response = await this.routesService.getAll(params);

    this.logger.log({
      message: '[RES] GET /routes - getAllRoutes()',
      response,
      source,
    });

    return response;
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Create Route', type: Route })
  async createRoute(
    @Body() routeDto: RouteDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> createRoute()';

    this.logger.log({
      message: '[REQ] POST /routes - createRoute()',
      source,
      body: routeDto,
    });

    const response = await this.routesService.create(routeDto);

    this.logger.log({
      message: '[RES] POST /routes - createRoute()',
      response,
      source,
    });

    return response;
  }

  @Put('status')
  @ApiResponse({ status: 201, description: 'Update Route Status', type: Route })
  async updateRouteStatus(
    @Body() body: UpdateRouteStatusDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> updateRouteStatus()';

    this.logger.log({
      message: '[REQ] PUT /routes/status - updateRouteStatus()',
      source,
      body,
    });

    const response = await this.routesService.updateRouteStatus(body.id, body);

    this.logger.log({
      message: '[RES] PUT /routes/status - updateRouteStatus()',
      response,
      source,
    });

    return response;
  }

  @Put()
  @ApiResponse({ status: 201, description: 'Update Route', type: Route })
  async updateClientStatus(
    @Body() body: UpdateStatusClientsDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> updateClientStatus()';

    this.logger.log({
      message: '[REQ] PUT /routes - updateClientStatus()',
      source,
      body,
    });

    const response = await this.routesService.updateStatusClients(body);

    this.logger.log({
      message: '[RES] PUT /routes - updateClientStatus()',
      response,
      source,
    });

    return response;
  }

  @Put('/clients')
  @ApiResponse({
    status: 201,
    description: 'Update Route Clients',
    type: Route,
  })
  async updateRouteClients(
    @Body() body: UpdateClientsRouteDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> updateRouteClients()';

    this.logger.log({
      message: '[REQ] PUT /routes/clients - updateRouteClients()',
      source,
      body,
    });

    const response = await this.routesService.updateRouteClients(body);

    this.logger.log({
      message: '[RES] PUT /routes/clients - updateRouteClients()',
      response,
      source,
    });

    return response;
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Delete Route', type: Boolean })
  async deleteRoute(@Param('id') id: string): Promise<boolean> {
    const source = 'RoutesController -> deleteRoute()';

    this.logger.log({
      message: '[REQ] DELETE /routes/:id - deleteRoute()',
      source,
      id,
    });

    const response = await this.routesService.delete(id);

    this.logger.log({
      message: '[RES] DELETE /routes/:id - deleteRoute()',
      response,
      source,
      id,
    });

    return !!response.deletedCount;
  }

  @Delete('/:routeId/:clientId')
  @ApiResponse({
    status: 201,
    description: 'Delete Client From Route',
    type: Route,
  })
  async deleteClientFromRoute(
    @Param('routeId') routeId: string,
    @Param('clientId') clientId: string,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> deleteClientFromRoute()';

    this.logger.log({
      message: '[REQ] DELETE /routes/:routeId/:clientId - deleteClientFromRoute()',
      source,
      routeId,
      clientId,
    });

    const response = await this.routesService.deleteClientOfRoute(
      routeId,
      clientId,
    );

    this.logger.log({
      message: '[RES] DELETE /routes/:routeId/:clientId - deleteClientFromRoute()',
      response,
      source,
      routeId,
      clientId,
    });

    return response;
  }

  @Delete()
  async deleteRoutes(@Body() body: { admin: boolean }): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    const response = await this.routesService.deleteAll();
    
    this.logger.log({
      message: '[RES] DELETE /routes - deleteRoutes()',
      response,
    });
    
    return response;
  }
}
