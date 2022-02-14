FROM node:12-alpine3.12

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD ["npm", "run", "test"]
