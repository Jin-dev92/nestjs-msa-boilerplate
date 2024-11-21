import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

// @Exclude(), @Expose를 사용하기 위한 인터셉터, @Exclude 데코레이터를 사용한 필드는 응답 객체에서 제외된다.
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
