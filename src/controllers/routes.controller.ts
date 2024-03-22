import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { RouteDto } from 'src/dto';
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
    @Query() params?: { startDate?: string, endDate?: string },
  ): Promise<Route[]> {
    const source = 'RoutesController -> getAllRoutes()';

      const { startDate, endDate } = params;

      this.logger.log({
        message: '[REQ] GET /routes - getAllRoutes()',
        params,
        source,
      });

      const response = await this.routesService.getAll({ startDate, endDate });

      this.logger.log({
        message: '[RES] GET /routes - getAllRoutes()',
        response,
        length: response?.length,
        source,
      });

      return response;
  }

  @Post()
  async createRoute(
    @Body() routeDto: RouteDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesController -> createRoute()';

    try {
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

  @Delete()
  async deleteProducts(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.routesService.deleteAll();
  }
}
