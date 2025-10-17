FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY dist ./dist
COPY .env .
EXPOSE 3001
CMD ["node", "dist/main.js"]
