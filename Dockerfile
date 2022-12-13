FROM node:16-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:8080/ || exit 1
EXPOSE 8080
CMD ["npm","start"]
