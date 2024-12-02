import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoleEnum } from '@libs/database';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
