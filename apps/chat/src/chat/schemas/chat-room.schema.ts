import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Chat } from './chat.schema';
import { Types } from 'mongoose';
import { ChatRoomStatus } from '@libs/database';

@Schema({
  timestamps: true,
})
export class ChatRoom {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  users: User[];
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Chat',
      },
    ],
  })
  chats: Chat[];

  @Prop({
    default: ChatRoomStatus.ACTIVE,
  })
  status: ChatRoomStatus;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
