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
  }: { startDate?: string, endDate?: string }): Promise<HydratedDocument<Route>[]> {

    const datesFilter: { $gte?: Date, $lte?: Date } = {};
    const filterParams: FilterQuery<Route> = {};
    
    const startDateInstance = new Date(startDate);
    const endDateInstance = new Date(endDate);

    startDate && (datesFilter.$gte = startDateInstance);
    endDate && (datesFilter.$lte = endDateInstance);

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
