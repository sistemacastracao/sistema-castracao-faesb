# Estágio base para instalar dependências
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Estágio de DESENVOLVIMENTO (Usado pelo Docker Compose no seu PC)
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Estágio de PRODUÇÃO (O Render vai ignorar o acima e usar este)
FROM base AS build-stage
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]