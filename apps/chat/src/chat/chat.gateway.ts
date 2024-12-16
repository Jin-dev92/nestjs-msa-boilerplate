import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { EncryptionService } from '@libs/encryption';
import { UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { WsMongooseSession, WsTransactionInterceptor } from '@libs/common';
import { ClientSession } from 'mongoose';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authorization = client.handshake.headers.authorization;
      const payload =
        await this.encryptionService.parseBearerToken(authorization);
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

  @UseInterceptors(WsTransactionInterceptor)
  @SubscribeMessage('handleMessage')
  async handleMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
    @WsMongooseSession() session: ClientSession,
  ) {
    // client.emit('sendMessage', data.message);
  }
}
