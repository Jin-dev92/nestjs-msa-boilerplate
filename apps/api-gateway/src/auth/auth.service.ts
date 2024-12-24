import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MetaDataBuilder, UserMicroService } from '@libs/common';
import { lastValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroService.AuthServiceClient;

  constructor(
    @Inject(UserMicroService.USER_SERVICE_NAME)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.userMicroservice.getService(
      UserMicroService.USER_SERVICE_NAME,
    );
  }

  async requestLoginExecutes(dto: UserMicroService.LoginRequest) {
    return await lastValueFrom(
      this.authService.login(
        dto,
        new MetaDataBuilder()
          .setClientClass(AuthService.name)
          .setClientMethod('login')
          .build(),
      ),
    );
  }
  async requestSignUpExecutes(dto: UserMicroService.SignUpRequest) {
    return await lastValueFrom(
      this.authService.signUp(
        dto,
        new MetaDataBuilder()
          .setClientClass(AuthService.name)
          .setClientMethod('signUp')
          .build(),
      ),
    );
  }
}
