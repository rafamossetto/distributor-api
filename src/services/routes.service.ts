import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { RouteDto } from 'src/dto';
import { Route } from 'src/schemas';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routesModel: Model<Route>,
  ) { }

  private readonly GET_ALL_SORT_PARAM = 'name';

  getAll() {
    return this.routesModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
  };

  create(createRouteDto: RouteDto): Promise<HydratedDocument<Route>> {
    return this.routesModel.create(createRouteDto);
  };

  deleteAll() {
    return this.routesModel.deleteMany({});
  }
}