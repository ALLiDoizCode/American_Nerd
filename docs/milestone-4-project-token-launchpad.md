# Milestone 4: Project Token Launchpad (pump.fun Model)

**Version:** 1.0
**Date:** 2025-10-06
**Goal:** Enable projects to raise development funds through token launches, creating speculation-driven project financing

---

## The Innovation

### Current Model (Milestones 0-3)

```
Client pays from pocket
    ↓
Funds escrow for each stage
    ↓
Work gets done
    ↓
Client owns 100% of project
```

**Problem:**
- ❌ High upfront cost ($2,000+ per project)
- ❌ All risk on client
- ❌ No community involvement
- ❌ No speculation/upside for early supporters

---

### New Model: Project Tokens (pump.fun Inspired)

```
Client launches project token
    ↓
Community buys tokens (speculation on project success)
    ↓
Token sale proceeds fund development escrow
    ↓
AI agents build the project
    ↓
Project ships → Token value increases
    ↓
Early supporters profit
```

**Benefits:**
- ✅ Client pays $0 upfront (community funds it)
- ✅ Risk shared with community
- ✅ Built-in marketing (token holders promote project)
- ✅ Speculation drives funding
- ✅ Early supporters get upside

---

## How It Works

### 1. Client Creates Project Token

```
Client (in Claude Desktop via MCP):
> "I want to build expense tracking for freelancers"

Analyst + PM Agents:
> [Brainstorm, research, create PRD...]
> ✅ PRD ready: "FreelanceExpense - Automated expense tracking"

MCP Server:
> Your project is ready. How do you want to fund development?
>
> Option A: Self-fund (14.2 SOL = ~$2,840)
> Option B: Launch project token (community-funded) ✨
>
> Token launch details:
> - Create $FEXP token (FreelanceExpense)
> - Bonding curve (price increases as more tokens sold)
> - Target raise: 14.2 SOL (covers full development)
> - You retain: 20% of token supply
> - Community gets: 80% via bonding curve

Client:
> Option B - launch the token

MCP Server:
> [MCP Tool: create_project_token({
>   symbol: "FEXP",
>   name: "FreelanceExpense",
>   description: "Automated expense tracking for freelancers",
>   prdTx: "arweave.net/abc123",
>   fundingTarget: 14.2 SOL,
>   creatorAllocation: 0.20
> })]
>
> ✅ Token created: $FEXP
> ✅ Bonding curve initialized
> ✅ Token page live: americannerd.com/tokens/FEXP
>
> Share with community:
> 🔗 Twitter: "Just launched $FEXP - funding development of automated
>    expense tracking for freelancers! Get in early: americannerd.com/tokens/FEXP"
```

---

### 2. Bonding Curve Token Sale

**pump.fun-style mechanics:**

```rust
#[account]
pub struct ProjectToken {
    pub project: Pubkey,
    pub mint: Pubkey,              // SPL token mint
    pub symbol: String,            // "FEXP"
    pub name: String,
    pub total_supply: u64,
    pub creator: Pubkey,
    pub creator_allocation: u64,   // 20% of supply
    pub funding_target: u64,       // 14.2 SOL
    pub funds_raised: u64,         // Current amount raised
    pub bonding_curve: BondingCurve,
    pub status: TokenStatus,
}

pub struct BondingCurve {
    pub curve_type: CurveType,     // Linear, exponential, sqrt
    pub initial_price: u64,        // Starting price in lamports per token
    pub current_price: u64,        // Current price (increases with sales)
    pub tokens_sold: u64,
}

pub enum CurveType {
    Linear,       // Price increases linearly
    Exponential,  // Price increases exponentially (early buyers rewarded)
    Sqrt,         // Square root (pump.fun default)
}

pub enum TokenStatus {
    Active,           // Still raising funds
    FundingComplete,  // Target reached, development begins
    Graduated,        // Listed on Raydium/Jupiter (if hits market cap)
}
```

**Bonding curve math (sqrt curve like pump.fun):**

```typescript
function calculatePrice(tokensSold: number): number {
  // Price increases as sqrt of tokens sold
  const basePrice = 0.0001; // 0.0001 SOL per token at start
  const currentPrice = basePrice * Math.sqrt(tokensSold / 1000);
  return currentPrice;
}

// Example:
// First 1,000 tokens: 0.0001 SOL each = 0.1 SOL raised
// Next 10,000 tokens: 0.0003 SOL each = 3 SOL raised
// Next 50,000 tokens: 0.0007 SOL each = 35 SOL raised
// Total: ~14.2 SOL raised at ~61,000 tokens sold
```

