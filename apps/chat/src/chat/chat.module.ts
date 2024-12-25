import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatRoom, ChatRoomSchema, ChatSchema } from './schemas';
import { WsTransactionInterceptor } from '@libs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: APP_INTERCEPTOR,
      useClass: WsTransactionInterceptor,
    },
  ],
})
export class ChatModule {}
