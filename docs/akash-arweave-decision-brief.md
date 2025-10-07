# Decision Brief: Arweave + Akash Network for SlopMachine Infrastructure

**Date:** October 7, 2025
**Author:** Claude Code (Autonomous Research Agent)
**Status:** ✅ Research Complete - Awaiting Team Decision

---

## Executive Summary

### Recommendation: 🎯 **HYBRID APPROACH** (Recommended) + **PROCEED WITH POC**

**Bottom Line**: Adopt **Akash Network for production backends + AI worker nodes** ($910/month savings) + **Arweave for production frontends only** ($41/month) + **Keep Vercel/Railway for staging environments** ($0-50/month).

**Total Hybrid Cost**: ~$480/month vs. $1,300/month centralized = **63% cost savings** ($820/month)

---

## Quick Decision Matrix

| Question | Answer | Impact |
|----------|--------|--------|
| Can Arweave replace Vercel for frontends? | ✅ YES (production only) | $41/month + permanent storage |
| Can Arweave handle preview URLs? | ❌ NO (too expensive) | Use Vercel Free for staging |
| Can Akash replace Railway for backends? | ✅ YES (production) | $910/month savings ✅ |
| Can Akash handle preview URLs? | ❌ NO (requires custom tooling) | Use Railway for staging |
| Is it worth the complexity? | ✅ YES (63% savings + decentralization) | But requires 10 dev-weeks migration |

---

## The Opportunity

**Cost Savings (Annual)**:
- Year 1: **$8,428** (after $2K migration costs)
- Year 2+: **$10,428/year**
- 3-Year Total: **$29,284**

**Strategic Benefits**:
- ✅ Fully blockchain-native stack (Arweave + Akash + Solana)
- ✅ Permanent, censorship-resistant frontend hosting
- ✅ No vendor lock-in (standard Docker containers)
- ✅ Decentralized infrastructure aligns with SlopMachine's philosophy

---

## The Blockers

### Critical Issues

1. **Arweave Preview URL Costs** ⚠️ SOLVABLE
   - **Problem**: Each PR deployment costs $0.07 (vs. Vercel free)
   - **Solution**: Use Vercel Free Tier for staging, Arweave for production

2. **Akash No Native Preview URLs** ⚠️ SOLVABLE
   - **Problem**: No automatic branch-based preview URLs (breaks "slop or ship" model)
   - **Solution**: Use Railway for staging, Akash for production

3. **Implementation Complexity** ⚠️ MANAGEABLE
   - **Problem**: Crypto wallets, SDL files, manual DNS setup
   - **Solution**: Build deployment abstractions (DevOps AI handles complexity)

**None of these are BLOCKERS** - all have proven workarounds.

---

## Detailed Cost Breakdown

### Hybrid Architecture Costs (Month 5 Scale)

| Component | Platform | Monthly Cost | Annual Cost |
|-----------|----------|--------------|-------------|
| **60 Production Frontends** | Arweave (2 deploys/week) | $41 | $492 |
| **60 Staging Frontends** | Vercel Free Tier | $0 | $0 |
| **40 Production Backends** | Akash (APIs + DBs) | $240 | $2,880 |
| **40 Staging Backends** | Railway (ephemeral) | ~$30 | $360 |
| **50 AI Worker Nodes** | Akash | $150 | $1,800 |
| **TOTAL HYBRID** | - | **$461** | **$5,532** |

### Centralized Architecture Costs (Comparison)

| Component | Platform | Monthly Cost | Annual Cost |
|-----------|----------|--------------|-------------|
| **60 Frontends (prod + staging)** | Vercel Free | $0 | $0 |
| **40 Backends (prod + staging)** | Railway | $800 | $9,600 |
| **50 AI Worker Nodes** | Railway | $500 | $6,000 |
| **TOTAL CENTRALIZED** | - | **$1,300** | **$15,600** |

### Net Savings

- **Monthly**: $1,300 - $461 = **$839/month** ✅
- **Annual (Year 1)**: $15,600 - $5,532 - $2,000 (migration) = **$8,068** ✅
- **Annual (Year 2+)**: $15,600 - $5,532 = **$10,068** ✅

---

## Recommended Architecture

```
PRODUCTION (Decentralized):
├─ Frontends: Arweave + Turbo SDK
│  └─ Cost: $41/month (permanent hosting)
├─ Backends + Databases: Akash Network
│  └─ Cost: $240/month (76-83% cheaper than AWS)
└─ AI Worker Nodes: Akash Network
   └─ Cost: $150/month (24/7 uptime)

STAGING (Centralized):
├─ Frontends: Vercel Free Tier
│  └─ Cost: $0/month (unlimited preview URLs)
└─ Backends: Railway ephemeral environments
   └─ Cost: ~$30/month (short-lived PR environments)

TOTAL: ~$461/month (vs. $1,300 centralized)
```

