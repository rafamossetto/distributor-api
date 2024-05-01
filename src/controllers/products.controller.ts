import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ProductDto } from 'src/dto';
import { Product } from 'src/schemas';
import { ProductsService } from 'src/services';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: Logger = new Logger(ProductsController.name),
  ) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    const source = 'ProductsController -> getAllProducts()';

    this.logger.log({
      message: '[REQ] GET /products - getAllProducts()',
      source,
    });

    const response = await this.productsService.getAll();

    this.logger.log({
      message: '[RES] GET /products - getAllProducts()',
      length: response?.length,
      source,
    });

    return response;
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    const source = 'ProductsController -> createProduct()';

    this.logger.log({
      message: '[REQ] POST /products - createProduct()',
      source,
      body: productDto,
    });

    const response = await this.productsService.create(productDto);

    this.logger.log({
      message: '[RES] POST /products - createProduct()',
      response,
      source,
    });

    return response;
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<boolean> {
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
  };

  @Delete()
  async deleteProducts(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.productsService.deleteAll();
  }
}
