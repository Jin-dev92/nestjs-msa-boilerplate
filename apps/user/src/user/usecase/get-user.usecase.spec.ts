import {Test, TestingModule} from '@nestjs/testing';
import {GetUserUsecase} from './get-user.usecase';
import {UserDomain} from '../domain';
import {GRPC_NAME} from '@libs/common';
import {GetUserDto} from './dto';
import {NotFoundException} from '@nestjs/common';

const mockUserOutputPort = {
  getUser: jest.fn(),
};

describe('GetUserUsecase', () => {
  let usecase: GetUserUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUsecase,
        {
          provide: GRPC_NAME.USER_GRPC,
          useValue: mockUserOutputPort,
        },
      ],
    }).compile();

    usecase = module.get<GetUserUsecase>(GetUserUsecase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should return user if found', async () => {
    const dto: GetUserDto = { id: 1 };
    const user = new UserDomain({ email: 'kpasd002@gmail.com', password: 'password', username: 'Test User' });
    jest.spyOn(mockUserOutputPort, 'getUser').mockResolvedValueOnce(user);

    await expect(usecase.execute(dto)).resolves.toEqual(user);
  });

  it('should throw NotFoundException if user not found', async () => {
    const dto: GetUserDto = { id: 1 };
    jest.spyOn(mockUserOutputPort, 'getUser').mockResolvedValueOnce(null);

    await expect(usecase.execute(dto)).rejects.toThrow(NotFoundException);
  });
});