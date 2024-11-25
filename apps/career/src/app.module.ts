import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({}),
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     url: configService.getOrThrow<string>('DATABASE_URL'),
    //     autoLoadEntities: true,
    //     synchronize: true,
    //   }),
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
