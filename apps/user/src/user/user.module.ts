import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@libs/database';
import { EncryptionModule } from '@libs/encryption';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EncryptionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
