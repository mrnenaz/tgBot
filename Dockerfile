FROM mongo:latest
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env /usr/src/app/.env
RUN npm run build
EXPOSE 3000 27017
CMD ["npm", "start"]