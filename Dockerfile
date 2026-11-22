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

RUN mkdir -p /app/dist && chown -R node:node /app
USER node

# Документируем порт приложения
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

# Запускаем NestJS в watch-режиме
CMD ["npm", "run", "start:dev"]