FROM node:20-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies required for the build
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY . .

# Build NestJS application
RUN npm run build

# Remove development dependencies after the build
RUN npm prune --omit=dev && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Give the application user ownership of the application directory
RUN chown -R nestjs:nodejs /app

USER nestjs

# Backend port
EXPOSE 4000

# Container health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]