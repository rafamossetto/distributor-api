import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { OrderDto } from 'src/dto/order.dto';
import { Order } from 'src/schemas';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  private readonly GET_ALL_SORT_PARAM = 'name';

  async getAll(): Promise<HydratedDocument<Order>[]> {
    const source = 'OrderService -> getAll()';

    try {
      return await this.orderModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async getByDate(date: string): Promise<HydratedDocument<Order>[]> {
    const source = 'OrderService -> getByDate()';
    const dateInstance = new Date(date);
    const filterParams: FilterQuery<Order> = {
      date: {
        $gte: new Date(date),
        $lte: new Date(`${dateInstance.toISOString().split('T')[0]}T23:59:59.999Z`),
      },
    };

    try {
      return await this.orderModel.find(filterParams).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async getById(id: string): Promise<HydratedDocument<Order>> {
    const source = 'OrderService -> getById()';

    try {
      return await this.orderModel.findById(id).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async create(createOrderDto: OrderDto): Promise<HydratedDocument<Order>> {
    const source = 'OrderService -> create()';

    const orderCount = await this.orderModel.countDocuments();

    try {
      return await this.orderModel.create({
        ...createOrderDto,
        documentNumber: orderCount + 1,
        date: new Date(),
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

  async deleteAll(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    try {
      return await this.orderModel.deleteMany({}).exec();
    } catch (error) {
      this.logger.error({
        message: `OrderService -> deleteAll() - ${error.toString()}`,
        error,
      });
      throw new HttpException(error.toString(), 500);
    }
  }
}
