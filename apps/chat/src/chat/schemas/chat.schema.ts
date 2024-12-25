import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment, MessageType } from '@libs/common/grpc/proto/chat';

@Schema({
  timestamps: true,
})
export class Chat extends Document {
  @Prop()
  message: string;
  @Prop()
  senderId: string;
  @Prop()
  roomId: string;

  @Prop()
  attachments: Attachment[];
  @Prop()
  type: MessageType;
  @Prop()
  createdAt: string;
  @Prop()
  deleteAt: string;
  // @Prop({
  //   type: {
  //     type: Types.ObjectId,
  //     ref: 'User',
  //   },
  // })
  // receiver: User;
  //
  // @Prop({
  //   type: {
  //     type: Types.ObjectId,
  //     ref: 'User',
  //   },
  // })
  // sender: User;
  //
  // @Prop()
  // message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
