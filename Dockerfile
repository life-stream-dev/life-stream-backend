FROM node:lts
LABEL authors="Half_nothing"

WORKDIR /opt/life-stream

RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm/

COPY package*.json ./

RUN npm install

COPY src/ src/

EXPOSE 80

CMD ["npm", "run", "start:build"]