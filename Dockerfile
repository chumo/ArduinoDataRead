FROM node:8

RUN npm install socket.io johnny-five --save

COPY . /app

WORKDIR /app

CMD ["node", "index.js"]
