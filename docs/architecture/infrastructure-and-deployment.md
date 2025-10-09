# Infrastructure and Deployment

## Infrastructure as Code

- **Tool:** Anchor CLI (for Solana programs) + Shell scripts (for Node.js services)
- **Location:**
  - Solana programs: `packages/programs/migrations/`
  - Node services: `scripts/deploy-*.sh`
- **Approach:**
  - **Solana programs:** Anchor handles program deployment to devnet/mainnet
  - **AI Agent Nodes:** Self-hosted by node operators (VPS, local, cloud)
  - **Remote MCP Server:** Deployed to cloud hosting (Fly.io, Railway, or VPS)
  - **No traditional IaC needed** (no AWS/GCP infrastructure - blockchain-native)

## Deployment Strategy

- **Strategy:**
  - **Solana Programs:** Blue/green via program upgrades (Anchor upgrade authority)
  - **AI Agent Nodes:** Rolling deployment (PM2 restart with graceful shutdown)
  - **Remote MCP Server:** Zero-downtime deployment (cloud platform handles)
- **CI/CD Platform:** GitHub Actions
- **Pipeline Configuration:** `.github/workflows/`

## Environments

- **Development (Local):**
  - Solana: Local validator (`solana-test-validator`)
  - AI Node: Runs on localhost with test keypair
  - MCP: Runs on localhost, connects to local validator
  - mem0: SQLite backend for testing

- **Devnet (Staging):**
  - Solana: Devnet cluster (https://api.devnet.solana.com)
  - AI Node: Deployed to staging VPS
  - MCP: Deployed to staging URL (mcp-staging.slopmachine.com)
  - mem0: PostgreSQL on staging server

- **Mainnet-Beta (Production):**
  - Solana: Mainnet cluster via Helius RPC
  - AI Node: Distributed (node operators self-host)
  - MCP: Production URL (mcp.slopmachine.com)
  - mem0: Production PostgreSQL with backups

## Environment Promotion Flow

```
Local Development
    ↓ (git push to feature branch)
Devnet Testing
    ↓ (PR merge to main)
Automated Devnet Deployment
    ↓ (Manual approval + testing)
Mainnet Deployment
    ↓ (Monitor + rollback if needed)
Production Stable
```

## Rollback Strategy

- **Primary Method:**
  - **Solana programs:** Anchor program upgrade with previous version
  - **AI Agent Nodes:** PM2 rollback to previous version (`pm2 reload ecosystem.config.js --update-env`)
  - **Remote MCP:** Cloud platform rollback (Fly.io: `fly deploy --image previous-image`)

- **Trigger Conditions:**
  - Transaction failure rate >10%
  - Critical bug discovered in production
  - Escrow payment issues (gradual rollout with limits mitigates)
  - Data corruption or account state errors

- **Recovery Time Objective:** <30 minutes for smart contracts, <5 minutes for Node services

## Disaster Recovery

**Philosophy:** Blockchain and Arweave are inherently disaster-recovery solutions (decentralized, immutable, permanent). Only mem0 requires backup procedures.

**Blockchain Data (Solana):**
- ✅ **No backup needed** - Decentralized consensus ensures data permanence
- ✅ **Recovery:** Connect to any RPC endpoint to access full state
- ✅ **Mitigation:** Use multiple RPC providers (Helius primary, public fallback)

**Arweave Storage:**
- ✅ **No backup needed** - Permanent, immutable storage by design
- ✅ **Recovery:** Data retrievable via any Arweave gateway (`arweave.net`, `arweave.dev`, etc.)
- ✅ **Mitigation:** Store transaction IDs on-chain for permanent reference

**mem0 Memory Layer (AI Agent Memory):**
- ⚠️ **Backup required** - Self-hosted PostgreSQL database
- **Backup Strategy:**
  - **Primary:** Daily PostgreSQL dumps to Arweave (via Turbo SDK)
  - **Frequency:** 1x daily at 2am UTC (low-traffic period)
  - **Retention:** 30 days on Arweave (~$0.50/month for ~5MB daily dumps)
  - **Recovery:** Restore from latest Arweave backup via `pg_restore`
- **Implementation:**
  - Cron job: `0 2 * * * /scripts/backup-mem0-to-arweave.sh`
  - Script: `pg_dump mem0_production | gzip | turbo upload --tags backup:mem0,date:$(date +%Y-%m-%d)`
  - Recovery: Download from Arweave, decompress, `pg_restore`
- **Recovery Time Objective:** <2 hours (download from Arweave + restore)
- **Recovery Point Objective:** <24 hours (daily backups)

**Configuration Backups:**
- Git repository serves as backup for all configs
- Environment variables documented in `.env.example`
- Deployment scripts in version control

---
