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
  ) { }

  private readonly GET_ALL_SORT_PARAM = 'name';

  getAll(): Promise<HydratedDocument<Product>[]> {
    return this.productModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
  };

  create(createProductDto: ProductDto): Promise<HydratedDocument<Product>> {
    return this.productModel.create(createProductDto);
  };

  deleteAll() {
    return this.productModel.deleteMany({});
  }
}