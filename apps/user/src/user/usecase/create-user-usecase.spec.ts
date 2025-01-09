import {Test, TestingModule} from '@nestjs/testing';
import {CreateUserUsecase} from './create-user-usecase';
import {UserDomain} from '../domain';
import {GRPC_NAME} from '@libs/common';
import {CreateUserDto} from './dto';
import {BadRequestException} from '@nestjs/common';

const mockUserOutputPort = {
  checkUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

describe('CreateUserUsecase', () => {
  let usecase: CreateUserUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUsecase,
        {
          provide: GRPC_NAME.USER_GRPC,
          useValue: mockUserOutputPort,
        },
      ],
    }).compile();

    usecase = module.get<CreateUserUsecase>(CreateUserUsecase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should create a new user if email does not exist', async () => {
    const dto: CreateUserDto = {
      email: 'kpasd002@gmail.com',
      password: 'password',
      username: 'Test User',
    };

    const user = new UserDomain(dto);
    jest.spyOn(mockUserOutputPort, 'checkUserByEmail').mockResolvedValueOnce(null);
    jest.spyOn(mockUserOutputPort, 'createUser').mockResolvedValueOnce(user);

    await expect(usecase.execute(dto)).resolves.toEqual(user);
  });

  it('should throw an error if email already exists', async () => {
    const dto: CreateUserDto = {
      email: 'kpasd002@gmail.com',
      password: 'password',
      username: 'Test User',
    };

    const user = new UserDomain(dto);
    jest.spyOn(mockUserOutputPort, 'checkUserByEmail').mockResolvedValueOnce(user);

    await expect(usecase.execute(dto)).rejects.toThrow(BadRequestException);
  });
});