import {
  Controller,
  Get,
  Logger,
  Param,
  Render,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderService } from 'src/services';

@Controller('remits')
// @UseGuards(JwtAuthGuard)
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
      amountInLetter: 'Cincuenta mil pesos',
      //   items: [
      //     {code: 1, quantity: 1, description: 'leche', unitPrice: 123, totalPrice: 500}
      // ]
        subTotal: total,
        total,
        totalArticles: remit.products.length,
        address: 'Zona sur',
        phoneNumber: 3516969566
    };
  }
}
