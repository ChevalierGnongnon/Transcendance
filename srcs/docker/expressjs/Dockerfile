FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl

COPY srcs/backend/package*.json ./

RUN npm install

COPY srcs/backend/ ./

EXPOSE 3000

CMD ["node", "server.js"]