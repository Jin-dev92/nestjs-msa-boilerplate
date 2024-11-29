FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start:dev", "chat"]

#FROM node:alpine AS production
# production 에서 추가적으로 실행