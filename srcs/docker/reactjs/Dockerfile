FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl

COPY srcs/frontend/package*.json ./

RUN npm install

COPY srcs/frontend/ ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
