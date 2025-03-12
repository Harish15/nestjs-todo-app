# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install NestJS CLI globally inside the container
RUN npm install -g @nestjs/cli

# Copy the rest of the application files
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the application port (change if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]
