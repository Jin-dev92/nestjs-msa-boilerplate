import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController, UserEntity, UserRepository} from './infrastructure';

import {GRPC_NAME} from '@libs/common';
import {CheckUserByEmailUsecase, CreateUserUsecase, GetUsersUsecase, GetUserUsecase} from "./usecase";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [
        CheckUserByEmailUsecase,
        CreateUserUsecase,
        GetUsersUsecase,
        GetUserUsecase,
        UserRepository,
        {
            provide: GRPC_NAME.USER_GRPC,
            useClass: UserRepository,
        },
    ],
})
export class UserModule {
}
