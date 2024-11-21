import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        DB_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
