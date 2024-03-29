import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Post,
  Put,
} from '@nestjs/common';
import { HydratedDocument, UpdateWriteOpResult } from 'mongoose';
import {
  CreatePriceListDto,
  DeletePriceListDto,
  UpdatePriceListDto,
} from 'src/dto';
import { PricesList } from 'src/schemas';
import { PricesListService } from 'src/services';

@Controller('pricesList')
export class PricesListController {
  constructor(
    private readonly pricesListService: PricesListService,
    private readonly logger: Logger = new Logger(PricesListController.name),
  ) {}

  @Get()
  async getAllPricesList(): Promise<PricesList[]> {
    const source = 'PricesListController -> getAllPricesList()';

    this.logger.log({
      message: '[REQ] GET /pricesList - getAllPricesList()',
      source,
    });

    const response = await this.pricesListService.getAll();

    this.logger.log({
      message: '[RES] GET /pricesList - getAllPricesList()',
      response,
      length: response?.length,
      source,
    });

    return response;
  }

  @Post()
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

    return response;
  }

  @Put()
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
  async deleteOne(@Body() body: DeletePriceListDto) {
    const source = 'PricesListController -> deleteOne()';

    const { number } = body;

    this.logger.log({
      message: '[REQ] DELETE /pricesList - deleteOne()',
      source,
      body,
    });

    const response = await this.pricesListService.delete(number);

    this.logger.log({
      message: '[RES] DELETE /pricesList - deleteOne()',
      response,
      source,
    });

    return response;
  }

  @Delete()
  async deletePricesList(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.pricesListService.deleteAll();
  }
}
