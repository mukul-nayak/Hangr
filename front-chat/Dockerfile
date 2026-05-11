# # Stage 1

# FROM node:24 as build
# WORKDIR /app

# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2 : serve react app
# # FROM nginx:1.27.3-alpine-slim
# FROM amd64/nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

