FROM node:lts-alpine3.20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 9090

CMD ["npm","start"]