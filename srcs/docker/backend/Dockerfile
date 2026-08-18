FROM node:24-alpine AS builder

WORKDIR /app

COPY srcs/backend/package*.json ./

RUN npm ci

COPY srcs/backend/src ./src

RUN npm run build

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY srcs/backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY srcs/backend/default-avatars/ /app/uploads/

EXPOSE 3000

CMD ["nmp", "start"]
