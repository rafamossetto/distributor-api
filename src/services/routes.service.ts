import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  RouteDto,
  UpdateClientsRouteDto,
  UpdateRouteStatusDto,
  UpdateStatusClientsDto,
} from 'src/dto';
import { Route } from 'src/schemas';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(@InjectModel(Route.name) private routesModel: Model<Route>) {}

  private readonly GET_ALL_SORT_PARAM = 'client';

  async getAllRoutes(userId: string): Promise<Route[]> {
    const source = 'RoutesService -> getAllRoutes()';
    try {
      return await this.routesModel.find({ userId }).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async getRoutesByDate(date: string, userId: string): Promise<Route[]> {
    const source = 'RoutesService -> getRoutesByDate()';
    try {
      const searchDate = new Date(date);
      searchDate.setUTCHours(0, 0, 0, 0);
  
  
      const routes = await this.routesModel.find({
        date: searchDate,
        userId,
      }).exec();
  
      return routes;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }
  
  async create(createRouteDto: RouteDto, userId: string): Promise<HydratedDocument<Route>> {
    const source = 'RoutesService -> create()';
    try {
      const clientsWithUserId = createRouteDto.clients.map(client => ({
        ...client,
        userId
      }));
  
      const routeDate = new Date(createRouteDto.date);
      routeDate.setUTCHours(0, 0, 0, 0);
  
      const route = await this.routesModel.create({
        ...createRouteDto,
        date: routeDate,
        clients: clientsWithUserId,
        open: true,
        userId,
      });
  
  
      return route;
    } catch (error) {
  
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async updateRouteClients(
    updateRouteDto: UpdateClientsRouteDto,
  ): Promise<HydratedDocument<Route> | null> {
    const source = 'RoutesService -> updateRouteClients()';
    try {
      const { clients, id } = updateRouteDto;

      return await this.routesModel
        .findByIdAndUpdate(
          id,
          {
            $set: { clients },
          },
          { multi: true, new: true },
        )
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

  async updateStatusClients(
    updateRouteDto: UpdateStatusClientsDto,
  ): Promise<HydratedDocument<Route> | null> {
    const source = 'RoutesService -> updateStatusClients()';
    try {
      const { id, clientId, status } = updateRouteDto;

      return await this.routesModel
        .findByIdAndUpdate(
          id,
          {
            $set: { 'clients.$[elem].status': status },
          },
          {
            arrayFilters: [{ 'elem._id': clientId }],
            multi: true,
            new: true,
          },
        )
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

  async updateRouteStatus(
    id: string,
    updateRouteStatusDto: UpdateRouteStatusDto,
  ): Promise<HydratedDocument<Route> | null> {
    const source = 'RoutesService -> updateRouteStatus()';
    try {
      return await this.routesModel
        .findByIdAndUpdate(id, updateRouteStatusDto, {
          new: true,
        })
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

  async delete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'RoutesService -> delete()';

    try {
      return await this.routesModel.deleteOne({ _id: id }).exec();
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
  ): Promise<HydratedDocument<Route> | null> {
    const source = 'RoutesService -> deleteClientOfRoute()';

    try {
      return await this.routesModel
        .findOneAndUpdate(
          { _id: routeId },
          { $pull: { clients: { _id: clientId } } },
          { new: true },
        )
        .exec();
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

  async deleteAll(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'RoutesService -> deleteAll()';
    try {
      return await this.routesModel.deleteMany({}).exec();
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
