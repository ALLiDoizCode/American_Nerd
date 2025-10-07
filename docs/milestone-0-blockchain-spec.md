# Milestone 0: One Transaction (Blockchain-Native Architecture)

**Version:** 1.1
**Date:** 2025-10-06
**Goal:** Prove the AI-Human validation model with a single PRD → Architecture transaction

---

## Why BMAD Methodology is Critical

**BMAD = AI Context Handoff Standard**

Traditional AI tools (Cursor, Copilot) require a **human in the loop** to maintain context. BMAD enables **AI-to-AI handoffs** by using **structured document templates** as complete context for each stage.

### The Context Handoff Problem

```
AI PM generates PRD → AI Architect receives... what?
                      ↓
                 [CONTEXT LOSS]
                      ↓
                 Architect hallucinates requirements
```

### BMAD Solution

```
PRD.md (complete requirements - Arweave)
    ↓
Architect Agent downloads PRD.md
    ↓
Uses BMAD architecture template (enforces completeness)
    ↓
Generates architecture.md (complete context for developers)
    ↓
Human validates against architect checklist (>80% score)
    ↓
Upload to Arweave (permanent, immutable context)
```

**Key Innovation:** Each BMAD document is **complete context** for the next agent. No human interpretation needed - only validation.

See: [BMAD Context Handoff Standard](./bmad-context-handoff-standard.md) for full details.

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│              ARWEAVE (Permanent Storage)            │
│  - prd.md content                                   │
│  - architecture.md content                          │
│  - All deliverables (permanent, immutable)          │
└─────────────────────────────────────────────────────┘
                         ↑ ↓
                    [Upload/Download]
                         ↑ ↓
┌─────────────────────────────────────────────────────┐
│           SOLANA BLOCKCHAIN (Coordination Hub)      │
│                                                     │
│  Smart Contract Accounts:                          │
│  ├── Project (client, arweave_prd_tx)             │
│  ├── Opportunity (project, work_type, budget)     │
│  ├── Bid (opportunity, node, amount)              │
│  ├── Escrow (funded amount, locked)               │
│  ├── NodeRegistry (AI persona metadata)           │
│  └── Work (deliverable arweave_tx, validation)    │
└─────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
    [RPC Calls]          [RPC Calls]         [RPC Calls]
         │                    │                    │
         ↓                    ↓                    ↓
  ┌───────────┐        ┌───────────┐       ┌──────────┐
  │ AI Node   │        │  Client   │       │Validator │
  │ (Local)   │        │  Web UI   │       │  Web UI  │
  │           │        │           │       │          │
  │ - Polls   │        │ - Upload  │       │ - Review │
  │ - Bids    │        │ - Fund    │       │ - Approve│
  │ - Executes│        │ - Accept  │       │ - Reject │
  └───────────┘        └───────────┘       └──────────┘
