import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

    const response = await this.productsService.getAllByUser(req.user.id);

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
