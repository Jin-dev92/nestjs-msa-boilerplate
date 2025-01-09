import {LoginUsecase} from "./login.usecase";
import {Test, TestingModule} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {GRPC_NAME} from "@libs/common";
import {LoginDto} from "./dto";
import {UserDomain} from "../../user";
import {ILoginResponse} from "./interfaces";

const mockConfigService = {
    getOrThrow: jest.fn(),
};

const mockJwtService = {
    signAsync: jest.fn(),
};

const mockUserOutputPort = {
    checkUserByEmail: jest.fn(),
};

describe('LoginUsecase', () => {
    let usecase: LoginUsecase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUsecase,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: GRPC_NAME.USER_GRPC,
                    useValue: mockUserOutputPort,
                },
            ],
        }).compile();

        usecase = module.get<LoginUsecase>(LoginUsecase);
    });

    it('should be defined', () => {
        expect(usecase).toBeDefined();
    });

    it('should return access and refresh tokens', async () => {
        const dto: LoginDto = {
            email: 'kpasd002@gmail.com',
            password: 'password',
        };

        const user: UserDomain = new UserDomain({
            email: dto.email,
            password: dto.password,
            username: '김의진',
        });
        user.setId(1);

        const token: ILoginResponse = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
        };

        jest.spyOn(mockUserOutputPort, 'checkUserByEmail').mockResolvedValueOnce(user);
        jest.spyOn(mockJwtService, 'signAsync').mockResolvedValueOnce(token.accessToken).mockResolvedValueOnce(token.refreshToken);
        jest.spyOn(mockConfigService, 'getOrThrow').mockReturnValueOnce('accessSecret').mockReturnValueOnce('refreshSecret');

        await expect(usecase.execute(dto)).resolves.toEqual(token);
    });
});