---

### 3. Community Buys Tokens

**Token purchase UI:**

```
americannerd.com/tokens/FEXP

┌──────────────────────────────────────────────┐
│  $FEXP - FreelanceExpense                    │
│  "Automated expense tracking for freelancers"│
│                                              │
│  📄 View PRD: arweave.net/abc123            │
│  🎯 Funding Progress: 8.2 / 14.2 SOL (58%)  │
│  📊 Holders: 47                             │
│  💰 Current Price: 0.00045 SOL              │
│  📈 Market Cap: 12.4 SOL                    │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │ Buy $FEXP                          │     │
│  │                                    │     │
│  │ Amount (SOL): [____] 1.0          │     │
│  │ You receive: ~2,222 $FEXP         │     │
│  │ New price: 0.00048 SOL            │     │
│  │                                    │     │
│  │ [Buy with Phantom] [Buy with...]  │     │
│  └────────────────────────────────────┘     │
│                                              │
│  💬 Community Chat                          │
│  - "Love this idea, buying 5 SOL worth"     │
│  - "When will development start?"           │
│  - "FEXP to the moon! 🚀"                   │
└──────────────────────────────────────────────┘
```

**When someone buys tokens:**

```typescript
const tx = await program.methods
  .buyProjectTokens({
    solAmount: 1 * LAMPORTS_PER_SOL,  // 1 SOL
  })
  .accounts({
    projectToken: projectTokenPDA,
    buyer: buyerWallet.publicKey,
    escrow: escrowPDA,  // SOL goes here
  })
  .rpc();

// Smart contract:
// 1. Calculates tokens to mint (based on bonding curve)
// 2. Mints tokens to buyer
// 3. Transfers SOL to escrow
// 4. Updates bonding curve price
// 5. Checks if funding target reached
```

---

### 4. Funding Target Reached → Development Begins

**Automatic workflow when target hit:**

```typescript
// Smart contract checks after each purchase
if (projectToken.fundsRaised >= projectToken.fundingTarget) {
  // 1. Update status
  projectToken.status = TokenStatus.FundingComplete;

  // 2. Post opportunities automatically
  await createOpportunity({
    project: project,
    workType: WorkType.Architecture,
    budget: 0.5 SOL, // From raised funds
    fundedBy: projectToken.escrow,
  });

  // 3. Emit event
  emit!(FundingComplete {
    project: project.pubkey,
    total_raised: projectToken.fundsRaised,
    token_holders: projectToken.holderCount,
  });

  // 4. Notify community
  // - Tweet: "$FEXP funding complete! Development starts now"
  // - Discord announcement
  // - Email to all holders
}
```

**Development proceeds as normal:**
- AI Architect bids, generates architecture
- Stories created
- Developer AIs implement
- QA validates
- **All funded from token sale proceeds**

---

### 5. Value Accrual to Token

**As project progresses, token value increases:**

```
Funding Complete (Day 1):
├─ Price: 0.00045 SOL
├─ Market cap: 14.2 SOL
└─ Status: "Development starting"

Architecture Complete (Day 3):
├─ Price: 0.00067 SOL (+49%)
├─ Market cap: 21.1 SOL
└─ Status: "Architecture approved, stories in progress"

Story 10/40 Complete (Week 3):
├─ Price: 0.00089 SOL (+33%)
├─ Market cap: 28.0 SOL
└─ Status: "25% complete, on schedule"

Project Complete (Week 8):
├─ Price: 0.0032 SOL (+260%)
├─ Market cap: 101 SOL
└─ Status: "Shipped! Live at freelanceexpense.com"

Graduation (if market cap > 100 SOL):
├─ Liquidity migrates to Raydium (DEX)
├─ Full trading enabled
└─ Token becomes tradeable asset
```

**Early buyers at 0.00045 SOL → Sell at 0.0032 SOL = 7x return**

---

### 6. Token Utility

**What can $FEXP holders do?**

```
1. Governance:
   - Vote on feature prioritization
   - Approve/reject major architecture changes
   - Select AI nodes for key roles

2. Revenue Sharing (optional):
   - If project generates revenue (SaaS subscription)
   - Token holders receive dividend distributions
   - Example: 10% of revenue → buyback $FEXP → burn (deflationary)

3. Early Access:
   - Token holders get beta access to product
   - Premium features unlocked for holders
   - Discord/community exclusive to holders

4. Speculation:
   - Trade on bonding curve (before graduation)
   - Trade on DEX (after graduation)
   - Bet on project success
```

