import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {GRPC_NAME} from '@libs/common';
import {AuthGrpc} from "../../../user/src/auth";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: GRPC_NAME.AUTH_GRPC,
      useClass: AuthGrpc,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
