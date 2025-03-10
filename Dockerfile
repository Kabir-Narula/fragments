# Dockerfile for fragments node.js microservice
# Using Node.js as the base image with version matching local environment
FROM node:18.13.0

# Metadata about the image
LABEL maintainer="Kabir Narula"
LABEL description="Fragments node.js microservice"

# Environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Stage 1: Build dependencies
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd
EXPOSE 8080
CMD ["npm", "start"]
