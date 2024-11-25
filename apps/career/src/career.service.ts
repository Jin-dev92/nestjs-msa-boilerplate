import { Injectable } from '@nestjs/common';

@Injectable()
export class CareerService {
  getHello(): string {
    return 'Hello World!';
  }
}
