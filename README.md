## 프로젝트 설명
써보고 싶은 기술을 사용해보기 위한 프로젝트입니다.
- 아키텍처 구성: MSA + Clean Architecture
- 프로토콜: gRPC + REST API
- 인증/인가: JWT
- 컨테이너: Docker
- 오케스트레이션: Kubernetes
- 데이터베이스: PostgreSQL + MongoDB
- 테스트: Jest(현재 부분적으로 적용 되어있습니다. 조만간 커버리지를 높일 예정입니다.)
- 캐싱: Redis
- 로깅: Winston (예정) +  ELK (예정) + Kibana (예정) + AWS CloudWatch (예정)
- 모니터링: Prometheus + Grafana (예정)
- CI/CD: Github Actions (예정)
- 클라우드: AWS Fargate (예정)

추후에 Kafka + CQRS 도 구현해보겠습니다. 

## 구성
- apps
  - gateway - 마이크로 서비스를 통합하기 위한 API Gateway, HTTP 포트 번호는 3000
  - user - 사용자 관리 + 인증/인가 서비스, TCP 포트 번호는 3001
  - chat - 채팅 서비스, TCP 포트 번호는 3002
- libs
  - common - 공통으로 변수나 유틸을 사용하기 위한 라이브러리
    - const - 공통으로 사용할 전역 변수
    - decorators - 공통 데코레이터
    - interceptors - 공통 인터셉터
    - filters - 공통 필터
    - pipes - 공통 파이프
  - database - 공통으로 사용할 데이터베이스 엔티티 및 설정
  - encryption - 공통으로 사용할 암호화 라이브러리
  - proto - gRPC 프로토콜을 사용하기 위한 프로토 파일
  - kubernetes - 쿠버네티스 학습 관련 내용.
## Running the docker container

```bash
docker compose up -d
```

## Test
```bash
yarn test:user # 유저 모듈 테스트
yarn test:chat # 채팅 모듈 테스트(미구현)
yarn test:e2e # E2E 테스트(미구현)
yarn test:user:integration # 통합 테스트(미구현)
```
[//]: # (## 인프라 구조)
[//]: # (![Infrastructure]&#40;~@source/.vuepress/public/image/2021_04_user_count.png&#41;)
