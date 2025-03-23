# Step 1: Build the app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the built app
FROM node:20-alpine AS production

# Install a simple static file server
RUN npm install -g serve

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3002

# Serve the app
CMD ["serve", "dist", "-l", "3002"]
