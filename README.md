## 프로젝트 설명

nestjs 기반의 microservice architecture 를 구현하기 위한 보일러플레이트 입니다.

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

[//]: # (## 인프라 구조)
[//]: # (![Infrastructure]&#40;~@source/.vuepress/public/image/2021_04_user_count.png&#41;)
