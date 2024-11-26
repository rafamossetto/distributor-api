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

    const items = remit.products.map(p => {
      const unitPrice = parseFloat(p.prices[selectedList].toFixed(2));
    
      // Determinar cantidad basada en la medición y valores disponibles
      const amount = 
        p.measurement === 'unit'
          ? p.quantity
          : p.measurement === 'kilogram' && (p.units === undefined || p.units === null)
          ? p.quantity
          : p.units ?? 0;
    
      const totalPrice = unitPrice * amount;
    
      let measurement;
      if (p.measurement === 'unit') {
        measurement = 'U.';
      } else if (p.measurement === 'kilogram') {
        measurement = 'KG.';
      } else {
        measurement = p.measurement;
      }
    
      return {
        code: p.code,
        quantity: p.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        name: p.name,
        discount: p.discount !== undefined && p.discount !== null ? p.discount + " %" : '-',
        units: p.units !== undefined && p.units !== null ? p.units + " KG" : '-',
        unitPrice: unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalPrice: totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        precioTotal: totalPrice, // Mantener como número para los cálculos
        measurement,
      };
    });
    

    const total = items.reduce((acc, el) => acc + el.precioTotal, 0); // precioTotal sigue siendo número
    const totalEnLetras = convertirNumeroALetras(total);

    return {
      remitNumber: remit.documentNumber,
      client: remit.clientName,
      clientNumber: remit.clientNumber,
      date: remit.date.toLocaleDateString('en-GB'),
      hour: remit.date.toISOString().split('T')[1].slice(0, 5),
      items,
      amountInLetter: totalEnLetras,
      subTotal: total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
      total: total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalArticles: remit.products.length,
      address: remit.clientAddress,
      phoneNumber: remit.clientPhone,
    };
  }
}
