FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN yarn install

COPY apps/user apps/user
COPY libs libs
RUN yarn build user

CMD ["yarn", "start:dev", "user"]

FROM node:alpine AS production
# production 에서 추가적으로 실행
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY --from=development /usr/src/app/dist ./dist
COPY proto proto

CMD ["node", "dist/apps/user/main"]