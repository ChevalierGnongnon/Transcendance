FROM node:22-bookworm-slim

WORKDIR /app

COPY srcs/backend/ ./

RUN	npm install

EXPOSE 3000

CMD ["node", "server.js"]
