# Берем Node.js 24 для запуска NestJS
FROM node:24-alpine

# Рабочая папка приложения внутри контейнера
WORKDIR /app

# Сначала копируем манифесты для установки зависимостей
COPY package*.json ./

# Устанавливаем версии зависимостей из package-lock.json
RUN npm ci

# Копируем исходный код приложения
COPY . .

# Документируем порт приложения
EXPOSE 3000

# Запускаем NestJS в watch-режиме
CMD ["npm", "run", "start:dev"]