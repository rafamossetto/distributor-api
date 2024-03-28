import { Injectable, Logger } from '@nestjs/common';
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
      throw error;
    }
  }

  create(
    createPricesListDto: PricesListDto,
  ): Promise<HydratedDocument<PricesList>> {
    const source = 'PricesListService -> create()';
    try {
      return this.pricesListModel.create(createPricesListDto);
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
    const source = 'PricesListService -> deleteAll()';
    try {
      return this.pricesListModel.deleteMany({});
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }
}
