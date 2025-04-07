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

# Copy required files
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd
COPY ./scripts ./scripts

# Make setup script executable and ensure Unix line endings
RUN apk add --no-cache dos2unix && \
    dos2unix /app/scripts/local-aws-setup.sh && \
    chmod +x /app/scripts/local-aws-setup.sh && \
    apk del dos2unix

EXPOSE 8080

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=5s \
    CMD curl -f http://localhost:8080/ || exit 1

CMD ["npm", "start"]