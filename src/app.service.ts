import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly HEALTH_RESPONSE = {
    health: 'OK',
    status: 200,
  };

  health() {
    return this.HEALTH_RESPONSE;
  }
}
