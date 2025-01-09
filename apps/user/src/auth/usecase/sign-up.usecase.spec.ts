import {Test, TestingModule} from '@nestjs/testing';
import {SignUpUsecase} from './sign-up.usecase';
import {SignUpDto} from './dto';
import {UserDomain} from '../../user';
import {GRPC_NAME} from '@libs/common';
import {BadRequestException} from '@nestjs/common';

const mockUserOutputPort = {
  createUser: jest.fn(),
};

describe('SignUpUsecase', () => {
  let usecase: SignUpUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUsecase,
        {
          provide: GRPC_NAME.USER_GRPC,
          useValue: mockUserOutputPort,
        },
      ],
    }).compile();

    usecase = module.get<SignUpUsecase>(SignUpUsecase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should create a new user and return the user domain object', async () => {
    const dto: SignUpDto = {
      email: 'test@example.com',
      password: 'password',
      username: 'Test User',
    };

    const user: UserDomain = new UserDomain(dto);
    jest.spyOn(mockUserOutputPort, 'createUser').mockResolvedValueOnce(user);

    await expect(usecase.execute(dto)).resolves.toEqual(user);
  });

  it('should throw a BadRequestException if user creation fails', async () => {
    const dto: SignUpDto = {
      email: 'test@example.com',
      password: 'password',
      username: 'Test User',
    };

    jest.spyOn(mockUserOutputPort, 'createUser').mockRejectedValueOnce(new Error());

    await expect(usecase.execute(dto)).rejects.toThrow(BadRequestException);
  });
});