---

## PumpPortal Integration

### Why PumpPortal Instead of Custom Contracts

**PumpPortal provides:**
- ✅ Battle-tested pump.fun bonding curve
- ✅ Existing liquidity and user base
- ✅ Simple API (no complex smart contract development)
- ✅ Automatic Raydium graduation
- ✅ Low-latency transaction building

**We leverage existing infrastructure instead of rebuilding it.**

---

### Token Launch via PumpPortal

**AI Node or Client creates token:**

```typescript
import axios from 'axios';

async function createProjectToken(project: {
  name: string,
  symbol: string,
  description: string,
  prdUrl: string,
  creatorWallet: Keypair
}) {
  // 1. Upload metadata to IPFS/Arweave
  const metadata = {
    name: project.name,
    symbol: project.symbol,
    description: project.description,
    image: generateProjectImage(), // Auto-generated from PRD
    external_url: `https://americannerd.com/projects/${project.symbol}`,
    attributes: [
      { trait_type: "Category", value: "Development Project" },
      { trait_type: "PRD", value: project.prdUrl },
      { trait_type: "Status", value: "Fundraising" }
    ]
  };

  const metadataUrl = await uploadToArweave(JSON.stringify(metadata));

  // 2. Create token on pump.fun via PumpPortal
  // Note: PumpPortal trading API is for trading existing tokens
  // Token creation likely happens directly on pump.fun
  // We'll use pump.fun SDK or direct contract call

  const createTx = await createPumpFunToken({
    name: project.name,
    symbol: project.symbol,
    uri: metadataUrl,
    creator: project.creatorWallet.publicKey,
  });

  // Sign and send
  createTx.sign([project.creatorWallet]);
  const signature = await connection.sendRawTransaction(createTx.serialize());

  return {
    mint: mintAddress,
    signature,
    bondingCurve: bondingCurveAddress,
  };
}
```

---

### Buy Tokens via PumpPortal API

**Community members buy project tokens:**

```typescript
async function buyProjectToken(
  mint: string,
  solAmount: number,
  buyerWallet: Keypair
) {
  const response = await axios.post(
    `https://pumpportal.fun/api/trade?api-key=${API_KEY}`,
    {
      action: "buy",
      mint: mint,
      amount: solAmount,
      denominatedInSol: "true",
      slippage: 10,
      priorityFee: 0.0001,
      pool: "pump", // Use pump.fun bonding curve
    }
  );

  // PumpPortal returns ready-to-sign transaction
  const tx = VersionedTransaction.deserialize(
    Buffer.from(response.data, 'base64')
  );

  // Sign with buyer's wallet
  tx.sign([buyerWallet]);

  // Send transaction
  const signature = await connection.sendRawTransaction(tx.serialize());

  return signature;
}
```

---

### Sell Development Fund Allocation

**On token creation, auto-sell dev fund:**

```typescript
async function launchProjectTokenWithFunding(project: Project) {
  // 1. Create token on pump.fun
  const token = await createProjectToken({
    name: project.name,
    symbol: project.symbol,
    description: project.description,
    prdUrl: `arweave.net/${project.prdTx}`,
    creatorWallet: platformWallet, // Platform creates on behalf
  });

  // 2. Immediately sell 20% of supply (dev fund)
  const totalSupply = 1_000_000_000; // 1B tokens (pump.fun standard)
  const devFundTokens = totalSupply * 0.20; // 200M tokens

  // Sell dev fund to curve at floor price
  const sellResponse = await axios.post(
    `https://pumpportal.fun/api/trade?api-key=${API_KEY}`,
    {
      action: "sell",
      mint: token.mint,
      amount: devFundTokens,
      denominatedInSol: "false", // Amount is in tokens, not SOL
      slippage: 1,
      priorityFee: 0.0005,
      pool: "pump",
    }
  );

  // Sign and send sell transaction
  const sellTx = VersionedTransaction.deserialize(
    Buffer.from(sellResponse.data, 'base64')
  );
  sellTx.sign([platformWallet]);
  await connection.sendRawTransaction(sellTx.serialize());

  // Proceeds automatically go to bonding curve (creates liquidity)
  // Extract SOL for development escrow
  const devFundProceeds = calculateProceeds(devFundTokens);
  // ~20 SOL (depending on curve)

  // 3. Transfer to development escrow on our smart contract
  await program.methods
    .initializeTokenFunding({
      projectTokenMint: token.mint,
      developmentBudget: devFundProceeds,
    })
    .accounts({
      project: projectPDA,
      tokenEscrow: escrowPDA,
    })
    .rpc();

  // 4. Auto-post architecture opportunity (funded immediately)
  await program.methods
    .createOpportunity({
      workType: WorkType.Architecture,
      budget: 0.5 * LAMPORTS_PER_SOL,
      fundedBy: escrowPDA, // Token escrow
    })
    .rpc();

  return {
    tokenMint: token.mint,
    fundingRaised: devFundProceeds,
    status: 'FUNDED',
    developmentStarted: true,
  };
}
```

---

## Smart Contract Design

### New Accounts

```rust
#[account]
pub struct ProjectToken {
    pub project: Pubkey,
    pub mint: Pubkey,                  // SPL token mint
    pub symbol: String,                // "FEXP" (max 10 chars)
    pub name: String,                  // "FreelanceExpense" (max 50)
    pub description: String,           // Max 500 chars
    pub prd_arweave_tx: String,        // Link to PRD
    pub creator: Pubkey,
    pub creator_allocation: u64,       // Tokens reserved for creator
    pub total_supply: u64,             // Max token supply
    pub funding_target: u64,           // SOL needed to fund development
    pub funds_raised: u64,             // Current SOL raised
    pub bonding_curve: BondingCurve,
    pub escrow: Pubkey,                // Escrow PDA holding raised SOL
    pub status: TokenStatus,
    pub holder_count: u32,
    pub launched_at: i64,
    pub funded_at: Option<i64>,
    pub graduated_at: Option<i64>,
}

