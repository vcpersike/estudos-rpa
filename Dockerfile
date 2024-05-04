FROM ghcr.io/puppeteer/puppeteer:21.7.0

USER root

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "run", "start" ]