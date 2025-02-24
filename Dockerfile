# Dockerfile for fragments node.js microservice
# Using Node.js as the base image with version matching local environment
FROM node:18.13.0

# Metadata about the image
LABEL maintainer="Your Name <your-email@example.com>"
LABEL description="Fragments node.js microservice"

# Environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and necessary files
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# Expose port and start command
EXPOSE 8080
CMD ["npm", "start"]