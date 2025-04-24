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
  Query,
  Render,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from 'src/dto';
import { OrderService } from 'src/services/orders.service';
import { Order } from 'src/schemas';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { PublicGuard } from 'src/auth/public.guard';
import { translateMeasurement } from 'src/utils/translation.utils';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Obtener todas las órdenes (solo admin) con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de órdenes',
  })
  async getAllOrdersAdmin(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    this.logger.log(`[REQ] GET /orders/all?page=${p}&limit=${l}&search=${search}`);
    try {
      return await this.orderService.getPaginatedOrders(p, l, undefined, search);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Error al obtener todas las órdenes');
    }
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create Buy Order' })
  async createOrder(@Body() body: OrderDto, @Req() req): Promise<Order> {
    const source = 'OrderController -> createOrder()';
    // const userId = '192938';
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(PublicGuard)
  @Render('order')
  @ApiResponse({ status: 200, description: 'Get Buy Order By Id' })
  async getOrder(
    @Param('id') orderId: string,
  ): Promise<{
    products: any;
    documentNumber: number;
    clientNumber: number;
    clientName: string;
    date: string;
  }> {
    this.logger.log(`Obtaining order by ID: ${orderId}`);
    try {
      const { products, date, documentNumber, clientNumber, clientName } =
        await this.orderService.getById(orderId);
  
      const translatedProducts = products.map((product) => {
        const isKilogram = product.measurement === 'kilogram';
        return {
          ...product,
          name: product.name,
          code: product.code,
          measurement: translateMeasurement(product.measurement),
          quantity: isKilogram ? product.units : product.quantity,
        };
      });
  
      return {
        products: translatedProducts,
        documentNumber,
        clientNumber,
        clientName,
        date: date.toLocaleDateString('en-GB'),
      };
    } catch (error) {
      this.logger.error('Failed to get order by ID', error);
      throw new InternalServerErrorException(
        'Error al obtener la orden por ID',
      );
    }
  }
  

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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

  @Get()  
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get paginated user orders' })
  async getUserOrders(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    const userId = req.user.id;
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    this.logger.log(`[REQ] GET /orders?page=${p}&limit=${l}&search=${search}`);
    try {
      return await this.orderService.getPaginatedOrders(p, l, userId, search);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Error al obtener órdenes');
    }
  }
  
  @Put('unassign/:orderId/:userId')
  @UseGuards(JwtAuthGuard)
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
