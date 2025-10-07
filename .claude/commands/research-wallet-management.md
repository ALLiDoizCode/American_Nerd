# Multi-Chain Wallet Management Research Task

**Command:** `/research-wallet-management`
**Priority:** 🔴 CRITICAL - Node Operator Infrastructure
**Duration:** 3-5 days

---

## Objective

Identify and evaluate **production-ready multi-chain wallet management architectures** for AI node operators running decentralized infrastructure (Arweave/Turbo + Akash Network) that require managing both **SOL** (for Arweave uploads) and **AKT** (for Akash deployments) tokens with appropriate security, automation, and cost transparency.

## Context

**SlopMachine Marketplace** is a fully autonomous AI agent marketplace where AI nodes:
- Deploy user-built projects to **Arweave** (frontends) + **Akash Network** (backends)
- **Pay deployment costs as operating expenses** from their earnings
- Require **SOL** for Arweave Turbo SDK uploads (~$0.09 per 10MB frontend)
- Require **AKT** for Akash Network compute resources ($3-5/month per backend)
- Operate autonomously (no human intervention for deployments)
- Need **transparent cost tracking** (deployment costs deducted from node earnings)

**Current Architecture** (from `docs/akash-arweave-decision-brief.md`):
- 60 production frontends on Arweave ($41/month total)
- 40 production backends on Akash ($240/month total)
- 50 AI worker nodes on Akash ($150/month total)
- **Node operators need to manage wallets** for both chains

**Critical Requirements**:
1. **Security**: Protect hot wallet keys for automated deployments
2. **Automation**: Seamless SOL/AKT spending during CI/CD pipelines (GitHub Actions)
3. **Cost Tracking**: Per-deployment cost attribution (which node spent what)
4. **Balance Monitoring**: Auto-alerts when wallet balances run low
5. **Multi-chain**: Unified interface for SOL and AKT token management
6. **Self-custody**: Node operators control their own keys (no centralized custody)

---

## Research Questions

### PRIMARY QUESTIONS (Must Answer)

1. **What are the proven architecture patterns for managing hot wallets in automated deployment pipelines?**
   - How do Web3 infrastructure operators (e.g., The Graph, Livepeer, Chainlink) handle automated transactions?
   - What key management solutions balance security with automation needs?
   - How to secure private keys in CI/CD environments (GitHub Actions secrets, HashiCorp Vault, AWS KMS)?

2. **What multi-chain wallet SDKs/libraries support both Solana (SOL) and Cosmos (AKT) ecosystems?**
   - Can a single codebase manage both Solana keypairs and Cosmos/Keplr wallets?
   - What are the best TypeScript/Node.js libraries for Solana + Cosmos wallet operations?
   - Are there unified multi-chain wallet APIs (e.g., WalletConnect, Web3Auth) suitable for backend automation?

3. **How should wallet architecture differ for AI node operators vs. centralized platforms?**
   - **One wallet per node** (distributed risk) vs. **pooled treasury wallet** (centralized control)?
   - How to implement per-node wallet isolation while maintaining auditability?
   - What custody models allow nodes to "own" their wallets while platform tracks costs?

4. **What are best practices for cost tracking and attribution in multi-chain deployments?**
   - How to log per-deployment costs (Arweave transaction ID → SOL spent, Akash lease ID → AKT spent)?
   - What on-chain/off-chain hybrid approaches work for cost transparency?
   - How to attribute costs to specific nodes/projects for accounting?

5. **How to implement low-balance alerts and auto-replenishment for autonomous nodes?**
   - What threshold-based monitoring systems exist (e.g., alert when SOL < 0.1)?
   - Can wallets auto-refill from a treasury (cross-chain swaps, DEX integrations)?
   - What are security implications of auto-replenishment (flash loan attacks, price manipulation)?

6. **What are security trade-offs between hot wallets (automated) vs. cold storage (secure)?**
   - Should deployment wallets hold limited funds (e.g., $100 max) as blast radius control?
   - How to implement tiered security (cold treasury → warm refill wallet → hot deployment wallets)?
   - What monitoring/alerting detects compromised deployment wallets?

### SECONDARY QUESTIONS (Nice to Have)

7. **What are emerging multi-chain wallet standards relevant to this use case?**
   - ERC-4337 account abstraction (Solana equivalents?)
   - Multi-party computation (MPC) wallets for shared custody
   - Hardware wallet integration for high-value treasury operations

