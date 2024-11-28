import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT_KEYS, Joi } from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@libs/database';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        NODE_ENV: Joi.valid('development', 'production').required(),
        DATABASE_URL: Joi.string().required(),
        HOST: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow(ENVIRONMENT_KEYS.DATABASE_URL),
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        entities: [User],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
