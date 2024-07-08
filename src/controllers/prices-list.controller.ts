import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HydratedDocument, UpdateWriteOpResult } from 'mongoose';
import {
  CreatePriceListDto,
  DeletePriceListDto,
  UpdatePriceListDto,
} from 'src/dto';
import { PricesList } from 'src/schemas';
import { PricesListService } from 'src/services';

@Controller('pricesList')
@ApiTags('pricesList')
export class PricesListController {
  private readonly logger = new Logger(PricesListController.name);

  constructor(private readonly pricesListService: PricesListService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List All Prices List',
    type: [PricesList],
  })
  async getAllPricesList(): Promise<PricesList[]> {
    const source = 'PricesListController -> getAllPricesList()';

    this.logger.log({
      message: '[REQ] GET /pricesList - getAllPricesList()',
      source,
    });

    const response = await this.pricesListService.getAll();

    this.logger.log({
      message: '[RES] GET /pricesList - getAllPricesList()',
      length: response?.length,
      source,
    });

    return response;
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create Price List',
    type: PricesList,
  })
  async createPricesList(
    @Body() pricesListDto: CreatePriceListDto,
  ): Promise<HydratedDocument<PricesList>> {
    const source = 'PricesListController -> createPricesList()';

    this.logger.log({
      message: '[REQ] POST /pricesList - createPricesList()',
      source,
      body: pricesListDto,
    });

    const response = await this.pricesListService.create(pricesListDto);

    this.logger.log({
      message: '[RES] POST /pricesList - createPricesList()',
      response,
      source,
    });

    // Update product prices
    await this.pricesListService.updateProductPrices();

    return response;
  }

  @Put()
  @ApiResponse({
    status: 201,
    description: 'Update Price List',
    type: PricesList,
  })
  async updateOne(
    @Body() body: UpdatePriceListDto,
  ): Promise<UpdateWriteOpResult> {
    const source = 'PricesListController -> updateOne()';

    const { number, percent } = body;

    this.logger.log({
      message: '[REQ] PUT /pricesList - updateOne()',
      source,
      body,
    });

    const response = await this.pricesListService.update({ number, percent });

    this.logger.log({
      message: '[RES] PUT /pricesList - updateOne()',
      response,
      source,
    });

    return response;
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Delete Price List',
    type: PricesList,
  })
  async deleteOne(@Body() body: DeletePriceListDto): Promise<any> {
    const source = 'PricesListController -> deleteOne()';

    const { number } = body;

    this.logger.log({
      message: '[REQ] DELETE /pricesList - deleteOne()',
      source,
      body,
    });

    const response = await this.pricesListService.delete(number);

    const bulkUpdateResponse =
      await this.pricesListService.bulkUpdatePricesListsNumber();

    this.logger.log({
      message: '[RES] DELETE /pricesList - deleteOne()',
      response,
      bulkUpdateResponse,
      source,
    });

    // Update product prices
    await this.pricesListService.updateProductPrices();

    return response;
  }
}
