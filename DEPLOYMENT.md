# Production Deployment Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose
- SSL certificates (self-signed or Let's Encrypt)
- A server with at least 2GB RAM, 10GB storage

### 1. Local Setup

```bash
# Clone and configure
git clone <repo> ablespace
cd ablespace

# Run setup script
./scripts/setup-env.sh

# Update .env files with your values
vim apps/backend/.env.production
vim apps/frontend/.env.production
```

### 2. SSL Certificates

For **Let's Encrypt** (free, recommended):
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy to project
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

### 3. Deploy

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy
```

## Platform-Specific Guides

### Render.com
1. Push repo to GitHub
2. Create Web Service, select Docker runtime
3. Set env vars: JWT_SECRET, CORS_ORIGIN, DATABASE_URL
4. Deploy

### Railway.app
1. Create project from GitHub
2. Add PostgreSQL plugin (optional, or use SQLite)
3. Set env vars in Railway dashboard
4. Auto-deploys on push

### Fly.io
1. Install `flyctl`
2. `fly launch --now`
3. `fly secrets set JWT_SECRET=...`
4. `fly deploy`

### DigitalOcean App Platform
1. Connect GitHub repo
2. Set environment variables
3. Set build/start commands per app
4. Deploy

## Monitoring

### Health Checks
- Backend: `GET /api/v1/health`
- Frontend: `GET /`

### Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Database Backups
```bash
# Daily backup script (add to cron)
docker-compose -f docker-compose.prod.yml exec -T backend \
  cp /data/dev.db /tmp/backup.db && \
  docker cp ablespace-backend-1:/tmp/backup.db ./backups/dev.db.$(date +%s)
```

## Security Checklist

- [ ] Change all default secrets
- [ ] Update CORS_ORIGIN to your domain
- [ ] Install valid SSL certificates
- [ ] Enable cert auto-renewal
- [ ] Keep Docker images updated
- [ ] Review nginx rate limits
- [ ] Enable database backups
- [ ] Set up monitoring
- [ ] Use strong JWT_SECRET (32+ chars)
- [ ] Restrict database file permissions

## Performance

### Already Implemented
- ✓ Gzip compression
- ✓ Security headers (HSTS, CSP, etc.)
- ✓ Rate limiting (30 req/min API, 60 req/min app)
- ✓ Helmet.js middleware
- ✓ Docker multi-stage builds
- ✓ Image optimization

### Scale to Multiple Instances
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### For High Traffic
- Add CDN (Cloudflare, CloudFront)
- Switch to PostgreSQL (SQLite limited to ~100 concurrent)
- Enable Redis caching
- Monitor with `docker stats`

## Troubleshooting

### Services won't start
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database locked
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### SSL expired
```bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
docker-compose -f docker-compose.prod.yml restart nginx
```

## Cost Estimates (Monthly)

- **Fly.io**: Free-$10 (pay-as-you-go)
- **Railway**: Free-$20 (starter friendly)
- **Render**: Free tier (750 hrs/month)
- **DigitalOcean**: $6-20
- **Self-hosted VPS**: $5-20

---

For complete details, see README.md. Last updated: 2026-08-08
