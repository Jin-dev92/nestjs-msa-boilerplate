import {Test, TestingModule} from '@nestjs/testing';
import {CheckUserByEmailUsecase} from './check-user-by-email.usecase';
import {UserDomain} from '../domain';
import {GRPC_NAME} from '@libs/common';
import {NotFoundException} from '@nestjs/common';

const mockUserOutputPort = {
    checkUserByEmail: jest.fn(),
};

describe('CheckUserByEmailUsecase', () => {
    let usecase: CheckUserByEmailUsecase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CheckUserByEmailUsecase,
                {
                    provide: GRPC_NAME.USER_GRPC,
                    useValue: mockUserOutputPort,
                },
            ],
        }).compile();

        usecase = module.get<CheckUserByEmailUsecase>(CheckUserByEmailUsecase);
    });

    it('should be defined', () => {
        expect(usecase).toBeDefined();
    });

    it('should return user domain if found', async () => {
        const email = 'kpasd002@gmail.com';
        const user = new UserDomain({ email, password: 'password', username: 'Test User' });
        jest.spyOn(mockUserOutputPort, 'checkUserByEmail').mockResolvedValueOnce(user);

        await expect(usecase.execute(email)).resolves.toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
        const email = 'kpasd002@gmail.com';
        jest.spyOn(mockUserOutputPort, 'checkUserByEmail').mockResolvedValueOnce(null);

        await expect(usecase.execute(email)).rejects.toThrow(NotFoundException);
    });
});