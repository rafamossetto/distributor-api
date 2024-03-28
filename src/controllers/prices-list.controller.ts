import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Post,
} from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { PricesListDto } from 'src/dto';
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
    @Body() pricesListDto: PricesListDto,
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

  @Delete()
  async deletePricesList(@Body() body: { admin: boolean }) {
    const { admin } = body;
    if (!admin) throw new ForbiddenException('Not admin access :(');

    return this.pricesListService.deleteAll();
  }
}
