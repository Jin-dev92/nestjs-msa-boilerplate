import {UserMicroService} from '@libs/common';
import {AuthOutputPort, ISignUpResponse} from '../../../port';
import {ClientGrpc} from '@nestjs/microservices';
import {Inject, OnModuleInit} from '@nestjs/common';

import {lastValueFrom} from 'rxjs';
import {HashPasswordDto, IJwtPayload, ILoginResponse, LoginDto, ParseBearerTokenDto, SignUpDto} from "../../../usecase";
import {SignUpGrpcRequestMapper, SignUpGrpcResponseMapper} from "./mapper";


export class AuthGrpc implements AuthOutputPort, OnModuleInit {
  private authService: UserMicroService.AuthServiceClient;

  constructor(
    @Inject(UserMicroService.AUTH_SERVICE_NAME)
    private authMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.authMicroService.getService<UserMicroService.AuthServiceClient>(
        UserMicroService.AUTH_SERVICE_NAME,
      );
  }

  async hashPassword(dto: HashPasswordDto): Promise<string> {
    const { hash } = await lastValueFrom(this.authService.hashPassword(dto));
    return hash;
  }

  async login(dto: LoginDto): Promise<ILoginResponse> {
    return await lastValueFrom(this.authService.login(dto));
  }

  async parseBearerToken(dto: ParseBearerTokenDto): Promise<IJwtPayload> {
    return await lastValueFrom(this.authService.parseBearerToken(dto));
  }

  async signUp(dto: SignUpDto): Promise<ISignUpResponse> {
    const response = await lastValueFrom(
      this.authService.signUp(new SignUpGrpcRequestMapper(dto).toGrpc()),
    );
    return new SignUpGrpcResponseMapper(response).toResponse();
  }
}
