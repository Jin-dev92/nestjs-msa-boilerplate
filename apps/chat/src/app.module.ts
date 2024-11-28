import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Joi } from '@libs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        HOST: Joi.string().required(),
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class AppModule {}
