import { Test, TestingModule } from '@nestjs/testing';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';

describe('CareerController', () => {
  let careerController: CareerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CareerController],
      providers: [CareerService],
    }).compile();

    careerController = app.get<CareerController>(CareerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(careerController.getHello()).toBe('Hello World!');
    });
  });
});
