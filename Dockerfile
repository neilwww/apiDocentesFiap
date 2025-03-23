FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --save-dev jest mongodb-memory-server supertest

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]