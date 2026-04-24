FROM node:22-bookworm-slim

WORKDIR /app

COPY srcs/frontend/package*.json ./

RUN	npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