#[account]
pub struct TokenEscrow {
    pub project_token: Pubkey,
    pub total_deposited: u64,          // Total SOL from token sales
    pub total_spent: u64,              // SOL paid to AI nodes
    pub available: u64,                // SOL available for new work
}
```

### New Instructions (Simplified)

```rust
#[program]
pub mod american_nerd {
    // Link project to pump.fun token
    pub fn initialize_token_funding(
        ctx: Context<InitializeTokenFunding>,
        pump_fun_mint: Pubkey,
        bonding_curve: Pubkey,
        development_budget: u64,
    ) -> Result<()> {
        // 1. Store reference to pump.fun token
        ctx.accounts.project_token.pump_fun_mint = pump_fun_mint;
        ctx.accounts.project_token.bonding_curve = bonding_curve;

        // 2. Initialize development escrow with funds from dev sale
        ctx.accounts.escrow.total_budget = development_budget;
        ctx.accounts.escrow.remaining = development_budget;

        // 3. Update project status
        ctx.accounts.project.status = ProjectStatus::Funded;

        // 4. Emit event
        emit!(TokenFundingInitialized {
            project: ctx.accounts.project.key(),
            token_mint: pump_fun_mint,
            budget: development_budget,
        });

        Ok(())
    }

    // Track token milestones (architecture done, stories complete, etc.)
    pub fn update_project_milestone(
        ctx: Context<UpdateMilestone>,
        milestone: Milestone,
    ) -> Result<()> {
        // Update project status
        // Emit event (can trigger social posts)
        // Token holders see progress
        Ok(())
    }

    // Fund work from token escrow (instead of client wallet)
    pub fn fund_opportunity_from_token(
        ctx: Context<FundFromToken>,
        opportunity: Pubkey,
        amount: u64,
    ) -> Result<()> {
        // Verify token escrow has funds
        require!(ctx.accounts.token_escrow.remaining >= amount);

        // Transfer from token escrow to work escrow
        ctx.accounts.token_escrow.remaining -= amount;
        ctx.accounts.token_escrow.spent += amount;

        // Create work escrow (standard flow continues)
        Ok(())
    }
}

// We DON'T implement bonding curve - pump.fun handles that
// We just track the token reference and spend the raised funds
```

---

## User Workflows

### Creator Flow

```
1. Client creates PRD (via analyst.txt + pm.txt in MCP)

2. Client decides to launch token instead of self-funding
   └─ "Launch token for this project"

3. MCP creates project token
   ├─ Symbol: Auto-suggested from project name
   ├─ Funding target: Calculated from PRD scope
   ├─ Bonding curve: sqrt curve (pump.fun default)
   └─ Creator allocation: 20% (configurable)

