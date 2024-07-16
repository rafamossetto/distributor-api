import {
  Controller,
  Get,
  Logger,
  Param,
  Render,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('remits')
@ApiTags('remits')
export class RemitsController {
  private readonly logger = new Logger(RemitsController.name);

  @Get()
  @Render('remit')
  @ApiResponse({ status: 200, description: 'Get Remit By Id' })
  async getRemit(@Param('id') remitId: string) {

    return {
      remitNumber: 123,
      client: 123,
      clientNumber: 1123,
      date: 'now',
      hour: 'hour',
      items: [{code: 1, quantity: 1, description: 'description', unitPrice: 123, totalPrice: 500}],
      amountInLetters: 'Dos pesos',
      subTotal: 500,
      total: 1000,
      totalArticles: 20,
      address: 'Zona sur',
      phoneNumber: 3516969566
    };
  }

}
