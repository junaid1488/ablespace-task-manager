#!/bin/bash
set -e

echo "🚀 AbleSpace Deployment Setup"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for required commands
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}✗ $1 is required but not installed${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ $1 found${NC}"
}

echo -e "\n${YELLOW}Checking requirements...${NC}"
check_command docker
check_command docker-compose

# Generate secrets
echo -e "\n${YELLOW}Generating secrets...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✓ JWT_SECRET generated${NC}"

# Create .env files
echo -e "\n${YELLOW}Creating environment files...${NC}"

cat > apps/backend/.env.production << BACKEND_ENV
NODE_ENV=production
DATABASE_URL=file:/data/dev.db
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-domain.com
PORT=4000
BACKEND_ENV

cat > apps/frontend/.env.production << FRONTEND_ENV
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
FRONTEND_ENV

echo -e "${GREEN}✓ Environment files created${NC}"
echo -e "\n${YELLOW}⚠️  Update the following before deploying:${NC}"
echo "  - CORS_ORIGIN in apps/backend/.env.production"
echo "  - NEXT_PUBLIC_API_URL in apps/frontend/.env.production"
echo "  - SSL certificates in ssl/ directory"

echo -e "\n${GREEN}Setup complete!${NC}"
