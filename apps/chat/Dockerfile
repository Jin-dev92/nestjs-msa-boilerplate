FROM node:alpine AS development

WORKDIR /usr/src/app
# 의존성 설치 단계
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN yarn install

# 서버 코드 빌드 및 실행 단계
COPY apps/chat apps/chat
COPY libs libs
RUN yarn build chat

CMD ["yarn", "start:dev", "chat"]

FROM node:alpine AS production
# production 에서 추가적으로 실행
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY --from=development /usr/src/app/dist ./dist
COPY proto proto

CMD ["node", "dist/apps/chat/main"]