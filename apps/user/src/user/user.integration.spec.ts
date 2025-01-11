import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity, UserRepository} from "./infrastructure";
import {CheckUserByEmailUsecase, CreateUserUsecase, GetUsersUsecase, GetUserUsecase} from "./usecase";
import {
    HashPasswordDto,
    HashPasswordUsecase,
    LoginDto,
    LoginUsecase,
    ParseBearerTokenUsecase,
    SignUpUsecase
} from "../auth";
import {GRPC_NAME} from "@libs/common";
import {AuthOutputPort} from "../auth/port";
import {UserOutputPort} from "./port";
import {DataSource, Repository} from "typeorm";
import {UserRoleEnum} from "@libs/common/grpc/proto/user";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import {JwtModule} from "@nestjs/jwt";

describe('User MicroService - Integration Test', () => {
    let dataSource: DataSource
    let configService: ConfigService

    let checkUserByEmailUsecase: CheckUserByEmailUsecase
    let getUsersUsecase: GetUsersUsecase
    let createUserUsecase: CreateUserUsecase
    let getUserUsecase: GetUserUsecase
    let hashPasswordUsecase: HashPasswordUsecase
    let loginUsecase: LoginUsecase
    let parseBearerTokenUsecase: ParseBearerTokenUsecase
    let signUpUsecase: SignUpUsecase
    let authOutputPort: AuthOutputPort
    let userOutputPort: UserOutputPort

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                await ConfigModule.forRoot({
                    envFilePath: 'apps/user/.env'
                }),
                JwtModule,
                TypeOrmModule.forRoot({
                    type: 'sqlite', // 가장 가벼운 데이터베이스이기 때문에 테스트에서 선정
                    database: ':memory:',
                    dropSchema: true,
                    entities: [UserEntity],
                    logging: false,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([UserEntity])
            ],
            providers: [
                Repository,
                UserRepository,
                CheckUserByEmailUsecase,
                GetUsersUsecase,
                CreateUserUsecase,
                GetUserUsecase,
                HashPasswordUsecase,
                LoginUsecase,
                ParseBearerTokenUsecase,
                SignUpUsecase,
                {
                    provide: GRPC_NAME.USER_GRPC,
                    useClass: UserRepository,
                },
                {
                    provide: GRPC_NAME.AUTH_GRPC,
                    useClass: UserRepository,
                }
            ],
        }).compile();
        // cacheManager = module.get<Cache>(CACHE_MANAGER)
        dataSource = module.get<DataSource>(DataSource)
        configService = module.get<ConfigService>(ConfigService)

        checkUserByEmailUsecase = module.get<CheckUserByEmailUsecase>(CheckUserByEmailUsecase)
        getUsersUsecase = module.get<GetUsersUsecase>(GetUsersUsecase)
        createUserUsecase = module.get<CreateUserUsecase>(CreateUserUsecase)
        getUserUsecase = module.get<GetUserUsecase>(GetUserUsecase)
        hashPasswordUsecase = module.get<HashPasswordUsecase>(HashPasswordUsecase)
        loginUsecase = module.get<LoginUsecase>(LoginUsecase)
        parseBearerTokenUsecase = module.get<ParseBearerTokenUsecase>(ParseBearerTokenUsecase)
        signUpUsecase = module.get<SignUpUsecase>(SignUpUsecase)

        authOutputPort = module.get<AuthOutputPort>(UserRepository)
        userOutputPort = module.get<UserOutputPort>(UserRepository)
    })
    beforeEach(async () => {
        // await cacheManager.clear()
        /* 초기 데이터 seeding */
        const userRepository = dataSource.getRepository(UserEntity);

        await userRepository.save(userRepository.create(
            [1, 2, 3, 4, 5].map(x => ({
                id: x,
                email: `${x}@test.com`,
                password: `password${x}`,
                role: x === 1 ? UserRoleEnum.SUPER : UserRoleEnum.USER,
                username: `테스트계정_${x}`
            }))
        ))
    })
    // describe('user microService - usecases', () => {
    //     describe('checkUserByEmailUsecase ', () => {
    //     });
    //     describe('getUsersUsecase ', () => {
    //     });
    //     describe('createUserUsecase ', () => {
    //     });
    //     describe('getUserUsecase ', () => {
    //     });
    // })
    describe('auth microService - usecases', () => {
        it('it should be create hashedPassword', async () => {
            expect(hashPasswordUsecase).toBeDefined();

            const dto: HashPasswordDto = {
                password: 'strongPassword',
                salt: 'saltAndPepper'
            }
            expect(await bcrypt.compare(dto.password, await hashPasswordUsecase.execute(dto))).toBe(true);
        });
        it("loginUsecase should be return accessToken and refreshToken", async () => {
            expect(loginUsecase).toBeDefined();
            const dto: LoginDto = {
                email: '1@test.com',
                password: 'password1'
            }
            const result = await loginUsecase.execute(dto)
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });
        it("parseBearerTokenUsecase should be defined", () => {
            expect(parseBearerTokenUsecase).toBeDefined();
        })
        it("signUpUsecase should be defined", () => {
            expect(signUpUsecase).toBeDefined();
        })
    })
    afterAll(async () => {
        await dataSource.destroy()
    })
});