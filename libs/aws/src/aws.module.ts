import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from '@libs/aws/factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/aws/.env',
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        multerOptionsFactory(configService),
    }),
  ],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
