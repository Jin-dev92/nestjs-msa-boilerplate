import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  private readonly activatedChatClients = new Map<number, Socket>();
  constructor() {}

  registerClient(userId: number, client: Socket) {
    this.activatedChatClients.set(userId, client);
  }

  disconnectClient(userId: number) {
    try {
      this.activatedChatClients.get(userId).disconnect();
      this.removeClient(userId);
    } catch (e) {
      throw e;
    }
  }

  removeClient(userId: number) {
    this.activatedChatClients.delete(userId);
  }
}
