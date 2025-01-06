import { UserMicroService } from '@libs/common';

export class HashPasswordResponseMapper {
  constructor(private readonly hash: string) {}

  toResponse(): UserMicroService.HashPasswordResponse {
    return {
      hash: this.hash,
    };
  }
}
