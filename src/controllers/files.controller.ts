import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  Render,
} from '@nestjs/common';

@Controller('files')
export class FilesController {
  constructor(
    private readonly logger: Logger = new Logger(FilesController.name),
  ) { }

  @Get('buyOrder')
  @Render('buyOrder')
  async createBuyOrder(
    // TODO: remove anys
    @Body() body: any,
  ): Promise<any> {
    const source = 'FilesController -> createBuyOrder()';

    try {
      this.logger.log({
        message: '[REQ] POST /buyOrder - createBuyOrder()',
        source,
        body,
      });

      //exec

      this.logger.log({
        message: '[RES] POST /buyOrder - createBuyOrder()',
        // response,
        body,
        source,
      });

      return {
        products: [
          {
            code: '001',
            name: 'Arroz',
            measurement: 'unidades',
            description: 'Arroz Gallo',
            price: 790,
          },
          {
            code: '002',
            name: 'Fideos',
            measurement: 'paquetes',
            description: 'Fideos Largos',
            price: 450,
          },
          {
            code: '003',
            name: 'Leche',
            measurement: 'litros',
            description: 'Leche Entera',
            price: 1050,
          },
          {
            code: '004',
            name: 'Pan',
            measurement: 'unidades',
            description: 'Pan Blanco',
            price: 350,
          },
          {
            code: '005',
            name: 'Huevos',
            measurement: 'docenas',
            description: 'Huevos Frescos',
            price: 1100,
          },
          {
            code: '006',
            name: 'Azúcar',
            measurement: 'kilogramos',
            description: 'Azúcar Blanca',
            price: 600,
          },
          {
            code: '007',
            name: 'Café',
            measurement: 'gramos',
            description: 'Café Molido',
            price: 1200,
          },
          {
            code: '008',
            name: 'Aceite',
            measurement: 'litros',
            description: 'Aceite de Oliva',
            price: 1800,
          },
          {
            code: '009',
            name: 'Sal',
            measurement: 'kilogramos',
            description: 'Sal Fina',
            price: 400,
          },
          {
            code: '010',
            name: 'Harina',
            measurement: 'kilogramos',
            description: 'Harina de Trigo',
            price: 900,
          },
          {
            code: '011',
            name: 'Atún',
            measurement: 'latas',
            description: 'Atún en Aceite',
            price: 1350,
          },
          {
            code: '012',
            name: 'Galletas',
            measurement: 'paquetes',
            description: 'Galletas de Chocolate',
            price: 650,
          },
          {
            code: '013',
            name: 'Jabón',
            measurement: 'unidades',
            description: 'Jabón de Tocador',
            price: 300,
          },
          {
            code: '014',
            name: 'Detergente',
            measurement: 'litros',
            description: 'Detergente Líquido',
            price: 1200,
          },
          {
            code: '015',
            name: 'Queso',
            measurement: 'kilogramos',
            description: 'Queso Gouda',
            price: 1450,
          },
          {
            code: '016',
            name: 'Yogur',
            measurement: 'unidades',
            description: 'Yogur Natural',
            price: 550,
          },
          {
            code: '017',
            name: 'Agua Mineral',
            measurement: 'botellas',
            description: 'Agua Mineral sin Gas',
            price: 400,
          },
          {
            code: '018',
            name: 'Papel Higiénico',
            measurement: 'rollos',
            description: 'Papel Higiénico Suave',
            price: 750,
          },
          {
            code: '019',
            name: 'Cerveza',
            measurement: 'unidades',
            description: 'Cerveza Rubia',
            price: 1200,
          },
          {
            code: '020',
            name: 'Vino',
            measurement: 'botellas',
            description: 'Vino Tinto Reserva',
            price: 2500,
          }
        ]
      };

      // return response;
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