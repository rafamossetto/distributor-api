import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly HEALTH_RESPONSE = {
    health: 'OK',
    status: 200,
  };

  getHello(ip: string) {
    Logger.log({
      message: '[RES] GET /health',
      response: this.HEALTH_RESPONSE,
      ip,
    });

    return this.HEALTH_RESPONSE;
  }
}
