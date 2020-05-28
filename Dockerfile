FROM node:erbium

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8000

RUN npm i -g nodemon

CMD ["npm","run", "dev"]