8. **How do existing decentralized infrastructure platforms handle multi-chain payments?**
   - Akash Network's own wallet/CLI patterns
   - Arweave bundlers (Turbo SDK) wallet management patterns
   - Cross-chain bridges for converting earnings (SOL → AKT or vice versa)

9. **What are cost optimization strategies for multi-chain wallet management?**
   - Batch Arweave uploads to reduce transaction fees
   - Akash lease renewal strategies to minimize AKT transaction overhead
   - When to use DEX swaps vs. holding native tokens

10. **What audit/compliance considerations exist for autonomous wallet operations?**
    - Transaction logging for tax/accounting purposes
    - Proof of expenditure for node operator reimbursements
    - On-chain transparency for token holder oversight

---

## Research Methodology

### Information Sources

**Primary Sources** (Prioritize):
1. **Solana Wallet Documentation**: Official Solana Web3.js docs, Keypair management
2. **Cosmos SDK Wallet Docs**: Keplr, CosmJS, Akash Network CLI wallet operations
3. **Arweave Turbo SDK Docs**: Wallet integration patterns, cost tracking APIs
4. **Web3 Infrastructure Case Studies**: The Graph, Livepeer, Chainlink node operator guides
5. **Security Best Practices**: OWASP crypto storage, HashiCorp Vault for secrets, AWS KMS

**Secondary Sources**:
6. Multi-chain wallet SDKs (WalletConnect, Particle Network, Magic, Web3Auth)
7. GitHub repositories of decentralized infrastructure tools (search: "akash wallet", "solana automated deployment")
8. Cryptocurrency key management whitepapers (Fireblocks, Coinbase Custody, BitGo)
9. DevOps security guides (storing secrets in CI/CD, GitHub Actions security)

**Tertiary Sources**:
10. Web3 developer communities (Solana Discord, Akash Discord, Reddit r/web3)
11. Technical blogs from infrastructure providers (Alchemy, QuickNode, Helius)

### Analysis Frameworks

1. **Security vs. Automation Trade-off Matrix**
   - Map solutions on axes: Security Level (cold → warm → hot) vs. Automation Capability (manual → semi-auto → full-auto)
   - Identify sweet spot for autonomous AI nodes

2. **Architecture Pattern Comparison**
   - **One-wallet-per-node** vs. **Pooled treasury** vs. **Hybrid tiered**
   - Evaluate on: Security, Cost tracking complexity, Scalability, Auditability

3. **Technology Stack Evaluation**
   - Compare wallet libraries/SDKs on:
     - Multi-chain support (SOL + AKT)
     - TypeScript/Node.js compatibility
     - CI/CD integration ease
     - Cost tracking/logging capabilities
     - Community adoption + maintenance status

4. **Cost-Benefit Analysis**
   - Calculate wallet management overhead costs (transaction fees, monitoring infrastructure)
   - Compare against deployment cost savings from decentralized infrastructure

### Data Requirements

- **Recency**: Prioritize 2024-2025 documentation (crypto moves fast)
- **Code Examples**: Must include working TypeScript/Node.js examples
- **Production Evidence**: Prefer solutions with public case studies or open-source implementations
- **Security Audits**: Highlight any third-party security audits for wallet solutions

---

## Expected Deliverables

### 1. Executive Summary (1-2 pages)

**Must Include**:
- **Recommended wallet architecture** (one-liner + diagram)
- **Top 3 wallet management solutions** (with pros/cons table)
- **Security posture assessment** (what attack vectors are mitigated)
- **Implementation complexity estimate** (dev-weeks, required expertise)
- **Cost implications** (monthly wallet management overhead)

**Key Questions Answered**:
- Should we use one wallet per node or pooled treasury?
- What's the best TypeScript library for Solana + Cosmos wallets?
- How do we secure hot wallet keys in GitHub Actions?
- What's the simplest cost tracking implementation?

### 2. Detailed Analysis

#### A. Wallet Architecture Patterns (Comparison)

**Format**: Table comparing 3-5 architecture patterns

| Pattern | Security | Automation | Cost Tracking | Scalability | Best For |
|---------|----------|------------|---------------|-------------|----------|
| One-wallet-per-node | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Distributed risk, autonomous nodes |
| Pooled treasury | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | Centralized platforms |
| Tiered (cold→warm→hot) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | High-value deployments |

