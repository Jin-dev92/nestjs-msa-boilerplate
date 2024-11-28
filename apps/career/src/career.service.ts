import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_NAME } from '@libs/common';
import { IJwtPayload } from '@libs/encryption';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CareerService {
  constructor(
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userService: ClientProxy,
  ) {}

  async getCareers(authorization: string) {
    // return await this.userService.send('getCareerList', {});
    const jwtPayload = await lastValueFrom(
      this.userService.send<IJwtPayload, string>(
        'parseBearerToken',
        authorization,
      ),
    );
  }
}
