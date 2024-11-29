import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ChatHistory {
  @Prop()
  message: string;

  @Prop()
  sender: string;

  @Prop()
  receiver: string;

  @Prop()
  createdAt: Date;
}
