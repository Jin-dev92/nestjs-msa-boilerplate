import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as multerS3 from 'multer-s3';
import { basename, extname } from 'path';
import { IMulterOptions } from '../types';

export const multerOptionsFactory = (
  configService: ConfigService,
): IMulterOptions => {
  return {
    storage: multerS3({
      s3: new S3Client({
        region: configService.getOrThrow('AWS_REGION'),
        credentials: {
          accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        },
      }),
      metadata(req, file, callback) {
        callback(null, { owner: 'ag-ent' });
      },
      bucket: configService.getOrThrow('AWS_S3_BUCKET'),
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key(_req, file, callback) {
        const fileType = file.mimetype.split('/')[0];
        const ext = extname(file.originalname); // 확장자
        const baseName = basename(file.originalname, ext); // 확장자 제외
        const fileName = `${fileType}s/${Date.now()}_${baseName}${ext}`;
        callback(null, fileName);
      },
    }),
    // 파일 크기 제한
    /**
     * @note 이미지 파일과 동영상 파일 업로드 시 용량 제한을 분리하도록 하는 로직 필요
     */
    limits: {
      fileSize: 10 * 1024 * 1024, // 500mb
    },
  };
};
