# SOL to AKT Cross-Chain Swap Solutions Research Task

**Command:** `/research-sol-to-akt-swap-solutions`
**Priority:** 🟠 HIGH - Required for Node Operator Automation
**Duration:** 3-5 days

---

## Objective

Identify and evaluate **programmatic solutions** (APIs, SDKs, npm libraries, MCP servers) for automating cross-chain token swaps from **SOL** (Solana) to **AKT** (Akash Network) to enable:

1. **Automated node operator wallet management** - Auto-refilling AKT for Akash deployments when balances run low
2. **End-user payment flows** - Users pay in SOL, system converts portion to AKT for deployments

**Primary Decision**: Select the optimal technical solution for production implementation in a **Node.js/TypeScript environment** with **no KYC/fully decentralized** operations.

---

## Background Context

**Project**: Slop Machine - Decentralized AI marketplace using Solana (payments) + Akash Network (compute deployments)

**Technical Requirements**:
- Node.js/TypeScript environment
- Programmatic API (no manual intervention)
- **No KYC/fully decentralized solutions only**
- Production-ready reliability
- Must work in automated CI/CD pipelines (GitHub Actions)

**User Flows Requiring Swaps**:

1. **Node Operator Auto-Refill**:
   - AI node monitors AKT balance
   - When AKT < threshold (e.g., 10 AKT), trigger swap
   - Convert SOL from node's warm wallet → AKT
   - Resume Akash deployments

2. **End-User Payment Flow**:
   - User pays story fee in SOL (e.g., 0.02 SOL = $5)
   - Platform receives SOL payment
   - Platform swaps portion to AKT (e.g., $3 worth for backend deployment)
   - Platform deploys frontend (Arweave, paid in SOL) + backend (Akash, paid in AKT)

**Cost Context** (from `docs/akash-arweave-decision-brief.md`):
- 40 production backends on Akash: $240/month total ($6/backend/month)
- 50 AI worker nodes on Akash: $150/month total ($3/node/month)
- Typical swap amounts: $10-$100 per refill event
- Frequency: ~10-50 swaps/month depending on deployment volume

---

## Research Questions

### PRIMARY QUESTIONS (Must Answer)

#### 1. What programmatic solutions exist for swapping SOL to AKT?

**Investigate**:
- **Direct swap protocols/DEXs** (e.g., does any DEX support both Solana and Cosmos chains?)
- **Cross-chain bridges with swap capability** (e.g., Wormhole, IBC, Axelar)
- **Aggregators** (e.g., Jupiter Aggregator, Li.Fi, Socket, Rango Exchange)
- **Multi-chain DEX protocols** (e.g., THORChain, Maya Protocol)
- **Liquidity pools** supporting SOL→AKT pairs

**Expected Output**:
- List of 5-10 potential solutions
- Categorization (direct swaps, bridges, aggregators, DEXs)

#### 2. Which solutions offer production-ready APIs/SDKs for Node.js/TypeScript?

**For Each Solution, Document**:
- **Official npm packages** (name, version, last updated)
- **REST/GraphQL APIs** (endpoint URLs, authentication methods)
- **WebSocket support** (for real-time swap status updates)
- **TypeScript type definitions** (included? @types package available?)
- **Documentation quality** (quickstart guides, API reference, examples)

**Expected Output**:
- Table comparing API/SDK availability across solutions
- Links to official SDK documentation

#### 3. What are the fee structures and cost implications?

**For Each Solution, Calculate**:
- **Protocol fees** (% of swap amount)
- **Network fees** (gas on Solana, gas on Cosmos/Akash)
- **Price impact/slippage** (at $10, $50, $100, $500 swap amounts)
- **Minimum swap amounts** (any lower limits?)
- **Hidden fees** (bridge fees, withdrawal fees, etc.)

**Scenario Analysis**:
- Swap $50 SOL → AKT: Total cost = ?
- Swap $100 SOL → AKT: Total cost = ?
- Monthly cost for 30 swaps averaging $75 each = ?

**Expected Output**:
- Fee comparison table
- Total cost calculations per scenario
- Recommendations for optimal swap sizes (to minimize fees)

#### 4. How do swap routes work technically?

**For Each Solution, Document**:
- **Direct SOL→AKT path available?** (Yes/No)
- **Intermediate tokens required?** (e.g., SOL → USDC → ATOM → AKT)
- **Number of hops** (2 hops, 3 hops, 4+ hops)
- **Liquidity depth** (can handle $100 swaps without significant slippage?)
- **Estimated completion time** (seconds, minutes, hours?)
- **Cross-chain communication mechanism** (IBC, Wormhole, native bridge?)

**Expected Output**:
- Route visualization/diagram for top solutions
- Comparison table: Route complexity vs. cost vs. speed

#### 5. What are the reliability and security considerations?

