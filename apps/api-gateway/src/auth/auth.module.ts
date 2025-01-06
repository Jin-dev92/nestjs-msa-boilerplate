import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGrpc } from '@apps/user/auth';
import { GRPC_NAME } from '@libs/common';

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
