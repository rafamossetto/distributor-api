import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PricesListDto } from 'src/dto';
import { PricesList } from 'src/schemas';

@Injectable()
export class PricesListService {
  constructor(
    private readonly logger: Logger = new Logger(PricesListService.name),
    @InjectModel(PricesList.name) private pricesListModel: Model<PricesList>,
  ) {}

  private readonly GET_ALL_SORT_PARAM = 'alias';

  getAll(): Promise<HydratedDocument<PricesList>[]> {
    const source = 'PricesListService -> getAll()';
    try {
      return this.pricesListModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
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
    createPricesListDto: PricesListDto,
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

  update({
    number,
    percent
  }: { number: number, percent: number }) {
    const source = 'PricesListService -> update()';
    try {
      return this.pricesListModel.updateOne({ number }, { percent });
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  delete(number: number) {
    const source = 'PricesListService -> deleteOne()';
    try {
      return this.pricesListModel.deleteOne({ number });
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }
  
  deleteAll() {
    const source = 'PricesListService -> deleteAll()';
    try {
      return this.pricesListModel.deleteMany({});
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
