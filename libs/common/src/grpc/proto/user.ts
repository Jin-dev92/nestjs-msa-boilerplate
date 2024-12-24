// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.5.1
//   protoc               v5.29.1
// source: proto/user.proto

/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = "user";

/** enum */
export enum TokenType {
  ACCESS = 0,
  REFRESH = 1,
  UNRECOGNIZED = -1,
}

export enum UserRoleEnum {
  USER = 0,
  SUPER = 1,
  UNRECOGNIZED = -1,
}

/** func definition */
export interface HashPasswordRequest {
  password: string;
  salt?: string | undefined;
}

export interface HashPasswordResponse {
  hash: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

export interface SignUpResponse {
  id: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ParseBearerTokenRequest {
  token: string;
  type?: TokenType | undefined;
}

export interface ParseBearerTokenResponse {
  sub: number;
  email: string;
  role: UserRoleEnum;
  type: TokenType;
  exp: number;
}

export interface GetUserRequest {
  id: number;
}

export interface GetUserResponse {
  id: number;
  email: string;
  username: string;
}

export const USER_PACKAGE_NAME = "user";

export interface AuthServiceClient {
  login(request: LoginRequest, metadata?: Metadata): Observable<LoginResponse>;

  parseBearerToken(request: ParseBearerTokenRequest, metadata?: Metadata): Observable<ParseBearerTokenResponse>;

  hashPassword(request: HashPasswordRequest, metadata?: Metadata): Observable<HashPasswordResponse>;

  /** rpc verifyToken(VerifyTokenRequest) returns (VerifyTokenResponse); */

  signUp(request: SignUpRequest, metadata?: Metadata): Observable<SignUpResponse>;
}

export interface AuthServiceController {
  login(request: LoginRequest, metadata?: Metadata): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  parseBearerToken(
    request: ParseBearerTokenRequest,
    metadata?: Metadata,
  ): Promise<ParseBearerTokenResponse> | Observable<ParseBearerTokenResponse> | ParseBearerTokenResponse;

  hashPassword(
    request: HashPasswordRequest,
    metadata?: Metadata,
  ): Promise<HashPasswordResponse> | Observable<HashPasswordResponse> | HashPasswordResponse;

  /** rpc verifyToken(VerifyTokenRequest) returns (VerifyTokenResponse); */

  signUp(
    request: SignUpRequest,
    metadata?: Metadata,
  ): Promise<SignUpResponse> | Observable<SignUpResponse> | SignUpResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "parseBearerToken", "hashPassword", "signUp"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";

export interface UserServiceClient {
  /** rpc SignUp(SingUpRequest) returns (SingUpResponse); */

  getUser(request: GetUserRequest, metadata?: Metadata): Observable<GetUserResponse>;
}

export interface UserServiceController {
  /** rpc SignUp(SingUpRequest) returns (SingUpResponse); */

  getUser(
    request: GetUserRequest,
    metadata?: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUser"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
