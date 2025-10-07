# Akash Network Decision Brief

**Date:** October 7, 2025
**Project:** SlopMachine Infrastructure
**Decision:** Infrastructure Platform Selection
**Status:** 🟡 RECOMMENDATION PENDING APPROVAL

---

## Executive Summary

**Recommendation: ⚠️ HYBRID APPROACH**

Use Vercel/Netlify for user-facing frontends + Akash Network for backend services (APIs, databases, AI worker nodes).

**Key Decision Points:**

| Aspect | Finding | Impact |
|--------|---------|--------|
| **Cost Savings** | 70-85% cheaper than AWS/Railway | ✅ $145-$615/month savings |
| **Preview URLs** | ❌ Not supported | 🚨 BLOCKER for frontends |
| **SSL Setup** | ⚠️ Requires Cloudflare | ⚠️ Added complexity |
| **Reliability** | ⚠️ No SLA published | ⚠️ Risk for user-facing |
| **Tech Support** | ✅ Docker, all stacks | ✅ Suitable for backend |

**Bottom Line:** Akash is excellent for cost-effective backend hosting but unsuitable for user-facing deployments requiring preview URLs (SlopMachine's core "slop or ship" feature).

---

## The Decision

### What We're Deciding

**Question:** Should SlopMachine use Akash Network as primary deployment infrastructure?

**Options:**
1. **All Akash** - Migrate everything to Akash
2. **Hybrid** - Vercel/Netlify for frontends, Akash for backends
3. **No Akash** - Stick with Vercel + Railway entirely

**Recommended:** **Option 2 - Hybrid Approach**

---

## Why Hybrid?

### The Critical Blocker: Preview URLs

**SlopMachine's Core UX:**
```
AI builds project → Token holders watch LIVE → Vote "slop or ship"
                    ↓
              REQUIRES PREVIEW URLs
```

- Vercel/Netlify: ✅ Automatic preview URL per PR (`pr-123.vercel.app`)
- Akash: ❌ No native preview URL support

**Conclusion:** Frontends MUST stay on Vercel/Netlify.

### Where Akash Shines: Backend Services

**AI Worker Nodes (50 nodes):**
- Akash: $17-$100/month
- Railway: $250-$500/month
- **Savings: 67-80%**

**APIs + Databases (20 services):**
- Akash: $35/month
- Railway: $150-$600/month
- **Savings: 77-94%**

**Backend services don't need preview URLs** → Perfect for Akash.

---

## Architecture Comparison

### Option 1: All Cloud (Current Plan)

```
Vercel (Frontends) → $100-$200/mo
Railway (APIs + DBs + Workers) → $350-$720/mo
────────────────────────────────────────────
TOTAL: $450-$920/month
```

**Pros:**
- ✅ Simple, proven stack
- ✅ Excellent DX
- ✅ Reliable (99.99% uptime)

**Cons:**
- ❌ Expensive at scale
- ❌ Centralized infrastructure

### Option 2: Hybrid (Recommended)

```
Vercel (Frontends) → $100-$200/mo
Akash (APIs + DBs + Workers) → $85/mo
────────────────────────────────────────────
TOTAL: $185-$285/month
```

**Pros:**
- ✅ 32-67% cost savings ($165-$635/mo)
- ✅ Decentralized backend (aligns with Solana)
- ✅ Preview URLs for frontends (Vercel)
- ✅ Cost-effective backend hosting (Akash)

**Cons:**
- ⚠️ More complex (two platforms)
- ⚠️ Akash learning curve
- ⚠️ No SLA for backend services

### Option 3: All Akash

```
Akash (Everything) → $85-$185/mo
```

**Pros:**
- ✅ Maximum cost savings (70-85%)
- ✅ Fully decentralized

**Cons:**
- 🚨 **No preview URLs** → Breaks "slop or ship" UX
- ❌ Complex SSL setup (Cloudflare workaround)
- ❌ No reliability SLA
- ❌ High operational burden

**Verdict: NOT VIABLE** for SlopMachine due to preview URL requirement.

---

## Cost Analysis

### Hybrid Approach Savings

**Month 5 Scale (50 AI nodes, 100 user projects):**

| Component | All-Cloud | Hybrid (Recommended) | Savings |
|-----------|-----------|----------------------|---------|
| Frontends (Vercel) | $100-$200 | $100-$200 | $0 |
| AI Nodes | $250-$500 | **$50** | **$200-$450** |
| APIs + DBs | $150-$600 | **$35** | **$115-$565** |
| **TOTAL** | **$500-$1300** | **$185-$285** | **$215-$1015** |

**Annual Savings: $2,580-$12,180**

**Caveat:** Does not include engineering time to implement Akash (estimate: 2-4 weeks = $10k-$40k one-time).

**ROI:** Break-even in 1-4 months if costs exceed $500/month.

---

## Risks & Mitigations

### Risk 1: Akash Provider Outages

**Risk:** Backend service goes down if Akash provider fails.

**Impact:** Medium (backend only, not user-facing frontend)

**Mitigation:**
- Deploy critical services to multiple providers
- Implement health monitoring and auto-failover
- Accept brief downtime for non-critical services

### Risk 2: No SLA/Uptime Guarantee

**Risk:** Akash has no published SLA (compare to Vercel 99.99%).

**Impact:** Medium (backend services less critical than frontends)

**Mitigation:**
- Only use Akash for backend services (not user-facing)
- Keep frontends on Vercel (proven reliability)
- Implement robust monitoring and alerting

### Risk 3: Complexity Overhead

**Risk:** Managing two platforms increases operational burden.

**Impact:** Medium (team must learn Akash + maintain two systems)

**Mitigation:**
- Build deployment abstractions (DevOps AI agent)
- Document runbooks and playbooks
- Invest in Akash training (1-2 weeks)

### Risk 4: AKT Token Price Volatility

**Risk:** If AKT price increases, compute costs increase (pricing in AKT).

**Impact:** Low-Medium (current AKT = $1.05, would need 2-3x increase to negate savings)

**Mitigation:**
- Monitor AKT price trends
- Budget for 2-3x price increase buffer
- Diversify to stablecoins if needed

### Risk 5: SSL/Security Concerns

**Risk:** Secrets in SDL files are visible to providers.

**Impact:** High if sensitive secrets exposed

**Mitigation:**
- Never put sensitive secrets in SDL
- Use external secrets manager (Vault, Doppler)
- Rotate secrets regularly
- Use least-privilege API keys

---

## Implementation Plan

### Phase 1: MVP on Traditional Cloud (Months 1-3)

**Focus:** Ship product fast, validate PMF

**Infrastructure:**
- Vercel for all frontends
- Railway for all backends
- **Don't prematurely optimize for cost**

**Rationale:** Speed > cost in early stage.

---

### Phase 2: Akash PoC (Month 4)

**Goal:** Validate Akash for backend workloads

**Deploy to Akash:**
1. 1 AI worker node (Node.js, 512MB RAM, 24/7)
2. 1 API + PostgreSQL (persistent storage)

**Test for 30 days:**
- ✅ Uptime > 99.5%
- ✅ API latency < 200ms
- ✅ Cost < $5/month (vs. $10-$20 Railway)
- ✅ No data loss or corruption
- ✅ Deployment automation works via GitHub Actions

**Success Criteria:**
- [ ] All tests pass → Proceed to production migration
- [ ] Any test fails → Stick with Railway

**Budget:** $20 (10 AKT tokens for escrow + testing)

**Timeline:** 4 weeks (2 weeks setup + 2 weeks monitoring)

---

### Phase 3: Production Migration (Months 5-6)

**If PoC successful:**

**Week 1-2: Build Automation**
- Create Akash deployment module (TypeScript)
- Create GitHub Actions workflows
- Set up Cloudflare automation for DNS/SSL

**Week 3-4: Migrate AI Nodes**
- Deploy 5 nodes to Akash (pilot)
- Monitor for 1 week
- Deploy remaining 45 nodes
- Decommission Railway nodes

**Week 5-6: Migrate APIs + Databases**
- Deploy 1 API + DB to Akash (pilot)
- Split traffic 10/90 (Akash/Railway)
- Gradually increase to 100% Akash
- Decommission Railway APIs/DBs

**Week 7-8: Monitoring & Optimization**
- Set up Grafana on Akash for monitoring
- Document incident response playbook
- Train team on Akash operations

**Timeline:** 8 weeks (2 months)

---

### Phase 4: Optimization (Month 7+)

**Multi-Provider Redundancy:**
- Deploy critical services to 2-3 providers
- Set up load balancing and auto-failover

**Cost Optimization:**
- Track provider pricing over time
- Migrate to cheaper providers when available

**Automation Enhancements:**
- Auto-renew leases before expiration
- Auto-failover if provider unhealthy

---

## Decision Matrix

### Use Akash IF:

- ✅ Backend service (not user-facing frontend)
- ✅ No preview URL requirement
- ✅ 24/7 long-running workload (cost-effective)
- ✅ Team has DevOps expertise
- ✅ Can tolerate brief downtime (99.5% vs. 99.99%)

**Examples:**
- AI worker nodes ✅
- Backend APIs ✅
- Databases ✅
- Background job queues ✅

### Use Vercel/Railway IF:

- ✅ User-facing frontend
- ✅ Requires preview URLs per PR
- ✅ Needs 99.99% uptime
- ✅ Prioritize developer experience
- ✅ Low traffic (Vercel Hobby free tier)

**Examples:**
- Marketing site ✅
- Marketplace frontend ✅
- User project deployments ✅
- Auth service ✅

---

## Key Metrics to Track

### During PoC (Month 4)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Uptime | > 99.5% | TBD | 🟡 |
| API Latency | < 200ms | TBD | 🟡 |
| Cost per node | < $5/mo | TBD | 🟡 |
| Deployment success rate | > 95% | TBD | 🟡 |
| Provider outages | 0 | TBD | 🟡 |
| Data loss incidents | 0 | TBD | 🟡 |

### After Migration (Months 5-6)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cost savings | > $200/mo | Monthly infrastructure bill |
| Backend uptime | > 99.5% | UptimeRobot |
| MTTR (Mean Time to Recovery) | < 30 min | Incident logs |
| Deployment failures | < 5% | GitHub Actions logs |
| Developer satisfaction | > 7/10 | Team survey |

---

## Open Questions

### Technical

1. **Can Akash handle sudden traffic spikes?**
   - Need to test auto-scaling capabilities
   - May require manual provider lease adjustments

2. **How does backup/restore work for Akash databases?**
   - Persistent storage is provider-tied
   - Need robust backup strategy (pg_dump to S3)

3. **Can we achieve < 100ms API latency on Akash?**
   - Depends on provider hardware and network
   - May need to choose premium providers

### Operational

4. **Who manages Akash deployments (DevOps AI agent or humans)?**
   - Ideal: Fully automated via DevOps agent
   - Reality: Likely hybrid (agent + human oversight)

5. **What's the incident response plan if Akash provider goes down?**
   - Need documented playbook
   - Consider multi-provider redundancy

6. **How do we handle Akash wallet security (private keys)?**
   - GitHub Secrets for CI/CD
   - Hardware wallet for production funds?

### Business

7. **Is the engineering time investment worth the cost savings?**
   - Estimate: 2-4 weeks (1 engineer) = $10k-$40k one-time
   - ROI: Break-even in 1-4 months at $200-$1000/mo savings

8. **What if Akash Network shuts down or pivots?**
   - Low risk (operational since 2020, growing ecosystem)
   - Mitigation: Standard Docker containers = easy migration

---

## Recommendation Summary

### ✅ APPROVED: Hybrid Approach

**Implement:**
1. Use Vercel/Netlify for frontends (preview URLs critical)
2. Run Akash PoC in Month 4 (validate backend hosting)
3. Migrate backends to Akash if PoC successful (Months 5-6)
4. Expect 32-67% infrastructure cost savings ($165-$635/month)

### ❌ REJECTED: All-Akash Approach

**Reason:** No preview URLs → Breaks "slop or ship" user experience

### ⏸️ DEFERRED: All-Cloud Approach

**Reason:** Significantly more expensive (70-85% higher costs) without commensurate benefits

**Re-evaluate if:**
- Akash PoC fails
- Team lacks bandwidth for Akash complexity
- Cost savings < $200/month (not worth effort)

---

## Next Steps

### Immediate (This Week)

1. **Review this decision brief with team** ✅
2. **Get approval on hybrid approach** 🟡
3. **Document decision in PRD** 🟡

### Month 1-3 (MVP Development)

4. **Build on Vercel + Railway** (traditional cloud)
5. **Focus on shipping product fast**
6. **Defer Akash implementation**

### Month 4 (PoC)

7. **Set up Akash account and wallet**
8. **Deploy 1 worker node + 1 API to Akash**
9. **Monitor for 30 days, evaluate success criteria**
10. **Go/No-Go decision for production migration**

### Month 5-6 (Migration, if PoC passes)

11. **Build Akash deployment automation**
12. **Migrate AI worker nodes to Akash**
13. **Migrate APIs and databases to Akash**
14. **Monitor, optimize, document**

---

## Approval

**Recommended By:** Claude (Infrastructure Research)
**Date:** October 7, 2025

**Approved By:** _____________________
**Date:** _____________________

**Notes:**
- [ ] Approved as-is (Hybrid approach)
- [ ] Approved with modifications (specify below)
- [ ] Rejected (provide reasoning)

**Modifications/Reasoning:**

---

---

## Appendix: Quick Reference

### Akash Pros
- ✅ 70-85% cost savings vs. traditional cloud
- ✅ Decentralized (aligns with Solana philosophy)
- ✅ Docker support (any tech stack)
- ✅ Persistent storage (databases)
- ✅ 24/7 workloads (ideal for AI nodes)
- ✅ GitHub Actions integration

### Akash Cons
- ❌ No preview URLs (blocker for frontends)
- ❌ No automatic SSL (requires Cloudflare)
- ❌ No SLA/uptime guarantees
- ❌ Steeper learning curve
- ❌ More complex deployment workflow
- ❌ Provider reliability variance

### When to Use Akash
- Backend APIs ✅
- Databases ✅
- AI worker nodes ✅
- Background jobs ✅
- Cost-sensitive workloads ✅

### When NOT to Use Akash
- User-facing frontends ❌
- Requires preview URLs ❌
- Needs 99.99% uptime ❌
- Team lacks DevOps skills ❌
- Low traffic (free tiers better) ❌

---

**End of Decision Brief**
