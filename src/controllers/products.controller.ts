import { Body, Controller, Delete, ForbiddenException, Get, HttpException, InternalServerErrorException, Logger, Post } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { ProductDto } from 'src/dto';
import { Product } from 'src/schemas';
import { ProductsService } from 'src/services';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: Logger = new Logger(ProductsController.name),
  ) { }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    const source = 'ProductsController -> getAllProducts()';

    try {
      this.logger.log({
        message: '[REQ] GET /products - getAllProducts()',
        source,
      });

      const response = await this.productsService.getAll();

      this.logger.log({
        message: '[RES] GET /products - getAllProducts()',
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw error;
    }
  };

  @Post()
  async createProduct(
    @Body() productDto: ProductDto,
  ): Promise<HydratedDocument<Product>> {
    const source = 'ProductsController -> createProduct()';

    try {
      this.logger.log({
        message: '[REQ] POST /products - createProduct()',
        source,
      });

      const response = await this.productsService.create(productDto);

      this.logger.log({
        message: '[RES] POST /products - createProduct()',
        response,
        source,
      });

      return response;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  };


  @Delete()
  async deleteProducts(
    @Body() body,
  ) {

    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access');

    return this.productsService.deleteAll();
  }
}