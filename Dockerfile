FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY .env /app/.env
ENV PORT=3000
EXPOSE ${PORT}
CMD ["npm", "dev"]