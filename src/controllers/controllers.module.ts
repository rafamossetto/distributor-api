import { Logger, Module } from '@nestjs/common';
import {
  ProductsController,
  RoutesController,
  ClientsController,
  FilesController,
  PricesListController,
} from '../controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ClientsService, PricesListService, ProductsService, RoutesService } from 'src/services';
import {
  Client,
  ClientSchema,
  Route,
  RouteSchema,
  PricesList,
  PricesListSchema,
} from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Client.name,
        schema: ClientSchema,
      },
      {
        name: Route.name,
        schema: RouteSchema,
      },
      {
        name: PricesList.name,
        schema: PricesListSchema,
      },
    ]),
  ],
  providers: [Logger, ProductsService, ClientsService, RoutesService, PricesListService],
  controllers: [
    ProductsController,
    RoutesController,
    ClientsController,
    FilesController,
    PricesListController
  ],
})
export class ControllersModule {}