4. Token page goes live
   └─ americannerd.com/tokens/FEXP

5. Client shares on social media
   └─ "Building $FEXP - automated expense tracking!
       Early supporters fund development: [link]"

6. Community buys tokens
   └─ Funding progress: 0% → 25% → 50% → 100%

7. Funding complete → Development auto-starts
   └─ Opportunities posted from token escrow
   └─ AI nodes bid and build

8. Client promotes progress
   └─ "Architecture complete! $FEXP development on track"
   └─ Token price increases (speculation)

9. Project ships
   └─ Token graduates to DEX (if market cap > 100 SOL)
   └─ Creator's 20% allocation now worth $$
```

---

### Investor/Speculator Flow

```
1. Discover project tokens
   └─ Browse: americannerd.com/tokens
   └─ Filter: Early stage, Nearly funded, Trending

2. Review project
   ├─ Read PRD (Arweave link)
   ├─ Check funding progress
   ├─ See creator reputation
   └─ View community activity

3. Buy tokens
   └─ Connect Phantom wallet
   └─ Buy 1 SOL worth of $FEXP
   └─ Receive ~2,222 $FEXP

4. Monitor development
   ├─ Dashboard shows: Architecture complete ✅
   ├─ Stories: 15/40 done (38%)
   └─ Token price: +45% since purchase

5. Participate in governance (optional)
   └─ Vote on feature priorities
   └─ Approve major changes

6. Exit
   ├─ Sell back to curve (before graduation)
   └─ Or trade on DEX (after graduation)
```

---

## Token Economics

### Funding Calculation

**Project:** FreelanceExpense (40 stories)

```
Development Costs:
├─ Architecture: 0.5 SOL
├─ Stories (40 × 0.25 avg): 10 SOL
├─ QA (40 × 0.05): 2 SOL
├─ Platform fees (5%): 0.7 SOL
└─ Buffer (15%): 2 SOL

Total Needed: 15.2 SOL (~$3,040 at $200/SOL)
```

**Token Supply:**

```
Total Supply: 1,000,000 $FEXP

Initial Distribution:
├─ Creator: 150,000 (15%) - VESTED over 6 months
├─ Platform: 50,000 (5%) - For operations
├─ Development Fund: 200,000 (20%) - SOLD IMMEDIATELY
└─ Bonding Curve: 600,000 (60%) - Public sale
```

---

### Pre-Sale Strategy (Development Fund)

**IMMEDIATE funding via dev allocation sale:**

```rust
// On token creation, automatically sell dev allocation
pub fn create_project_token(
    ctx: Context<CreateProjectToken>,
    funding_target: u64,
) -> Result<()> {
    let total_supply = 1_000_000;

    // Allocations
    let creator_allocation = total_supply * 15 / 100;     // 150k (vested)
    let platform_allocation = total_supply * 5 / 100;     // 50k
    let dev_fund_allocation = total_supply * 20 / 100;    // 200k (SELL NOW)
    let bonding_curve_supply = total_supply * 60 / 100;   // 600k

    // IMMEDIATELY sell dev fund allocation to curve
    // This provides initial liquidity + funds development
    let dev_fund_proceeds = sell_to_curve_at_floor_price(
        dev_fund_allocation,
        initial_price: 0.0001 SOL
    );

    // dev_fund_proceeds = 200,000 × 0.0001 = 20 SOL
    // This EXCEEDS our 15.2 SOL target!

    ctx.accounts.token_escrow.development_budget = dev_fund_proceeds;
    ctx.accounts.project.status = ProjectStatus::Funded; // Immediately funded!

    // Creator fee (optional)
    let creator_fee = ctx.accounts.creator_fee; // e.g., 0.5 SOL
    ctx.accounts.token_escrow.development_budget -= creator_fee;

    // Transfer creator fee to creator
    transfer_sol(token_escrow, creator, creator_fee)?;

    Ok(())
}
```

**Result:**
- ✅ **Development funded INSTANTLY** (20 SOL from dev allocation sale)
- ✅ Creator gets small fee (0.5 SOL) for launching
- ✅ Work can start immediately (no waiting for community to buy)
- ✅ Bonding curve still has 600k tokens for public (creates liquidity)

---

### Updated Token Economics

**At token launch:**

```
Step 1: Token created on pump.fun
Total supply: 1B $FEXP (pump.fun standard)

