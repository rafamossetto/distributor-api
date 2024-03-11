import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      health: 'OK',
      status: 200,
    };
  }
}
