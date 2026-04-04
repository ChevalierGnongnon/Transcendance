FROM node:22-bookworm-slim

WORKDIR app/

COPY srcs/frontend/package*.json ./

RUN	npm install

EXPOSE 3000

CMD ["npm", "start"]



