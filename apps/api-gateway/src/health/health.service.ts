import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import {
  ENVIRONMENT_KEYS,
  MICROSERVICE_NAME,
  UserMicroService,
} from '@libs/common';
import { ClientProxy, GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly microServiceHealth: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userMicroService: ClientProxy,
  ) {}

  async microServiceHealthCheckExecutes() {
    return this.healthService.check([
      () =>
        this.microServiceHealth.pingCheck<GrpcOptions>('grpc', {
          transport: Transport.GRPC,
          options: {
            package: UserMicroService.protobufPackage,
            protoPath: join(process.cwd(), 'proto/user.proto'),
            url: this.configService.getOrThrow(
              ENVIRONMENT_KEYS.GRPC_CHAT_SERVICE_URL,
            ),
          },
        }),
      // () =>
      //   this.microServiceHealth.pingCheck<GrpcOptions>(
      //     MICROSERVICE_NAME.CHAT_SERVICE,
      //     {
      //       transport: Transport.GRPC,
      //       options: {
      //         package: UserMicroService.protobufPackage,
      //         protoPath: join(process.cwd(), 'proto/user.proto'),
      //         url: this.configService.getOrThrow(
      //           ENVIRONMENT_KEYS.GRPC_CHAT_SERVICE_URL,
      //         ),
      //       },
      //     },
      //   ),
    ]);
  }
}
