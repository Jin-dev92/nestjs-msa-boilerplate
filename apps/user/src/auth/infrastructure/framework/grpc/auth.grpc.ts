import { UserMicroService } from '@libs/common';

export class AuthGrpc {
  constructor(private authMicroSerivce: UserMicroService.AuthServiceClient) {}
}
