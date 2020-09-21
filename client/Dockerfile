FROM node:latest

WORKDIR /client

COPY package-lock.json package.json ./

RUN npm install --no-progress --ignore-optional

CMD npm start     # webpack-dev-server --host 0.0.0.0 --hot