**For Each Solution, Assess**:
- **Solution maturity** (launch date, version number)
- **Smart contract audits** (audited by whom? links to audit reports)
- **Total Value Locked (TVL)** (as proxy for trust/usage)
- **Historical uptime** (any known outages? downtime stats?)
- **Slippage tolerance requirements** (how much slippage is typical?)
- **Failed transaction handling** (automatic retries? error codes?)
- **Bridge risk assessment** (custodial vs. non-custodial, validator set size)

**Expected Output**:
- Risk assessment matrix (Low/Medium/High risk per solution)
- Security audit report links
- Incident history (if any major exploits/failures)

#### 6. Are these solutions truly decentralized/no-KYC?

**For Each Solution, Verify**:
- **On-chain execution** (fully on-chain vs. partially off-chain)
- **Custodial vs. non-custodial** (does solution hold funds at any point?)
- **KYC requirements** (any user authentication needed?)
- **Wallet-only interaction** (can swap with just wallet signature, no account?)
- **Censorship resistance** (can transactions be blocked by operators?)

**Expected Output**:
- Decentralization score (1-5 scale) per solution
- Clear YES/NO on KYC requirement

### SECONDARY QUESTIONS (Nice to Have)

#### 7. What MCP servers exist for cross-chain operations?

**Investigate**:
- Existing MCP servers for DeFi/swaps (search npm, GitHub)
- MCP servers for Solana, Cosmos, or multi-chain operations
- Potential to build custom MCP server for SOL↔AKT swaps
- Integration benefits with Claude Code workflow (automated deployments)

**Expected Output**:
- List of relevant MCP servers (if any)
- Assessment: "Build custom MCP server" vs. "Use existing SDK directly"

#### 8. What developer experience differences exist?

**Compare Solutions On**:
- **Documentation quality** (1-5 rating)
- **Code examples availability** (working TypeScript examples? Y/N)
- **Community support** (Discord/forum activity, GitHub issue response time)
- **Error handling** (clear error messages? typed error codes?)
- **Testing/devnet support** (can test swaps on testnet/devnet?)

**Expected Output**:
- Developer experience ranking (Best to Worst)

#### 9. What monitoring and tracking capabilities exist?

**For Each Solution, Document**:
- **Transaction status tracking** (API to check swap progress?)
- **Swap history APIs** (query past swaps by wallet address?)
- **Rate limiting** (requests per second/minute/hour?)
- **Webhook/event notifications** (callback when swap completes?)
- **Partial fill handling** (if liquidity insufficient, does it partially fill?)

**Expected Output**:
- Monitoring capabilities comparison table

#### 10. Are there alternative approaches?

**Investigate**:
- **Running your own relayer/bridge node** (effort? cost? feasibility?)
- **Liquidity pool participation** (provide liquidity, swap from own pool?)
- **OTC desks with APIs** (centralized but potentially lower fees?)
- **Payment processor integrations** (e.g., Stripe-like services for crypto?)
- **Holding both SOL and AKT** (avoid swaps entirely by accepting both tokens?)

**Expected Output**:
- Alternative approaches list with pros/cons

#### 11. What future-proofing considerations exist?

**Assess**:
- **Solution roadmap** (planned features, GitHub activity)
- **Development activity** (recent commits, team size, backing)
- **Support for additional chains** (can expand to other tokens later?)
- **Rate limit scalability** (will limits work at 500+ swaps/month?)
- **Cost predictability** (fixed fees vs. variable market-dependent fees)

**Expected Output**:
- Future-proofing score (1-5 scale) per solution

---

## Research Methodology

### Information Sources

