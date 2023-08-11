FROM node:18-alpine
LABEL authors="Femi Tubosun | ƒa†3"

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .

RUN ["node", "ace", "cmma:config-create"]
RUN ["node", "ace", "cmma:config-update"]

EXPOSE 3333

CMD ["npm", "run", "dev"]

