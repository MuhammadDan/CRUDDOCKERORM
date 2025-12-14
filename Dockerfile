# Base image
FROM node:22-alpine

# Workdir
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy source code
COPY . .

# Expose port (same as .env PORT)
EXPOSE 4000

# Start command
CMD ["node", "src/server.js"]