# Deployment Guide

This document provides comprehensive instructions for deploying the Oro application to various environments.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Manual Deployment](#manual-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring](#monitoring)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed locally
- A Grail API key (contact Grail support)
- Access to the deployment target (Vercel account, server, etc.)
- Git repository access
- Solana wallet for testing (optional but recommended)

---

## Environment Setup

### Required Secrets

Contact your team lead to obtain:

1. **Grail API Key**: For production API access
2. **Vercel Team Access**: For team deployments
3. **Solana RPC URL**: For mainnet connections

### Local Environment Validation

Before deploying, verify everything works locally:

```bash
# Install dependencies
npm install

# Run type check
npm run type-check

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build the application
npm run build
```

All checks must pass before deployment.

---

## Vercel Deployment

Vercel is the recommended platform for Oro deployments.

### Initial Setup

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import from GitHub/GitLab
   - Select the Oro repository

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `ororound` (if applicable) or `./`
   - **Build Command**: `cd ororound && npm run build`
   - **Output Directory**: `ororound/.next`

3. **Environment Variables**:
   Add these in the Vercel dashboard:

   | Variable | Value | Environment |
  |----------|-------|-------------|
   | `NEXT_PUBLIC_GRAIL_API_URL` | `https://api.grail.oro.finance/v1` | All |
   | `NEXT_PUBLIC_GRAIL_API_KEY` | (your key) | All |
   | `GRAIL_API_URL` | `https://api.grail.oro.finance/v1` | All |
   | `GRAIL_API_KEY` | (your key) | All |

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Verify deployment URL

### Automatic Deployments

Vercel automatically deploys on git pushes:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches and pull requests

Configure branch deployment rules in `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "staging": true,
      "preview": false
    }
  }
}
```

### Production Deployment

To deploy to production:

```bash
# Merge to main branch
git checkout main
git merge feature/your-feature
git push origin main

# Vercel will auto-deploy
# Check dashboard for status
```

### Preview Deployments

Every pull request gets a preview deployment:

1. Create a PR on GitHub
2. Vercel builds and deploys automatically
3. View preview URL in PR comments
4. Test before merging

### Vercel CLI Deployment

For developers who prefer the command line, you can deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to your account
vercel login

# Link your project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Managing Vercel Environment Variables via CLI

You can also manage environment variables directly from your terminal:

```bash
# Add a new environment variable
vercel env add NEXT_PUBLIC_GRAIL_API_KEY production

# Pull environment variables to local .env file
vercel env pull .env.local
```
---

## Manual Deployment

For non-Vercel deployments (custom servers, etc.):

### Build

```bash
# Production build
npm run build

# Output is in .next/ directory
```

### Start Server

```bash
# Production server
npm start

# Or with custom port
PORT=3000 npm start
```

### Environment Variables

Create `.env.production`:

```bash
NEXT_PUBLIC_GRAIL_API_URL=https://api.grail.oro.finance/v1
NEXT_PUBLIC_GRAIL_API_KEY=gr_live_xxx
GRAIL_API_URL=https://api.grail.oro.finance/v1
GRAIL_API_KEY=gr_live_xxx
NODE_ENV=production
```

### Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name oro.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t oro-app .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GRAIL_API_URL=https://api.grail.oro.finance/v1 \
  -e NEXT_PUBLIC_GRAIL_API_KEY=gr_live_xxx \
  -e GRAIL_API_URL=https://api.grail.oro.finance/v1 \
  -e GRAIL_API_KEY=gr_live_xxx \
  oro-app
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GRAIL_API_URL=https://api.grail.oro.finance/v1
      - NEXT_PUBLIC_GRAIL_API_KEY=${GRAIL_API_KEY}
      - GRAIL_API_URL=https://api.grail.oro.finance/v1
      - GRAIL_API_KEY=${GRAIL_API_KEY}
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GRAIL_API_URL` | Public API URL | `https://api.grail.oro.finance/v1` |
| `NEXT_PUBLIC_GRAIL_API_KEY` | Public API key | `gr_live_abc123` |
| `GRAIL_API_URL` | Server-side API URL | `https://api.grail.oro.finance/v1` |
| `GRAIL_API_KEY` | Server-side API key | `gr_live_abc123` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_APP_ENV` | App environment | `production` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `BASE_URL` | Base URL for E2E tests | `http://localhost:3000` |

### Environment-Specific Values

#### Development

```bash
NEXT_PUBLIC_GRAIL_API_URL=https://api-staging.grail.oro.finance/v1
NEXT_PUBLIC_GRAIL_API_KEY=gr_test_xxx
```

#### Staging

```bash
NEXT_PUBLIC_GRAIL_API_URL=https://api-staging.grail.oro.finance/v1
NEXT_PUBLIC_GRAIL_API_KEY=gr_staging_xxx
```

#### Production

```bash
NEXT_PUBLIC_GRAIL_API_URL=https://api.grail.oro.finance/v1
NEXT_PUBLIC_GRAIL_API_KEY=gr_live_xxx
```

### Security Best Practices for Environment Variables

1. **Never commit `.env` files**: Ensure `.env`, `.env.local`, and `.env.production` are in your `.gitignore`.
2. **Use Secret Management**: For production, use Vercel's built-in secret management or a dedicated service like Doppler.
3. **Rotate Keys Regularly**: Periodically rotate your `GRAIL_API_KEY` and other sensitive credentials.
4. **Least Privilege**: Use restricted API keys for client-side (`NEXT_PUBLIC_`) whenever possible.
5. **Environment Isolation**: Use different API keys for development, staging, and production environments.
---

## Pre-Deployment Checklist

Before deploying to production:

### Code Quality

- [ ] All tests pass (`npm run test && npm run test:e2e`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console.log statements in production code
- [ ] No debugger statements

### Security

- [ ] Environment variables are set correctly
- [ ] API keys are production keys (not test/development)
- [ ] CORS settings are correct
- [ ] Security headers are configured

### Performance

- [ ] Build completes without warnings
- [ ] Bundle size is acceptable
- [ ] Images are optimized
- [ ] API response times are acceptable

### Documentation

- [ ] README is up to date
- [ ] API documentation reflects current state
- [ ] Architecture docs are current
- [ ] CHANGELOG is updated

### Testing

- [ ] Manual testing completed on staging
- [ ] Critical paths tested (purchase flow, wallet connection)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed

---

## Post-Deployment Verification

After deployment, verify:

### Smoke Tests

1. **Homepage loads**: Check for 200 response
2. **Wallet connection**: Test connecting a wallet
3. **Quote fetching**: Get a gold quote
4. **No console errors**: Check browser console

### API Connectivity

```bash
# Test API connectivity
curl https://your-domain.com/api/health
```

### Vercel Checks

In Vercel dashboard:
- Build status: Success
- Deployment status: Ready
- Domains: Correctly assigned
- Functions: No errors

### Sentry/Monitoring

If using error tracking:
- No new errors introduced
- Performance metrics acceptable

---

## Rollback Procedures

### Vercel Rollback

1. Go to Vercel Dashboard
2. Select the project
3. Go to "Deployments" tab
4. Find the previous working deployment
5. Click the three dots menu
6. Select "Promote to Production"

### Git Rollback

```bash
# Rollback to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard HEAD~1
git push origin main --force
```

### Emergency Rollback

If critical issues are found:

1. Immediately roll back via Vercel dashboard
2. Notify the team
3. Create incident report
4. Fix issues in separate branch
5. Deploy fix after testing

---

## Monitoring

### Vercel Analytics

Enable in dashboard:
- Performance metrics
- Core Web Vitals
- Audience analytics

### Uptime Monitoring

Recommended services:
- UptimeRobot
- Pingdom
- Datadog

### Error Tracking

Recommended integrations:
- Sentry
- LogRocket
- Vercel Error Monitoring

### Key Metrics to Watch

- **Uptime**: Target 99.9%+
- **Load Time**: Target < 3 seconds
- **Error Rate**: Target < 0.1%
- **API Latency**: Target < 500ms

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variable Issues

- Check variables are set in Vercel dashboard
- Verify prefix (NEXT_PUBLIC_ for client-side)
- Confirm no trailing spaces in values

### API Connection Issues

- Verify API keys are correct
- Check CORS settings on API
- Test API endpoints directly

### Performance Issues

- Check bundle analyzer output
- Optimize images
- Review API response times
- Enable caching where appropriate

---

## Support

For deployment issues:

- **Vercel**: Check [Vercel Docs](https://vercel.com/docs)
- **Next.js**: Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- **Team**: Contact DevOps team in Slack
