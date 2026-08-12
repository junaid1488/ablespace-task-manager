FROM node:20-slim

WORKDIR /app

# Install OpenSSL and dumb-init
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies required for the build
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY . .

# Build NestJS application and verify the entry file exists
RUN npm run build && find dist -type f -name "main.js" -print

# Remove development dependencies after build
RUN npm prune --omit=dev \
    && npm cache clean --force

# Create non-root user
RUN groupadd --gid 1001 nodejs \
    && useradd --uid 1001 --gid nodejs --shell /bin/sh --create-home nestjs

# Give application user ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

# Render port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:10000/api/v1/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node $(find /app/dist -type f -name 'main.js' | head -1)"]