import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { EncryptionModule } from '@libs/encryption';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas';

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
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
