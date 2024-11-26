import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // NODE_ENV: Joi.string().valid('development', 'production').required(),
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class AppModule {}
