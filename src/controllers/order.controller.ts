import { Body, Controller, Get, Logger, Param, Post, Render } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from 'src/dto';
import { OrderService } from 'src/services/order.service';
import { Order, Product } from 'src/schemas';

@Controller()
@ApiTags('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) { }

  @Post('order')
  @ApiResponse({ status: 201, description: 'Create Buy Order' })
  async createOrder(
    @Body() body: OrderDto,
  ): Promise<Order> {
    const source = 'OrderController -> createOrder()';

    this.logger.log({
      message: '[REQ] POST /order - createOrder()',
      source,
      body,
    });
    const response = await this.orderService.create(body);

    this.logger.log({
      message: '[RES] POST /order - createOrder()',
      response,
      body,
      source,
    });

    return response;
  }

  @Get('order/:id')
  @Render('order')
  @ApiResponse({ status: 200, description: 'Get Buy Order By Id' })
  async getOrder(
    @Param('id') orderId: string,
  ): Promise<{
    products: Product[],
    documentNumber: number,
    clientNumber: number,
    date: string
  }> {
    const source = 'OrderController -> getOrder()';

    this.logger.log({
      message: `[REQ] GET /order/${orderId} - getOrder()`,
      source,
      orderId,
    });
    const {
      products,
      date,
      documentNumber,
      clientNumber,
    } = await this.orderService.getById(orderId);

    this.logger.log({
      message: `[RES] GET /order/${orderId} - getOrder()`,
      response: products,
      orderId,
      source,
    });

    return {
      products,
      documentNumber,
      clientNumber,
      date: date.toLocaleDateString('en-GB'),
    };
  }
}
