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
import { Inject, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import {
  UserMicroService,
  WsMongooseSession,
  WsTransactionInterceptor,
} from '@libs/common';
import { ClientSession } from 'mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly authService: UserMicroService.AuthServiceClient;
  constructor(
    private readonly chatService: ChatService,
    @Inject(UserMicroService.USER_SERVICE_NAME)
    private readonly userMicroService: ClientGrpc,
  ) {
    this.authService =
      this.userMicroService.getService<UserMicroService.AuthServiceClient>(
        UserMicroService.USER_SERVICE_NAME,
      );
  }

  async handleConnection(client: Socket) {
    try {
      const authorization = client.handshake.headers.authorization;
      if (!authorization) {
        throw new UnauthorizedException('인증되지 않은 사용자입니다.');
      }
      const user = await lastValueFrom(
        this.authService.parseBearerToken({ token: authorization }),
      );
      client.data.user = user;

      this.chatService.registerClient(user.sub, client);
      client.emit('welcomeChatRoom', `환영합니다. ${user.email}님`);
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
