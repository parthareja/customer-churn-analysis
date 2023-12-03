FROM node:lts-buster

WORKDIR /server-side

COPY . .

EXPOSE 8080

RUN yarn

CMD [ "yarn", "run", "dev" ]