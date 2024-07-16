import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from 'src/dto';
import { OrderService } from 'src/services/orders.service';
import { Order, Product } from 'src/schemas';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
@ApiTags('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get Buy Orders' })
  async getOrders(@Req() req): Promise<Order[]> {
    const source = 'OrderController -> getOrders()';
    const userId = req.user.id;
    
    this.logger.log({
      message: '[REQ] GET /orders - getOrders()',
      source,
      userId,
    });

    const response = await this.orderService.getAll(userId);

    this.logger.log({
      message: '[RES] GET /orders - getOrders()',
      response,
      source,
    });

    return response;
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Create Buy Order' })
  async createOrder(@Body() body: OrderDto, @Req() req): Promise<Order> {
    const source = 'OrderController -> createOrder()';
    const userId = req.user.id;

    this.logger.log({
      message: '[REQ] POST /orders - createOrder()',
      source,
      body,
      userId,
    });
    const response = await this.orderService.create(body, userId);

    this.logger.log({
      message: '[RES] POST /orders - createOrder()',
      response,
      body,
      source,
    });

    return response;
  }

  @Get('selectedList/:selectedList')
  @ApiResponse({
    status: 200,
    description: 'Get Buy Orders by Selected List',
  })
  async getOrderBySelectedList(@Param('selectedList') selectedList: string): Promise<Order[]> {
    const source = 'OrderController -> getOrderBySelectedList()';

    this.logger.log({
      message: `[REQ] GET /orders/selectedList/${selectedList} - getOrderBySelectedList()`,
      source,
    });

    const response = await this.orderService.getBySelectedList(selectedList);

    this.logger.log({
      message: `[RES] GET /orders/selectedList/${selectedList} - getOrderBySelectedList()`,
      response,
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

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete Order By Id' })
  async deleteOrder(@Param('id') id: string): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'OrderController -> deleteOrder()';

    this.logger.log({
      message: `[REQ] DELETE /orders/${id} - deleteOrder()`,
      source,
      id,
    });

    const response = await this.orderService.deleteById(id);

    this.logger.log({
      message: `[RES] DELETE /orders/${id} - deleteOrder()`,
      response,
      id,
      source,
    });

    return response;
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'Delete All Orders' })
  async deleteAllOrders(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'OrderController -> deleteAllOrders()';

    this.logger.log({
      message: '[REQ] DELETE /orders - deleteAllOrders()',
      source,
    });

    const response = await this.orderService.deleteAll();

    this.logger.log({
      message: '[RES] DELETE /orders - deleteAllOrders()',
      response,
      source,
    });

    return response;
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Update Order By Id' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: OrderDto,
  ): Promise<Order> {
    const source = 'OrderController -> updateOrder()';

    this.logger.log({
      message: `[REQ] PUT /orders/${id} - updateOrder()`,
      source,
      id,
      updateOrderDto,
    });

    const response = await this.orderService.updateById(id, updateOrderDto);

    this.logger.log({
      message: `[RES] PUT /orders/${id} - updateOrder()`,
      response,
      id,
      source,
    });

    return response;
  }
}
