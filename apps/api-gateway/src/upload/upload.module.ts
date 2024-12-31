import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AwsModule } from '@libs/aws';

@Module({
  imports: [AwsModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
