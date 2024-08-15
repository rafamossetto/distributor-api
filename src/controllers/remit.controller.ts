import { Controller, Get, Logger, Param, Render } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from 'src/services';
import { convertirNumeroALetras } from 'src/utils/numberToLetters.util';

@Controller('remits')
@ApiTags('remits')
export class RemitsController {
  private readonly logger = new Logger(RemitsController.name);

  constructor(private orderService: OrderService) {}

  @Get(':id')
  @Render('remit')
  @ApiResponse({ status: 200, description: 'Get Remit By Id' })
  async getRemit(@Param('id') remitId: string) {
    const remit = await this.orderService.getById(remitId);
    const selectedList = remit.selectedList;

    const total = remit.products.reduce((acc, el) => acc + el.prices[selectedList], 0);
    const totalEnLetras = convertirNumeroALetras(total);

    return {
      remitNumber: remit.documentNumber,
      client: remit.clientName,
      clientNumber: remit.clientNumber,
      date: remit.date.toLocaleDateString('en-GB'),
      hour: remit.date.toISOString().split('T')[1].slice(0, 5),
      items: remit.toObject().products.map(p => ({
        ...p,
        unitPrice: p.prices[selectedList],
        totalPrice: p.prices[selectedList],
      })),
      amountInLetter:totalEnLetras,
      subTotal: total,
      total,
      totalArticles: remit.products.length,
      address: remit.clientAddress,
      phoneNumber: remit.clientPhone
    };
  }
}
