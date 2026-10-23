# Multi-stage production container for Car Castle Goa
FROM node:20-alpine AS base

WORKDIR /app

# Install production dependencies only if package.json specifies them
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY . .

# Set secure production environment
ENV NODE_ENV=production
ENV PORT=8080

# Switch to unprivileged node user
USER node

# Expose HTTP port
EXPOSE 8080

# Container Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start non-blocking web server
CMD ["node", "server.js"]
