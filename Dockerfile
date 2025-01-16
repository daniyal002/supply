# Указываем базовый образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если он есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Собираем приложение
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 8080

# Команда для запуска приложения
CMD ["npm", "start"]