Step 2: Immediate dev fund sale to curve
├─ 200M tokens (20%) sold to curve at floor price
├─ Proceeds: 20 SOL
├─ ALL 20 SOL → Development escrow (no platform cut)
└─ Status: FUNDED (development begins immediately)

Step 3: Public can now buy from curve
├─ Starting price: Floor price (same as dev sale)
├─ 600M tokens (60%) available on curve
├─ As community buys, price increases
└─ Curve has initial liquidity from dev sale

Creator Allocation:
├─ 150M tokens (15%) vested over 6 months
├─ 25M unlock per month
└─ Trading fees from all buys/sells (claimable via PumpPortal)

Platform Allocation:
├─ 50M tokens (5%)
└─ Trading fees from platform-owned tokens

Remaining:
├─ 600M tokens on bonding curve for public
```

**Benefits:**
- ✅ No waiting period (funded instantly)
- ✅ No "will it reach target?" risk
- ✅ ALL 20 SOL goes to development (no deductions)
- ✅ Creator earns from trading fees (pump.fun mechanism)
- ✅ Creator still has 15% vested token upside
- ✅ Community gets fair entry at floor price

---

### Bonding Curve After Dev Sale

```
Curve state after dev fund sale:

Tokens in curve: 200,000 (from dev fund)
SOL in curve: 0 SOL (dev fund extracted to escrow)
Current price: 0.0001 SOL (floor price)

Tokens available: 600,000 (for public)
Price trajectory: 0.0001 → 0.002 SOL (as public buys)
```

**First community buyer:**
- Buys at: 0.0001 SOL (same as dev fund)
- Gets: Fair price (no "insiders got better deal")
- Curve: Already has 200k tokens (creates depth)

**As community buys:**
```
Community buys 100k tokens: Price rises to 0.0005 SOL
Community buys 300k tokens: Price rises to 0.0015 SOL
Community buys 500k tokens: Price rises to 0.0025 SOL
```

**Market cap progression:**
```
At launch (after dev sale): 0.0001 × 800k circulating = 80 SOL market cap
After community buys 500k: 0.0025 × 700k circulating = 1,750 SOL market cap
```

---

### Creator Fee Structure (pump.fun Trading Fees)

**How pump.fun creator fees work:**

```
Every trade on the bonding curve generates fees:
├─ 1% trading fee (pump.fun standard)
├─ Creator receives portion of trading fees
└─ Fees accumulate and can be claimed via PumpPortal
```

**Updated tokenomics:**

```
Token Launch:
    ↓
Platform sells 200M dev tokens to curve
    ↓
Proceeds: 20 SOL → Development escrow
    ↓
Development budget: 20 SOL (ALL goes to work, no platform cut here)

Ongoing Trading:
    ↓
Community buys/sells $FEXP on pump.fun
    ↓
Trading volume: 500 SOL (over project lifetime)
    ↓
Trading fees generated: 5 SOL (1% of volume)
    ↓
Creator can claim fees via PumpPortal API:

const claimTx = await axios.post(
  `https://pumpportal.fun/api/trade?api-key=${API_KEY}`,
  {
    action: "collectCreatorFee",
    priorityFee: 0.000001,
  }
);
```

**Creator Revenue Streams:**

1. **Trading Fees** (ongoing)
   - Collected from every buy/sell on bonding curve
   - Claimed via PumpPortal: `collectCreatorFee`
   - Potential: 1-5 SOL over project lifetime (based on trading volume)

2. **Vested Token Allocation** (15% of supply)
   - 150M tokens vesting over 6 months
   - Value if token succeeds: 150M × 0.003 SOL = 450 SOL (~$90k)

3. **Revenue Share** (optional, if product generates income)
   - 10% of SaaS revenue → buy back $FEXP → burn (deflationary)
   - Increases token value over time

**Total creator value:**
- Trading fees: 1-5 SOL (immediate)
- Vested tokens: 450 SOL potential (if successful)
- Revenue share: Ongoing

**Platform doesn't take cut from dev fund** - entire 20 SOL goes to development. Platform earns from:
- 5% token allocation (50M tokens)
- Trading fees from their allocation
- Network effects (more successful projects = more tokens launched)

---

### Value Accrual Model

**As project ships, token value increases:**

```
Pre-launch: No market, no price

Funding phase: Price defined by bonding curve
├─ Early: 0.0001 SOL per token
├─ Target hit: 0.0022 SOL per token
└─ Market cap: 15.2 SOL

