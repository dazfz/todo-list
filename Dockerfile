FROM node:18

WORKDIR /todo-list

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000
CMD ["node", "back/server.js"]
