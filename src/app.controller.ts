import { Controller, Get, Ip } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Ip() ip: string,
  ) {
    return this.appService.getHello(ip);
  }
}
