import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController, UserEntity, UserRepository } from './infrastructure';
import {
  CheckUserByEmailUsecase,
  CreateUserUsecase,
  GetUsersUsecase,
  GetUserUsecase,
} from '@apps/user/user/usecase';
import { GRPC_NAME } from '@libs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    CheckUserByEmailUsecase,
    CreateUserUsecase,
    GetUsersUsecase,
    GetUserUsecase,
    {
      provide: GRPC_NAME.USER_GRPC,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
