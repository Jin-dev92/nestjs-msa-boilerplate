import { Injectable } from '@nestjs/common';
import { AwsService } from '@libs/aws';

@Injectable()
export class UploadService {
  constructor(private readonly awsService: AwsService) {}
  async uploadImage(image: Express.MulterS3.File) {
    this.awsService.uploadFile(image);
  }
}
