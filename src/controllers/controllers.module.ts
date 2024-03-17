import { Logger, Module } from '@nestjs/common';
import {
  ProductsController,
  RoutesController,
  ClientsController,
  FilesController,
} from '../controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ClientsService, ProductsService, RoutesService } from 'src/services';
import { Client, ClientSchema, Route, RouteSchema } from 'src/schemas';

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
    ]),
  ],
  providers: [ProductsService, ClientsService, RoutesService, Logger],
  controllers: [ProductsController, RoutesController, ClientsController, FilesController],
})
export class ControllersModule {}
