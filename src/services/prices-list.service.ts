import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, UpdateWriteOpResult } from 'mongoose';
import { CreatePriceListDto } from 'src/dto';
import { PricesList, Product } from 'src/schemas';
import { getPricesWithPercent } from 'src/utils';

@Injectable()
export class PricesListService {
  private readonly logger = new Logger(PricesListService.name);

  constructor(
    @InjectModel(PricesList.name) private pricesListModel: Model<PricesList>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  private readonly GET_ALL_SORT_PARAM = 'number';

  async getAll(): Promise<HydratedDocument<PricesList>[]> {
    const source = 'PricesListService -> getAll()';
    try {
      return await this.pricesListModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async create(
    createPricesListDto: CreatePriceListDto,
  ): Promise<HydratedDocument<PricesList>> {
    const source = 'PricesListService -> create()';
    try {
      const count = await this.pricesListModel.countDocuments();

      return await this.pricesListModel.create({
        ...createPricesListDto,
        number: count + 1,
      });
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async update({ number, percent }: { number: number; percent: number }): Promise<UpdateWriteOpResult> {
    const source = 'PricesListService -> update()';
    try {
      return await this.pricesListModel.updateOne({ number }, { percent }).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async updateProductPrices(limit = 10): Promise<void> {
    const source = 'PricesListService -> updateProductPrices()';
    try {
      const allPercentsList = (await this.pricesListModel.find().exec()).map(
        ({ percent }) => percent,
      );

      let skip = 0;
      let allDocumentsProcessed = false;
      while (!allDocumentsProcessed) {
        const products = await this.productModel
          .find()
          .skip(skip)
          .limit(limit)
          .exec();

        if (!products.length) {
          allDocumentsProcessed = true;
          continue;
        }

        const arr = products.map((product) => {
          const [basePrice] = product.prices;
          const increasedPrices = getPricesWithPercent(
            basePrice,
            allPercentsList,
          );

          product.prices = [basePrice, ...increasedPrices];

          return {
            updateOne: {
              filter: { _id: product._id },
              update: product.toObject(),
            },
          };
        });

        await this.productModel.bulkWrite(arr);

        skip += limit;
      }
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async delete(number: number): Promise<any> {
    const source = 'PricesListService -> deleteOne()';
    try {
      const docsCount = await this.pricesListModel.countDocuments();
      if (docsCount === 1) throw new Error('Prices List must have at least one value, operation denied');
      return await this.pricesListModel.deleteOne({ number }).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async bulkUpdatePricesListsNumber(): Promise<any> {
    const source = 'PricesListService -> bulkUpdatePricesListsNumber()';
    try {
      const pricesListDocs = await this.pricesListModel.find().sort({ percent: 1 }).exec();

      const bulkOps = pricesListDocs.map((doc, index) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { number: index + 1 },
        },
      }));

      return await this.pricesListModel.bulkWrite(bulkOps);
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async deleteAll(): Promise<any> {
    const source = 'PricesListService -> deleteAll()';
    try {
      return await this.pricesListModel.deleteMany({}).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }
}
