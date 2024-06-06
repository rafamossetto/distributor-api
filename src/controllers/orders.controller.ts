import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from 'src/dto';
import { OrderService } from 'src/services/orders.service';
import { Order, Product } from 'src/schemas';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get Buy Orders' })
  async getOrders(): Promise<Order[]> {
    const source = 'OrderController -> getOrders()';

    this.logger.log({
      message: '[REQ] GET /orders - getOrders()',
      source,
    });

    const response = await this.orderService.getAll();

    this.logger.log({
      message: '[RES] GET /orders - getOrders()',
      response,
      source,
    });

    return response;
  }

  @Get(':date')
  @ApiResponse({
    status: 200,
    description: 'Get Buy Orders by Date - ex: 2024-12-20',
  })
  async getOrderByDate(@Param('date') date: string): Promise<Order[]> {
    const source = 'OrderController -> getOrderByDate()';

    this.logger.log({
      message: `[REQ] GET /orders/${date} - getOrderByDate()`,
      source,
    });

    const response = await this.orderService.getByDate(date);

    this.logger.log({
      message: `[RES] GET /orders/${date} - getOrderByDate()`,
      response,
      source,
    });

    return response;
  }

  @Post('')
  @ApiResponse({ status: 201, description: 'Create Buy Order' })
  async createOrder(@Body() body: OrderDto): Promise<Order> {
    const source = 'OrderController -> createOrder()';

    this.logger.log({
      message: '[REQ] POST /orders - createOrder()',
      source,
      body,
    });
    const response = await this.orderService.create(body);

    this.logger.log({
      message: '[RES] POST /orders - createOrder()',
      response,
      body,
      source,
    });

    return response;
  }

  @Get(':id')
  @Render('order')
  @ApiResponse({ status: 200, description: 'Get Buy Order By Id' })
  async getOrder(@Param('id') orderId: string): Promise<{
    products: Product[];
    documentNumber: number;
    clientNumber: number;
    date: string;
  }> {
    const source = 'OrderController -> getOrder()';

    this.logger.log({
      message: `[REQ] GET /orders/${orderId} - getOrder()`,
      source,
      orderId,
    });
    const { products, date, documentNumber, clientNumber } =
      await this.orderService.getById(orderId);

    this.logger.log({
      message: `[RES] GET /orders/${orderId} - getOrder()`,
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
