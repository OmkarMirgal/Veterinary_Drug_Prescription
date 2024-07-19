# PRODUCTION

# # Stage 1:
# FROM node:20-alpine3.20 as angular
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build --prod

# # Stage 2:
# FROM nginx:alpine3.19-slim
# COPY --from=angular /app/dist/frontend/browser /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

#DEVELOPMENT
# Stage 1:
FROM node:20-alpine3.20 as angular
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm", "start"]