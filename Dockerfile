FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./config/ssh /app/config/ssh

# Expose port 443 for HTTPS
EXPOSE 443


CMD ["npm", "run", "dev"]