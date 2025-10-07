# Arweave + Akash Deployment Examples

This directory contains code examples for deploying SlopMachine applications to decentralized infrastructure (Arweave + Akash Network).

## Files

### Arweave Frontend Deployment

- **`arweave-turbo-upload.ts`**: TypeScript script for uploading Next.js static exports to Arweave using Turbo SDK
- **`github-actions-arweave-deploy.yml`**: GitHub Actions workflow for automated Arweave deployments
  - Production: Deploys to Arweave (permanent hosting)
  - Staging: Deploys to Vercel Free (preview URLs)

### Akash Backend Deployment

- **`akash-deployment-api.yml`**: SDL file for deploying Node.js API + PostgreSQL + Redis to Akash
- **`akash-deployment-ai-worker.yml`**: SDL file for deploying AI worker nodes (24/7 processes)
- **`github-actions-akash-deploy.yml`**: GitHub Actions workflow for automated Akash deployments
  - Production: Deploys to Akash (cost savings)
  - Staging: Deploys to Railway (preview URLs)

## Quick Start

### Prerequisites

1. **Arweave**:
   - Arweave wallet (JWK format)
   - Turbo Credits (purchase at https://turbo.ardrive.io)
   - Store wallet in GitHub Secrets as `ARWEAVE_WALLET`

2. **Akash**:
   - Keplr wallet with AKT tokens (minimum 20 AKT)
   - Store mnemonic in GitHub Secrets as `AKASH_MNEMONIC`
   - Store wallet password in GitHub Secrets as `AKASH_PASSWORD`

3. **No DNS setup needed**:
   - Arweave provides instant HTTPS URLs via gateway
   - Format: `https://arweave.net/{transaction-id}`
   - No Cloudflare or custom domain configuration required

### Deploy Frontend to Arweave

```bash
# Install dependencies
npm install -g ts-node @ardrive/turbo-sdk

# Set environment variables
export ARWEAVE_WALLET='{"kty":"RSA",...}'  # Your Arweave wallet JSON
export PROJECT_NAME="my-project"

# Build Next.js app
cd frontend
npm run build

# Upload to Arweave
ts-node ../docs/examples/arweave-turbo-upload.ts ./out my-project-id

# Output:
# ✅ Deployment successful!
#   Transaction ID: dQhJXkR9...
#   Arweave URL: https://arweave.net/dQhJXkR9...
```

### Deploy Backend to Akash

```bash
# Install Akash CLI
curl -sSfL https://raw.githubusercontent.com/akash-network/node/master/install.sh | sh

# Set environment variables in SDL file
export DATABASE_PASSWORD="your-secure-password"
export JWT_SECRET="your-jwt-secret"
export CORS_ORIGIN="https://my-project.slopmachine.fun"

# Substitute environment variables
envsubst < docs/examples/akash-deployment-api.yml > deployment.yml

# Deploy to Akash
akash tx deployment create deployment.yml --from wallet

# Accept lowest bid
akash query market bid list --owner $AKASH_ACCOUNT_ADDRESS
akash tx market lease create --dseq $DSEQ --provider $PROVIDER --from wallet

# Send manifest
akash provider send-manifest deployment.yml --dseq $DSEQ --provider $PROVIDER

# Get deployment URL
akash provider lease-status --dseq $DSEQ --provider $PROVIDER
```

## GitHub Actions Setup

### 1. Add Secrets to GitHub Repository

Navigate to **Settings → Secrets and variables → Actions** and add:

**Arweave**:
- `ARWEAVE_WALLET`: Your Arweave wallet JSON (entire JWK object)

**Akash**:
- `AKASH_MNEMONIC`: Your Keplr wallet mnemonic (12-24 words)
- `AKASH_PASSWORD`: Wallet password for encryption

**SlopMachine Platform** (optional):
- `SLOPMACHINE_API_TOKEN`: API token for updating deployment metadata

**Vercel** (for staging):
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

**Railway** (for staging):
- `RAILWAY_TOKEN`: Railway API token

### 2. Copy Workflows to Your Repository

```bash
# Frontend deployment workflow
cp docs/examples/github-actions-arweave-deploy.yml .github/workflows/

# Backend deployment workflow
cp docs/examples/github-actions-akash-deploy.yml .github/workflows/

# Commit and push
git add .github/workflows/
git commit -m "Add Arweave + Akash deployment workflows"
git push
```

### 3. Test Deployment

```bash
# Trigger production deployment
git push origin main

# Or trigger staging deployment
git checkout -b test-deploy
git push origin test-deploy
# Open pull request
```

## Cost Estimates

### Arweave (Frontend)

| Build Size | Cost per Deploy | Deploys/Month (2x/week) | Monthly Cost |
|------------|-----------------|-------------------------|--------------|
| 5 MB | $0.043 | 8 | $0.34 |
| 10 MB | $0.086 | 8 | $0.69 |
| 20 MB | $0.172 | 8 | $1.38 |

**Note**: Includes 23.4% Turbo SDK service fee.

### Akash (Backend)

| Workload | CPU | RAM | Storage | Cost/Month |
|----------|-----|-----|---------|------------|
| Node.js API | 500m | 512Mi | 1Gi | $3-4 |
| PostgreSQL | 500m | 2Gi | 20Gi SSD | $6-8 |
| AI Worker Node | 500m | 512Mi | 5Gi SSD | $3-5 |

**Comparison**: Railway equivalent = $10-25/month per service (76-83% savings).

## Troubleshooting

### Arweave Upload Fails

```
Error: Insufficient Turbo Credits
```

**Solution**: Top up Turbo Credits at https://turbo.ardrive.io

---

```
Error: Failed to authenticate with Arweave wallet
```

**Solution**: Verify `ARWEAVE_WALLET` is valid JSON (entire JWK object, not just address).

---

### Akash Deployment Fails

```
Error: No providers bidding on deployment
```

**Solution**:
1. Increase pricing in SDL file (e.g., `amount: 2000` → `amount: 5000`)
2. Remove provider attribute filters (region, tier)
3. Check Akash network status at https://stats.akash.network

---

```
Error: Insufficient AKT balance
```

**Solution**: Fund wallet with at least 20 AKT tokens.

---

### Arweave URL Not Loading

**Solution**:
1. Wait 2-5 minutes for Arweave transaction confirmation
2. Verify transaction ID is correct (check GitHub Actions output)
3. Try alternative gateway: `https://{tx-id}.ar.io`
4. Check Arweave explorer: `https://viewblock.io/arweave/tx/{tx-id}`

---

## Additional Resources

- **Arweave Docs**: https://docs.arweave.org
- **Turbo SDK Docs**: https://docs.ardrive.io/docs/turbo/turbo-sdk/
- **Akash Docs**: https://akash.network/docs
- **Akash Console**: https://console.akash.network (GUI deployment)
- **Full Research Report**: `docs/decentralized-infrastructure-research.md`
- **Decision Brief**: `docs/akash-arweave-decision-brief.md`

---

## Support

For questions or issues:
- **Arweave/Turbo**: ArDrive Discord (https://discord.gg/ardrive)
- **Akash**: Akash Discord (https://discord.akash.network)
- **SlopMachine**: GitHub Issues (https://github.com/slopmachine/slopmachine)
