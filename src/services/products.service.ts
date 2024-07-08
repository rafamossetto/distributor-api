import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ProductDto } from 'src/dto';
import { PricesList, Product } from 'src/schemas';
import { getPricesWithPercent } from 'src/utils';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(PricesList.name) private pricesListModel: Model<PricesList>,
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
      const { price: firstPrice, name } = createProductDto;

      const allPercentsList = (await this.pricesListModel.find().exec()).map(
        ({ percent }) => percent,
      );

      const increasedPrices = getPricesWithPercent(firstPrice, allPercentsList);

      const prices = [firstPrice, ...increasedPrices];

      const codeIncreased = (await this.productModel.countDocuments()) + 1;

      return this.productModel.create({
        ...createProductDto,
        name: name.toUpperCase(),
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

  async update(
    id: string,
    updateParams: Partial<ProductDto>,
  ): Promise<HydratedDocument<Product> | null> {
    const source = 'ProductsService -> update()';

    try {
      return this.productModel.findByIdAndUpdate(id, updateParams, { new: true }).exec();
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async delete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'ProductsService -> delete()';

    try {
      return this.productModel.deleteOne({ _id: id }).exec();
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
    const source = 'ProductsService -> deleteAll()';

    try {
      return this.productModel.deleteMany({}).exec();
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }
}
