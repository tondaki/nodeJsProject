
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]



# docker compose down -v
# docker volume rm redis-data
# docker volume prune که استفاده دیگگه نمیشه

# volumes:
#   mongo-data:
#   redis-data:
# یعنی Docker خودش با تنظیمات پیش‌فرض دو Volume می‌سازد.