FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Expose port
EXPOSE 4000

# For development, use ts-node-dev
# For production, build and run
CMD ["npm", "run", "dev"]

