import { Module } from '@nestjs/common';
import {
  ProductsController,
  RoutesController,
  ClientsController,
  OrderController,
  PricesListController,
} from '../controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import {
  ClientsService,
  OrderService,
  PricesListService,
  ProductsService,
  RoutesService,
} from 'src/services';
import {
  Client,
  ClientSchema,
  Route,
  RouteSchema,
  PricesList,
  PricesListSchema,
  Order,
  OrderSchema,
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
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [
    ProductsService,
    ClientsService,
    RoutesService,
    PricesListService,
    OrderService,
  ],
  controllers: [
    ProductsController,
    RoutesController,
    ClientsController,
    OrderController,
    PricesListController,
  ],
})
export class ControllersModule {}
