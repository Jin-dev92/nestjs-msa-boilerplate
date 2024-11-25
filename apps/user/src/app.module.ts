import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@libs/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        NODE_ENV: Joi.valid('development', 'production').required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('@@@DATABASE_URL', configService.get('DATABASE_URL'));
        return {
          type: 'postgres',
          url: configService.getOrThrow('DATABASE_URL'),
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          entities: [User],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
