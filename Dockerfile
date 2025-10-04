# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_PUBLIC_MAPBOX_KEY
ARG VITE_VAPID_PUBLIC_KEY
ARG VITE_PUBLIC_API_URL

# Set environment variables for build
ENV VITE_PUBLIC_MAPBOX_KEY=${VITE_PUBLIC_MAPBOX_KEY}
ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}
ENV VITE_PUBLIC_API_URL=${VITE_PUBLIC_API_URL}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy service worker to root
COPY --from=builder /app/public/serviceWorker.js /usr/share/nginx/html/serviceWorker.js

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]