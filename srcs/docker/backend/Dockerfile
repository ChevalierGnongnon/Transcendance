FROM node:24-alpine

RUN apk add --no-cache curl


WORKDIR /app

COPY srcs/backend/package*.json ./
# COPY srcs/backend/prisma ./prisma

RUN npm install

# RUN npx prisma generate

COPY srcs/docker/backend/default-avatars/ /app/uploads/

EXPOSE 3000

# CMD ["npm", "run", "dev"]
CMD ["sh", "-c", "npx prisma generate && npm run prisma:deploy && npm run db:seed && npm run dev"]
