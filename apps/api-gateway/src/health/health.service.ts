import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}

  healthCheck() {
    // @todo MSA 구현한 서비스들의 상태를 체크하는 로직 추가 예정.
    return true;
  }
}
