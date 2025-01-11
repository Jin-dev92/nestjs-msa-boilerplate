import {ENVIRONMENT_KEYS, UseCase} from '@libs/common';
import * as bcrypt from 'bcrypt';
import {BadRequestException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {HashPasswordDto} from "./dto";

@Injectable()
export class HashPasswordUsecase
    implements UseCase<HashPasswordDto, Promise<string>> {
    constructor(private readonly configService: ConfigService) {
    }

    async execute(dto: HashPasswordDto): Promise<string> {
        const {password, salt} = dto;
        try {
            return await bcrypt.hash(
                password,
                parseInt(this.configService.getOrThrow(ENVIRONMENT_KEYS.AUTH_ROUNDS)),
            );
        } catch (e) {
            throw new BadRequestException('비밀번호 암호화에 실패했습니다.');
        }
    }
}
