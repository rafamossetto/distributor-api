import { Module } from '@nestjs/common';
import {
  ProductsController,
  RoutesController,
  ClientsController,
  OrderController,
  PricesListController,
} from '../controllers';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthService,
  ClientsService,
  OrderService,
  PricesListService,
  ProductsService,
  RoutesService,
  UserService,
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
  Product,
  ProductSchema,
  User,
  UserSchema,
} from 'src/schemas';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
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
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    ProductsService,
    ClientsService,
    RoutesService,
    PricesListService,
    OrderService,
    UserService,
    JwtService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [
    ProductsController,
    RoutesController,
    ClientsController,
    OrderController,
    PricesListController,
    AuthController,
  ],
})
export class ControllersModule {}
