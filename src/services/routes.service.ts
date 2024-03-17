import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { RouteDto } from 'src/dto';
import { Route } from 'src/schemas';

@Injectable()
export class RoutesService {
  constructor(@InjectModel(Route.name) private routesModel: Model<Route>) {}

  private readonly GET_ALL_SORT_PARAM = 'client';

  getAll({
    startDate, endDate
  }: { startDate?: Date, endDate?: Date }): Promise<HydratedDocument<Route>[]> {

    const datesFilter: { $gte?: Date, $lte?: Date } = {};
    const filterParams: FilterQuery<Route> = {};

    startDate && (datesFilter.$gte = startDate);
    endDate && (datesFilter.$lte = endDate);

    Object.keys(datesFilter).length && (filterParams.date = datesFilter);

    return this.routesModel.find(filterParams).sort(this.GET_ALL_SORT_PARAM).exec();
  }

  create(createRouteDto: RouteDto): Promise<HydratedDocument<Route>> {
    return this.routesModel.create(createRouteDto);
  }

  deleteAll() {
    return this.routesModel.deleteMany({});
  }
}
