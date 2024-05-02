import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from 'src/services/order.service';

@Controller()
@ApiTags('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post('buyOrder')
  @ApiResponse({ status: 200, description: 'Create Buy Order' })
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
    await this.orderService.create({
      clientId: '123',
      products: [],
      date: new Date(),
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
