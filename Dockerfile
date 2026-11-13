# Multi-stage Dockerfile for Mineral Springs Retreat
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build frontend assets
COPY . .
RUN npm run build

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production runtime dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server, public assets, and compiled production bundle
COPY server ./server
COPY public ./public
COPY --from=builder /app/dist ./dist

# Ensure persistence directories exist with non-root ownership
RUN mkdir -p /app/public/uploads /app/server/data/backups && \
    chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/settings || exit 1

CMD ["node", "server/index.js"]
