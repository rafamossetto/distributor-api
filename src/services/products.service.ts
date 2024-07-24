import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ProductDto } from 'src/dto';
import { PricesList, Product } from 'src/schemas';
import { getPricesWithPercent } from 'src/utils';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(PricesList.name) private pricesListModel: Model<PricesList>,
  ) {}

  private readonly GET_ALL_SORT_PARAM = 'name';

  getAll(): Promise<HydratedDocument<Product>[]> {
    const source = 'ProductsService -> getAll()';

    try {
      return this.productModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async getAllProductsAdmin(): Promise<Product[]> {
    const source = 'ProductsService -> getAllProductsAdmin()';

    try {
      return this.productModel.find().sort(this.GET_ALL_SORT_PARAM).exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  getAllByUser(userId: string): Promise<HydratedDocument<Product>[]> {
    const source = 'ProductsService -> getAllByUser()';

    try {
      return this.productModel
        .find({ userId })
        .sort(this.GET_ALL_SORT_PARAM)
        .exec();
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async getProductsByUserId(userId: string): Promise<Product[]> {
    const source = 'ProductsService -> getProductsByUserId()';

    try {
      this.logger.log({
        message: 'Fetching products by user ID',
        userId,
        source,
      });

      const products = await this.productModel.find({ userId }).exec();

      if (!products.length) {
        throw new NotFoundException(`No products found for user ID ${userId}`);
      }

      return products;
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }

  async create(
    createProductDto: ProductDto & { userId: string },
  ): Promise<HydratedDocument<Product>> {
    const source = 'ProductsService -> create()';

    try {
      const { price: firstPrice, name, userId } = createProductDto;

      const allPercentsList = (await this.pricesListModel.find().exec()).map(
        ({ percent }) => percent,
      );

      const increasedPrices = getPricesWithPercent(firstPrice, allPercentsList);

      const prices = [firstPrice, ...increasedPrices];

      const codeIncreased = (await this.productModel.countDocuments()) + 1;

      return this.productModel.create({
        ...createProductDto,
        name: name.toUpperCase(),
        code: codeIncreased,
        prices,
        userId,
      });
    } catch (error) {
      this.logger.error({
        message: `${source} - ${error.toString()}`,
        error,
        source,
      });
      throw error;
    }
  }

  async update(
    id: string,
    updateParams: Partial<ProductDto>,
    userId: string,
  ): Promise<HydratedDocument<Product> | null> {
    const source = 'ProductsService -> update()';

    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new HttpException('Product not found', 404);
      }

      if (product.userId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this product',
        );
      }

      if (updateParams.price !== undefined) {
        const allPercentsList = (await this.pricesListModel.find().exec()).map(
          ({ percent }) => percent,
        );

        const increasedPrices = getPricesWithPercent(
          updateParams.price,
          allPercentsList,
        );
        updateParams['prices'] = [updateParams.price, ...increasedPrices];
      }

      if (updateParams.name) {
        updateParams.name = updateParams.name.toUpperCase();
      }

      // Removing 'price' from updateParams as it's not in the schema
      const { price, ...updateParamsWithoutPrice } = updateParams;

      return this.productModel
        .findByIdAndUpdate(id, updateParamsWithoutPrice, { new: true })
        .exec();
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async assignProductToUser(
    productId: string,
    userId: string,
  ): Promise<Product> {
    const source = 'ProductsService -> assignProductToUser()';

    try {
      const product = await this.productModel
        .findByIdAndUpdate(productId, { userId: userId }, { new: true })
        .exec();

      if (!product) {
        this.logger.warn({
          message: `Product with ID ${productId} not found`,
          source,
        });
        throw new NotFoundException(
          `Producto con ID ${productId} no encontrado`,
        );
      }

      this.logger.log({
        message: `Product assigned successfully`,
        productId,
        userId,
        source,
      });

      return product;
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

  async unassignProductFromUser(
    productId: string,
    userId: string,
  ): Promise<Product> {
    const source = 'ProductsService -> unassignProductFromUser()';

    try {
      const product = await this.productModel
        .findOneAndUpdate(
          { _id: productId, userId: userId },
          { $unset: { userId: '' } },
          { new: true },
        )
        .exec();

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${productId} no encontrado o no asignado al usuario ${userId}`,
        );
      }

      this.logger.log({
        message: `Product unassigned successfully`,
        productId,
        userId,
        source,
      });

      return product;
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

  async delete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'ProductsService -> delete()';

    try {
      return this.productModel.deleteOne({ _id: id }).exec();
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

  async deleteAll(): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const source = 'ProductsService -> deleteAll()';

    try {
      return this.productModel.deleteMany({}).exec();
    } catch (error) {
      this.logger.error({
        message: `Error in ${source}`,
        error,
        errorString: error.toString(),
        source,
      });
      throw new HttpException(error.message, 500);
    }
  }
}
