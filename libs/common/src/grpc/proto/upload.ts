// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.5.1
//   protoc               v5.29.1
// source: proto/upload.proto

/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = "upload";

export interface UploadRequest {
  filename: string;
  content: Uint8Array;
}

export interface UploadResponse {
  filePath: string;
}

export const UPLOAD_PACKAGE_NAME = "upload";

export interface UploadServiceClient {
  uploadFiles(request: UploadRequest, metadata?: Metadata): Observable<UploadResponse>;
}

export interface UploadServiceController {
  uploadFiles(
    request: UploadRequest,
    metadata?: Metadata,
  ): Promise<UploadResponse> | Observable<UploadResponse> | UploadResponse;
}

export function UploadServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadFiles"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UploadService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UploadService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const UPLOAD_SERVICE_NAME = "UploadService";
