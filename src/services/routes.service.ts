import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { RouteDto } from 'src/dto';
import { Route } from 'src/schemas';

@Injectable()
export class RoutesService {
  constructor(
    private readonly logger: Logger = new Logger(RoutesService.name),
    @InjectModel(Route.name) private routesModel: Model<Route>,
  ) {}

  private readonly GET_ALL_SORT_PARAM = 'client';

  getAll({
    startDate,
    endDate,
  }: {
    startDate?: string;
    endDate?: string;
  }): Promise<HydratedDocument<Route>[]> {
    const source = 'RoutesService -> getAll()';
    const datesFilter: { $gte?: Date; $lte?: Date } = {};
    const filterParams: FilterQuery<Route> = {};

    try {
      const startDateInstance = new Date(startDate);
      const endDateInstance = new Date(endDate);

      startDate && (datesFilter.$gte = startDateInstance);
      endDate && (datesFilter.$lte = endDateInstance);

      Object.keys(datesFilter).length && (filterParams.date = datesFilter);

      return this.routesModel
        .find(filterParams)
        .sort(this.GET_ALL_SORT_PARAM)
        .exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  create(createRouteDto: RouteDto): Promise<HydratedDocument<Route>> {
    const source = 'RoutesService -> create()';
    try {
      return this.routesModel.create(createRouteDto);
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  update(id: string, updateParams: any): Promise<HydratedDocument<Route>> {
    const source = 'RoutesService -> update()';
    try {
      return this.routesModel.findByIdAndUpdate(id, updateParams);
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  deleteAll() {
    const source = 'RoutesService -> deleteAll()';
    try {
      return this.routesModel.deleteMany({});
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }
}
