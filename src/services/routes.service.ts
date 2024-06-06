import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { RouteDto, UpdateClientsRouteDto, UpdateRouteDto } from 'src/dto';
import { Route } from 'src/schemas';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(@InjectModel(Route.name) private routesModel: Model<Route>) {}

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

  updateRouteClients(
    updateRouteDto: UpdateClientsRouteDto,
  ): Promise<HydratedDocument<Route>> {
    const source = 'RoutesService -> update()';
    try {
      const { clients, id } = updateRouteDto;

      return this.routesModel.findByIdAndUpdate(
        id,
        {
          $set: {
            clients: clients,
          },
        },
        {
          multi: true,
          new: true,
        },
      );
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  update(updateRouteDto: UpdateRouteDto): Promise<HydratedDocument<Route>> {
    const source = 'RoutesService -> update()';
    try {
      const { id, clientId, status } = updateRouteDto;

      return this.routesModel.findByIdAndUpdate(
        id,
        {
          $set: {
            'clients.$[elem].status': status,
          },
        },
        {
          arrayFilters: [{ 'elem._id': clientId }],
          multi: true,
          new: true,
        },
      );
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async delete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'RoutesService -> delete()';

    try {
      return this.routesModel.deleteOne({ _id: id });
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw error;
    }
  }

  async deleteClientOfRoute(
    routeId: string,
    clientId: string,
  ): Promise<Promise<HydratedDocument<Route>>> {
    const source = 'RoutesService -> delete()';

    try {
      return this.routesModel.findOneAndUpdate(
        { _id: routeId },
        { $pull: { clients: { _id: clientId } } },
        { new: true },
      );
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
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
