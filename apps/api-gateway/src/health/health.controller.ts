import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/micro-services')
  @HealthCheck()
  async microServiceHealthCheck() {
    return await this.healthService.microServiceHealthCheckExecutes();
  }

  @Get('/')
  @HealthCheck()
  healthCheck() {
    return true;
  }
}
