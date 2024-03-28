import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
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
      response,
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

  @Delete()
  async deleteProducts(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.productsService.deleteAll();
  }
}
