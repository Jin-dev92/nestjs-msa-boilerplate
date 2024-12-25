import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let uploadController: UploadController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadService],
    }).compile();

    uploadController = app.get<UploadController>(UploadController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(uploadController.getHello()).toBe('Hello World!');
    });
  });
});
