FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY srcs/frontend/package*.json ./

RUN npm install 

RUN npm install --save-dev @types/react @types/react-dom typescript

COPY srcs/frontend/ ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
