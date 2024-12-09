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
  
      const totalPrice = unitPrice * p.quantity;
  
      const isKilogram = p.units !== 0

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
        quantity: isKilogram ? p.units.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        name: p.name,
        discount: p.discount !== undefined && p.discount !== null ? p.discount + " %" : '-',
        units: p.quantity !== undefined && p.units !== null ? p.quantity + " KG" : '-',
        unitPrice: unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalPrice: totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        precioTotal: totalPrice, 
        measurement,
      };
    });
  
    const total = items.reduce((acc, el) => acc + el.precioTotal, 0);
    const totalEnLetras = convertirNumeroALetras(total);
  
    let deliveryDate: Date;
    if (typeof remit.deliveryDate === 'string') {
      const [day, month, year] = remit.deliveryDate.split('/').map(Number);
      deliveryDate = new Date(year, month - 1, day); 
    } else {
      deliveryDate = new Date(remit.deliveryDate); 
    }
  
    function addDays(date: Date, days: number) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
  
    function formatDate(date: Date) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
    }
  
    const firstExpiration = addDays(deliveryDate, 1);
    const secondExpiration = addDays(deliveryDate, 8);
    const thirdExpiration = addDays(deliveryDate, 16);
  
    const firstExpirationDate = formatDate(firstExpiration);
    const secondExpirationDate = formatDate(secondExpiration);
    const thirdExpirationDate = formatDate(thirdExpiration);
  
    const firstTotal = total * 1.03; // 3% aumento
    const secondTotal = total * 1.03; // 3% aumento
    const thirdTotal = total * 1.06; // 6% aumento
  
    return {
      remitNumber: remit.documentNumber,
      client: remit.clientName,
      clientNumber: remit.clientNumber,
      deliveryDate: remit.deliveryDate,
      date: remit.date.toLocaleDateString('en-GB'),
      hour: remit.date.toISOString().split('T')[1].slice(0, 5),
      items,
      amountInLetter: totalEnLetras,
      subTotal: total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      total: total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalArticles: remit.products.length,
      address: remit.clientAddress,
      phoneNumber: remit.clientPhone,
      firstExpirationDate,
      secondExpirationDate,
      thirdExpirationDate,
      firstTotal: firstTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      secondTotal: secondTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      thirdTotal: thirdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  }
  
}
