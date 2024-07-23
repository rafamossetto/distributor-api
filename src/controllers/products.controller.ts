import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin.guard';
import { ProductDto } from 'src/dto';
import { Product } from 'src/schemas';
import { ProductsService } from 'src/services';

@Controller('products')
@ApiTags('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List Products', type: [Product] })
  async getAllProducts(@Req() req): Promise<Product[]> {
    const source = 'ProductsController -> getAllProducts()';

    this.logger.log({
      message: '[REQ] GET /products - getAllProducts()',
      source,
    });

    let response: Product[];
    if (req.user.role === 'admin') {
      response = await this.productsService.getAllProductsAdmin();
    } else {
      response = await this.productsService.getAllByUser(req.user.id);
    }

    this.logger.log({
      message: '[RES] GET /products - getAllProducts()',
      length: response?.length,
      source,
    });

    return response;
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Create Product', type: Product })
  async createProduct(
    @Body() productDto: ProductDto,
    @Req() req,
  ): Promise<Product> {
    const source = 'ProductsController -> createProduct()';

    this.logger.log({
      message: '[REQ] POST /products - createProduct()',
      source,
      body: productDto,
    });

    const userId = req.user.id;
    const productData = { ...productDto, userId };

    const response = await this.productsService.create(productData);

    this.logger.log({
      message: '[RES] POST /products - createProduct()',
      response,
      source,
    });

    return response;
  }

  @Put('assign/:productId/:userId')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Asignar producto a usuario (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Producto asignado con éxito',
    type: Product,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto o usuario no encontrado' })
  async assignProductToUser(
    @Param('productId') productId: string,
    @Param('userId') userId: string,
  ): Promise<Product> {
    const source = 'ProductsController -> assignProductToUser()';

    this.logger.log({
      message: `[REQ] PUT /products/assign/${productId}/${userId} - assignProductToUser()`,
      source,
      productId,
      userId,
    });

    try {
      const response = await this.productsService.assignProductToUser(
        productId,
        userId,
      );

      this.logger.log({
        message: `[RES] PUT /products/assign/${productId}/${userId} - assignProductToUser()`,
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `[ERR] PUT /products/assign/${productId}/${userId} - assignProductToUser()`,
        error,
        source,
      });
      throw error;
    }
  }

  @Put('unassign/:productId')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiOperation({ summary: 'Desasignar producto de usuario (solo admin)' })
@ApiResponse({
  status: 200,
  description: 'Producto desasignado con éxito',
  type: Product,
})
@ApiResponse({ status: 403, description: 'Acceso denegado' })
@ApiResponse({ status: 404, description: 'Producto no encontrado' })
async unassignProductFromUser(
  @Param('productId') productId: string,
): Promise<Product> {
  const source = 'ProductsController -> unassignProductFromUser()';

  this.logger.log({
    message: `[REQ] PUT /products/unassign/${productId} - unassignProductFromUser()`,
    source,
    productId,
  });

  try {
    const response = await this.productsService.unassignProductFromUser(productId);

    this.logger.log({
      message: `[RES] PUT /products/unassign/${productId} - unassignProductFromUser()`,
      response,
      source,
    });

    return response;
  } catch (error) {
    this.logger.error({
      message: `[ERR] PUT /products/unassign/${productId} - unassignProductFromUser()`,
      error,
      source,
    });
    throw error;
  }
}

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Update Product', type: Product })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<ProductDto>,
    @Req() req,
  ): Promise<Product> {
    const source = 'ProductsController -> updateProduct()';

    this.logger.log({
      message: `[REQ] PUT /products/${id} - updateProduct()`,
      source,
      body: updateProductDto,
    });

    const userId = req.user.id;

    const response = await this.productsService.update(
      id,
      updateProductDto,
      userId,
    );

    this.logger.log({
      message: `[RES] PUT /products/${id} - updateProduct()`,
      response,
      source,
    });

    return response;
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Delete Product', type: Boolean })
  async deleteProduct(@Param('id') id: string): Promise<boolean> {
    const source = 'ProductsController -> deleteProducts()';

    this.logger.log({
      message: '[REQ] DELETE /products - deleteProducts()',
      source,
      id,
    });

    const response = await this.productsService.delete(id);

    this.logger.log({
      message: '[RES] DELETE /products - deleteProducts()',
      response,
      source,
      id,
    });

    return !!response.deletedCount;
  }

  @Delete()
  async deleteProducts(
    @Body() body: { admin: boolean },
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.productsService.deleteAll();
  }
}
