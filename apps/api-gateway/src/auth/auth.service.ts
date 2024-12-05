import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERN_NAME, MICROSERVICE_NAME } from '@libs/common';
import { lastValueFrom } from 'rxjs';
import { ILoginResponse } from '../../../user/src/auth/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userMicroservice: ClientProxy,
  ) {}

  async requestLoginExecutes(dto: LoginDto) {
    return await lastValueFrom(
      this.userMicroservice.send<ILoginResponse, LoginDto>(
        MESSAGE_PATTERN_NAME.USER.LOGIN,
        dto,
      ),
    );
  }
}
