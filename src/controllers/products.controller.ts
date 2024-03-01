import { Controller, Get, Logger } from '@nestjs/common';
import { Product } from 'src/schemas';
import { ProductsService } from 'src/services';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: Logger = new Logger(ProductsController.name),
  ) { }

  @Get()
  async getAll(): Promise<Product[]> {
    const source = 'ProductsController -> getAll()';

    try {
      const allProducts = await this.productsService.getAllProducts();

      return allProducts;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw error;
    }
  }
}