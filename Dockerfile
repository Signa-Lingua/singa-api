FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get-upgrade -y

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source

COPY . .

EXPOSE 3333

CMD [ "npm", "run", "start" ]