import { All, Controller, Inject, Param, Req } from '@nestjs/common';
import { GRPC_NAME } from '@libs/common';
import { ClientProxy } from '@nestjs/microservices';

// 현재 사용하지 않는 컨트롤러.
@Controller('api')
export class ApiGatewayController {
  constructor(
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userMicroService: ClientProxy,
    @Inject(GRPC_NAME.CHAT_GRPC)
    private readonly chatMicroService: ClientProxy,
  ) {}

  @All('users/:path') // /api/users/* 로 들어오는 모든 요청을 UserService 로 보내 처리
  handleUserRequests(@Param('path') path: string, @Req() req: Request) {
    const pattern = { cmd: path };
    return this.userMicroService.send(pattern, req.body);
  }
  @All('chats/:path') // /api/chats/* 로 들어오는 모든 요청을 UserService 로 보내 처리
  handleChatRequests(@Param('path') path: string, @Req() req: Request) {
    const pattern = { cmd: path };
    return this.chatMicroService.send(pattern, req.body);
  }
}
/* deprecated */