---

## Technology Assessment

### Arweave (Frontend Hosting)

**What It Is**: Permanent decentralized storage with one-time payment model.

**Capabilities**:
- ✅ Next.js static export, React/Vue/Svelte SPAs
- ✅ Turbo SDK for automated deployments via GitHub Actions
- ✅ Permanent URLs (200+ year guarantee)
- ✅ Custom domains via CNAME or ArNS
- ❌ No SSR, serverless functions, or ISR (static-only)

**Cost Model**:
- **$0.006-0.008/MB** base storage cost
- **+23.4% Turbo SDK service fee**
- **Effective**: ~$0.086 per 10MB deployment
- **Example**: 10MB Next.js app × 8 deploys/month = **$0.69/month**

**Best Use Case**: Production frontends with low deployment frequency (weekly or less).

**NOT suitable for**: High-frequency deployments, preview URLs, SSR apps.

### Akash Network (Backend Hosting)

**What It Is**: Decentralized Docker container marketplace with reverse auction pricing.

**Capabilities**:
- ✅ Any Docker-based workload (Node.js, Python, Rust, Go)
- ✅ PostgreSQL, Redis, MongoDB with persistent storage (SSD/NVMe)
- ✅ 24/7 processes (APIs, AI worker nodes, cron jobs)
- ✅ Custom domains + SSL (via Cloudflare or Caddy)
- ❌ No automatic preview URLs (manual per-branch deployments)

**Cost Model**:
- **76-83% cheaper than AWS/GCP/Azure**
- **Reverse auction**: Providers bid for your workload
- **Example**: 500m CPU + 512Mi RAM = **~$3/month** (vs. $10-15 Railway)

**Best Use Case**: Production backends, AI worker nodes, databases (cost-sensitive, 24/7 uptime).

**NOT suitable for**: Teams without crypto expertise, apps requiring preview URLs.

---

## Critical Findings

### ✅ What Works

1. **Arweave for production frontends**: Permanent hosting, one-time cost, blockchain-native.
2. **Akash for backends + AI nodes**: **MASSIVE cost savings** ($910/month).
3. **Hybrid staging**: Vercel Free + Railway = $0 for unlimited preview URLs.
4. **DevOps automation**: Turbo SDK + Akash CLI = automatable (requires custom tooling).
5. **Full-stack integration**: Arweave frontend → Akash backend works (CORS config required).

### ❌ What Doesn't Work

1. **Arweave preview URLs**: Too expensive ($0.07/deploy × 1,800 staging deploys = $155/month).
2. **Akash preview URLs**: No native support (manual SDL per PR = complexity).
3. **Akash SLA**: No uptime guarantees (provider-dependent).

### 🎯 The Hybrid Solution

**Use decentralized infrastructure for production** (cost savings + permanence)
**Use centralized infrastructure for staging** (free preview URLs + fast iteration)

This gives us:
- ✅ **63% cost savings** ($820/month)
- ✅ **Free staging environments** (Vercel Free + Railway ephemeral)
- ✅ **Blockchain-native production** (Arweave + Akash + Solana)
- ✅ **Best of both worlds**

---

## Migration Plan

### Phase 1: Proof of Concept (2 weeks)

**Goal**: Validate Arweave + Akash with real SlopMachine workload.

**Deliverables**:
- [ ] Next.js app deployed to Arweave (permanent URL)
- [ ] Node.js API + PostgreSQL deployed to Akash (custom domain)
- [ ] AI worker node running 24/7 on Akash
- [ ] Full-stack integration (Arweave → Akash)
- [ ] GitHub Actions automation (build + deploy)
- [ ] Cost tracking (actual vs. estimates)

**Success Criteria**:
- All deployments successful
- Actual costs within 20% of estimates
- No critical performance issues (latency, uptime)
- Team comfortable with complexity

**Go/No-Go Decision**: After PoC, decide to proceed with full migration or stick with centralized.

### Phase 2: Gradual Rollout (10 weeks)

