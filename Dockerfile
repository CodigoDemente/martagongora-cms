FROM node:18.17.0-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --ignore-scripts

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
