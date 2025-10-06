# 14. Deployment Architecture

## 14.1 Deployment Strategy

**Frontend Deployment (Vercel):**
- **Platform:** Vercel
- **Build Command:** `pnpm --filter web build`
- **Output Directory:** `apps/web/.next`
- **CDN/Edge:** Automatic edge caching via Vercel Edge Network
- **Environment:** Production, Preview (per PR)

**Backend Deployment (Railway):**
- **Platform:** Railway
- **Build Command:** `pnpm --filter api build`
- **Deployment Method:** Docker container
- **Regions:** us-west-2
- **Auto-scaling:** Enabled (2-10 instances)

**MCP Server Deployment (Railway):**
- **Platform:** Railway
- **Build Command:** `pnpm --filter mcp-server build`
- **Deployment Method:** Docker container
- **Public Access:** HTTPS endpoint for AI assistants

## 14.2 CI/CD Pipeline

```yaml