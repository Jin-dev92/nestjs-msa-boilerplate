import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {
  constructor() {}
  uploadFile(file: Express.MulterS3.File) {
    //   https://issuebombom.tistory.com/104
    try {
      if (!file) {
        throw new BadRequestException('파일이 존재하지 않습니다.');
      }
      return file;
    } catch (e) {
      throw e;
    }
  }
}
