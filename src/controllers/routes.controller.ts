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
import { HydratedDocument } from 'mongoose';
import { RouteDto, UpdateRouteDto } from 'src/dto';
import { Route } from 'src/schemas';
import { RoutesService } from 'src/services';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
    private readonly logger: Logger = new Logger(RoutesController.name),
  ) {}

  @Get()
  async getAllRoutes(
    @Query() params?: { startDate?: string; endDate?: string },
  ): Promise<Route> {
    const source = 'RoutesController -> getAllRoutes()';

    const { startDate, endDate } = params;

    this.logger.log({
      message: '[REQ] GET /routes - getAllRoutes()',
      params,
      source,
    });

    const [response] = await this.routesService.getAll({ startDate, endDate });

    this.logger.log({
      message: '[RES] GET /routes - getAllRoutes()',
      response,
      source,
    });

    return response;
  }

  @Post()
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

  @Put()
  async updateRoute(
    @Body() body: UpdateRouteDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> updateRoute()';

    this.logger.log({
      message: '[REQ] PUT /routes - updateRoute()',
      source,
      body,
    });

    const response = await this.routesService.update(body);

    this.logger.log({
      message: '[RES] PUT /routes - updateRoute()',
      response,
      source,
    });

    return response;
  }

  @Delete(':id')
  async deleteRoute(
    @Param('id') id: string,
  ): Promise<boolean> {
    const source = 'RoutesController -> deleteRoute()';

    this.logger.log({
      message: '[REQ] DELETE /routes - deleteRoute()',
      source,
      id,
    });

    const response = await this.routesService.delete(id);

    this.logger.log({
      message: '[RES] DELETE /routes - deleteRoute()',
      response,
      source,
      id,
    });

    return !!response.deletedCount;
  };

  @Delete('/:routeId/:clientId')
  async deleteClientFromRoute(
    @Param('routeId') routeId: string,
    @Param('clientId') clientId: string,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> deleteRoute()';

    this.logger.log({
      message: '[REQ] DELETE /routes - deleteRoute()',
      source,
      routeId,
      clientId,
    });

    const response = await this.routesService.deleteClientOfRoute(routeId, clientId);

    this.logger.log({
      message: '[RES] DELETE /routes - deleteRoute()',
      response,
      source,
      routeId,
      clientId,
    });

    return response;
  };

  @Delete()
  async deleteRoutes(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.routesService.deleteAll();
  }
}
