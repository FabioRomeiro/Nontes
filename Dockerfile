FROM node:16

USER node

RUN mkdir /home/app

WORKDIR /home/app

COPY --chown=node:node package-lock.json package.json ./

RUN npm ci

COPY --chown=node:node . .

CMD ["node", "app/server.js"]
