import {
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
  Render,
} from '@nestjs/common';
import { OrderService } from 'src/services/order.service';

@Controller()
export class OrderController {

  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post('buyOrder')
  // @Render('buyOrder')
  async createBuyOrder(
    // TODO: remove anys
    @Body() body: any,
  ): Promise<any> {
    const source = 'OrderController -> createBuyOrder()';

      this.logger.log({
        message: '[REQ] POST /buyOrder - createBuyOrder()',
        source,
        body,
      });
      // test
      const response = this.orderService.create({
        clientId: '123',
        products: [],
        date: new Date()
      });

      this.logger.log({
        message: '[RES] POST /buyOrder - createBuyOrder()',
        // response,
        body,
        source,
      });

      return {};
  }
}
