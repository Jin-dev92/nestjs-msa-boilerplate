import {Test} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import * as bcypt from 'bcrypt';
import {HashPasswordUsecase} from "./hash-password.usecase";
import {HashPasswordDto} from "./dto";

const mockConfigService = {
    getOrThrow: jest.fn()
}

describe('user >> hash-password.usecase', () => {
    let usecase: HashPasswordUsecase;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                HashPasswordUsecase,
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile();
        usecase = module.get<HashPasswordUsecase>(HashPasswordUsecase);
    })

    it('user >> hash-password.usecase', async () => {
        const dto: HashPasswordDto = {
            password: 'strongPassword',
            salt: 'saltAndPepper'
        }
        const hashRound = 10
        expect(usecase).toBeDefined();
        jest.spyOn(mockConfigService, 'getOrThrow').mockResolvedValueOnce(hashRound);
        jest.spyOn(bcypt, 'hash').mockImplementationOnce((password, hashRound) => 'hashedPassword');
        const result = await usecase.execute(dto);
        expect(result).toEqual('hashedPassword');
    });

});