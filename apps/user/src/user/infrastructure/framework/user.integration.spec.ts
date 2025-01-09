import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./postgres";

describe('User MicroService - Integration Test', () => {
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                TypeOrmModule.forRoot({
                    type: 'sqlite', // 가장 가벼운 데이터베이스이기 때문에 테스트에서 선정
                    database: ':memory:',
                    dropSchema: true,
                    entities: [UserEntity],
                })
            ],
        }).compile();
    })
});