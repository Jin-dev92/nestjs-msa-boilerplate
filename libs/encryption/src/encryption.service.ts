import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string, salt = undefined) {
    return await bcrypt.hash(
      password,
      salt || this.configService.getOrThrow('AUTH_ROUNDS'),
    );
  }
}