Development phase: Speculative price increase
├─ Architecture done: +30% (0.0029 SOL)
├─ 50% stories done: +50% (0.0033 SOL)
└─ Market cap: ~25 SOL

Launch day: Product goes live
├─ Token pumps: +200% (0.0066 SOL)
└─ Market cap: ~50 SOL

Post-launch: Revenue-driven or speculative
├─ If product gains users: +500% (0.033 SOL)
├─ Market cap: 250 SOL
└─ Graduates to Raydium (DEX listing)
```

**Early buyer ROI:**
- Bought at: 0.0001 SOL
- Sells at: 0.033 SOL
- **330x return** 🚀

---

## Governance Integration

### Token-Weighted Voting

```rust
#[account]
pub struct Proposal {
    pub project_token: Pubkey,
    pub proposal_type: ProposalType,
    pub description: String,
    pub voting_deadline: i64,
    pub votes_for: u64,      // Token-weighted votes
    pub votes_against: u64,
    pub status: ProposalStatus,
}

pub enum ProposalType {
    FeaturePriority,     // Re-order story queue
    ArchitectureChange,  // Major tech stack change
    BudgetIncrease,      // Need more funds
    AINodeSelection,     // Choose specific AI node
}
```

**Example governance:**

```
Proposal: "Add mobile app to roadmap (requires +3 SOL funding)"
    ↓
Token holders vote (1 token = 1 vote)
    ↓
If >50% approve:
  - Additional funding released from reserves
  - Mobile stories added to queue
  - Development continues
```

---

## Integration with Existing Milestones

### Milestone 0-1: Works Same Way

**Architecture + Story workflow unchanged:**
- Someone funds escrow (client OR token sale proceeds)
- AI nodes bid and work
- QA validates
- Payments release

**Difference:** Escrow funded by **token sale** instead of **client wallet**

---

### Milestone 2 (MCP): New Token Launch Option

**MCP flow updated:**

```typescript
// New MCP tool
{
  name: 'create_project_token',
  description: 'Launch project token to community-fund development',
  inputSchema: {
    type: 'object',
    properties: {
      symbol: { type: 'string' },
      name: { type: 'string' },
      fundingTarget: { type: 'number' },
      creatorAllocation: { type: 'number', default: 0.20 }
    }
  }
}
```

**Client chooses funding method:**
```
A) Self-fund (pay 14.2 SOL yourself)
B) Launch token (community funds via $FEXP)
```

---

### Milestone 3 (Social): Token Holders Join Community

**AI personas promote tokens:**

```
@AlexArchitectAI tweets:
"Just won the bid for $FEXP architecture!
Building expense tracking for freelancers.

Token holders can follow progress:
americannerd.com/tokens/FEXP

Delivery ETA: 48 hours 🚀"
```

**Community engagement:**
- Token holders join project Discord
- Discuss features, vote on priorities
- Promote project (aligned incentives)
- Create memes, content (viral marketing)

---

## Revenue Model Changes

### Platform Revenue (With Tokens)

**Option A (Client-funded):**
```
Client pays from wallet
├─ Work: 15.2 SOL
├─ Platform fee (5%): 0.76 SOL
└─ Total: 15.96 SOL from client
```

**Option B (Token-funded via pump.fun):**
```
Platform creates token on behalf of client:

Token allocation:
├─ Creator: 15% (150M tokens, vested)
├─ Platform: 5% (50M tokens)
├─ Dev fund: 20% (200M tokens, SOLD IMMEDIATELY)
└─ Public: 60% (600M tokens, bonding curve)

Dev fund sale:
├─ Sells 200M tokens → Raises 20 SOL
└─ ALL 20 SOL → Development escrow (no platform cut)

Platform revenue:
├─ Owns 50M tokens (5%)
├─ Value at launch: ~5 SOL
├─ Value if graduates (0.003 SOL): ~150 SOL
├─ Plus: Trading fees on platform-owned tokens
└─ Upside aligned with project success
```

**Platform earns MORE from successful token projects:**
- Token fails: ~5 SOL (just allocation value)
- Token succeeds: 150+ SOL (appreciation)
- Token goes viral: 500+ SOL (major win)

---

### Creator Revenue (pump.fun Fees)

**pump.fun creator fee mechanism:**

```typescript
// Creator claims accumulated trading fees
async function claimCreatorFees(creatorWallet: Keypair) {
  const claimTx = await axios.post(
    `https://pumpportal.fun/api/trade?api-key=${API_KEY}`,
    {
      action: "collectCreatorFee",
      priorityFee: 0.000001,
    }
  );

  // Sign and send
  const tx = VersionedTransaction.deserialize(
    Buffer.from(claimTx.data, 'base64')
  );
  tx.sign([creatorWallet]);
  await connection.sendRawTransaction(tx.serialize());
}
```

**Creator earnings:**

```
Launch day:
├─ Vested tokens: 150M (worth ~15 SOL at floor)
└─ Trading fees: 0 SOL (no trades yet)

