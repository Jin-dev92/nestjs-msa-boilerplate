import { Controller, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GrpcInterceptor } from '@libs/common';

@UseInterceptors(GrpcInterceptor)
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
