import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from 'src/dto';
import { OrderService } from 'src/services/orders.service';
import { Order, Product } from 'src/schemas';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@ApiTags('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Obtener todas las órdenes (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las órdenes',
    type: [Order],
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async getAllOrdersAdmin(): Promise<Order[]> {
    const source = 'OrderController -> getAllOrdersAdmin()';

    this.logger.log({
      message: '[REQ] GET /orders/all - getAllOrdersAdmin()',
      source,
    });

    try {
      const response = await this.orderService.getAllOrders();

      this.logger.log({
        message: '[RES] GET /orders/all - getAllOrdersAdmin()',
        length: response?.length,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: '[ERR] GET /orders/all - getAllOrdersAdmin()',
        error,
        source,
      });
      throw new InternalServerErrorException(
        'Error al obtener todas las órdenes',
      );
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get user-assigned orders',
    type: [Order],
  })
  async getUserOrders(@Req() req): Promise<Order[]> {
    const source = 'OrderController -> getUserOrders()';
    const userId = req.user.id;

    this.logger.log({
      message: '[REQ] GET /orders - getUserOrders()',
      source,
      userId,
    });

    try {
      const response = await this.orderService.getOrdersByUserId(userId);

      this.logger.log({
        message: '[RES] GET /orders - getUserOrders()',
        length: response?.length,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: '[ERR] GET /orders - getUserOrders()',
        error,
        source,
      });
      throw new InternalServerErrorException(
        'Error al obtener las órdenes del usuario',
      );
    }
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
  async getOrderBySelectedList(
    @Param('selectedList') selectedList: string,
  ): Promise<Order[]> {
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

  @Get('user/:userId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Obtener órdenes por ID de usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes del usuario especificado',
    type: [Order],
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getOrdersByUserId(@Param('userId') userId: string): Promise<Order[]> {
    const source = 'OrdersController -> getOrdersByUserId()';

    this.logger.log({
      message: `[REQ] GET /orders/user/${userId} - getOrdersByUserId()`,
      source,
      userId,
    });

    try {
      const response = await this.orderService.getOrdersByUserId(userId);

      this.logger.log({
        message: `[RES] GET /orders/user/${userId} - getOrdersByUserId()`,
        length: response?.length,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] GET /orders/user/${userId} - getOrdersByUserId()`,
        error,
        source,
      });
      throw new InternalServerErrorException(
        'Error al obtener las órdenes del usuario',
      );
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete Order By Id' })
  async deleteOrder(
    @Param('id') id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
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
  async deleteAllOrders(): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> {
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

  @Put('assign/:orderId/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Asignar orden a usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Orden asignada con éxito',
    type: Order,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Orden o usuario no encontrado' })
  async assignOrderToUser(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ): Promise<Order> {
    const source = 'OrderController -> assignOrderToUser()';

    this.logger.log({
      message: `[REQ] PUT /orders/assign/${orderId}/${userId} - assignOrderToUser()`,
      source,
      orderId,
      userId,
    });

    try {
      const response = await this.orderService.assignOrderToUser(
        orderId,
        userId,
      );

      this.logger.log({
        message: `[RES] PUT /orders/assign/${orderId}/${userId} - assignOrderToUser()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] PUT /orders/assign/${orderId}/${userId} - assignOrderToUser()`,
        error,
        source,
      });
      throw error;
    }
  }

  @Put('unassign/:orderId/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Desasignar orden de usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Orden desasignada con éxito',
    type: Order,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada o no asignada al usuario especificado',
  })
  async unassignOrderFromUser(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ): Promise<Order> {
    const source = 'OrderController -> unassignOrderFromUser()';

    this.logger.log({
      message: `[REQ] PUT /orders/unassign/${orderId}/${userId} - unassignOrderFromUser()`,
      source,
      orderId,
      userId,
    });

    try {
      const response = await this.orderService.unassignOrderFromUser(
        orderId,
        userId,
      );

      this.logger.log({
        message: `[RES] PUT /orders/unassign/${orderId}/${userId} - unassignOrderFromUser()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] PUT /orders/unassign/${orderId}/${userId} - unassignOrderFromUser()`,
        error,
        source,
      });
      throw error;
    }
  }
}
