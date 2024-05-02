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
import { RouteDto, UpdateRouteDto } from 'src/dto';
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
    type: Route,
  })
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

  @Put()
  @ApiResponse({ status: 201, description: 'Update Route', type: Route })
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
  @ApiResponse({ status: 201, description: 'Delete Route', type: Boolean })
  async deleteRoute(@Param('id') id: string): Promise<boolean> {
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
    const source = 'RoutesController -> deleteRoute()';

    this.logger.log({
      message: '[REQ] DELETE /routes - deleteRoute()',
      source,
      routeId,
      clientId,
    });

    const response = await this.routesService.deleteClientOfRoute(
      routeId,
      clientId,
    );

    this.logger.log({
      message: '[RES] DELETE /routes - deleteRoute()',
      response,
      source,
      routeId,
      clientId,
    });

    return response;
  }

  @Delete()
  async deleteRoutes(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.routesService.deleteAll();
  }
}
