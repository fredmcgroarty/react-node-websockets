FROM node:latest

WORKDIR /server

COPY package-lock.json package.json ./

RUN npm install && npm install -g nodemon

CMD [ "nodemon", "index.js" ]

