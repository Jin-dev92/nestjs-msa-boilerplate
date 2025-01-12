import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity, UserRepository} from "./infrastructure";
import {CheckUserByEmailUsecase, CreateUserUsecase, GetUsersUsecase, GetUserUsecase} from "./usecase";
import {
    HashPasswordDto,
    HashPasswordUsecase,
    IJwtPayload,
    ILoginResponse,
    LoginDto,
    LoginUsecase,
    ParseBearerTokenUsecase,
    SignUpDto,
    SignUpUsecase
} from "../auth";
import {GRPC_NAME} from "@libs/common";
import {AuthOutputPort} from "../auth/port";
import {UserOutputPort} from "./port";
import {DataSource, Repository} from "typeorm";
import {TokenType, UserRoleEnum} from "@libs/common/grpc/proto/user";
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
    describe('auth microService - usecases', () => {
        describe('hashPasswordUsecase', () => {
            it('it should be defined', () => {
                expect(hashPasswordUsecase).toBeDefined();
            });
            it('it should be create hashedPassword', async () => {
                const dto: HashPasswordDto = {
                    password: 'strongPassword',
                    salt: 'saltAndPepper'
                }
                expect(await bcrypt.compare(dto.password, await hashPasswordUsecase.execute(dto))).toBe(true);
            });
        })

        describe('loginUsecase', () => {
            it('it should be defined', () => {
                expect(loginUsecase).toBeDefined();
            });

            it("loginUsecase should be return accessToken and refreshToken", async () => {
                const dto: LoginDto = {
                    email: '1@test.com',
                    password: 'password1'
                }
                const result = await loginUsecase.execute(dto)
                expect(result).toMatchObject<ILoginResponse>({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String)
                })
            });
        })

        describe('parseBearerTokenUsecase', () => {
            it('it should be defined', () => {
                expect(parseBearerTokenUsecase).toBeDefined();
            });
            it("parseBearerTokenUsecase should be return tokens", async () => {
                expect(loginUsecase).toBeDefined();
                const loginDto: LoginDto = {
                    email: '1@test.com',
                    password: 'password1'
                }
                const {accessToken, refreshToken} = await loginUsecase.execute(loginDto)

                const accessTokenResult = await parseBearerTokenUsecase.execute({
                    token: ['bearer', accessToken].join(" "),
                    type: TokenType.ACCESS
                });

                const refreshTokenResult = await parseBearerTokenUsecase.execute({
                    token: ['bearer', refreshToken].join(" "),
                    type: TokenType.REFRESH
                });

                expect(accessTokenResult).toMatchObject<IJwtPayload>({
                    sub: expect.any(Number),
                    email: '1@test.com',
                    role: UserRoleEnum.SUPER,
                    type: TokenType.ACCESS,
                    expireIn: expect.any(Number)
                });

                expect(refreshTokenResult).toMatchObject<IJwtPayload>({
                    sub: expect.any(Number),
                    email: '1@test.com',
                    role: UserRoleEnum.SUPER,
                    type: TokenType.REFRESH,
                    expireIn: expect.any(Number)
                });
            })
        })

        describe('signUpUsecase', () => {
            it('it should be defined', () => {
                expect(signUpUsecase).toBeDefined();
            });
            it("signUpUsecase should be defined", async () => {
                // 0부터 9999 사이의 랜덤한 숫자 생성
                const randomNum = +Math.floor(Math.random() * 10000).toString().padStart(4, '0');

                const dto: SignUpDto = {
                    email: `test${randomNum}@test.com`,
                    password: `password${randomNum}`,
                    username: `test${randomNum}`
                }

                const userDomain = await signUpUsecase.execute(dto)
                const user = await userOutputPort.getUser({
                    id: userDomain.id
                })
                expect(user).toMatchObject(userDomain)
            })
        })
    })

    /* 해당 테스트는 반복이라 생략
    describe('user microService - usecases', () => {
        it('checkUserByEmailUsecase ', () => {
        });
        it('getUsersUsecase ', () => {
        });
        it('createUserUsecase ', () => {
        });
        it('getUserUsecase ', () => {
        });
    })*/


    afterAll(async () => {
        await dataSource.destroy()
    })
});