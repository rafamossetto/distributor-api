import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ProductDto } from 'src/dto';
import { Product } from 'src/schemas';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly logger: Logger = new Logger(ProductsService.name),
  ) {}

  private readonly GET_ALL_SORT_PARAM = 'name';

  getAll(): Promise<HydratedDocument<Product>[]> {
    const source = 'ProductsService -> getAll()';

    try {
      return this.productModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async create(
    createProductDto: ProductDto,
  ): Promise<HydratedDocument<Product>> {
    const source = 'ProductsService -> create()';

    try {
      const count = await this.productModel.countDocuments();

      return this.productModel.create({
        ...createProductDto,
        code: count + 1,
      });
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  deleteAll() {
    return this.productModel.deleteMany({});
  }
}
