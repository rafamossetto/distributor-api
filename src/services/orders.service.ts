import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { OrderDto } from 'src/dto/order.dto';
import { Order } from 'src/schemas';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  private readonly GET_ALL_SORT_PARAM = 'name';

  getAll(userId: string): Promise<HydratedDocument<Order>[]> {
    const source = 'OrderService -> getAll()';

    try {
      return this.orderModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    const source = 'OrderService -> getAllOrders()';

    try {
      this.logger.log({
        message: 'Fetching all orders',
        source,
      });

      return this.orderModel.find().exec();
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

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const source = 'OrdersService -> getOrdersByUserId()';

    try {
      this.logger.log({
        message: 'Fetching orders by user ID',
        userId,
        source,
      });

      const orders = await this.orderModel.find({ userId }).exec();

      if (!orders.length) {
        throw new NotFoundException(`No orders found for user ID ${userId}`);
      }

      return orders;
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

  async assignOrderToUser(orderId: string, userId: string): Promise<Order> {
    const source = 'OrderService -> assignOrderToUser()';

    try {
      const order = await this.orderModel
        .findByIdAndUpdate(orderId, { userId: userId }, { new: true })
        .exec();

      if (!order) {
        this.logger.warn({
          message: `Order with ID ${orderId} not found`,
          source,
        });
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
      }

      this.logger.log({
        message: `Order assigned successfully`,
        orderId,
        userId,
        source,
      });

      return order;
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

  async unassignOrderFromUser(orderId: string, userId: string): Promise<Order> {
    const source = 'OrderService -> unassignOrderFromUser()';

    try {
      const order = await this.orderModel
        .findOneAndUpdate(
          { _id: orderId, userId: userId },
          { $unset: { userId: '' } },
          { new: true },
        )
        .exec();

      if (!order) {
        throw new NotFoundException(
          `Orden con ID ${orderId} no encontrada o no asignada al usuario ${userId}`,
        );
      }

      this.logger.log({
        message: `Order unassigned successfully`,
        orderId,
        userId,
        source,
      });

      return order;
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

  async create(
    createOrderDto: OrderDto,
    userId: string,
  ): Promise<HydratedDocument<Order>> {
    const source = 'OrderService -> create()';

    const orderCount = await this.orderModel.countDocuments();

    try {
      const productsWithUserId = createOrderDto.products.map((product) => ({
        ...product,
        userId,
      }));

      return await this.orderModel.create({
        ...createOrderDto,
        products: productsWithUserId,
        documentNumber: orderCount + 1,
        date: new Date(),
        userId,
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

  getBySelectedList(selectedList: string): Promise<HydratedDocument<Order>[]> {
    const source = 'OrderService -> getBySelectedList()';
    const filterParams: FilterQuery<Order> = {
      selectedList: selectedList,
    };

    try {
      return this.orderModel.find(filterParams).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  getById(id: string): Promise<HydratedDocument<Order>> {
    const source = 'OrderService -> getById()';

    try {
      return this.orderModel.findById(id).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async deleteById(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'OrderService -> deleteById()';

    try {
      const result = await this.orderModel.deleteOne({ _id: id }).exec();
      //To Vle: Los services no logean
      this.logger.log({
        message: `${source} - Order deleted successfully with id ${id}`,
        result,
        source,
      });
      return result;
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  deleteAll(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    try {
      return this.orderModel.deleteMany({}).exec();
    } catch (error) {
      this.logger.error({
        message: `OrderService -> deleteAll() - ${error.toString()}`,
        error,
      });
      throw new HttpException(error.toString(), 500);
    }
  }

  async updateById(
    id: string,
    updateOrderDto: OrderDto,
  ): Promise<HydratedDocument<Order>> {
    const source = 'OrderService -> updateById()';

    try {
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(id, { ...updateOrderDto }, { new: true })
        .exec();

      if (!updatedOrder) {
        throw new HttpException('Order not found', 404);
      }

      this.logger.log({
        message: `${source} - Order updated successfully with id ${id}`,
        updatedOrder,
        source,
      });

      return updatedOrder;
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
