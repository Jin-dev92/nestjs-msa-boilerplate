import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_NAME } from '@libs/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_NAME.USER_SERVICE,
        transport: Transport.TCP,
      },
      // {
      //   name: '_SERVICE',
      //   transport: Transport.TCP,
      // },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
