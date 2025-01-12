import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {ParseBearerTokenUsecase} from './parse-bearer-token.usecase';
import {ParseBearerTokenDto} from './dto';
import {IJwtPayload} from './interfaces';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import {UserMicroService} from '@libs/common';

const mockConfigService = {
    getOrThrow: jest.fn(),
};

const mockJwtService = {
    verifyAsync: jest.fn(),
};

describe('ParseBearerTokenUsecase', () => {
    let usecase: ParseBearerTokenUsecase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ParseBearerTokenUsecase,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        usecase = module.get<ParseBearerTokenUsecase>(ParseBearerTokenUsecase);
    });

    it('should be defined', () => {
        expect(usecase).toBeDefined();
    });

    it('should throw BadRequestException if token is not Bearer', async () => {
        const dto: ParseBearerTokenDto = {
            token: 'Basic token',
            type: UserMicroService.TokenType.ACCESS,
        };

        await expect(usecase.execute(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if token type is UNRECOGNIZED', async () => {
        const dto: ParseBearerTokenDto = {
            token: 'Bearer token',
            type: UserMicroService.TokenType.UNRECOGNIZED,
        };

        await expect(usecase.execute(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return payload if token is valid', async () => {
        const dto: ParseBearerTokenDto = {
            token: 'Bearer validToken',
            type: UserMicroService.TokenType.ACCESS,
        };

        const payload: IJwtPayload = {
            sub: 1,
            email: 'kpasd002@gmail.com',
            expireIn: 1234567890,
            type: UserMicroService.TokenType.ACCESS,
            role: UserMicroService.UserRoleEnum.USER
        };

        mockConfigService.getOrThrow.mockReturnValue('accessSecret');
        mockJwtService.verifyAsync.mockResolvedValue(payload);

        await expect(usecase.execute(dto)).resolves.toEqual(payload);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
        const dto: ParseBearerTokenDto = {
            token: 'Bearer invalidToken',
            type: UserMicroService.TokenType.ACCESS,
        };

        mockConfigService.getOrThrow.mockReturnValue('accessSecret');
        mockJwtService.verifyAsync.mockRejectedValue(new Error());

        await expect(usecase.execute(dto)).rejects.toThrow(UnauthorizedException);
    });
});