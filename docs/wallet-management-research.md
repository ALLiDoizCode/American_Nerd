

 # Multi-Chain Wallet Management Research
**Comprehensive Analysis for AI Node Operator Infrastructure**

---

**Document Version:** 1.0
**Date:** October 7, 2025
**Author:** SlopMachine Architecture Team
**Status:** Final

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Research Context](#research-context)
3. [Wallet Architecture Patterns](#wallet-architecture-patterns)
4. [Multi-Chain SDK Evaluation](#multi-chain-sdk-evaluation)
5. [Key Management & Security](#key-management--security)
6. [Cost Tracking Implementation](#cost-tracking-implementation)
7. [Balance Monitoring & Auto-Replenishment](#balance-monitoring--auto-replenishment)
8. [Production Implementation Roadmap](#production-implementation-roadmap)
9. [Risk Analysis](#risk-analysis)
10. [Recommendations](#recommendations)
11. [References](#references)

---

## Executive Summary

### Research Objective

Identify production-ready multi-chain wallet management architectures for AI node operators running decentralized infrastructure (Arweave/Turbo + Akash Network) that require managing both **SOL** (for Arweave uploads) and **AKT** (for Akash deployments) tokens with appropriate security, automation, and cost transparency.

### Key Findings

**✅ RECOMMENDED ARCHITECTURE: Tiered One-Wallet-Per-Node with Hot/Warm/Cold Security**

1. **Wallet Architecture:** Hybrid tiered model with one deployment wallet per node + centralized treasury
   - **Hot wallets** (per-node): Automated deployments with limited funds ($100 max)
   - **Warm wallet** (platform): Auto-refill operations with monitoring
   - **Cold storage** (treasury): Main fund reserves with hardware wallet security

2. **Multi-Chain SDKs:** Use separate, native libraries for each blockchain
   - **Solana:** `@solana/web3.js` (official, mature, extensive ecosystem)
   - **Cosmos/Akash:** `@cosmjs/stargate` + `@cosmjs/proto-signing` (official Cosmos SDK)
   - **Arweave:** `@ardrive/turbo-sdk` (managed upload service with cost tracking)

3. **Key Management:** GitHub Actions Secrets for MVP, HashiCorp Vault for production
   - **MVP (Phase 1):** GitHub Actions encrypted secrets (acceptable for <$100 hot wallets)
   - **Production (Phase 2-3):** HashiCorp Vault or AWS KMS for enhanced security
   - **Key Rotation:** Every 6 months or on security event

4. **Cost Tracking:** Hybrid on-chain + off-chain PostgreSQL database
   - On-chain: Query transaction history via RPC (Solana `getSignaturesForAddress`, Cosmos RPC)
   - Off-chain: PostgreSQL with cost attribution schema (node_id, project_id, tx_hash, amounts)
   - Integration: Real-time cost logging during deployments

5. **Balance Monitoring:** Automated threshold-based alerts with Discord/Slack webhooks
   - **SOL threshold:** Alert when < 0.1 SOL (~$20 at current prices)
   - **AKT threshold:** Alert when < 10 AKT (~$30 at current prices)
   - **Check frequency:** Every 5 minutes during active deployments, hourly otherwise

### Implementation Complexity

- **Estimated effort:** 6 dev-weeks (assuming TypeScript expertise, basic crypto knowledge)
- **Phase 1 (MVP):** 2 weeks - Basic wallet operations + GitHub Secrets
- **Phase 2 (Automation):** 2 weeks - Balance monitoring + cost tracking
- **Phase 3 (Advanced):** 2 weeks - Auto-refill + tiered security + reporting

### Cost Implications

- **Wallet management overhead:** ~$5/month (monitoring infrastructure, RPC calls)
- **Transaction fees:**
  - Solana: ~$0.00025 per transaction (negligible)
  - Akash: ~$0.01-0.05 per transaction (minimal)
- **Total monthly cost (60 frontends + 40 backends):** ~$280-290/month
  - Arweave uploads: ~$40/month
  - Akash backends: ~$240/month
  - Wallet management: ~$5/month

---

## Research Context

### SlopMachine Marketplace Architecture

**SlopMachine** is a fully autonomous AI agent marketplace where AI nodes:

- Deploy user-built projects to **Arweave** (frontends) + **Akash Network** (backends)
- **Pay deployment costs as operating expenses** from their earnings
- Require **SOL** for Arweave Turbo SDK uploads (~$0.09 per 10MB frontend)
- Require **AKT** for Akash Network compute resources ($3-5/month per backend)
- Operate autonomously (no human intervention for deployments)
- Need **transparent cost tracking** (deployment costs deducted from node earnings)

### Current Production Scale (Estimated)

| Resource Type | Count | Monthly Cost |
|---------------|-------|--------------|
| Production Frontends (Arweave) | 60 | $41 |
| Production Backends (Akash) | 40 | $240 |
| AI Worker Nodes (Akash) | 50 | $150 |
| **Total** | **150** | **$431** |

### Critical Requirements

1. **Security:** Protect hot wallet keys for automated deployments
2. **Automation:** Seamless SOL/AKT spending during CI/CD pipelines (GitHub Actions)
3. **Cost Tracking:** Per-deployment cost attribution (which node spent what)
4. **Balance Monitoring:** Auto-alerts when wallet balances run low
5. **Multi-chain:** Unified interface for SOL and AKT token management
6. **Self-custody:** Node operators control their own keys (no centralized custody)

---

## Wallet Architecture Patterns

### Pattern Comparison Matrix

| Architecture Pattern | Security | Automation | Cost Tracking | Scalability | Complexity | Best For |
|---------------------|----------|------------|---------------|-------------|------------|----------|
| **One-Wallet-Per-Node** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Distributed risk, autonomous nodes |
| **Pooled Treasury** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | Centralized platforms |
| **Tiered (Cold→Warm→Hot)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | High-value deployments |
| **MPC Wallet** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise custody |

### 1. One-Wallet-Per-Node Architecture

**Description:** Each AI node has its own SOL and AKT wallets for deployments.

**Diagram:**
```
┌─────────────────────────────────────────────────────┐
│                Treasury (Cold Storage)               │
│  ┌──────────────┐         ┌──────────────┐         │
│  │ SOL Treasury │         │ AKT Treasury │         │
│  │  (Hardware)  │         │  (Hardware)  │         │
│  └──────┬───────┘         └──────┬───────┘         │
└─────────┼──────────────────────────┼────────────────┘
          │                          │
          │ Manual Refill            │ Manual Refill
          ▼                          ▼
┌─────────────────────────────────────────────────────┐
│                   Node Wallets                       │
│  ┌──────────────────────┐  ┌──────────────────────┐│
│  │ Node 1 (Alex AI)     │  │ Node 2 (Betty AI)    ││
│  │ • SOL: 0.5 ($100)    │  │ • SOL: 0.5 ($100)    ││
│  │ • AKT: 33 ($100)     │  │ • AKT: 33 ($100)     ││
│  └──────────────────────┘  └──────────────────────┘│
│                                                      │
│           ▼ Deploy Arweave    ▼ Deploy Akash       │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ **Distributed risk:** Single wallet compromise affects only one node
- ✅ **Perfect cost attribution:** Direct mapping of costs to nodes
- ✅ **Easy accounting:** Separate wallets = separate accounting
- ✅ **Scalable:** Add nodes = add wallets (linear scaling)

**Cons:**
- ❌ **Management overhead:** N nodes = 2N wallets (SOL + AKT per node)
- ❌ **Capital inefficiency:** Funds locked per wallet (can't pool liquidity)
- ❌ **Refill complexity:** Must monitor and refill N wallets individually

**Implementation:**
```typescript
// Each node loads its own wallets from environment
const solWallet = loadSolanaKeypairFromEnv('NODE_ALEX_SOL_WALLET');
const aktWallet = loadCosmosWalletFromEnv('NODE_ALEX_AKT_WALLET');

// Deploy with node-specific wallet
const result = await deployArweave(solWallet, {
  nodeId: 'alex-architect-ai',
  projectId: 'proj-123'
});
```

**Cost Tracking:**
```sql
-- Direct attribution
SELECT node_id, SUM(amount_sol) FROM costs GROUP BY node_id;
```

---

### 2. Pooled Treasury Architecture

**Description:** Single SOL and AKT wallet for all deployments, shared across nodes.

**Diagram:**
```
┌─────────────────────────────────────────────────────┐
│             Shared Treasury Wallets                  │
│  ┌──────────────┐         ┌──────────────┐         │
│  │ Shared SOL   │         │ Shared AKT   │         │
│  │ Wallet       │         │ Wallet       │         │
│  │ (All Nodes)  │         │ (All Nodes)  │         │
│  └──────┬───────┘         └──────┬───────┘         │
└─────────┼──────────────────────────┼────────────────┘
          │                          │
          └──────────┬───────────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  Deployment Engine  │
          │  • Track node_id    │
          │  • Track project_id │
          │  • Log all spends   │
          └─────────────────────┘
```

**Pros:**
- ✅ **Simple management:** Only 2 wallets (SOL + AKT)
- ✅ **Capital efficient:** Pool all funds, minimize idle capital
- ✅ **Easy refill:** Single point for funding

**Cons:**
- ❌ **Single point of failure:** Wallet compromise affects all nodes
- ❌ **Complex cost attribution:** Must track node_id in metadata
- ❌ **Accounting complexity:** Requires detailed transaction logging
- ❌ **Not self-custody:** Nodes don't control their own funds

**Implementation:**
```typescript
// Platform-wide wallet
const sharedSolWallet = loadSolanaKeypairFromEnv('PLATFORM_SOL_WALLET');

// Must track node_id manually
await deployArweave(sharedSolWallet, {
  nodeId: 'alex-architect-ai', // ← Manual tracking required
  projectId: 'proj-123'
});
```

**Cost Tracking:**
```sql
-- Requires metadata in every transaction record
SELECT node_id, SUM(amount_sol)
FROM costs
WHERE metadata->>'node_id' = 'alex-architect-ai';
```

---

### 3. Tiered Security Architecture (RECOMMENDED)

**Description:** Three-tier system (cold → warm → hot) balancing security and automation.

**Diagram:**
```
┌───────────────────────────────────────────────────────┐
│  TIER 1: Cold Storage (Hardware Wallet)               │
│  ┌────────────────────────────────────────────────┐  │
│  │  Treasury: SOL 500 + AKT 10,000                │  │
│  │  Security: Hardware wallet (Ledger/Trezor)     │  │
│  │  Access: Manual, multi-sig approval required   │  │
│  └────────────────────────┬───────────────────────┘  │
└────────────────────────────┼──────────────────────────┘
                             │ Manual → Warm (monthly)
                             ▼
┌───────────────────────────────────────────────────────┐
│  TIER 2: Warm Wallet (Auto-Refill Service)           │
│  ┌────────────────────────────────────────────────┐  │
│  │  Balance: SOL 10 + AKT 500                     │  │
│  │  Purpose: Auto-refill hot wallets               │  │
│  │  Security: Encrypted secrets, rate-limited      │  │
│  │  Max daily spend: $500                          │  │
│  └────────────────────────┬───────────────────────┘  │
└────────────────────────────┼──────────────────────────┘
                             │ Automated → Hot (threshold)
                             ▼
┌───────────────────────────────────────────────────────┐
│  TIER 3: Hot Wallets (Per-Node Deployment)           │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Node Alex        │  │ Node Betty       │         │
│  │ SOL: 0.5 ($100)  │  │ SOL: 0.5 ($100)  │         │
│  │ AKT: 33 ($100)   │  │ AKT: 33 ($100)   │         │
│  │ Max: $100 total  │  │ Max: $100 total  │         │
│  └──────────────────┘  └──────────────────┘         │
│           ▼ Deploy                ▼ Deploy           │
└───────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ **Best security:** Majority of funds in cold storage
- ✅ **Automation-friendly:** Hot wallets enable CI/CD deployments
- ✅ **Controlled blast radius:** Hot wallet compromise ≤ $100 loss
- ✅ **Cost attribution:** Per-node hot wallets enable direct tracking

**Cons:**
- ❌ **Complex setup:** Requires 3-tier infrastructure
- ❌ **Warm wallet risk:** Auto-refill wallet is semi-vulnerable
- ❌ **Higher dev effort:** ~6 dev-weeks vs. 2-3 for simpler approaches

**Implementation Phases:**

**Phase 1: Hot Wallets Only (MVP)**
```typescript
// Each node has limited-fund hot wallet
const hotWallet = await initializeDeploymentWallet(
  'NODE_ALEX_SOL_WALLET',
  0.1 // Minimum 0.1 SOL required
);
```

**Phase 2: Add Balance Monitoring**
```typescript
// Alert when balance low
await monitorWallets({
  solana: [hotWallet.publicKey],
  thresholds: { sol: 0.1 }
}, alertConfig);
```

**Phase 3: Add Auto-Refill (Warm Wallet)**
```typescript
// Warm wallet auto-refills hot wallet when < threshold
if (hotWalletBalance < 0.1) {
  await refillFromWarmWallet(hotWallet.publicKey, 0.5); // Refill to 0.5 SOL
}
```

---

### 4. MPC Wallet Architecture

**Description:** Multi-Party Computation wallets with threshold signatures (advanced).

**Diagram:**
```
┌───────────────────────────────────────────────────────┐
│           MPC Wallet (Threshold 2-of-3)               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │ Key Share 1│  │ Key Share 2│  │ Key Share 3│     │
│  │ (Platform) │  │ (Node Op)  │  │ (Backup)   │     │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘     │
│         └────────────────┴────────────────┘           │
│                  ▼ Any 2 of 3 required                │
│            Transaction Signing                        │
└───────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ **Enterprise-grade security:** No single point of key compromise
- ✅ **Flexible custody:** Shared control between platform + node operator
- ✅ **No single key exposure:** Private key never assembled in full

**Cons:**
- ❌ **High complexity:** Requires MPC infrastructure (Fireblocks, Sepior, etc.)
- ❌ **Cost:** Enterprise MPC solutions = $5,000-50,000/year
- ❌ **Limited blockchain support:** Not all chains support MPC patterns
- ❌ **Overkill for SlopMachine:** $100 hot wallets don't justify MPC overhead

**Verdict:** ❌ **NOT RECOMMENDED** for SlopMachine (cost/complexity exceeds benefit)

---

### ✅ RECOMMENDATION: Tiered One-Wallet-Per-Node

**Rationale:**

1. **Security:** Hot wallets limited to $100 (acceptable risk), cold storage for treasury
2. **Cost Attribution:** Direct node → wallet mapping (simplest accounting)
3. **Automation:** Per-node wallets in GitHub Actions secrets (seamless CI/CD)
4. **Scalability:** Linear scaling (N nodes = N hot wallets)
5. **Pragmatic:** Balances security, automation, and implementation effort

**Decision:** Start with Phase 1 (hot wallets only), add monitoring (Phase 2) and auto-refill (Phase 3) iteratively.

---

## Multi-Chain SDK Evaluation

### SDK Comparison Matrix

| SDK | Chains Supported | Node.js Support | CI/CD Friendly | Cost Tracking | Maturity | Community |
|-----|------------------|-----------------|----------------|---------------|----------|-----------|
| **@solana/web3.js** | Solana | ✅ Yes | ✅ Yes | Manual (RPC) | ⭐⭐⭐⭐⭐ (5+ years) | 50k+ stars |
| **@cosmjs/stargate** | Cosmos SDK (Akash, Cosmos Hub, etc.) | ✅ Yes | ✅ Yes | Manual (RPC) | ⭐⭐⭐⭐ (3+ years) | 5k+ stars |
| **@ardrive/turbo-sdk** | Arweave (via Turbo service) | ✅ Yes | ✅ Yes | ✅ Built-in APIs | ⭐⭐⭐ (1+ year) | Active |
| **WalletConnect** | Multi-chain (70+) | ⚠️ Browser-focused | ❌ Not for backend | N/A | ⭐⭐⭐⭐ | 10k+ stars |
| **Web3Auth** | Multi-chain (40+) | ⚠️ Embedded wallets | ⚠️ Not for CI/CD | N/A | ⭐⭐⭐ | Emerging |

### 1. Solana Web3.js

**Official Documentation:** https://solana.com/docs/clients/javascript

**Key Features:**
- Create, load, and manage Solana keypairs
- Sign and send transactions
- Query account balances and transaction history
- RPC connection management

**Production Readiness:** ⭐⭐⭐⭐⭐ (Mature, battle-tested)

**Code Example:**
```typescript
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

// Load wallet from environment (GitHub Actions secret)
const privateKey = process.env.DEPLOYMENT_WALLET;
const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));

// Check balance
const connection = new Connection('https://api.mainnet-beta.solana.com');
const balance = await connection.getBalance(keypair.publicKey);
console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

// Query transaction history for cost tracking
const signatures = await connection.getSignaturesForAddress(
  keypair.publicKey,
  { limit: 100 }
);
```

**Cost Tracking:** Query on-chain history with `getSignaturesForAddress()` + `getParsedTransaction()`

**Verdict:** ✅ **RECOMMENDED** - Official, mature, perfect for Solana/Arweave deployments

---

### 2. CosmJS (Cosmos SDK)

**Official Documentation:** https://cosmos.github.io/cosmjs/

**Key Features:**
- `DirectSecp256k1HdWallet` for mnemonic-based wallets
- Offline signing for automation
- Transaction broadcasting and fee estimation
- Akash Network compatible (Cosmos SDK chain)

**Production Readiness:** ⭐⭐⭐⭐ (Mature, official Cosmos library)

**Code Example:**
```typescript
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';

// Load wallet from mnemonic (GitHub Actions secret)
const mnemonic = process.env.AKASH_WALLET_MNEMONIC;
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: 'akash'
});

const [account] = await wallet.getAccounts();
console.log(`Akash address: ${account.address}`);

// Check balance
const client = await SigningStargateClient.connectWithSigner(
  'https://rpc.akash.forbole.com:443',
  wallet
);

const balance = await client.getBalance(account.address, 'uakt');
console.log(`Balance: ${parseInt(balance.amount) / 1_000_000} AKT`);
```

**Cost Tracking:** Query Cosmos RPC for transaction history by address

**Verdict:** ✅ **RECOMMENDED** - Official Cosmos SDK library, Akash Network compatible

---

### 3. Arweave Turbo SDK

**Official Documentation:** https://docs.ardrive.io/docs/turbo/turbo-sdk/

**Key Features:**
- **Multi-wallet support:** Solana, Arweave JWK, Ethereum signers
- **Cost estimation APIs:** `getWincForFiat()`, `getUploadCosts()`
- **Upload tracking:** Progress callbacks, transaction IDs
- **Credit management:** Check balance, top-up, monitor credits

**Production Readiness:** ⭐⭐⭐ (Newer, but actively maintained by ArDrive team)

**Code Example:**
```typescript
import { TurboFactory } from '@ardrive/turbo-sdk/node';
import { Keypair } from '@solana/web3.js';

// Create Turbo client with Solana signer
const solanaKeypair = Keypair.fromSecretKey(/* ... */);
const turbo = TurboFactory.authenticated({
  signer: new ArweaveSigner(solanaKeypair.secretKey)
});

// Check balance
const { winc } = await turbo.getBalance();
console.log(`Turbo Credits: ${winc} winc`);

// Estimate upload cost
const [{ winc: cost }] = await turbo.getUploadCosts({ bytes: [1024000] });
console.log(`Cost for 1MB: ${cost} winc`);

// Upload with cost tracking
const { id: txId } = await turbo.uploadFile({
  fileStreamFactory: () => fs.createReadStream('./dist/index.html'),
  fileSizeFactory: () => 1024000,
  dataItemOpts: {
    tags: [
      { name: 'Node-ID', value: 'alex-architect-ai' },
      { name: 'Project-ID', value: 'proj-123' }
    ]
  }
});

console.log(`Uploaded: https://arweave.net/${txId}`);
```

**Cost Tracking:** ✅ Built-in via `getUploadCosts()` + Turbo credit balance monitoring

**Verdict:** ✅ **RECOMMENDED** - Best option for Arweave uploads with cost tracking

---

### 4. Unified Multi-Chain Solutions

**WalletConnect, Web3Auth, Particle Network, etc.**

**Analysis:**
- ❌ **Browser-focused:** Designed for dApp wallet connections, not backend automation
- ❌ **CI/CD incompatible:** Require user interaction (wallet popups, approvals)
- ⚠️ **Embedded wallets:** Some support serverless, but add complexity
- ⚠️ **Vendor lock-in:** Platform-dependent (not self-custody)

**Verdict:** ❌ **NOT RECOMMENDED** - Use native SDKs for backend automation

---

### ✅ FINAL SDK RECOMMENDATION

**Use separate, native libraries:**

1. **Solana:** `@solana/web3.js` (keypair management, RPC queries)
2. **Cosmos/Akash:** `@cosmjs/stargate` + `@cosmjs/proto-signing`
3. **Arweave:** `@ardrive/turbo-sdk` (managed uploads with cost APIs)

**Rationale:**
- Native SDKs = best performance, features, and community support
- No unified multi-chain solution fits backend automation needs
- Complexity of managing 3 SDKs < complexity of adapting unsuitable solutions

---

## Key Management & Security

### Security Threat Model

| Threat | Likelihood | Impact | Mitigation |
|--------|------------|--------|------------|
| **GitHub Actions secret leak** | Medium | High ($100 max per wallet) | Limit hot wallet funds, rotate keys regularly |
| **Compromised CI/CD pipeline** | Low | High | Use GitHub OIDC, restrict workflow permissions |
| **Developer machine compromise** | Medium | Medium | Never store production keys on dev machines |
| **Supply chain attack (npm package)** | Low | Critical | Use lockfiles, audit dependencies, Snyk scans |
| **Insider threat** | Low | High | Multi-sig for treasury, audit logs |

### Key Storage Solutions Comparison

| Solution | Cost | Security | Automation | Learning Curve | SlopMachine Fit |
|----------|------|----------|------------|----------------|-----------------|
| **GitHub Actions Secrets** | Free | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (MVP) |
| **HashiCorp Vault** | $$ ($300-1000/mo) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ (Production) |
| **AWS KMS** | $ ($50-200/mo) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ (Cloud-native) |
| **Hardware Wallet (Ledger)** | $ (one-time $150) | ⭐⭐⭐⭐⭐ | ⭐ (manual) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ (Treasury) |

### Recommended Approach: Phased Security

**Phase 1 (MVP): GitHub Actions Secrets**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Arweave

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy Frontend
        env:
          DEPLOYMENT_WALLET: ${{ secrets.DEPLOYMENT_WALLET_SOL }}
        run: |
          npm run deploy:arweave
```

**Pros:**
- ✅ Free, built-in to GitHub
- ✅ Encrypted at rest (AES-256)
- ✅ Perfect for CI/CD automation
- ✅ No additional infrastructure needed

**Cons:**
- ⚠️ Secrets accessible to anyone with repo write access
- ⚠️ No key rotation automation
- ⚠️ Limited audit logging

**Best Practices:**
1. ✅ Limit hot wallet funds ($100 max)
2. ✅ Rotate secrets every 6 months
3. ✅ Use repository-level secrets (not organization-wide)
4. ✅ Enable 2FA for all GitHub accounts with repo access
5. ✅ Monitor for unusual deployment activity

---

**Phase 2 (Production): HashiCorp Vault**

```typescript
// Load secrets from Vault instead of environment
import Vault from 'node-vault';

const vault = Vault({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

const { data } = await vault.read('secret/data/wallets/alex-ai');
const solWallet = loadWalletFromBase58(data.data.solana_private_key);
```

**Pros:**
- ✅ Enterprise-grade security
- ✅ Dynamic secrets (short-lived credentials)
- ✅ Detailed audit logs
- ✅ Key rotation automation
- ✅ Secret versioning

**Cons:**
- ❌ Additional infrastructure ($300-1000/mo)
- ❌ Steeper learning curve
- ❌ Requires DevOps expertise

**When to Upgrade:**
- When managing >$10,000 in hot wallets
- When regulatory compliance required
- When serving enterprise customers

---

**Phase 3 (Treasury): Hardware Wallet**

```typescript
// For treasury management (cold storage)
// Use hardware wallet (Ledger/Trezor) for manual transactions
// Example: Monthly refill of warm wallet from treasury

// 1. Connect Ledger
// 2. Manually approve transaction
// 3. Transfer SOL/AKT to warm wallet
```

**Pros:**
- ✅ Maximum security (offline signing)
- ✅ Industry standard for large holdings
- ✅ One-time cost ($150)

**Cons:**
- ❌ Manual operation (no automation)
- ❌ Physical device management

**Use Case:** Treasury wallet (main fund reserves), not for deployment automation

---

### Key Rotation Strategy

**Frequency:**
- **Hot wallets:** Every 6 months OR on security event
- **Warm wallet:** Every 3 months
- **Treasury:** Annually OR on suspicious activity

**Process:**
1. Generate new wallet
2. Update GitHub Actions secret / Vault
3. Transfer remaining funds from old → new wallet
4. Archive old wallet (for transaction history)
5. Update database with new wallet addresses

**Automation:**
```typescript
// Automated key rotation script (run quarterly)
async function rotateDeploymentWallet(nodeId: string) {
  // 1. Generate new wallet
  const newWallet = generateSolanaWallet();

  // 2. Get old wallet balance
  const oldWallet = loadWalletFromEnv('DEPLOYMENT_WALLET');
  const balance = await getBalance(oldWallet.publicKey);

  // 3. Transfer all funds to new wallet
  await transferAllFunds(oldWallet, newWallet.publicKey);

  // 4. Update secret (manual step - notify admin)
  console.log(`New wallet private key (update GitHub secret):`);
  console.log(getBase58PrivateKey(newWallet));

  // 5. Update database
  await updateNodeWalletAddress(nodeId, newWallet.publicKey.toBase58());
}
```

---

### Security Checklist

**✅ Pre-Launch Security Audit**

- [ ] Private keys stored in encrypted secrets (not plain text)
- [ ] Hot wallet funds limited to $100 per wallet
- [ ] GitHub Actions workflows use minimal permissions
- [ ] All repo contributors have 2FA enabled
- [ ] Treasury keys stored in hardware wallet (cold storage)
- [ ] Key rotation schedule defined (6 months)
- [ ] Monitoring alerts configured (Discord/Slack)
- [ ] Transaction logging enabled (all deployments)
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled (quarterly)

---

## Cost Tracking Implementation

### Architecture: Hybrid On-Chain + Off-Chain

**Philosophy:** Query on-chain for source of truth, store off-chain for fast queries

**Diagram:**
```
┌─────────────────────────────────────────────────────────┐
│                  ON-CHAIN (Source of Truth)              │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │ Solana Blockchain│         │ Cosmos Blockchain│     │
│  │ • TX: 5x7abc...  │         │ • TX: ABC123...  │     │
│  │ • Amount: 0.0012 │         │ • Amount: 0.5AKT │     │
│  └────────┬─────────┘         └────────┬─────────┘     │
└───────────┼──────────────────────────────┼──────────────┘
            │                              │
            │ Query via RPC                │
            ▼                              ▼
┌─────────────────────────────────────────────────────────┐
│             OFF-CHAIN (PostgreSQL Database)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ deployment_costs                                  │  │
│  │ • tx_hash: 5x7abc...                             │  │
│  │ • chain: solana                                  │  │
│  │ • node_id: alex-architect-ai                     │  │
│  │ • project_id: proj-123                           │  │
│  │ • amount_native: 0.0012 SOL                      │  │
│  │ • amount_usd: 0.24 USD                           │  │
│  │ • created_at: 2025-10-07 14:32:10               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Fast Queries: SUM(), GROUP BY, Date ranges, etc.       │
└─────────────────────────────────────────────────────────┘
```

### Database Schema

**See:** `docs/examples/cost-attribution-queries.sql`

**Key Tables:**
1. `nodes` - AI node metadata (node_id, solana_address, akash_address)
2. `projects` - User project metadata (project_id, owner_id)
3. `deployments` - Deployment records (deployment_id, node_id, project_id, type)
4. `deployment_costs` - Cost records (tx_hash, chain, amount_native, amount_usd, node_id, project_id)
5. `arweave_uploads` - Arweave-specific details (tx_id, file_size, cost_winc)
6. `akash_deployments` - Akash-specific details (dseq, lease_id, cpu, memory, storage, cost_per_block)

### Cost Attribution Flow

**1. Arweave Upload Cost Tracking:**

```typescript
import { TurboFactory } from '@ardrive/turbo-sdk/node';

async function uploadWithCostTracking(
  turbo: any,
  filePath: string,
  config: { nodeId: string, projectId: string }
) {
  // 1. Estimate cost before upload
  const stats = fs.statSync(filePath);
  const [{ winc: estimatedCost }] = await turbo.getUploadCosts({
    bytes: [stats.size]
  });

  // 2. Upload file
  const { id: txId } = await turbo.uploadFile({
    fileStreamFactory: () => fs.createReadStream(filePath),
    fileSizeFactory: () => stats.size,
    dataItemOpts: {
      tags: [
        { name: 'Node-ID', value: config.nodeId },
        { name: 'Project-ID', value: config.projectId }
      ]
    }
  });

  // 3. Calculate actual cost (SOL)
  const costSol = wincToSol(estimatedCost);
  const costUsd = costSol * await getSolPriceUsd();

  // 4. Store in database
  await db.insertDeploymentCost({
    deployment_id: `deploy-${Date.now()}`,
    node_id: config.nodeId,
    project_id: config.projectId,
    chain: 'solana',
    tx_hash: txId,
    amount_native: costSol,
    amount_usd: costUsd,
    deployment_type: 'arweave-frontend'
  });

  await db.insertArweaveUpload({
    tx_id: txId,
    arweave_url: `https://arweave.net/${txId}`,
    file_size_bytes: stats.size,
    cost_winc: estimatedCost,
    cost_sol: costSol,
    cost_usd: costUsd
  });

  return { txId, costSol, costUsd };
}
```

**2. Akash Deployment Cost Tracking:**

```typescript
async function deployAkashWithCostTracking(
  wallet: DirectSecp256k1HdWallet,
  sdlPath: string,
  config: { nodeId: string, projectId: string }
) {
  // 1. Parse SDL and estimate cost
  const resourceSpecs = parseSDL(sdlPath);
  const estimate = estimateDeploymentCost(resourceSpecs, 30);

  // 2. Deploy to Akash
  const dseq = await deployToAkash(wallet, sdlPath);

  // 3. Get lease info (price per block)
  const lease = await getLeaseInfo(dseq, address);
  const actualCostAkt = calculateLeaseCost(
    parseInt(lease.price),
    30 // days
  );
  const actualCostUsd = actualCostAkt * await getAktPriceUsd();

  // 4. Store in database
  await db.insertDeploymentCost({
    deployment_id: `deploy-${dseq}`,
    node_id: config.nodeId,
    project_id: config.projectId,
    chain: 'akash',
    tx_hash: `akash-${dseq}`,
    amount_native: actualCostAkt,
    amount_usd: actualCostUsd,
    deployment_type: 'akash-backend'
  });

  await db.insertAkashDeployment({
    dseq,
    lease_id: lease.leaseId,
    cpu_units: resourceSpecs.cpu,
    memory_mb: resourceSpecs.memory,
    storage_gb: resourceSpecs.storage,
    cost_per_block: parseInt(lease.price),
    total_cost_akt: actualCostAkt,
    total_cost_usd: actualCostUsd,
    lease_start: new Date(),
    lease_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  return { dseq, costAkt: actualCostAkt, costUsd: actualCostUsd };
}
```

### Cost Attribution Queries

**See:** `docs/examples/cost-attribution-queries.sql`

**Key Queries:**

**Q1: Total costs per node (all chains)**
```sql
SELECT
  n.node_id,
  n.node_name,
  COUNT(DISTINCT dc.deployment_id) as total_deployments,
  SUM(CASE WHEN dc.chain = 'solana' THEN dc.amount_native ELSE 0 END) as total_sol_spent,
  SUM(CASE WHEN dc.chain = 'akash' THEN dc.amount_native ELSE 0 END) as total_akt_spent,
  SUM(dc.amount_usd) as total_usd_spent
FROM nodes n
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
GROUP BY n.node_id, n.node_name
ORDER BY total_usd_spent DESC;
```

**Q2: Monthly operating expenses (node's total spend)**
```sql
SELECT
  n.node_id,
  SUM(dc.amount_usd) as total_operating_expenses_usd
FROM nodes n
LEFT JOIN deployment_costs dc ON n.node_id = dc.node_id
WHERE dc.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY n.node_id
ORDER BY total_operating_expenses_usd DESC;
```

**Q3: Cost efficiency (Arweave: cost per MB)**
```sql
SELECT
  n.node_id,
  COUNT(au.upload_id) as total_uploads,
  SUM(au.file_size_bytes) / 1024.0 / 1024.0 as total_mb_uploaded,
  SUM(au.cost_usd) as total_cost_usd,
  (SUM(au.cost_usd) / NULLIF(SUM(au.file_size_bytes) / 1024.0 / 1024.0, 0)) as cost_per_mb_usd
FROM nodes n
JOIN deployment_costs dc ON n.node_id = dc.node_id
JOIN arweave_uploads au ON dc.cost_id = au.cost_id
GROUP BY n.node_id
ORDER BY cost_per_mb_usd ASC;
```

### On-Chain Verification (Audit Trail)

**Solana Transaction History:**
```typescript
import { Connection } from '@solana/web3.js';

async function auditSolanaTransactions(address: PublicKey) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  // Get last 1000 transactions
  const signatures = await connection.getSignaturesForAddress(address, {
    limit: 1000
  });

  for (const sig of signatures) {
    const tx = await connection.getParsedTransaction(sig.signature);

    // Extract cost information
    const fee = tx.meta.fee / LAMPORTS_PER_SOL;
    const timestamp = tx.blockTime;

    // Verify against database
    const dbRecord = await db.getCostByTxHash(sig.signature);
    if (!dbRecord) {
      console.warn(`⚠️ Transaction ${sig.signature} not in database!`);
    }
  }
}
```

**Cosmos/Akash Transaction History:**
```typescript
import { StargateClient } from '@cosmjs/stargate';

async function auditAkashTransactions(address: string) {
  const client = await StargateClient.connect(
    'https://rpc.akash.forbole.com:443'
  );

  // Query transaction history (requires indexing service)
  // Cosmos RPC doesn't provide built-in tx history by address
  // Use Mintscan API or run own indexer

  const response = await fetch(
    `https://api.mintscan.io/v1/akash/account/${address}/transactions`
  );
  const transactions = await response.json();

  for (const tx of transactions) {
    // Verify against database
    const dbRecord = await db.getCostByTxHash(tx.txhash);
    if (!dbRecord) {
      console.warn(`⚠️ Transaction ${tx.txhash} not in database!`);
    }
  }
}
```

---

## Balance Monitoring & Auto-Replenishment

**See:** `docs/examples/wallet-balance-monitor.ts`

### Monitoring Architecture

**Diagram:**
```
┌─────────────────────────────────────────────────────────┐
│            Balance Monitoring Cron Job                   │
│                (Every 5 minutes)                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 1. Check all hot wallet balances               │    │
│  │ 2. Compare against thresholds                   │    │
│  │ 3. Send alerts if low                           │    │
│  │ 4. Log balance snapshot                         │    │
│  └────────────────────────────────────────────────┘    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ If balance < threshold
┌─────────────────────────────────────────────────────────┐
│                  Alert Channels                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Discord  │  │  Slack   │  │  Email   │              │
│  │ Webhook  │  │ Webhook  │  │  SMTP    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼ Manual or automated
┌─────────────────────────────────────────────────────────┐
│             Refill Process (Phase 3)                     │
│  ┌────────────────────────────────────────────────┐    │
│  │ Warm wallet auto-transfers to hot wallet       │    │
│  │ Amount: Refill to target balance (0.5 SOL)     │    │
│  │ Limits: Max $500/day auto-refill               │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Alert Thresholds

| Chain | Token | Threshold | Target Refill | Rationale |
|-------|-------|-----------|---------------|-----------|
| Solana | SOL | 0.1 SOL | 0.5 SOL | ~100 Arweave uploads per refill |
| Akash | AKT | 10 AKT | 50 AKT | ~10 backend deployments per refill |

### Monitoring Implementation

**Phase 1: Manual Alerts**

```typescript
// Cron job (runs every 5 minutes during deployments)
import { monitorAllWallets } from './wallet-balance-monitor';

const wallets = {
  solana: [
    new PublicKey('alex-ai-wallet-address'),
    new PublicKey('betty-ai-wallet-address')
  ],
  akash: [
    'akash1abc...',
    'akash1xyz...'
  ]
};

const config = {
  discordWebhook: process.env.DISCORD_WEBHOOK,
  solThreshold: 0.1,
  aktThreshold: 10,
  alertCooldown: 3600000 // 1 hour between alerts
};

// Run monitoring
await monitorAllWallets(wallets, config);
```

**Alert Output (Discord):**
```
⚠️ Low Wallet Balance Alert

Chain: SOLANA
Address: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Balance: 0.08 SOL
Status: 🔴 Below Threshold (0.1 SOL)

Action Required: Refill wallet to 0.5 SOL
```

**Phase 2: Automated Refill (Production)**

```typescript
async function autoRefillHotWallet(
  warmWallet: Keypair, // Warm wallet with funds
  hotWalletAddress: PublicKey,
  targetBalance: number = 0.5
) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  // 1. Check current balance
  const currentBalance = await getBalance(hotWalletAddress);

  if (currentBalance >= 0.1) {
    console.log(`✅ Balance OK: ${currentBalance} SOL`);
    return;
  }

  // 2. Calculate refill amount
  const refillAmount = targetBalance - currentBalance;

  console.log(`🔄 Auto-refilling ${refillAmount} SOL to ${hotWalletAddress.toBase58()}`);

  // 3. Send transaction from warm → hot
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: warmWallet.publicKey,
      toPubkey: hotWalletAddress,
      lamports: refillAmount * LAMPORTS_PER_SOL
    })
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [warmWallet]
  );

  console.log(`✅ Refilled: ${refillAmount} SOL`);
  console.log(`   TX: https://solscan.io/tx/${signature}`);

  // 4. Log refill in database
  await db.insertWalletRefill({
    from_wallet: warmWallet.publicKey.toBase58(),
    to_wallet: hotWalletAddress.toBase58(),
    amount_sol: refillAmount,
    tx_hash: signature,
    timestamp: Date.now()
  });
}
```

### Auto-Refill Safety Controls

**Daily Spending Limits:**
```typescript
async function canAutoRefill(hotWalletAddress: PublicKey): Promise<boolean> {
  // Check daily refill limit
  const today = new Date().toISOString().split('T')[0];
  const dailyRefills = await db.getRefillsToday(
    hotWalletAddress.toBase58(),
    today
  );

  const totalToday = dailyRefills.reduce((sum, r) => sum + r.amount_sol, 0);
  const maxDailyRefill = 10; // Max 10 SOL per day (~$2000)

  if (totalToday >= maxDailyRefill) {
    console.error(`🚫 Daily refill limit reached: ${totalToday} SOL`);
    await sendAdminAlert(`Daily refill limit reached for ${hotWalletAddress.toBase58()}`);
    return false;
  }

  return true;
}
```

**Anomaly Detection:**
```typescript
async function detectAnomalousSpending(
  nodeId: string
): Promise<boolean> {
  // Get average daily spend (last 30 days)
  const avgDailySpend = await db.getAverageDailySpend(nodeId, 30);

  // Get today's spend
  const todaySpend = await db.getTodaySpend(nodeId);

  // Alert if today > 3x average
  if (todaySpend > avgDailySpend * 3) {
    console.warn(`⚠️ Anomalous spending detected for ${nodeId}`);
    console.warn(`   Average: $${avgDailySpend.toFixed(2)}/day`);
    console.warn(`   Today: $${todaySpend.toFixed(2)}`);

    await sendAdminAlert(
      `Anomalous spending: ${nodeId} spent $${todaySpend.toFixed(2)} today (avg: $${avgDailySpend.toFixed(2)})`
    );

    return true;
  }

  return false;
}
```

---

## Production Implementation Roadmap

### Phase 1: MVP (Weeks 1-2)

**Goal:** Basic wallet operations + cost tracking + GitHub Actions integration

**Tasks:**
- [ ] Implement Solana wallet functions (create, load, balance check)
- [ ] Implement Cosmos wallet functions (create, load, balance check)
- [ ] Integrate Turbo SDK for Arweave uploads
- [ ] Create PostgreSQL database schema
- [ ] Build cost tracking functions (insert deployment costs)
- [ ] Set up GitHub Actions secrets
- [ ] Test end-to-end: wallet → deploy → cost logging

**Deliverables:**
- ✅ `solana-wallet-create.ts` - Solana wallet utilities
- ✅ `cosmos-wallet-create.ts` - Cosmos/Akash wallet utilities
- ✅ `arweave-upload-cost-tracking.ts` - Arweave upload with costs
- ✅ `cost-attribution-queries.sql` - Database schema + queries
- ✅ GitHub Actions workflow for automated deployments

**Effort:** 2 dev-weeks (1 developer)

---

### Phase 2: Automation (Weeks 3-4)

**Goal:** Balance monitoring + alerts + cost reporting dashboard

**Tasks:**
- [ ] Build balance monitoring cron job (5-minute intervals)
- [ ] Implement Discord/Slack webhook alerts
- [ ] Create wallet balance snapshot logging
- [ ] Build cost attribution queries (per-node, per-project)
- [ ] Create admin dashboard for wallet overview
- [ ] Implement cost reporting API

**Deliverables:**
- ✅ `wallet-balance-monitor.ts` - Multi-chain balance monitoring
- ✅ Cron job scheduler (GitHub Actions or dedicated server)
- ✅ Admin dashboard (simple React app or Retool)
- ✅ Cost reports (daily, weekly, monthly summaries)

**Effort:** 2 dev-weeks (1 developer)

---

### Phase 3: Advanced (Weeks 5-6)

**Goal:** Tiered security + auto-refill + comprehensive reporting

**Tasks:**
- [ ] Implement warm wallet auto-refill logic
- [ ] Add daily spending limits + anomaly detection
- [ ] Set up hardware wallet for treasury (cold storage)
- [ ] Build key rotation automation
- [ ] Integrate with node earnings system (deduct costs from payouts)
- [ ] Create comprehensive cost analytics

**Deliverables:**
- ✅ Auto-refill system with safety controls
- ✅ Tiered security architecture (cold → warm → hot)
- ✅ Key rotation scripts
- ✅ Node earnings integration (costs deducted from earnings)
- ✅ Advanced analytics (cost efficiency, forecasting)

**Effort:** 2 dev-weeks (1 developer)

---

### Total Effort: 6 Dev-Weeks

**Assumptions:**
- Developer has TypeScript expertise
- Developer has basic blockchain/crypto knowledge
- Database infrastructure (PostgreSQL) already exists
- GitHub Actions infrastructure already set up

**Risk Factors:**
- Learning curve for Cosmos SDK (1-2 days)
- Akash Network CLI integration complexity (2-3 days)
- Hardware wallet setup for treasury (1 day)

---

## Risk Analysis

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Turbo SDK API changes** | Medium | Medium | Pin SDK version, monitor releases |
| **Akash Network RPC downtime** | Medium | High | Use multiple RPC endpoints, fallback logic |
| **Solana RPC rate limits** | High | Medium | Use paid RPC providers (Helius, QuickNode) |
| **Database corruption (cost data)** | Low | High | Daily backups, WAL archiving |
| **GitHub Actions secret leak** | Medium | Medium | Limit hot wallet funds, rotate keys |

### Financial Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Hot wallet drained (attack)** | Medium | Medium ($100 max) | Limited funds per wallet, monitoring |
| **SOL/AKT price volatility** | High | Medium | Hedge with stablecoins, adjust thresholds |
| **Unexpected deployment costs** | Medium | Low | Pre-deployment cost estimates, alerts |
| **Auto-refill bugs (overspending)** | Low | High | Daily spending limits, anomaly detection |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Developer key rotation mistakes** | Medium | Medium | Automated rotation scripts, documentation |
| **Alert fatigue (too many notifications)** | High | Low | Alert cooldowns, threshold tuning |
| **Database query performance** | Medium | Medium | Proper indexing, query optimization |
| **Monitoring downtime** | Low | Medium | Redundant monitoring (Datadog, UptimeRobot) |

---

## Recommendations

### ✅ Recommended Architecture

**Tiered One-Wallet-Per-Node:**
- Hot wallets ($100 max) for per-node deployments
- Warm wallet for auto-refill operations
- Cold storage (hardware wallet) for treasury

**Rationale:** Best balance of security, automation, and cost attribution

### ✅ Recommended SDKs

1. **Solana:** `@solana/web3.js`
2. **Cosmos/Akash:** `@cosmjs/stargate` + `@cosmjs/proto-signing`
3. **Arweave:** `@ardrive/turbo-sdk`

**Rationale:** Native SDKs offer best performance, features, and support

### ✅ Recommended Key Management

- **Phase 1 (MVP):** GitHub Actions Secrets
- **Phase 2 (Production):** HashiCorp Vault or AWS KMS
- **Treasury:** Hardware Wallet (Ledger/Trezor)

**Rationale:** Phased approach balances speed-to-market with security

### ✅ Recommended Monitoring

- **Balance checks:** Every 5 minutes during active deployments
- **Alerts:** Discord/Slack webhooks
- **Thresholds:** SOL < 0.1, AKT < 10

**Rationale:** Real-time monitoring prevents deployment failures

### ✅ Recommended Implementation Timeline

- **Phase 1 (MVP):** Weeks 1-2
- **Phase 2 (Automation):** Weeks 3-4
- **Phase 3 (Advanced):** Weeks 5-6

**Total:** 6 dev-weeks

---

## References

### Official Documentation

1. **Solana Web3.js:** https://solana.com/docs/clients/javascript
2. **CosmJS:** https://cosmos.github.io/cosmjs/
3. **Turbo SDK:** https://docs.ardrive.io/docs/turbo/turbo-sdk/
4. **Akash Network:** https://akash.network/docs/
5. **GitHub Actions Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets
6. **HashiCorp Vault:** https://developer.hashicorp.com/vault

### Community Resources

7. **Solana Stack Exchange:** https://solana.stackexchange.com/
8. **Cosmos Hub Forum:** https://forum.cosmos.network/
9. **Akash Discord:** https://discord.akash.network/
10. **Web3 Infrastructure Security:** https://blog.gitguardian.com/talking-about-data-security-an-introduction-to-aws-kms-and-hashicorp-vault/

### Code Examples

11. **Solana Wallet Examples:** `docs/examples/solana-wallet-create.ts`
12. **Cosmos Wallet Examples:** `docs/examples/cosmos-wallet-create.ts`
13. **Arweave Upload Examples:** `docs/examples/arweave-upload-cost-tracking.ts`
14. **Akash Deploy Examples:** `docs/examples/akash-deploy-cost-tracking.ts`
15. **Balance Monitor Examples:** `docs/examples/wallet-balance-monitor.ts`
16. **Database Schema:** `docs/examples/cost-attribution-queries.sql`

---

**End of Research Document**
