import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {GRPC_NAME} from '@libs/common';
import {UserGrpc} from "../../../user/src/user";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: GRPC_NAME.USER_GRPC,
      useClass: UserGrpc,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
