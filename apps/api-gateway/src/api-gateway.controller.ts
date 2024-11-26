import { All, Controller, Inject, Param, Req } from '@nestjs/common';
import { MICROSERVICE_NAME } from '@libs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api')
export class ApiGatewayController {
  constructor(
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userService: ClientProxy,
  ) {}

  @All('users/:path') // /api/users/* 로 들어오는 모든 요청을 UserService 로 보내 처리
  handleUserRequests(@Param('path') path: string, @Req() req: Request) {
    const pattern = { cmd: path };
    return this.userService.send(pattern, req.body);
  }
}
