import { Prop, Schema } from '@nestjs/mongoose';
import { AttachmentType } from '@libs/common/grpc/proto/chat';

@Schema({
  timestamps: true,
})
export class Attachment {
  @Prop()
  url: string;

  @Prop({ type: 'enum', enum: AttachmentType })
  type: AttachmentType;

  @Prop()
  size: number;

  @Prop()
  name: string;

  @Prop()
  mimeType: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}
