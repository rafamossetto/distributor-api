import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ProductDto } from 'src/dto';
import { PricesList, Product } from 'src/schemas';
import { getPricesWithPercent } from 'src/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(PricesList.name) private pricesListModel: Model<PricesList>,
    private readonly logger: Logger = new Logger(ProductsService.name),
  ) { }

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
      const { price: firstPrice } = createProductDto;

      const allPercentsList = (await this.pricesListModel.find().exec()).map(({ percent }) => percent);

      const increasedPrices = getPricesWithPercent(firstPrice, allPercentsList);

      const prices = [firstPrice, ...increasedPrices];

      const codeIncreased = await this.productModel.countDocuments() + 1;

      return this.productModel.create({
        ...createProductDto,
        code: codeIncreased,
        prices,
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
