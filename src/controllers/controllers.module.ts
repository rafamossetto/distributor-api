import { Logger, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema'
import { ProductsService } from 'src/services';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Product.name,
      schema: ProductSchema,
    },
  ])],
  providers: [ProductsService, Logger],
  controllers: [ProductsController],
})
export class ControllersModule { };