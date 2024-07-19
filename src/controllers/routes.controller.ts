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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import {
  RouteDto,
  UpdateStatusClientsDto,
  UpdateClientsRouteDto,
  UpdateRouteStatusDto,
} from 'src/dto';
import { Route } from 'src/schemas';
import { RoutesService } from 'src/services';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('routes')
@ApiTags('routes')
@UseGuards(JwtAuthGuard)
export class RoutesController {
  private readonly logger = new Logger(RoutesController.name);

  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all routes or filter by date',
    type: [Route],
  })
  async getAllRoutes(
    @Req() req,
    @Query('date') date?: string,
  ): Promise<Route[]> {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (date) {
      console.log('Received date query:', date);
      return isAdmin
        ? this.routesService.getRoutesByDate(date)
        : this.routesService.getRoutesByDate(date, userId);
    } else {
      return isAdmin
        ? this.routesService.getAllRoutesAdmin()
        : this.routesService.getAllRoutes(userId);
    }
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Create Route', type: Route })
  async createRoute(
    @Body() routeDto: RouteDto,
    @Req() req,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> createRoute()';

    this.logger.log({
      message: '[REQ] POST /routes - createRoute()',
      source,
      body: routeDto,
    });

    const userId = req.user.id;
    const response = await this.routesService.create(routeDto, userId);

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

  @Put('assign/:routeId/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Asignar ruta a usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Ruta asignada con éxito',
    type: Route,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Ruta o usuario no encontrado' })
  async assignRouteToUser(
    @Param('routeId') routeId: string,
    @Param('userId') userId: string,
  ): Promise<Route> {
    const source = 'RoutesController -> assignRouteToUser()';

    this.logger.log({
      message: `[REQ] PUT /routes/assign/${routeId}/${userId} - assignRouteToUser()`,
      source,
      routeId,
      userId,
    });

    try {
      const response = await this.routesService.assignRouteToUser(
        routeId,
        userId,
      );

      this.logger.log({
        message: `[RES] PUT /routes/assign/${routeId}/${userId} - assignRouteToUser()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] PUT /routes/assign/${routeId}/${userId} - assignRouteToUser()`,
        error,
        source,
      });
      throw error;
    }
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
      message:
        '[REQ] DELETE /routes/:routeId/:clientId - deleteClientFromRoute()',
      source,
      routeId,
      clientId,
    });

    const response = await this.routesService.deleteClientOfRoute(
      routeId,
      clientId,
    );

    this.logger.log({
      message:
        '[RES] DELETE /routes/:routeId/:clientId - deleteClientFromRoute()',
      response,
      source,
      routeId,
      clientId,
    });

    return response;
  }

  @Delete()
  async deleteRoutes(
    @Body() body: { admin: boolean },
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
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
