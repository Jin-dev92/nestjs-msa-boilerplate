import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { EncryptionModule } from '@libs/encryption';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas';
import { WsTransactionInterceptor } from '@libs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    EncryptionModule,
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
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