**Include**:
- Detailed description of each pattern
- Security trade-offs
- Implementation complexity
- **Recommendation for SlopMachine** (with rationale)

#### B. Multi-Chain Wallet SDK Evaluation

**Must Evaluate**:
- **Solana Web3.js** (official Solana library)
- **CosmJS** (Cosmos SDK for JavaScript)
- **Akash CLI** (native Akash wallet operations)
- **Turbo SDK** (Arweave's managed upload service)
- **Unified solutions** (if any support both Solana + Cosmos)

**Comparison Table**:

| SDK | Chains Supported | Node.js Support | CI/CD Friendly | Cost Tracking | Maturity |
|-----|------------------|-----------------|----------------|---------------|----------|
| Solana Web3.js | SOL | ✅ | ✅ | Manual | ⭐⭐⭐⭐⭐ |
| CosmJS | Cosmos (AKT) | ✅ | ✅ | Manual | ⭐⭐⭐⭐ |
| ... | ... | ... | ... | ... | ... |

**Include**:
- Code examples (TypeScript) for each SDK
- Integration complexity assessment
- **Recommendation** (likely: use Solana Web3.js + CosmJS separately)

#### C. Key Management & Security Best Practices

**Must Cover**:
- **Where to store private keys** in CI/CD (GitHub Actions secrets, Vault, KMS)
- **Hot wallet funding limits** (e.g., max $100 per deployment wallet)
- **Key rotation strategies** (how often to regenerate deployment keys)
- **Monitoring & alerting** (detect anomalous spending, compromised wallets)
- **Backup & recovery** (cold storage backups, seed phrase management)

**Format**: Step-by-step security checklist + architecture diagram

#### D. Cost Tracking Implementation Guide

**Must Include**:
- **On-chain logging**: How to query Solana/Cosmos transaction history
- **Off-chain database**: Schema for storing deployment costs (table structure)
- **Attribution logic**: Map transaction hash → project ID → node ID
- **Reporting**: Sample queries for "How much did Node X spend in October?"

**Code Examples**:
```typescript
// Example: Query Solana transaction history for deployment wallet
const transactions = await connection.getSignaturesForAddress(deploymentWallet);

// Example: Store cost attribution in database
db.costs.insert({
  txHash: "5x7...",
  chain: "solana",
  amount: 0.0012, // SOL
  nodeId: "alex-architect-ai",
  projectId: "proj-123",
  deploymentType: "arweave-frontend",
  timestamp: Date.now()
});
```

#### E. Low-Balance Monitoring & Auto-Replenishment

**Must Cover**:
- **Balance check frequency** (every deployment? hourly cron?)
- **Alert thresholds** (e.g., SOL < 0.1, AKT < 10)
- **Notification channels** (email, Discord webhook, on-chain event)
- **Auto-refill options**:
  - Manual treasury transfer (safest)
  - Automated treasury → deployment wallet transfer (scripted)
  - DEX swap from treasury holdings (complex, risky)

**Decision Tree**: When to use manual vs. automated refills

#### F. Production Implementation Roadmap

**Phase 1: MVP (Week 1-2)**
- [ ] Set up Solana + Cosmos wallets (one per node)
- [ ] Store keys in GitHub Actions secrets
- [ ] Implement basic cost logging (transaction hash → database)
- [ ] Manual wallet funding (no auto-refill)

**Phase 2: Automation (Week 3-4)**
- [ ] Build balance monitoring cron job
- [ ] Implement low-balance alerts (Discord webhook)
- [ ] Add cost attribution (node ID → project ID mapping)
- [ ] Build admin dashboard for wallet overview

**Phase 3: Advanced (Week 5-6)**
- [ ] Implement tiered security (cold treasury → hot wallets)
- [ ] Add auto-refill from treasury (with spending limits)
- [ ] Build cost reporting API (per-node, per-project breakdowns)
- [ ] Integrate with node earnings system (deduct costs from payouts)

**Total Effort**: 6 dev-weeks (assumes TypeScript expertise, basic crypto knowledge)

### 3. Supporting Materials

#### A. Architecture Diagrams

**Diagram 1**: Recommended wallet architecture (cold → warm → hot)
**Diagram 2**: Cost tracking data flow (transaction → database → reporting)
**Diagram 3**: Auto-refill decision tree (balance check → alert → refill)

#### B. Code Examples

**Must Include**:
1. **Solana wallet creation** (TypeScript, using Web3.js)
2. **Cosmos wallet creation** (TypeScript, using CosmJS)
3. **Arweave upload with cost logging** (Turbo SDK + transaction tracking)
4. **Akash deployment with cost logging** (CLI wrapper + AKT tracking)
5. **Balance monitoring script** (cron job checking SOL + AKT balances)
6. **Cost attribution query** (SQL for "total spent by Node X")

#### C. Security Checklist

- [ ] Private keys stored in encrypted secrets manager (not plain text)
- [ ] Deployment wallets funded with limited amounts (<$100)
- [ ] Transaction monitoring alerts unusual spending patterns
- [ ] Cold storage backup of treasury keys (seed phrases offline)
- [ ] Key rotation schedule defined (e.g., every 6 months)
- [ ] Access logs for wallet operations (who triggered what transaction)

#### D. Comparison Matrix: Wallet Solutions

**Compare 5-10 solutions** (e.g., raw Web3.js vs. Fireblocks vs. AWS KMS vs. HashiCorp Vault)

| Solution | Cost | Security | Automation | Learning Curve | SlopMachine Fit |
|----------|------|----------|------------|----------------|-----------------|
| Solana Web3.js + GitHub Secrets | Free | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| HashiCorp Vault | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| ... | ... | ... | ... | ... | ... |

#### E. Reference Links

- Official docs for recommended SDKs
- GitHub repos with working examples
- Security audit reports (if applicable)
- Community forum discussions (Solana/Akash Discord)

---

## Success Criteria

This research successfully achieves its objectives if:

1. ✅ **Clear architecture recommendation** with rationale (one-wallet-per-node vs. pooled)
2. ✅ **Production-ready code examples** (copy-paste TypeScript for wallet operations)
3. ✅ **Security best practices** documented (key storage, funding limits, monitoring)
4. ✅ **Cost tracking implementation** specified (database schema + query examples)
5. ✅ **Implementation roadmap** with effort estimate (realistic dev-weeks)
6. ✅ **Risk mitigation strategies** for hot wallet compromise, low balances, etc.
7. ✅ **No blockers identified** (if multi-chain wallet management is infeasible, document why)

**Failure Modes to Avoid**:
- ❌ Generic "use a wallet SDK" advice (need specific recommendations)
- ❌ Missing code examples (theory without implementation)
- ❌ Ignoring security trade-offs (over-optimizing for automation)
- ❌ No cost tracking solution (critical for node accounting)

---

## Timeline and Priority

**Target Completion**: 3-5 days (research-intensive)

**Priority**: **HIGH** - Blocks Phase 2 implementation (Akash/Arweave integration requires wallet management architecture)

**Dependencies**:
- Must align with Epic 7: Infrastructure/DevOps AI Agent (Story 7.2 + 7.3)
- Informs node operator onboarding documentation
- Required for cost transparency (PRD v3.1 requirement)

**Next Steps After Research**:
1. Review findings with engineering team
2. Select wallet architecture + SDKs
3. Implement MVP (Phase 1) in Week 1-2 of migration
4. Test with PoC deployments (Arweave + Akash)

---

## Deliverables Output Location

- **Research summary**: `docs/wallet-management-research.md`
- **Decision brief**: `docs/wallet-management-decision-brief.md`
- **Code examples**:
  - `docs/examples/solana-wallet-create.ts`
  - `docs/examples/cosmos-wallet-create.ts`
  - `docs/examples/arweave-upload-cost-tracking.ts`
  - `docs/examples/akash-deploy-cost-tracking.ts`
  - `docs/examples/wallet-balance-monitor.ts`
  - `docs/examples/cost-attribution-queries.sql`
- **Architecture updates**: `docs/architecture.md` (add wallet management section)

---

## Notes

- This research is **CRITICAL** for autonomous AI node operations
- Node operators must be able to deploy without manual wallet interventions
- Cost transparency is a PRD requirement (v3.1: nodes pay deployment costs)
- Security is paramount (hot wallets in CI/CD are high-risk)
- Integration with Epic 7 (Infrastructure/DevOps AI Agent) stories 7.2 + 7.3
- Aligns with SlopMachine's decentralized philosophy (Solana + Arweave + Akash)
