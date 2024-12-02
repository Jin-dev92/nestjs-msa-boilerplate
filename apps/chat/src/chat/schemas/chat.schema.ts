import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class Chat extends Document {
  @Prop({
    type: {
      type: Types.ObjectId,
      ref: 'User',
    },
  })
  receiver: User;

  @Prop({
    type: {
      type: Types.ObjectId,
      ref: 'User',
    },
  })
  sender: User;

  @Prop()
  message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
