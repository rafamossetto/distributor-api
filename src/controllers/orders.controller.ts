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
import { PublicGuard } from 'src/auth/public.guard';
import { translateMeasurement } from 'src/utils/translation.utils';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard) // Solo admin puede acceder a esta ruta
  @ApiOperation({ summary: 'Obtener todas las órdenes (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de todas las órdenes', type: [Order] })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async getAllOrdersAdmin(): Promise<Order[]> {
    this.logger.log('Obtaining all orders for admin');
    try {
      return await this.orderService.getAllOrders();
    } catch (error) {
      this.logger.error('Failed to get all orders', error);
      throw new InternalServerErrorException('Error al obtener todas las órdenes');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get user-assigned orders', type: [Order] })
  async getUserOrders(@Req() req): Promise<Order[]> {
    const userId = req.user.id;
    this.logger.log(`Obtaining orders for user: ${userId}`);
    try {
      return await this.orderService.getOrdersByUserId(userId);
    } catch (error) {
      this.logger.error('Failed to get user orders', error);
      throw new InternalServerErrorException('Error al obtener las órdenes del usuario');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create Buy Order' })
  async createOrder(@Body() body: OrderDto, @Req() req): Promise<Order> {
    const userId = req.user.id;
    this.logger.log(`Creating order for user: ${userId}`);
    try {
      return await this.orderService.create(body, userId);
    } catch (error) {
      this.logger.error('Failed to create order', error);
      throw new InternalServerErrorException('Error al crear la orden');
    }
  }

  @Get('selectedList/:selectedList')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get Buy Orders by Selected List' })
  async getOrderBySelectedList(@Param('selectedList') selectedList: string): Promise<Order[]> {
    this.logger.log(`Obtaining orders by selected list: ${selectedList}`);
    try {
      return await this.orderService.getBySelectedList(selectedList);
    } catch (error) {
      this.logger.error('Failed to get orders by selected list', error);
      throw new InternalServerErrorException('Error al obtener las órdenes por lista seleccionada');
    }
  }


  @Get(':id')
  @UseGuards(PublicGuard)
  @Render('order')
  @ApiResponse({ status: 200, description: 'Get Buy Order By Id' })
  async getOrder(@Param('id') orderId: string): Promise<{ products: any; documentNumber: number; clientNumber: number; date: string }> {
    this.logger.log(`Obtaining order by ID: ${orderId}`);
    try {
      const { products, date, documentNumber, clientNumber } = await this.orderService.getById(orderId);
      
      const translatedProducts = products.map(product => ({
        ...product,
        name: product.name,
        quantity: product.quantity,
        code: product.code,
        measurement: translateMeasurement(product.measurement),
      }));

      return { products: translatedProducts, documentNumber, clientNumber, date: date.toLocaleDateString('en-GB') };
    } catch (error) {
      this.logger.error('Failed to get order by ID', error);
      throw new InternalServerErrorException('Error al obtener la orden por ID');
    }
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard) // Solo admin puede acceder a esta ruta
  @ApiOperation({ summary: 'Obtener órdenes por ID de usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes del usuario especificado', type: [Order] })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getOrdersByUserId(@Param('userId') userId: string): Promise<Order[]> {
    this.logger.log(`Obtaining orders for user ID: ${userId}`);
    try {
      return await this.orderService.getOrdersByUserId(userId);
    } catch (error) {
      this.logger.error('Failed to get orders by user ID', error);
      throw new InternalServerErrorException('Error al obtener las órdenes del usuario');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Delete Order By Id' })
  async deleteOrder(@Param('id') id: string): Promise<{ acknowledged: boolean; deletedCount: number }> {
    this.logger.log(`Deleting order by ID: ${id}`);
    try {
      return await this.orderService.deleteById(id);
    } catch (error) {
      this.logger.error('Failed to delete order', error);
      throw new InternalServerErrorException('Error al eliminar la orden');
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Delete All Orders' })
  async deleteAllOrders(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    this.logger.log('Deleting all orders');
    try {
      return await this.orderService.deleteAll();
    } catch (error) {
      this.logger.error('Failed to delete all orders', error);
      throw new InternalServerErrorException('Error al eliminar todas las órdenes');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Update Order By Id' })
  async updateOrder(@Param('id') id: string, @Body() updateOrderDto: OrderDto): Promise<Order> {
    this.logger.log(`Updating order by ID: ${id}`);
    try {
      return await this.orderService.updateById(id, updateOrderDto);
    } catch (error) {
      this.logger.error('Failed to update order', error);
      throw new InternalServerErrorException('Error al actualizar la orden');
    }
  }

  @Put('assign/:orderId/:userId')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard) // Solo admin puede asignar órdenes
  @ApiOperation({ summary: 'Asignar orden a usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Orden asignada con éxito', type: Order })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Orden o usuario no encontrado' })
  async assignOrderToUser(@Param('orderId') orderId: string, @Param('userId') userId: string): Promise<Order> {
    this.logger.log(`Assigning order ID ${orderId} to user ID ${userId}`);
    try {
      return await this.orderService.assignOrderToUser(orderId, userId);
    } catch (error) {
      this.logger.error('Failed to assign order to user', error);
      throw new InternalServerErrorException('Error al asignar la orden al usuario');
    }
  }

  @Put('unassign/:orderId/:userId')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard) // Solo admin puede desasignar órdenes
  @ApiOperation({ summary: 'Desasignar orden de usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Orden desasignada con éxito', type: Order })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada o no asignada al usuario especificado' })
  async unassignOrderFromUser(@Param('orderId') orderId: string, @Param('userId') userId: string): Promise<Order> {
    this.logger.log(`Unassigning order ID ${orderId} from user ID ${userId}`);
    try {
      return await this.orderService.unassignOrderFromUser(orderId, userId);
    } catch (error) {
      this.logger.error('Failed to unassign order from user', error);
      throw new InternalServerErrorException('Error al desasignar la orden del usuario');
    }
  }
}
