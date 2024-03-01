import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ProductDto } from 'src/dto';
import { Product } from 'src/schemas';
// import { IProducts } from './interfaces/cat.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    ) {}

  getAll() {
    return this.productModel.find().exec();
  };

  create(createProductDto: ProductDto): Promise<HydratedDocument<Product>>  {
    return this.productModel.create(createProductDto);
  };

  deleteAll() {
    return this.productModel.deleteMany({});
  }
}