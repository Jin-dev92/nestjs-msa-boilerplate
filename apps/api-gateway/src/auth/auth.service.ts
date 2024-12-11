import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  MetaDataBuilder,
  MICROSERVICE_NAME,
  UserMicroService,
} from '@libs/common';
import { lastValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroService.AuthServiceClient;
  constructor(
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}
  onModuleInit() {
    this.authService = this.userMicroservice.getService(
      MICROSERVICE_NAME.USER_SERVICE,
    );
  }

  async requestLoginExecutes(dto: UserMicroService.LoginRequest) {
    return await lastValueFrom(
      this.authService.login(
        dto,
        new MetaDataBuilder()
          .setClientClass(AuthService.name)
          .setClientMethod('requestLoginExecutes')
          .build(),
        // constructMetadataUtils(AuthService.name, 'requestLoginExecutes'),
      ),
    );
  }
}
