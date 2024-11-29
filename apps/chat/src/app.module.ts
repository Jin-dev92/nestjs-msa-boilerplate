import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Joi } from '@libs/common';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        HOST: Joi.string().required(),
      }),
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
