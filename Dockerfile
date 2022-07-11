FROM node:16-alpine

RUN npm i --location=global nodemon

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package-lock.json package.json ./

RUN npm ci

COPY --chown=node:node . .

CMD ["nodemon", "server.js"]
