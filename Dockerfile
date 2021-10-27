FROM node:lts-alpine3.14

RUN apk update
RUN apk upgrade
RUN npm install -g serve

RUN addgroup -S acg-ui
RUN adduser -S acg-ui -G acg-ui
USER acg-ui

RUN mkdir /home/acg-ui/project
WORKDIR /home/acg-ui/project

RUN mkdir ./public
COPY --chown=acg-ui:acg-ui public/ ./public
RUN mkdir ./src
COPY --chown=acg-ui:acg-ui src/ ./src
COPY --chown=acg-ui:acg-ui package-lock.json .
COPY --chown=acg-ui:acg-ui package.json .
COPY --chown=acg-ui:acg-ui tsconfig.json .

RUN npm install
RUN npm run build

ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]
