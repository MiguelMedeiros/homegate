# Development Dockerfile for Next.js 15

FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./

RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

