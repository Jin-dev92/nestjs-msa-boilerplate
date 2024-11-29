import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IJwtPayload } from '@libs/encryption';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: ClientProxy,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authorization = client.handshake.headers.authorization;
      const payload = await lastValueFrom<IJwtPayload>(
        this.authService.send('parseBearerToken', authorization),
      ); // @todo 타입 추론이 가능한 형태로 변경해야됨, send, emit manager 와 같은 것 필요
      if (!payload) {
        throw new UnauthorizedException('인증되지 않은 사용자입니다.');
      }
      client.data.user = payload;
      this.chatService.registerClient(payload.sub, client);
      client.emit('welcomeChatRoom', `환영합니다. ${payload.email}님`);
    } catch (e) {
      client.disconnect();
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }
  }

  handleDisconnect(client: Socket) {
    this.chatService.disconnectClient(client.data.user.sub);
  }

  // @SubscribeMessage('receiveMessage')
  // async receiveMessage(
  //   @MessageBody() data: { message: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   client.emit('sendMessage', data.message);
  // }
}