**Week 1**: Infrastructure setup (wallets, CLI, Cloudflare)
**Weeks 2-3**: Build deployment tooling (`@slopmachine/arweave-deployer`, `@slopmachine/akash-deployer`)
**Weeks 3-4**: Pilot with 3 projects (1 frontend, 1 backend, 1 full-stack)
**Weeks 5-8**: Migrate 10 projects/week (gradual rollout)
**Weeks 9-10**: Migrate remaining projects, decommission old infrastructure

**Total Effort**: ~10 dev-weeks (2.5 months of full-time work)

---

## Decision Framework

### ✅ PROCEED with Arweave + Akash IF:

- [ ] **Cost savings justify complexity** (63% savings = $10K/year)
- [ ] **Team has bandwidth** for 10 dev-weeks migration effort
- [ ] **Blockchain-native infrastructure** aligns with SlopMachine's mission
- [ ] **PoC succeeds** (all success criteria met)
- [ ] **Hybrid staging approach** is acceptable (Vercel/Railway for previews)

### ❌ REJECT Arweave + Akash IF:

- [ ] **Preview URL costs are non-negotiable** (must be free, must be automatic)
- [ ] **Team lacks crypto/blockchain expertise** (wallets, AKT tokens)
- [ ] **Predictable subscription costs preferred** over crypto volatility
- [ ] **PoC fails** (costs >50% higher, frequent downtime)
- [ ] **Migration effort too high** (team underwater with other priorities)

### ⚠️ REVISIT LATER IF:

- [ ] **Timing not right** (wait until Month 6+ for cost pressure)
- [ ] **Akash roadmap addresses preview URLs** (feature announced)
- [ ] **Arweave reduces upload costs** (Turbo SDK discounts)

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Arweave upload costs spiral with frequent deploys** | HIGH | Use Vercel Free for staging, limit Arweave to production |
| **Akash provider downtime (no SLA)** | MEDIUM | Multi-provider redundancy + health check failover |
| **Custom domain complexity (ArNS, DNS)** | MEDIUM | Use Cloudflare proxying (simpler than ArNS) |
| **AKT token volatility** | LOW | Buy AKT in bulk during dips, 76% savings buffer |
| **Team learning curve (crypto/SDL files)** | MEDIUM | Build deployment abstractions (DevOps AI hides complexity) |

---

## Key Metrics to Track (PoC)

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| **Arweave upload cost (10MB)** | <$0.10 | - | - |
| **Arweave upload time (10MB)** | <60s | - | - |
| **Akash API latency** | <200ms | - | - |
| **Akash monthly cost (API + DB)** | <$10 | - | - |
| **AI worker node uptime** | >99% (7 days) | - | - |
| **Total PoC cost** | <$20 (2 weeks) | - | - |

---

## Recommendation

### 🎯 **PROCEED WITH HYBRID APPROACH + POC**

**Why**:
1. **Massive cost savings**: $820/month ($10K+/year)
2. **Blockchain-native alignment**: Arweave + Akash + Solana = fully decentralized
3. **Proven workarounds**: Hybrid staging solves preview URL problem
4. **Low-risk PoC**: 2 weeks, <$20 to validate assumptions

**Next Steps**:
1. **Week 1**: Run 2-week PoC (see detailed plan in research doc)
2. **Week 3**: Go/No-Go decision based on PoC results
3. **Weeks 4-13**: Gradual migration (if PoC succeeds)
4. **Month 6**: Full production on Arweave + Akash

**Expected Outcome**: **63% infrastructure cost reduction** + **permanent, decentralized hosting** + **no vendor lock-in**.

---

## Questions for Team Discussion

1. **Cost vs. Complexity**: Is 63% savings worth 10 dev-weeks migration effort?
2. **Preview URLs**: Is hybrid staging acceptable (Vercel/Railway for staging, Arweave/Akash for production)?
3. **Crypto Expertise**: Does team have bandwidth to learn Arweave wallets, Akash SDL, AKT tokens?
4. **Risk Tolerance**: Comfortable with no-SLA infrastructure (Akash) if multi-provider redundancy?
5. **Timeline**: Can we allocate 2 weeks for PoC in current sprint?

---

## Additional Resources

- **Full Research Report**: `docs/decentralized-infrastructure-research.md` (20,000 words, all findings)
- **Code Examples**: `docs/examples/arweave-turbo-upload.ts`, `docs/examples/akash-deployment-api.yml`
- **PoC Plan**: See "Proof-of-Concept Recommendations" section in research doc

---

**Decision Needed By**: End of current sprint (to align with Epic 0: Infrastructure Bootstrap)

**Point of Contact**: Claude Code (for technical clarifications)

**Approval Required From**: Engineering Lead + Product Lead + CTO (infrastructure decision)