Week 1 (100 SOL trading volume):
├─ Vested tokens: 150M (worth ~45 SOL, price increased)
├─ Trading fees: ~1 SOL (accumulated from buys/sells)
└─ Claimable: 1 SOL

Project complete (500 SOL lifetime volume):
├─ Vested tokens: 150M (worth ~450 SOL if successful)
├─ Trading fees: ~5 SOL (accumulated)
└─ Total: ~455 SOL (~$91k)
```

**Creator earns from:**
1. Token appreciation (15% vested allocation)
2. Trading fees (pump.fun mechanism, claimed via PumpPortal)
3. No upfront payment needed

---

## Graduation Mechanism (pump.fun Model)

### Bonding Curve → DEX Migration

**When market cap hits threshold (e.g., 100 SOL):**

```
1. Lock bonding curve (no more buys/sells on curve)

2. Create Raydium liquidity pool
   ├─ Migrate all SOL from bonding curve
   ├─ Pair with remaining token supply
   └─ Create FEXP/SOL pool

3. Enable full trading
   └─ Token now trades on Jupiter, Raydium, etc.

4. Burn liquidity LP tokens (permanent liquidity)

5. Update status: Graduated
```

**Benefits:**
- ✅ Organic price discovery (market-driven)
- ✅ Higher liquidity (DEX aggregators)
- ✅ Token becomes real asset
- ✅ Project success = token success

---

## Success Metrics

### Milestone 4 Complete When:

**Token Launches:**
- ✅ 10+ projects launch tokens (vs self-funding)
- ✅ Average funding time: <7 days (target reached)
- ✅ 80%+ of token projects reach funding goal
- ✅ Average holder count: 50+ per project

**Community Engagement:**
- ✅ Active trading (100+ buys/sells per day)
- ✅ Token holder participation in governance
- ✅ Discord communities formed around tokens
- ✅ Viral marketing from holders (memes, tweets)

**Platform Economics:**
- ✅ Platform earns from token sales (5% of volume)
- ✅ Platform holds token allocations (upside exposure)
- ✅ Revenue 2x vs transaction fee model

**Project Success:**
- ✅ Token-funded projects complete at same rate as self-funded
- ✅ 3+ projects graduate to DEX (market cap > 100 SOL)
- ✅ Early token buyers see avg 5-10x returns

---

## Open Questions

1. **Minimum Funding:** What if token only raises 50% of target? Partial refund or continue with smaller scope?
2. **Creator Allocation:** 20% standard, or variable based on creator reputation?
3. **Vesting:** Should creator tokens vest over time (prevent rug pulls)?
4. **Refunds:** If project fails, do token holders get refund from escrow?
5. **Revenue Sharing:** Should all tokens get revenue share, or opt-in model?
6. **Graduation Threshold:** 100 SOL market cap, or dynamic based on project size?

---

## Comparison to pump.fun

| Feature | pump.fun | American Nerd Tokens |
|---------|----------|---------------------|
| **Purpose** | Meme coin speculation | Fund real software development |
| **Bonding curve** | ✅ Yes (sqrt) | ✅ Yes (sqrt) |
| **Graduation** | ✅ Raydium at market cap | ✅ Raydium at 100 SOL |
| **Utility** | ❌ None (pure speculation) | ✅ Governance, revenue share, product access |
| **Underlying asset** | ❌ Nothing | ✅ Real software project with PRD, architecture, code |
| **Value drivers** | Memes, community hype | Project completion milestones, user adoption |
| **Risk** | 100% could go to zero | Funded development continues regardless |

**We're pump.fun meets Kickstarter meets software development marketplace** 🚀

---

## Next: Milestone 5+

With token launchpad, what's next?

- **Milestone 5:** Multi-token portfolios (invest in basket of projects)
- **Milestone 6:** DAO governance (token holder DAOs control projects)
- **Milestone 7:** Revenue-generating projects (SaaS with token buybacks)

**Milestone 4 unlocks speculation-driven growth and community-funded development.** 🎉
