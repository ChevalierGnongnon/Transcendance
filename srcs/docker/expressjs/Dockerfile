FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY srcs/backend/package*.json ./

RUN npm install

COPY srcs/backend/ ./

COPY srcs/backend/default-avatars/ /app/uploads/

EXPOSE 3000

CMD ["npx", "nodemon", "server.js"]