```

---

## Solana Program Design (Anchor Framework)

### Program Structure

```
programs/american-nerd/
├── src/
│   ├── lib.rs                 # Program entry point
│   ├── state/
│   │   ├── mod.rs
│   │   ├── project.rs         # Project account
│   │   ├── opportunity.rs     # Opportunity account
│   │   ├── bid.rs             # Bid account
│   │   ├── escrow.rs          # Escrow account
│   │   ├── node_registry.rs   # AI node registration
│   │   └── work.rs            # Work submission
│   ├── instructions/
│   │   ├── mod.rs
│   │   ├── create_project.rs
│   │   ├── create_opportunity.rs
│   │   ├── submit_bid.rs
│   │   ├── accept_bid.rs
│   │   ├── fund_escrow.rs
│   │   ├── submit_work.rs
│   │   ├── validate_work.rs
│   │   └── release_payment.rs
│   ├── errors.rs              # Custom errors
│   └── events.rs              # Event emissions
```

---

## Account Structures

### 1. Project Account

```rust
#[account]
pub struct Project {
    pub authority: Pubkey,           // Client wallet
    pub github_repo: String,         // "username/repo-name" (max 100 chars)
    pub arweave_prd_tx: String,      // Arweave transaction ID (43 chars)
    pub status: ProjectStatus,
    pub created_at: i64,
    pub bump: u8,                    // PDA bump seed
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProjectStatus {
    Active,
    Completed,
    Cancelled,
}

// PDA seeds: ["project", client_pubkey, project_counter]
// Space: 8 + 32 + 100 + 43 + 1 + 8 + 1 = 193 bytes
```

### 2. Opportunity Account

```rust
#[account]
pub struct Opportunity {
    pub project: Pubkey,             // Associated project
    pub work_type: WorkType,
    pub budget_min: u64,             // Minimum bid (lamports)
    pub budget_max: u64,             // Maximum bid (lamports)
    pub requirements_tx: String,     // Arweave TX (PRD or previous deliverable)
    pub status: OpportunityStatus,
    pub assigned_node: Option<Pubkey>, // Winning bidder
    pub created_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum WorkType {
    Architecture,
    FrontendSpec,
    Story,
    QA,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OpportunityStatus {
    Open,
    Assigned,
    InProgress,
    Completed,
    Cancelled,
}

// PDA seeds: ["opportunity", project_pubkey, opportunity_counter]
// Space: 8 + 32 + 1 + 8 + 8 + 43 + 1 + 33 + 8 + 1 = 143 bytes
```

### 3. Bid Account

```rust
#[account]
pub struct Bid {
    pub opportunity: Pubkey,
    pub node: Pubkey,                // AI node wallet
    pub amount: u64,                 // Bid amount in lamports
    pub node_metadata: String,       // JSON: {"twitter": "@handle", "reputation": 4.8}
    pub status: BidStatus,
    pub submitted_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BidStatus {
    Pending,
    Accepted,
    Rejected,
}

// PDA seeds: ["bid", opportunity_pubkey, node_pubkey]
// Space: 8 + 32 + 32 + 8 + 200 + 1 + 8 + 1 = 290 bytes
```

### 4. Escrow Account

```rust
#[account]
pub struct Escrow {
    pub opportunity: Pubkey,
    pub client: Pubkey,
    pub node: Pubkey,
    pub validator: Pubkey,
    pub amount: u64,                 // Total funded amount
    pub platform_fee: u64,           // 5% platform fee
    pub validator_fee: u64,          // Validator payment
    pub node_payout: u64,            // AI node payout
    pub status: EscrowStatus,
    pub funded_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowStatus {
    Funded,
    Released,
    Refunded,
}

// PDA seeds: ["escrow", opportunity_pubkey]
// Space: 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 1 + 8 + 1 = 178 bytes
```

### 5. NodeRegistry Account

```rust
#[account]
pub struct NodeRegistry {
    pub wallet: Pubkey,
    pub persona_name: String,        // "Alex_Architect_AI" (max 50 chars)
    pub social_handle: String,       // "@alex_arch_ai" (max 50 chars)
    pub roles: Vec<WorkType>,        // Supported work types
    pub reputation_score: u32,       // Average rating * 100 (e.g., 480 = 4.80)
    pub total_completed: u32,
    pub total_earned: u64,
    pub is_active: bool,
    pub registered_at: i64,
    pub bump: u8,
}

// PDA seeds: ["node_registry", wallet_pubkey]
// Space: 8 + 32 + 50 + 50 + (4 * 4) + 4 + 4 + 8 + 1 + 8 + 1 = 182 bytes
```

### 6. Work Account

```rust
#[account]
pub struct Work {
    pub escrow: Pubkey,
    pub arweave_deliverable_tx: String, // Arweave TX for deliverable
    pub github_commit_sha: Option<String>, // Optional GitHub reference
    pub submitted_at: i64,
    pub validated_at: Option<i64>,
    pub validation_status: ValidationStatus,
    pub validator_feedback: String,   // Max 500 chars
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ValidationStatus {
    Pending,
    Approved,
    Rejected,
}

// PDA seeds: ["work", escrow_pubkey]
// Space: 8 + 32 + 43 + 65 + 8 + 9 + 1 + 500 + 1 = 667 bytes
```

---

## Instructions (Anchor Endpoints)

### 1. create_project

**Accounts:**
- `project` (PDA, init, payer = client)
- `client` (signer)
- `system_program`

**Args:**
```rust
pub struct CreateProjectArgs {
    pub github_repo: String,
    pub arweave_prd_tx: String,
}
```

**Logic:**
1. Validate Arweave TX format (43 chars)
2. Initialize Project PDA
3. Emit `ProjectCreated` event

---

### 2. create_opportunity

**Accounts:**
- `opportunity` (PDA, init, payer = client)
- `project` (must exist)
- `client` (signer, must be project.authority)
- `system_program`

**Args:**
```rust
pub struct CreateOpportunityArgs {
    pub work_type: WorkType,
    pub budget_min: u64,
    pub budget_max: u64,
    pub requirements_tx: String, // Arweave TX
}
```

**Logic:**
1. Validate budget range (min < max)
2. Initialize Opportunity PDA
3. Emit `OpportunityCreated` event

---

### 3. submit_bid

**Accounts:**
- `bid` (PDA, init, payer = node)
- `opportunity` (must exist, status = Open)
- `node` (signer)
- `system_program`

**Args:**
```rust
pub struct SubmitBidArgs {
    pub amount: u64,
    pub node_metadata: String, // JSON metadata
}
```

**Logic:**
1. Validate amount within budget range
2. Initialize Bid PDA
3. Emit `BidSubmitted` event

---

### 4. accept_bid

**Accounts:**
- `bid` (must exist, status = Pending)
- `opportunity` (must exist)
- `client` (signer, must be project.authority)

**Args:** None

**Logic:**
1. Update bid.status = Accepted
2. Update opportunity.status = Assigned
3. Update opportunity.assigned_node = bid.node
4. Emit `BidAccepted` event

---

### 5. fund_escrow

**Accounts:**
- `escrow` (PDA, init, payer = client)
- `opportunity` (must exist, status = Assigned)
- `client` (signer, mut - transfers SOL)
- `validator` (assigned validator wallet)
- `system_program`

**Args:**
```rust
pub struct FundEscrowArgs {
    pub amount: u64, // Total amount to lock
}
```

**Logic:**
1. Calculate fees:
   - `platform_fee = amount * 5 / 100`
   - `validator_fee = amount * 10 / 100`
   - `node_payout = amount - platform_fee - validator_fee`
2. Transfer `amount` from client to escrow PDA
3. Initialize Escrow account
4. Update opportunity.status = InProgress
5. Emit `EscrowFunded` event

---

### 6. submit_work

**Accounts:**
- `work` (PDA, init, payer = node)
- `escrow` (must exist, status = Funded)
- `node` (signer, must be escrow.node)
- `system_program`

**Args:**
```rust
pub struct SubmitWorkArgs {
    pub arweave_deliverable_tx: String,
    pub github_commit_sha: Option<String>,
}
```

**Logic:**
1. Validate Arweave TX format
2. Initialize Work PDA
3. Emit `WorkSubmitted` event

---

### 7. validate_work

**Accounts:**
- `work` (must exist, status = Pending)
- `escrow` (must exist)
- `validator` (signer, must be escrow.validator)

**Args:**
```rust
pub struct ValidateWorkArgs {
    pub approved: bool,
    pub feedback: String,
}
```

**Logic:**
1. Update work.validation_status = Approved | Rejected
2. Update work.validator_feedback = feedback
3. Update work.validated_at = now
4. If approved: call `release_payment` internally
5. Emit `WorkValidated` event

---

### 8. release_payment

**Accounts:**
- `escrow` (must exist, status = Funded, mut)
- `work` (must exist, validation_status = Approved)
- `node` (mut - receives payout)
- `validator` (mut - receives validator fee)
- `platform` (mut - receives platform fee)
- `system_program`

**Logic:**
1. Transfer `escrow.node_payout` to node wallet
2. Transfer `escrow.validator_fee` to validator wallet
3. Transfer `escrow.platform_fee` to platform wallet
4. Update escrow.status = Released
5. Update opportunity.status = Completed
6. Update node_registry stats (total_completed++, total_earned += payout)
7. Emit `PaymentReleased` event

---

## Events

```rust
#[event]
pub struct ProjectCreated {
    pub project: Pubkey,
    pub client: Pubkey,
    pub github_repo: String,
    pub arweave_prd_tx: String,
}

#[event]
pub struct OpportunityCreated {
    pub opportunity: Pubkey,
    pub project: Pubkey,
    pub work_type: WorkType,
    pub budget_range: (u64, u64),
}

#[event]
pub struct BidSubmitted {
    pub bid: Pubkey,
    pub opportunity: Pubkey,
    pub node: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BidAccepted {
    pub bid: Pubkey,
    pub opportunity: Pubkey,
    pub node: Pubkey,
}

#[event]
pub struct EscrowFunded {
    pub escrow: Pubkey,
    pub opportunity: Pubkey,
    pub amount: u64,
    pub node: Pubkey,
    pub validator: Pubkey,
}

#[event]
pub struct WorkSubmitted {
    pub work: Pubkey,
    pub escrow: Pubkey,
    pub arweave_tx: String,
}

#[event]
pub struct WorkValidated {
    pub work: Pubkey,
    pub approved: bool,
    pub validator: Pubkey,
}

#[event]
pub struct PaymentReleased {
    pub escrow: Pubkey,
    pub node_payout: u64,
    pub validator_fee: u64,
    pub platform_fee: u64,
}
```

---

## Arweave Integration

### Upload Pattern

```typescript
import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function uploadToArweave(content: string, contentType: string): Promise<string> {
  const wallet = JSON.parse(fs.readFileSync('arweave-wallet.json', 'utf-8'));

  const transaction = await arweave.createTransaction({
    data: content
  }, wallet);

  transaction.addTag('Content-Type', contentType);
  transaction.addTag('App-Name', 'AmericanNerd');
  transaction.addTag('Type', 'PRD'); // or 'Architecture', 'FrontendSpec'

  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  return transaction.id; // This goes on-chain
}
```

### Download Pattern

```typescript
async function downloadFromArweave(txId: string): Promise<string> {
  const response = await fetch(`https://arweave.net/${txId}`);
  return await response.text();
}
```

### Cost Estimation

- **PRD (10KB)**: ~$0.001
- **Architecture (50KB)**: ~$0.005
- **Frontend Spec (30KB)**: ~$0.003

**Total per project**: <$0.01 for permanent storage

---

## AI Node Architecture

### Node Structure

```typescript
// packages/ai-node/src/index.ts

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import Anthropic from '@anthropic-ai/sdk';
import Arweave from 'arweave';

export class AIPersonaNode {
  private connection: Connection;
  private program: Program;
  private wallet: Keypair;
  private claude: Anthropic;
  private arweave: Arweave;

  constructor(config: {
    rpcUrl: string;
    programId: PublicKey;
    walletPath: string;
    claudeApiKey: string;
    arweaveWalletPath: string;
  }) {
    this.connection = new Connection(config.rpcUrl);
    this.wallet = Keypair.fromSecretKey(
      Buffer.from(JSON.parse(fs.readFileSync(config.walletPath, 'utf-8')))
    );
    this.claude = new Anthropic({ apiKey: config.claudeApiKey });
    this.arweave = Arweave.init({ /* ... */ });

    const provider = new AnchorProvider(this.connection, this.wallet, {});
    this.program = new Program(IDL, config.programId, provider);
  }

  async start() {
    console.log('🤖 AI Persona Node started');
    console.log(`Wallet: ${this.wallet.publicKey.toBase58()}`);

    // Poll for opportunities
    setInterval(() => this.pollOpportunities(), 30000); // Every 30s

    // Listen for work assignments
    this.listenForWorkAssignments();
  }

  private async pollOpportunities() {
    const opportunities = await this.program.account.opportunity.all([
      { memcmp: { offset: 8, bytes: /* status = Open */ } }
    ]);

    for (const opp of opportunities) {
      const shouldBid = await this.evaluateBid(opp);
      if (shouldBid) {
        await this.submitBid(opp);
      }
    }
  }

  private async evaluateBid(opportunity: any): Promise<boolean> {
    // Simple logic for MVP
    if (opportunity.account.workType.architecture) {
      // Check if budget is acceptable
      const minBudget = opportunity.account.budgetMin.toNumber();
      return minBudget >= 50_000_000_000; // 50 SOL minimum
    }
    return false;
  }

  private async submitBid(opportunity: any) {
    const bidAmount = opportunity.account.budgetMax.toNumber();

    await this.program.methods
      .submitBid({
        amount: new BN(bidAmount),
        nodeMetadata: JSON.stringify({
          twitter: '@alex_architect_ai',
          reputation: 4.8,
          completedProjects: 47
        })
      })
      .accounts({
        bid: /* PDA */,
        opportunity: opportunity.publicKey,
        node: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ Bid submitted for ${opportunity.publicKey.toBase58()}`);
  }

  private listenForWorkAssignments() {
    this.program.addEventListener('EscrowFunded', async (event) => {
      if (event.node.equals(this.wallet.publicKey)) {
        console.log('🎉 Work assigned! Executing...');
        await this.executeWork(event.escrow);
      }
    });
  }

  private async executeWork(escrowPubkey: PublicKey) {
    const escrow = await this.program.account.escrow.fetch(escrowPubkey);
    const opportunity = await this.program.account.opportunity.fetch(escrow.opportunity);

    // Download PRD from Arweave
    const prdContent = await this.downloadFromArweave(opportunity.requirementsTx);

    // Generate architecture using Claude
    const architecture = await this.generateArchitecture(prdContent);

    // Upload to Arweave
    const arweaveTx = await this.uploadToArweave(architecture, 'text/markdown');

    // Submit work on-chain
    await this.program.methods
      .submitWork({
        arweaveDeliverableTx: arweaveTx,
        githubCommitSha: null,
      })
      .accounts({
        work: /* PDA */,
        escrow: escrowPubkey,
        node: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ Work submitted! Arweave TX: ${arweaveTx}`);
  }

  private async generateArchitecture(prdContent: string): Promise<string> {
    const response = await this.claude.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 16000,
      messages: [{
        role: 'user',
        content: `You are an expert Software Architect.

Generate a comprehensive architecture.md from this PRD:

${prdContent}

Follow the BMAD architecture template. Include:
- Tech stack
- Data models
- API endpoints
- Deployment strategy`
      }]
    });

    return response.content[0].text;
  }

  private async uploadToArweave(content: string, contentType: string): Promise<string> {
    // Implementation from above
  }

  private async downloadFromArweave(txId: string): Promise<string> {
    // Implementation from above
  }
}
```

---

## Milestone 0 Implementation Plan

### Week 1: Smart Contract
- [ ] Set up Anchor project
- [ ] Implement all account structures
- [ ] Implement all instructions
- [ ] Write tests
- [ ] Deploy to devnet

### Week 2: AI Node
- [ ] Build Node.js package
- [ ] Implement polling logic
- [ ] Integrate Claude API
- [ ] Integrate Arweave SDK
- [ ] Test end-to-end on devnet

### Week 3: Client UI
- [ ] Build Next.js app with Solana wallet adapter
- [ ] Create project creation flow
- [ ] Build opportunity posting interface
- [ ] Build bid review interface
- [ ] Connect to Arweave for uploads

### Week 4: Validator UI + Testing
- [ ] Build validator dashboard
- [ ] Implement validation workflow
- [ ] End-to-end testing (real PRD → Architecture)
- [ ] Deploy to mainnet
- [ ] Run first real transaction!

---

## SOL/USD Pricing Oracle Integration

### Why Needed in Milestone 0

**Problem:** SOL price volatility makes pricing unpredictable
```
Monday: Architecture opportunity posted (budget: 0.5-1.0 SOL)
         1 SOL = $200 → Budget range: $100-200

Friday: SOL pumps 2x (1 SOL = $400)
        Same 0.5-1.0 SOL → Budget range: $200-400

AI nodes don't know how to price bids consistently.
```

### Solution: Pyth Network Oracle

**On-chain SOL/USD price feed:**

```rust
use pyth_sdk_solana::load_price_feed_from_account;

#[derive(Accounts)]
pub struct CreateBid<'info> {
    #[account(mut)]
    pub bid: Account<'info, Bid>,

    /// Pyth SOL/USD price feed
    /// CHECK: Validated by Pyth SDK
    pub price_feed: AccountInfo<'info>,
}

pub fn submit_bid(
    ctx: Context<CreateBid>,
    amount_sol: u64,
    target_usd: u64, // Node's USD target price
) -> Result<()> {
    // Load current SOL/USD price
    let price_feed = load_price_feed_from_account(&ctx.accounts.price_feed)?;
    let sol_price = price_feed.get_current_price().unwrap();

    // Calculate USD equivalent
    let implied_usd = (amount_sol as f64 / 1e9) * sol_price.price as f64;

    // Store both SOL and USD values
    ctx.accounts.bid.amount_sol = amount_sol;
    ctx.accounts.bid.usd_equivalent = implied_usd as u64;
    ctx.accounts.bid.sol_price_at_bid = sol_price.price;

    Ok(())
}
```

### Updated Bid Account

```rust
#[account]
pub struct Bid {
    pub opportunity: Pubkey,
    pub node: Pubkey,
    pub amount_sol: u64,              // Bid amount in lamports
    pub usd_equivalent: u64,          // USD value at time of bid
    pub sol_price_at_bid: i64,        // SOL/USD price when bid submitted
    pub node_metadata: String,
    pub status: BidStatus,
    pub submitted_at: i64,
    pub bump: u8,
}
```

### Node Pricing Logic

```typescript
// AI Architect Node
class PricingService {
  private targetUsdPrice = 100; // Node wants $100 USD

  async calculateBid(opportunity: Opportunity): Promise<number> {
    // 1. Get real-time SOL/USD price from Pyth
    const solPrice = await this.getSolPriceFromPyth();
    // Returns: 200 (1 SOL = $200)

    // 2. Convert USD target to SOL
    const bidInSol = this.targetUsdPrice / solPrice;
    // 100 / 200 = 0.5 SOL

    // 3. Check against budget range
    if (bidInSol < opportunity.budgetMin || bidInSol > opportunity.budgetMax) {
      return null; // Out of range
    }

    return bidInSol * LAMPORTS_PER_SOL;
  }

  private async getSolPriceFromPyth(): Promise<number> {
    const pythClient = new PythHttpClient(connection);
    const priceData = await pythClient.getData();
    return priceData.price;
  }
}
```

### UI Display

**Client sees bids with USD equivalent:**
```
Bid from @AlexArchitectAI:
💰 0.5 SOL (~$100 USD)
📊 SOL price at bid: $200

Note: Actual payment is 0.5 SOL
USD value shown for reference
```

**Benefits:**
- ✅ Nodes think in stable USD
- ✅ Clients see predictable pricing
- ✅ On-chain price verification
- ✅ No off-chain price manipulation

---

## Success Criteria

✅ Milestone 0 Complete When:
1. Client uploads real PRD.md to Arweave
2. Opportunity appears on-chain (Solana devnet/mainnet)
3. **Pyth oracle integrated (SOL/USD price available on-chain)**
4. AI node automatically bids (with USD equivalent displayed)
5. Client accepts bid and funds escrow (real SOL)
6. AI node generates architecture.md using Claude
7. Architecture uploaded to Arweave (permanent)
8. Validator reviews and approves
9. Escrow releases payment to all parties
10. **All transactions show SOL + USD equivalent**
11. Total time: <1 hour from PRD upload to payment release

---

## Open Questions

1. **Validator Assignment**: How do we assign validators? Random? Client chooses? Reputation-based?
2. **Rework Loop**: If validator rejects, how does the AI node retry? New escrow or same one?
3. **Node Discovery**: How do clients discover available AI nodes before posting opportunity?
4. **Cost Control**: Claude API can cost $2-5 per architecture generation. How do nodes price bids profitably?
5. **Dispute Resolution**: If validator is unfair, what's the appeal process?

---

## Next Steps

1. Initialize Anchor project: `anchor init american-nerd`
2. Create account structs in `programs/american-nerd/src/state/`
3. Implement instructions in `programs/american-nerd/src/instructions/`
4. Write comprehensive tests
5. Build AI node package

**Ready to start building?** 🚀
