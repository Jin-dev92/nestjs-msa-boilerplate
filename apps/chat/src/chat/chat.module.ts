import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { EncryptionModule } from '@libs/encryption';

@Module({
  imports: [EncryptionModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
