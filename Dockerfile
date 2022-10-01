FROM node:16-alpine

# 이전 cache 삭제
RUN npm cache verify 

RUN npm cache clean --force

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY ./ .

CMD ["npm", "run", "start:dev"]