**Priority 1 - Official Documentation**:
- **Jupiter Aggregator** (Solana's leading DEX aggregator): `https://docs.jup.ag/`
- **Osmosis DEX** (Cosmos/IBC ecosystem DEX): `https://docs.osmosis.zone/`
- **IBC Protocol** (Inter-Blockchain Communication): `https://ibc.cosmos.network/`
- **Wormhole** (cross-chain bridge): `https://docs.wormhole.com/`
- **THORChain** (multi-chain liquidity): `https://docs.thorchain.org/`
- **Axelar Network** (cross-chain communication): `https://docs.axelar.dev/`
- **Li.Fi** (cross-chain bridge aggregator): `https://li.fi/`
- **Socket** (multi-chain bridge aggregator): `https://socket.tech/`
- **Rango Exchange** (cross-chain DEX aggregator): `https://rango.exchange/`
- **Akash Network docs** (token acquisition guidance): `https://akash.network/docs/`

**Priority 2 - Technical Resources**:
- npm registry: Search for `@solana/web3.js`, `@cosmjs/stargate`, cross-chain swap SDKs
- GitHub repos: Search "Solana to Cosmos bridge", "SOL to AKT swap", "IBC Solana"
- Solana developer docs: Wallet integration, transaction signing
- Cosmos SDK docs: IBC transfers, CosmJS usage
- Cross-chain bridge aggregator docs: Multi-hop swap APIs

**Priority 3 - Community & Analysis**:
- DeFi comparison sites: Compare fees, routes, liquidity (e.g., DefiLlama)
- Developer forums: Solana Discord, Akash Discord, Cosmos Discord, Stack Overflow
- Security audit reports: CertiK, Trail of Bits, OpenZeppelin audits
- Recent articles (2024-2025): "Solana to Cosmos bridge", "Cross-chain swap best practices"

### Analysis Frameworks

#### 1. Technical Evaluation Matrix

| Solution | API Quality | TypeScript Support | Decentralized | Route Efficiency | Fees | Maturity | Risk |
|----------|-------------|-------------------|---------------|------------------|------|----------|------|
| Jupiter Aggregator | ? | ? | ? | ? | ? | ? | ? |
| Osmosis DEX | ? | ? | ? | ? | ? | ? | ? |
| Wormhole + Osmosis | ? | ? | ? | ? | ? | ? | ? |
| THORChain | ? | ? | ? | ? | ? | ? | ? |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Rating Scale**: ⭐ (Poor) to ⭐⭐⭐⭐⭐ (Excellent)

#### 2. Cost Analysis Framework

**Calculate Total Cost** for reference swap amounts:

```typescript
// Example cost breakdown structure
interface SwapCostAnalysis {
  swapAmount: number; // USD
  protocolFee: number; // % or fixed USD
  solanaNetworkFee: number; // USD
  cosmosNetworkFee: number; // USD
  estimatedSlippage: number; // %
  totalCost: number; // USD
  effectiveRate: number; // AKT received per SOL
}

// Scenarios to calculate:
const scenarios = [
  { swapAmount: 10, description: "Minimum refill" },
  { swapAmount: 50, description: "Typical refill" },
  { swapAmount: 100, description: "Large refill" },
  { swapAmount: 500, description: "Treasury conversion" }
];
```

Compare total cost across all solutions for each scenario.

#### 3. Integration Complexity Assessment

**Lines of Code Required** for basic swap implementation:
- Setup (authentication, wallet connection): X lines
- Swap execution: Y lines
- Status checking: Z lines
- Error handling: W lines
- Total: X+Y+Z+W lines

**Time to First Swap** (developer timeline):
- Solution A: 30 minutes
- Solution B: 2 hours
- Solution C: 1 day (complex setup)

#### 4. Risk Assessment

**Smart Contract Risk**:
- Audited by reputable firm? ✅/❌
- Audit date (recent = better): YYYY-MM-DD
- Known exploits: Yes/No (with links if yes)
- TVL (higher = more trust): $X million

**Route Risk**:
- Number of hops: 2 (low risk) vs. 5 (high risk)
- Intermediate tokens: Stablecoins (low risk) vs. Volatile tokens (high risk)
- Bridge mechanism: IBC (native) vs. Wormhole (wrapped) vs. Custodial (high risk)

**Counterparty Risk**:
- Centralized components: None (best) vs. Centralized relayers (medium) vs. Custodial (high risk)
- Governance: DAO-controlled (low risk) vs. Centralized team (medium risk)

**Regulatory Risk**:
- KYC required: ❌ (best) vs. Optional vs. Required (fail)
- Geographic restrictions: None (best) vs. Some countries blocked

### Data Requirements

- **Recency**: Documentation and package versions from 2024-2025 (crypto moves fast)
- **Credibility**: Official docs > audited protocols > community resources
- **Completeness**: Must include working code examples in TypeScript
- **Verifiability**: Test with actual transactions on testnet/devnet where possible

---

## Expected Deliverables

### 1. Executive Summary

**Format**:
```markdown
## Executive Summary

### Recommended Solution

**Primary Recommendation**: [Solution Name]

**Rationale**: [2-3 sentences explaining why this is the best choice]

**Backup Option**: [Fallback solution if primary fails]

### Key Findings

- [3-5 bullet points of critical insights]
- Example: "Direct SOL→AKT swaps are not available; minimum 3-hop route required"
- Example: "Jupiter + Wormhole + Osmosis offers best balance of cost, speed, and decentralization"

### Critical Blockers

[Any show-stoppers discovered, or "None"]

### Cost Impact

**Per-Swap Cost** (typical $50 swap):
- Protocol fees: $X
- Network fees: $Y
- Slippage: $Z
- **Total**: $X+Y+Z (~A% of swap amount)

**Monthly Cost** (30 swaps @ $50 avg):
- Total swap fees: $X/month
- Comparison to holding AKT directly: (saves/costs $Y vs. buying AKT upfront)

### Implementation Complexity

**Effort Estimate**: [X dev-days]
**Required Expertise**: TypeScript, Solana SDK, Cosmos SDK (beginner/intermediate/expert level)
**Timeline**: [X days for PoC, Y days for production-ready]

### Go/No-Go Recommendation

✅ **GO** - Recommended solution is production-ready
⚠️ **GO WITH CAUTION** - Workable but with caveats
❌ **NO-GO** - No viable solution exists
```

### 2. Detailed Analysis

#### Section 1: Solution Landscape

**Complete List of Identified Solutions**:
1. Jupiter Aggregator (Solana) + Bridge X + Osmosis (Cosmos)
2. THORChain (multi-chain liquidity)
3. Wormhole + Osmosis
4. Axelar + Osmosis
5. Li.Fi aggregator
6. Socket aggregator
7. Rango Exchange
8. [Any others discovered]

**Categorization**:
- **Direct Swaps**: [Solutions offering direct SOL→AKT, if any]
- **Bridge + DEX Combos**: [Solutions requiring bridge + DEX]
- **Aggregators**: [Solutions that route through multiple protocols]
- **Multi-Chain DEXs**: [Solutions with native multi-chain support]

**High-Level Capability Comparison**:

| Category | Solutions | Pros | Cons | Best For |
|----------|-----------|------|------|----------|
| Direct Swaps | [None found?] | Fast, cheap | N/A | N/A |
| Bridge + DEX | Jupiter+Wormhole+Osmosis | Full control | Complex integration | Custom automation |
| Aggregators | Li.Fi, Socket, Rango | Easy integration | Less control, fees | Quick MVP |
| Multi-Chain DEXs | THORChain | Native multi-chain | Higher fees | Cross-chain focus |

#### Section 2: Top Solutions Deep Dive

**Select Top 3 Solutions** for detailed analysis.

---

**For Each Top Solution**:

##### A. Technical Specifications

**Solution Name**: [e.g., Jupiter + Wormhole + Osmosis]

**Overview**: [1-2 sentence description]

**API/SDK Documentation**: [Link to official docs]

**npm Packages**:
- Primary package: `@jup-ag/api` (v1.2.3, updated 2025-01-15)
- Secondary package: `@certusone/wormhole-sdk` (v0.9.0, updated 2024-12-20)
- Tertiary package: `@cosmjs/stargate` (v0.32.0, updated 2025-01-10)

**TypeScript Support**: ✅ Full (native TS) / ⚠️ Partial (@types package) / ❌ None

**Installation**:
```bash
npm install @jup-ag/api @certusone/wormhole-sdk @cosmjs/stargate
```

**Setup Requirements**:
- Solana RPC endpoint (Helius, QuickNode, or public)
- Cosmos RPC endpoint (Akash RPC or public Cosmos RPC)
- Wallet private keys (Solana keypair + Cosmos mnemonic)

##### B. Implementation Guide

**Code Example 1: Basic SOL→AKT Swap**

```typescript
import { Connection, Keypair } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/api';
import { /* Wormhole imports */ } from '@certusone/wormhole-sdk';
import { SigningStargateClient } from '@cosmjs/stargate';

async function swapSOLtoAKT(amountSOL: number): Promise<SwapResult> {
  // Step 1: Swap SOL → USDC on Solana (via Jupiter)
  const connection = new Connection(process.env.SOLANA_RPC_URL);
  const wallet = Keypair.fromSecretKey(/* ... */);
  const jupiter = await Jupiter.load({ connection, user: wallet });

  const routes = await jupiter.computeRoutes({
    inputMint: 'So11111111111111111111111111111111111111112', // SOL
    outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    amount: amountSOL * 1e9, // lamports
    slippageBps: 50 // 0.5% slippage
  });

  const { swapTransaction } = await jupiter.exchange({ routeInfo: routes[0] });
  const txid = await connection.sendRawTransaction(swapTransaction.serialize());
  await connection.confirmTransaction(txid);

  // Step 2: Bridge USDC from Solana → Cosmos (via Wormhole)
  // [Implementation details...]

  // Step 3: Swap USDC → ATOM → AKT on Osmosis
  // [Implementation details...]

  return {
    txHash: txid,
    amountAKTReceived: 123.45,
    totalCostUSD: 2.35
  };
}
```

**Code Example 2: Check Swap Status/History**

```typescript
async function getSwapStatus(txHash: string): Promise<SwapStatus> {
  // Query transaction on Solana
  const solTx = await connection.getTransaction(txHash);

  // Check bridge status
  // [Implementation details...]

  return {
    status: 'completed' | 'pending' | 'failed',
    timestamp: Date.now(),
    amountReceived: 123.45
  };
}
```

**Code Example 3: Error Handling**

```typescript
try {
  const result = await swapSOLtoAKT(0.5); // Swap 0.5 SOL
} catch (error) {
  if (error.code === 'SLIPPAGE_EXCEEDED') {
    // Retry with higher slippage tolerance
  } else if (error.code === 'INSUFFICIENT_LIQUIDITY') {
    // Alert user, try later or different route
  } else {
    // Generic error handling
  }
}
```

##### C. Cost Analysis

**Fee Breakdown** (for $50 swap):

```typescript
const costBreakdown = {
  protocolFee: {
    jupiter: 0.003, // 0.3% of $50 = $0.15
    wormhole: 0.10,  // $0.10 flat bridge fee
    osmosis: 0.002   // 0.2% of $50 = $0.10
  },
  networkFees: {
    solanaGas: 0.00025, // ~$0.00025 SOL
    cosmosGas: 0.01      // ~$0.01 ATOM
  },
  estimatedSlippage: 0.005, // 0.5% = $0.25
  totalCostUSD: 0.61,       // Sum of all above
  percentOfSwap: 1.22       // 1.22% of $50
};
```

**Cost Comparison** (across swap amounts):

| Swap Amount | Protocol Fees | Network Fees | Slippage | Total Cost | % of Swap |
|-------------|---------------|--------------|----------|------------|-----------|
| $10 | $0.35 | $0.01 | $0.05 | $0.41 | 4.1% |
| $50 | $0.35 | $0.01 | $0.25 | $0.61 | 1.2% |
| $100 | $0.35 | $0.01 | $0.50 | $0.86 | 0.9% |
| $500 | $0.35 | $0.01 | $2.50 | $2.86 | 0.6% |

**Insight**: Larger swaps are more cost-efficient (lower % cost).

##### D. Route Analysis

**Exact Token Path**:
```
SOL (Solana)
  → USDC (Solana) [via Jupiter DEX]
  → USDC (Cosmos) [via Wormhole bridge]
  → ATOM (Cosmos) [via Osmosis DEX]
  → AKT (Akash/Cosmos) [via Osmosis DEX]
```

**Number of Hops**: 4 hops

**Expected Completion Time**:
- Jupiter swap: ~30 seconds (Solana finality)
- Wormhole bridge: ~5 minutes (guardian signatures + Cosmos finality)
- Osmosis swaps: ~1 minute (2 swaps, Cosmos finality)
- **Total**: ~6-7 minutes

**Failure Points & Mitigation**:
1. **Jupiter swap fails** (insufficient liquidity):
   - Mitigation: Retry with lower amount or higher slippage
2. **Wormhole bridge delay** (guardian downtime):
   - Mitigation: Monitor Wormhole status, retry after delay
3. **Osmosis swap fails** (low AKT liquidity):
   - Mitigation: Check Osmosis liquidity pools before initiating swap

##### E. Reliability Assessment

**Solution Maturity**:
- Jupiter: ⭐⭐⭐⭐⭐ (Solana's #1 DEX, launched 2021, 100M+ daily volume)
- Wormhole: ⭐⭐⭐⭐ (Launched 2021, $500M+ TVL, audited by Neodyme/OtterSec)
- Osmosis: ⭐⭐⭐⭐⭐ (Cosmos's #1 DEX, launched 2021, $200M+ TVL)

**Smart Contract Audits**:
- Jupiter: [Link to audit report]
- Wormhole: [Link to audit report]
- Osmosis: [Link to audit report]

**Total Value Locked (TVL)**:
- Jupiter: $500M+ (high trust)
- Wormhole: $500M+ (high trust)
- Osmosis: $200M+ (high trust)

**Historical Uptime**:
- Jupiter: 99.9% (per CoinGecko API uptime)
- Wormhole: 99.5% (known brief outage in Dec 2024)
- Osmosis: 99.8% (per Cosmos chain uptime stats)

**Known Issues**:
- Wormhole had exploit in Feb 2022 ($320M), since patched and audited
- No major Jupiter or Osmosis exploits

**Risk Assessment**: ⚠️ **MEDIUM RISK** (Wormhole bridge risk, but well-audited)

---

**[Repeat Section 2 for 2nd and 3rd top solutions]**

---

#### Section 3: Integration Architecture

**Recommended Implementation Pattern**:

```typescript
// File: src/services/cross-chain-swap.ts

interface SwapService {
  swapSOLtoAKT(amountSOL: number, minAKTOut: number): Promise<SwapResult>;
  getSwapStatus(swapId: string): Promise<SwapStatus>;
  getSwapHistory(walletAddress: string): Promise<SwapHistory[]>;
}

class JupiterWormholeOsmosisSwap implements SwapService {
  constructor(
    private solanaConnection: Connection,
    private cosmosClient: SigningStargateClient,
    private config: SwapConfig
  ) {}

  async swapSOLtoAKT(amountSOL: number, minAKTOut: number): Promise<SwapResult> {
    // 1. Validate inputs
    // 2. Execute Jupiter swap (SOL → USDC)
    // 3. Bridge USDC (Solana → Cosmos) via Wormhole
    // 4. Execute Osmosis swaps (USDC → ATOM → AKT)
    // 5. Return result with transaction hashes
  }

  async getSwapStatus(swapId: string): Promise<SwapStatus> {
    // Query on-chain transaction status
  }

  async getSwapHistory(walletAddress: string): Promise<SwapHistory[]> {
    // Query historical swaps from database or on-chain
  }
}

// Usage in node operator auto-refill
async function autoRefillAKT(nodeWallet: Wallet, threshold: number) {
  const aktBalance = await getAKTBalance(nodeWallet.cosmosAddress);

  if (aktBalance < threshold) {
    const solBalance = await getSolBalance(nodeWallet.solanaAddress);
    const amountToSwap = calculateSwapAmount(solBalance, aktBalance, threshold);

    const swapService = new JupiterWormholeOsmosisSwap(/* ... */);
    const result = await swapService.swapSOLtoAKT(amountToSwap, threshold - aktBalance);

    console.log(`Swapped ${amountToSwap} SOL → ${result.amountAKTReceived} AKT`);

    // Log cost for accounting
    await logDeploymentCost({
      nodeId: nodeWallet.nodeId,
      type: 'swap',
      chain: 'solana+cosmos',
      cost: result.totalCostUSD,
      txHashes: result.txHashes
    });
  }
}
```

**Error Handling Strategy**:

```typescript
enum SwapErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  BRIDGE_TIMEOUT = 'BRIDGE_TIMEOUT',
  LIQUIDITY_INSUFFICIENT = 'LIQUIDITY_INSUFFICIENT',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

class SwapError extends Error {
  constructor(public code: SwapErrorCode, message: string) {
    super(message);
  }
}

// Usage
try {
  await swapSOLtoAKT(0.5, 10);
} catch (error) {
  if (error instanceof SwapError) {
    switch (error.code) {
      case SwapErrorCode.SLIPPAGE_EXCEEDED:
        // Retry with 2x slippage tolerance
        break;
      case SwapErrorCode.BRIDGE_TIMEOUT:
        // Poll bridge status, resume when ready
        break;
      default:
        // Alert admin, fail gracefully
    }
  }
}
```

**Monitoring and Alerting**:

```typescript
// Monitor swap service health
setInterval(async () => {
  const health = await swapService.healthCheck();

  if (!health.jupiterOnline) {
    alert('Jupiter API is down, swaps will fail');
  }
  if (health.wormholeBridgeDelay > 600) { // > 10 min
    alert('Wormhole bridge experiencing delays');
  }
}, 60 * 1000); // Check every minute
```

**Testing Approach**:

```typescript
// Unit tests
describe('SwapService', () => {
  it('should swap SOL to AKT successfully', async () => {
    const result = await swapService.swapSOLtoAKT(0.5, 10);
    expect(result.amountAKTReceived).toBeGreaterThan(10);
  });

  it('should handle slippage exceeded error', async () => {
    await expect(swapService.swapSOLtoAKT(0.5, 1000)).rejects.toThrow(SwapError);
  });
});

// Integration tests (devnet/testnet)
describe('SwapService Integration', () => {
  it('should complete full SOL→AKT swap on devnet', async () => {
    // Use devnet Solana + testnet Cosmos
    const result = await swapService.swapSOLtoAKT(0.01, 0.1);
    expect(result.txHashes).toHaveLength(3); // Solana, Wormhole, Cosmos
  });
});
```

**Testnet/Devnet Availability**:
- Jupiter: ✅ Devnet supported
- Wormhole: ✅ Testnet bridge available
- Osmosis: ✅ Testnet DEX available

**Cost of Testing**:
- Solana devnet SOL: Free (faucet)
- Cosmos testnet ATOM/AKT: Free (faucet)
- Wormhole testnet: Free
- **Total**: $0 for unlimited testing

#### Section 4: Cost Projections

**Monthly Cost Scenarios**:

**Scenario A: Low Volume** (10 nodes, 10 refill swaps/month)
- Average swap size: $50
- Total swap volume: $500/month
- Total swap fees: $6/month (~1.2% of volume)
- **Annual cost**: $72

**Scenario B: Medium Volume** (50 nodes, 50 refill swaps/month)
- Average swap size: $75
- Total swap volume: $3,750/month
- Total swap fees: $40/month (~1.1% of volume)
- **Annual cost**: $480

**Scenario C: High Volume** (200 nodes, 200 refill swaps/month)
- Average swap size: $100
- Total swap volume: $20,000/month
- Total swap fees: $180/month (~0.9% of volume)
- **Annual cost**: $2,160

**Optimization Opportunities**:

1. **Batch Swapping** (if technically feasible):
   - Instead of 10 nodes swapping $50 each = 10 transactions
   - Swap $500 once, distribute AKT to 10 nodes = 1 transaction + 10 transfers
   - Savings: ~$5/month (reduced network fees)

2. **Optimal Refill Thresholds**:
   - Refill when AKT < 5: More frequent swaps, higher total fees
   - Refill when AKT < 20: Less frequent swaps, lower total fees
   - **Recommendation**: Refill when AKT < 15 (balance frequency vs. fee efficiency)

3. **Hold AKT Directly** (alternative approach):
   - Buy AKT upfront on centralized exchange (Coinbase, Kraken)
   - Transfer to node wallets
   - Avoid swap fees entirely
   - **Tradeoff**: Requires upfront capital, exposes to AKT price volatility

**Cost Comparison: Swapping vs. Holding**:

| Approach | Upfront Cost | Monthly Swap Fees | Volatility Risk | Liquidity |
|----------|--------------|-------------------|-----------------|-----------|
| Swap SOL→AKT on-demand | $0 | $40 (medium volume) | ✅ Low (hold SOL until needed) | ✅ High |
| Hold AKT directly | $5,000 (fund 50 nodes) | $0 | ⚠️ High (AKT price fluctuation) | ⚠️ Medium |

**Recommendation**: **Swap on-demand** for flexibility and lower risk.

#### Section 5: Comparison Matrix

**Complete Solution Comparison**:

| Solution | Route | Hops | Time | Cost ($50) | Decentralized | KYC | TypeScript SDK | Audit | Recommendation |
|----------|-------|------|------|-----------|---------------|-----|----------------|-------|----------------|
| Jupiter+Wormhole+Osmosis | SOL→USDC→ATOM→AKT | 4 | ~7min | $0.61 (1.2%) | ✅ | ❌ | ✅ | ✅ | ⭐⭐⭐⭐⭐ Best |
| THORChain | SOL→RUNE→AKT | 3 | ~5min | $1.20 (2.4%) | ✅ | ❌ | ⚠️ Limited | ✅ | ⭐⭐⭐ Backup |
| Li.Fi Aggregator | SOL→...→AKT | 3-5 | ~10min | $0.80 (1.6%) | ⚠️ Partial | ❌ | ✅ | N/A (aggregator) | ⭐⭐⭐⭐ Alternative |
| Centralized Exchange | Manual SOL→AKT | N/A | ~1hr | $0.10 (0.2%) | ❌ | ✅ | ❌ | N/A | ❌ Fails no-KYC requirement |

**Winner**: **Jupiter + Wormhole + Osmosis**
- ✅ Fully decentralized, no KYC
- ✅ Best cost/performance balance
- ✅ Excellent TypeScript SDK support
- ✅ Well-audited, high TVL
- ⚠️ Slightly complex integration (4 hops)

### 3. Supporting Materials

#### A. Data Tables

**Table 1: Solution Landscape**
[See Section 1 above]

**Table 2: Fee Comparison**
[See Section 2C above]

**Table 3: Route Comparison**
[See Section 2D above]

**Table 4: Complete Comparison Matrix**
[See Section 5 above]

#### B. Code Examples

**All code examples included in Section 2B and 3**

**Additional Example: GitHub Actions Workflow**

```yaml
# .github/workflows/auto-refill-akt.yml
name: Auto-Refill AKT Wallets

on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch: # Manual trigger

jobs:
  check-balances:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Check AKT balances and refill if needed
        env:
          SOLANA_RPC_URL: ${{ secrets.SOLANA_RPC_URL }}
          COSMOS_RPC_URL: ${{ secrets.COSMOS_RPC_URL }}
          TREASURY_SOLANA_KEY: ${{ secrets.TREASURY_SOLANA_KEY }}
          TREASURY_COSMOS_KEY: ${{ secrets.TREASURY_COSMOS_KEY }}
        run: |
          npm run auto-refill-akt

      - name: Report results
        run: npm run report-wallet-balances
```

#### C. Visual Materials

**Diagram 1: Recommended Swap Flow**
```
[User/Node Wallet (SOL)]
         |
         v
   [Jupiter API]
    (SOL → USDC on Solana)
         |
         v
  [Wormhole Bridge]
  (USDC Solana → Cosmos)
         |
         v
    [Osmosis DEX]
  (USDC → ATOM → AKT)
         |
         v
 [Node Wallet (AKT)]
```

**Diagram 2: Auto-Refill Architecture**
```
[GitHub Actions Cron Job]
         |
         v
[Check AKT Balances]
         |
    [Balance < threshold?]
         |
    YES  |  NO
         |   └─→ [Skip]
         v
 [Initiate Swap]
   (via SwapService)
         |
         v
 [Log Cost to DB]
         |
         v
  [Alert Success]
```

#### D. Reference Documentation

**Official Docs Reviewed**:
- Jupiter Aggregator API: https://docs.jup.ag/
- Wormhole Bridge: https://docs.wormhole.com/
- Osmosis DEX: https://docs.osmosis.zone/
- Solana Web3.js: https://solana-labs.github.io/solana-web3.js/
- CosmJS: https://cosmos.github.io/cosmjs/

**Relevant GitHub Repositories**:
- Jupiter SDK: https://github.com/jup-ag/jupiter-core
- Wormhole SDK: https://github.com/wormhole-foundation/wormhole
- Osmosis frontend (reference): https://github.com/osmosis-labs/osmosis-frontend

**Security Audit Reports**:
- Jupiter: [Link to audit]
- Wormhole: [Link to audit]
- Osmosis: [Link to audit]

**Community Resources**:
- Solana Discord: https://discord.gg/solana
- Akash Discord: https://discord.gg/akash
- Cosmos Discord: https://discord.gg/cosmosnetwork

---

## Success Criteria

This research successfully achieves its objectives if:

1. ✅ **Clear Recommendation**: One primary solution recommended with confidence
2. ✅ **Production-Ready Code**: Working TypeScript example that can be adapted immediately
3. ✅ **Cost Clarity**: Accurate cost projections for expected volume ranges
4. ✅ **Risk Assessment**: All major risks identified with mitigation strategies
5. ✅ **Implementation Plan**: Clear next steps with effort estimates

**Decision Enablement**: After reading this research, we should be able to:
1. Choose the optimal solution confidently
2. Estimate implementation timeline (sprint planning)
3. Project operational costs accurately
4. Understand and mitigate key risks
5. Begin implementation immediately

**Failure Modes to Avoid**:
- ❌ Recommending solutions that require KYC (violates requirements)
- ❌ Ignoring liquidity/slippage issues (could cause failed swaps at scale)
- ❌ Missing hidden fees (inaccurate cost projections)
- ❌ Providing pseudocode instead of real, testable TypeScript

---

## Timeline and Priority

**Priority**: 🟠 **HIGH** - Required for production launch of autonomous node operations

**Desired Completion**: 3-5 days to inform development sprint planning

**Phased Approach**:
- **Phase 1 (Day 1-2)**: Identify all viable solutions, eliminate non-starters (KYC, no API, etc.)
- **Phase 2 (Day 3-4)**: Deep dive on top 2-3 solutions with code examples, cost analysis
- **Phase 3 (Day 5)**: Final recommendation with implementation plan, code templates

---

## Deliverables Output Location

- **Research summary**: `docs/sol-to-akt-swap-research.md`
- **Decision brief**: `docs/sol-to-akt-swap-decision.md`
- **Code examples**:
  - `docs/examples/swap-sol-to-akt-jupiter-wormhole-osmosis.ts`
  - `docs/examples/swap-sol-to-akt-thorchain.ts` (backup)
  - `docs/examples/auto-refill-akt-wallets.ts`
  - `docs/examples/github-actions-auto-refill-akt.yml`
- **Cost tracking integration**: `docs/examples/log-swap-costs.ts`

---

## Next Steps After Research

**If Viable Solution Found**:
1. **Review Findings**: Engineering team approves recommended solution
2. **Proof-of-Concept**: Test swap on devnet/testnet (1-2 days)
   - Execute SOL→AKT swap successfully
   - Measure actual cost, time, reliability
   - Verify TypeScript integration works
3. **Production Implementation** (Week 1-2):
   - Integrate SwapService into node operator codebase
   - Add auto-refill logic to wallet management system
   - Implement cost tracking and logging
   - Set up monitoring and alerting
4. **Update Documentation**:
   - Add swap integration to Architecture doc
   - Update wallet management research with swap implementation
   - Document auto-refill thresholds and triggers

**If No Viable Solution Found**:
1. **Document Blockers**: Specific reasons why SOL→AKT swapping is infeasible
2. **Alternative Approaches**:
   - **Hold AKT directly**: Buy AKT upfront, skip swaps entirely
   - **Centralized on-ramp**: Use CEX (Coinbase/Kraken) manually for large AKT purchases
   - **Accept AKT payments**: Allow users to pay in AKT directly (skip SOL→AKT)
3. **Revisit Requirements**: Can we relax no-KYC requirement? (unlikely, but consider)
4. **Monitor Ecosystem**: Track new bridge/swap solutions, re-evaluate quarterly

---

## Research Execution Notes

**Starting Points**:
1. Search: "Jupiter API Solana cross-chain swap"
2. Search: "IBC protocol Solana to Cosmos bridge"
3. Search: "Wormhole bridge SOL to AKT"
4. Search: "Osmosis DEX API TypeScript"
5. Search: "THORChain Solana to Cosmos"
6. Check: npm packages for `@jup-ag`, `@certusone/wormhole-sdk`, `@cosmjs/stargate`
7. Check: Akash Network docs on token acquisition

**Key Validation Points**:
- ✅ Must actually test a small swap on testnet/devnet (proof it works)
- ✅ Verify TypeScript code examples compile and run
- ✅ Confirm no KYC requirements through actual API interaction
- ✅ Validate fee estimates with real transaction examples
- ✅ Check liquidity depth (can Osmosis handle $100+ AKT swaps?)

---

## Notes

- This research is **CRITICAL** for autonomous node operations
- No KYC requirement is **NON-NEGOTIABLE** (decentralized ethos)
- Must work in CI/CD (GitHub Actions) for automated deployments
- Cost transparency is essential (nodes deduct deployment costs from earnings)
- Integration with Epic 7 (Infrastructure/DevOps AI Agent) Story 7.8
- Aligns with SlopMachine's multi-chain architecture (Solana + Akash + Arweave)
