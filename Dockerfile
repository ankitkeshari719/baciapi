FROM node:16
RUN useradd -d /home/baci -m -s /bin/bash baci
USER baci
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]
