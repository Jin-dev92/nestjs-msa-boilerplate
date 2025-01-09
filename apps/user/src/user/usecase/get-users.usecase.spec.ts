import {Test, TestingModule} from '@nestjs/testing';
import {GetUsersUsecase} from './get-users.usecase';
import {IGetUsersResponse} from '../port';
import {GRPC_NAME} from '@libs/common';
import {GetUsersDto} from './dto';

const mockUserOutputPort = {
    getUsers: jest.fn(),
};

describe('GetUsersUsecase', () => {
    let usecase: GetUsersUsecase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetUsersUsecase,
                {
                    provide: GRPC_NAME.USER_GRPC,
                    useValue: mockUserOutputPort,
                },
            ],
        }).compile();

        usecase = module.get<GetUsersUsecase>(GetUsersUsecase);
    });

    it('should be defined', () => {
        expect(usecase).toBeDefined();
    });

    it('should return a list of users', async () => {
        const dto: GetUsersDto = {skip: 0, take: 10};
        const response: IGetUsersResponse = {users: [], total: 0};
        jest.spyOn(mockUserOutputPort, 'getUsers').mockResolvedValueOnce(response);

        await expect(usecase.execute(dto)).resolves.toEqual(response);
    });
});