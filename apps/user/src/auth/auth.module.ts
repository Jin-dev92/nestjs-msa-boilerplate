import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infrastructure/auth.controller';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
