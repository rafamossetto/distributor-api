import { Body, Controller, Get, Logger, Param, Post, Render } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from 'src/dto';
import { OrderService } from 'src/services/order.service';

@Controller()
@ApiTags('buyOrder')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) { }

  @Post('buyOrder')
  @ApiResponse({ status: 201, description: 'Create Buy Order' })
  async createBuyOrder(
    @Body() body: OrderDto,
  ): Promise<any> {
    const source = 'OrderController -> createBuyOrder()';

    this.logger.log({
      message: '[REQ] POST /buyOrder - createBuyOrder()',
      source,
      body,
    });
    const response = await this.orderService.create(body);

    this.logger.log({
      message: '[RES] POST /buyOrder - createBuyOrder()',
      response,
      body,
      source,
    });

    return response;
  }

  @Get('buyOrder/:id')
  @Render('buyOrder')
  @ApiResponse({ status: 200, description: 'Get Buy Order By Id' })
  async getBuyOrder(
    @Param('id') orderId: string,
  ): Promise<any> {
    const source = 'OrderController -> getBuyOrder()';

    this.logger.log({
      message: `[REQ] GET /buyOrder/${orderId} - getBuyOrder()`,
      source,
      orderId,
    });
    const { products } = await this.orderService.getById(orderId);

    this.logger.log({
      message: `[RES] GET /buyOrder/${orderId} - getBuyOrder()`,
      response: products,
      orderId,
      source,
    });

    return { products };
  }
}
