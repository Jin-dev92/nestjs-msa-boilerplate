import { Controller, Get } from '@nestjs/common';
import { CareerService } from './career.service';

@Controller()
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get()
  getHello(): string {
    return this.careerService.getHello();
  }
}
