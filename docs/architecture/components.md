# Components

## Solana Programs (Anchor Smart Contracts)

**Responsibility:** Core blockchain state management, business logic enforcement, and payment coordination via CPI to custom escrow program

**Key Interfaces:**
- **Instructions (RPC endpoints):**
  - `create_project(prd_tx, github_repo, funding_type)` → Project account
  - `create_opportunity(project, work_type, budget_sol, requirements_tx, min_price_usd)` → Opportunity account (enforces $2.50 minimum via Pyth oracle)
  - `submit_bid_with_stake(opportunity, amount_sol, estimated_hours, stake_sol)` → Bid account + StakeEscrow (validates tier requirements)
  - `accept_bid(opportunity, bid)` → Initialize custom escrow via CPI, lock stake, update Opportunity status
  - `submit_work(opportunity, deliverable_tx, github_commit_sha, staging_url)` → Work account
  - `submit_automated_validation(pr, checks_passed, checks_failed, deployment_url)` → AutomatedValidation account (from GitHub Actions webhook)
  - `validate_work(work)` → Updates Work, releases escrow via CPI (85% dev, 5% QA, 10% platform OR $0.25 min), returns stake if passed, **calls update_node_tier_on_success()**
  - `slash_stake(stake_escrow, reason)` → Slashes stake on 3+ validation failures (50% to project, 50% burned), **calls update_node_tier_on_failure()**
  - `create_epic(project, epic_number, title, description, story_count)` → Epic account
  - `create_story(project, epic_id, story_number, description_tx, budget_sol)` → Story account
  - `submit_pr(story, pr_number, head_sha, target_branch)` → PullRequest account (target: development/staging/main)
  - `post_story_deployment(story, development_url)` → Updates Story.staging_url (development branch deployment)
  - `complete_epic(epic)` → Marks epic as ReadyForStaging when all stories complete
  - `post_epic_deployment(epic, staging_url)` → Updates Epic.staging_url (staging branch deployment)
  - `post_production_deployment(project, production_url)` → Updates Project.production_url (main branch deployment)
  - `register_node(persona_name, node_type, social_handles)` → NodeRegistry account (initializes tier 0)
  - `update_node_tier_on_success(node_registry)` → **Increments projects_completed, projects_attempted, recalculates tier/stake/limits using formulas (v3.4 infinite tier system)**
  - `update_node_tier_on_failure(node_registry)` → **Increments projects_attempted only, recalculates tier/stake/limits (success rate drops, tier may decrease)**
  - `initialize_token_funding(project, pump_fun_mint, dev_budget)` → ProjectToken account
  - `update_project_milestone(project, milestone_data)` → Triggers token holder updates

**Dependencies:**
- Custom Escrow Program (payment coordination via CPI)
- Pyth Network (price oracle for SOL/USD conversion)
- Solana runtime (account storage, transaction processing)

**Technology Stack:**
- Rust (Solana program language)
- Anchor 0.30.0+ (framework for account serialization, CPI, validation)
- anchor-spl (SPL token interactions)

---

## AI Agent Node Runtime

**Responsibility:** Autonomous AI worker that polls for opportunities, generates deliverables, and submits work on-chain

**Key Interfaces:**
- **Event Listeners:**
  - `onOpportunityCreated(opportunity)` → Evaluate and potentially bid
  - `onBidAccepted(opportunity, bid)` → Begin work execution
  - `onAutomatedValidationFailed(story, validation)` → Process failures, auto-fix

- **Work Execution APIs (by agent type):**
  - **Architect:** `generateArchitecture(prdArweaveTx)` → architecture.md + upload to Arweave
  - **Developer:** `generateStoryCode(storyTx, architectureTx)` → Code + GitHub PR
  - **Developer:** `autoFixCode(validationResults, prNumber)` → Updated code + push commits
  - **Infrastructure:** `setupCICD(projectId, architectureTx)` → GitHub Actions workflows
  - **Infrastructure:** `deployToStaging(buildArtifacts, projectType)` → Arweave/Akash URLs

- **Blockchain Interaction:**
  - `submitBid(opportunityId, amountSol)`
  - `submitWork(opportunityId, arweaveTx, githubSha)`
  - `updateNodeStatus(isActive, currentLoad)`

**Dependencies:**
- Solana Programs (via @solana/web3.js)
- Arweave (via @ardrive/turbo-sdk)
- GitHub MCP server (github/github-mcp-server - official, remote or self-hosted)
- Claude API (via @anthropic-ai/sdk)
- mem0 (self-hosted memory layer)
- Social platforms (Twitter/X, Discord, Telegram via MCP servers or direct SDKs - research pending)
- Local MCP server (agent-to-agent communication)

**Technology Stack:**
- Node.js 20 LTS runtime
- TypeScript 5.3+
- @solana/web3.js + @coral-xyz/anchor (blockchain client)
- @anthropic-ai/sdk (Claude integration)
- @ardrive/turbo-sdk (Arweave uploads)
- mem0 SDK (memory persistence)
- PM2 (process management, auto-restart)

---

## Infrastructure/DevOps AI Agent (Specialized Node Type)

**Responsibility:** Sets up CI/CD pipelines, manages deployments to decentralized infrastructure (Arweave + Akash), posts staging URLs on-chain

**Key Interfaces:**
- **Infrastructure Setup:**
  - `setupGitHubActions(projectId, techStack)` → Creates .github/workflows/ files based on architecture.md
  - `generateArweaveWorkflow(frontendType)` → Workflow for Next.js/React/Vue static exports to Arweave
  - `generateAkashSDL(backendType, resources)` → SDL file for API/backend deployment to Akash Network
  - `configureWebhooks(projectId)` → Sets up GitHub Actions → Solana webhook

- **Deployment Execution:**
  - `deployFrontendToArweave(buildDir)` → Upload via Turbo SDK, returns TX ID and gateway URL
  - `deployBackendToAkash(dockerImage, sdlFile)` → Create lease, deploy to provider, returns provider URL
  - `monitorDeploymentHealth(deploymentUrl)` → Health checks, retry on failure
  - `postStagingURL(storyId, url)` → Submit URL to Solana smart contract

- **Cost Management:**
  - `calculateDeploymentCost(projectType, size)` → Estimate Arweave/Akash costs
  - `trackInfrastructureCosts(nodeId)` → Track operating expenses (deducted from story payment)

- **Multi-Chain Wallet Management (SOL→AKT Swaps):**
  - `monitorAKTBalance(cosmosAddress)` → Check AKT balance via Cosmos RPC
  - `shouldRefillAKT(balance, threshold)` → Determine if refill needed (threshold: 15 AKT)
  - `calculateSwapAmount(currentBalance, threshold)` → Determine SOL amount to swap
  - `swapSOLtoAKT(amountSOL, minAKTOut, destination)` → Execute swap via Rango Exchange
  - `checkSwapStatus(requestId)` → Poll swap completion (6-13 min avg)
  - `logSwapCost(nodeId, costUSD, txHash)` → Track swap costs for accounting
  - `autoRefillAKT(nodeWallet, threshold)` → Automated refill orchestration (runs every 6 hours via GitHub Actions)

**Dependencies:**
- Arweave Turbo SDK (@ardrive/turbo-sdk) - Frontend deployments
- Akash CLI wrapper (custom) - Backend deployments
- Rango Exchange SDK (rango-sdk-basic) - SOL→AKT cross-chain swaps (primary)
- THORChain SDK (@xchainjs/xchain-thorchain-amm) - SOL→AKT swaps (backup)
- Cosmos SDK (@cosmjs/stargate) - AKT balance monitoring
- GitHub Actions API (via @octokit/rest) - Workflow creation
- Solana Programs - Post URLs on-chain
- Claude API - Generate workflows and SDL files from architecture.md

**Technology Stack:**
- Node.js 20 LTS runtime
- TypeScript 5.3+
- @ardrive/turbo-sdk (Arweave uploads, ~$0.09 per 10MB frontend)
- Custom Akash CLI wrapper (SDL deployment, ~$3-5/month per backend)
- rango-sdk-basic (SOL→AKT swaps, primary)
- @xchainjs/xchain-thorchain-amm (SOL→AKT swaps, backup)
- @cosmjs/stargate (AKT balance monitoring, Cosmos SDK integration)
- @octokit/rest (GitHub API client)
- @solana/web3.js (post URLs on-chain)
- PM2 (process management)

**Cost Model:**
- Infrastructure nodes pay deployment costs as operating expenses
- Frontend: ~$0.09 per Arweave upload (10MB Next.js app)
- Backend: ~$3-5/month per Akash service
- Cross-chain swaps: ~$1/month per node (automated SOL→AKT refills via Rango Exchange)
- Nodes deduct 1% from story payment to cover infrastructure costs (85% → 84% developer payout)

**Multi-Chain Wallet Management & SOL→AKT Swap Architecture:**

Infrastructure nodes earn payments in SOL but require AKT tokens for Akash deployments. Automated cross-chain swaps eliminate manual intervention:

**Wallet Structure:**
```typescript
interface InfrastructureNodeWallet {
  solana: {
    hotWallet: Keypair;        // For receiving payments, signing transactions
    balance: number;            // SOL balance
  };
  cosmos: {
    address: string;            // Akash-compatible Cosmos address
    mnemonic: string;           // HD wallet seed (BIP39)
    aktBalance: number;         // Current AKT balance
  };
  swapConfig: SwapConfig;      // Configurable auto-refill settings
}

interface SwapConfig {
  akt_refill_threshold: number;        // Default: 15 AKT (trigger refill when below)
  akt_target_balance: number;          // Default: 22.5 AKT (threshold × 1.5 buffer)
  max_swap_amount_sol: number;         // Default: 0.5 SOL (safety limit per swap)
  slippage_tolerance_percent: number;  // Default: 3% (increase to 5% on retry)
  check_interval_hours: number;        // Default: 6 hours
  primary_protocol: 'rango' | 'thorchain'; // Default: 'rango'
  enable_auto_refill: boolean;         // Default: true
}
```

**Swap Solution Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  Infrastructure Node                             │
│                                                                   │
│  ┌──────────────┐         ┌─────────────────┐                  │
│  │ Balance      │         │   Swap Service  │                  │
│  │ Monitor      │────────▶│                 │                  │
│  │ (every 6hr)  │ AKT<15? │ MultiProtocol   │                  │
│  └──────────────┘         │ SwapService     │                  │
│                            └────────┬────────┘                  │
│                                     │                            │
│                         ┌───────────▼──────────┐                │
│                         │   Try Rango First    │                │
│                         │  (95%+ success)      │                │
│                         └───────────┬──────────┘                │
│                                     │                            │
│                              Success│  Failure                   │
│                         ┌───────────▼──────────┐                │
│                         │ Fallback: THORChain  │                │
│                         │  (90-95% success)    │                │
│                         └──────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                                     │
                         ┌───────────▼──────────────────┐
                         │   Rango Exchange API         │
                         │   (rango-sdk-basic)          │
                         └───────────┬──────────────────┘
                                     │
                    Route: SOL → USDC → ATOM → AKT
                    Time: 6-13 minutes
                    Fee: 1.3% (~$0.42 on $50 swap)
                                     │
                         ┌───────────▼──────────────────┐
                         │  AKT arrives in Cosmos wallet│
                         │  Resume Akash deployments    │
                         └──────────────────────────────┘
```

**Primary Solution: Rango Exchange**
- **Type:** Cross-chain DEX aggregator (106+ DEXs, 26+ bridges, 77+ chains)
- **npm:** `rango-sdk-basic@latest`
- **Route:** SOL → USDC (Jupiter) → USDC (Wormhole) → ATOM (Osmosis) → AKT (Osmosis)
- **Hops:** 3-5 (automatically optimized)
- **Completion Time:** 6-13 minutes average
- **Fees:** ~1.3% (0% platform fee + protocol fees only)
- **Success Rate:** 95%+ (validated $4.3B+ volume since 2021)
- **Security:** Non-custodial, uses audited protocols (Jupiter, Wormhole, Osmosis)
- **KYC:** None (wallet signatures only)
- **TypeScript:** ✅ Full native support with type definitions

**Backup Solution: THORChain/THORSwap**
- **Type:** Multi-chain liquidity protocol
- **npm:** `@xchainjs/xchain-thorchain-amm@latest`
- **Route:** SOL → RUNE → ATOM → AKT
- **Hops:** 3
- **Completion Time:** 4-5 minutes average
- **Fees:** ~1.6%
- **Success Rate:** 90-95%
- **Use Case:** Fallback when Rango unavailable/fails

**Auto-Refill Implementation (with Configurable Settings):**

```typescript
// Runs based on config.check_interval_hours via GitHub Actions
async function autoRefillAKT(nodeWallet: InfrastructureNodeWallet) {
  const config = nodeWallet.swapConfig;

  // Check if auto-refill is enabled
  if (!config.enable_auto_refill) {
    console.log('[AutoRefill] Auto-refill disabled for this node');
    return;
  }

  // 1. Check AKT balance
  const aktBalance = await getAKTBalance(nodeWallet.cosmos.address);

  if (aktBalance >= config.akt_refill_threshold) {
    console.log(`[AutoRefill] Balance sufficient: ${aktBalance} AKT >= ${config.akt_refill_threshold} AKT`);
    return; // No refill needed
  }

  // 2. Calculate swap amount based on configured target
  const neededAKT = config.akt_target_balance - aktBalance;
  const solToSwap = Math.min(
    calculateSOLAmount(neededAKT),
    config.max_swap_amount_sol // Safety limit
  );

  console.log(`[AutoRefill] Triggering swap: ${aktBalance} AKT < ${config.akt_refill_threshold} AKT threshold`);
  console.log(`[AutoRefill] Target: ${config.akt_target_balance} AKT, Needed: ${neededAKT} AKT`);

  // 3. Execute swap via configured protocol (with fallback)
  const swapService = new MultiProtocolSwapService(config.primary_protocol);
  const result = await swapService.swapSOLtoAKT(
    solToSwap,
    neededAKT * (1 - config.slippage_tolerance_percent / 100), // Apply configured slippage
    nodeWallet.cosmos.address
  );

  // 4. Log cost for accounting
  await logDeploymentCost({
    nodeId: nodeWallet.solana.hotWallet.publicKey.toBase58(),
    type: 'swap',
    chain: 'solana+cosmos',
    cost: result.totalCostUSD,
    txHash: result.txHash,
    requestId: result.requestId,
    protocol: result.protocol // 'rango' or 'thorchain'
  });

  console.log(`[AutoRefill] Swapped ${solToSwap} SOL → ${result.amountAKTReceived} AKT via ${result.protocol}`);
  console.log(`[AutoRefill] Cost: $${result.totalCostUSD} (${(result.totalCostUSD / (solToSwap * 200) * 100).toFixed(2)}%)`);
}

// Node operators can update config via API or UI
async function updateSwapConfig(nodeId: string, updates: Partial<SwapConfig>) {
  const config = await getNodeSwapConfig(nodeId);

  // Validate updates
  if (updates.akt_refill_threshold !== undefined && updates.akt_refill_threshold < 5) {
    throw new Error('Threshold must be at least 5 AKT');
  }
  if (updates.max_swap_amount_sol !== undefined && updates.max_swap_amount_sol > 2.0) {
    throw new Error('Max swap amount cannot exceed 2.0 SOL for safety');
  }

  // Apply updates
  Object.assign(config, updates);
  await saveNodeSwapConfig(nodeId, config);

  console.log(`[Config] Updated swap config for node ${nodeId}:`, updates);
}
```

**Cost Tracking Integration:**

Swap costs are logged to the `deployment_costs` table (see wallet management research) alongside Arweave/Akash costs:

```sql
INSERT INTO deployment_costs (
  node_id,
  cost_type,           -- 'swap'
  blockchain,          -- 'solana+cosmos'
  amount_usd,          -- $0.42-$0.67 per swap
  transaction_hash,
  external_reference,  -- Rango requestId
  protocol_used,       -- 'rango' or 'thorchain'
  created_at
) VALUES (...);
```

**Monitoring & Alerting:**

```typescript
// Health check (every 1 minute)
const healthMonitor = new SwapHealthMonitor();
const health = await healthMonitor.checkHealth();

if (health.rango.score < 50 && health.thorchain.score < 50) {
  alertAdmin('⚠️ All swap protocols degraded! Check manually.');
}

// Cost tracking alert (daily)
const monthlyCost = await getTotalSwapCostsThisMonth(nodeId);
if (monthlyCost > expectedBudget * 1.5) {
  alertAdmin(`Node ${nodeId} swap costs exceed budget: $${monthlyCost}`);
}
```

**Production-Ready Code:**
- `/docs/examples/swap-sol-to-akt-rango.ts` (376 LOC, Rango integration)
- `/docs/examples/swap-sol-to-akt-thorchain.ts` (289 LOC, THORChain backup)
- `/docs/examples/github-actions-auto-refill-akt.yml` (GitHub Actions workflow)

**Research & Decision Documentation:**
- `/docs/sol-to-akt-swap-research.md` (20,000 words, comprehensive analysis)
- `/docs/sol-to-akt-swap-decision-brief.md` (executive summary, GO recommendation)

**Git Branching & Deployment Strategy:**

Projects use **Git Flow** with three long-lived branches, each deploying to Arweave on merge:

```
main (production)
  ↑
staging (epic integration)
  ↑
development (story integration)
  ↑
feature/story-{id} (individual stories)
```

**1. Story-Level Deployments (development branch)**:
   - Developer AI completes story → PR from `feature/story-123` to `development`
   - Automated validation passes → PR auto-merges to `development`
   - GitHub Actions triggers build + deploy to Arweave
   - New TX ID: `https://arweave.net/{dev-story-123-tx-id}`
   - Posted on-chain: `Story.staging_url = dev-story-123-tx-id`
   - **Token holders see:** Individual story testing URL (development environment)

**2. Epic-Level Deployments (staging branch)**:
   - All stories in epic complete → Epic marked complete on-chain
   - Infrastructure AI creates PR: `development` → `staging`
   - Automated validation runs against full epic integration
   - PR merges → Deploy to Arweave
   - New TX ID: `https://arweave.net/{staging-epic-5-tx-id}`
   - Posted on-chain: `Epic.staging_url = staging-epic-5-tx-id`
   - **Token holders see:** Full epic integration URL (staging environment)

**3. Project-Level Deployments (main branch)**:
   - All epics complete → Project marked complete on-chain
   - Infrastructure AI creates PR: `staging` → `main`
   - Final validation + production readiness checks
   - PR merges → Deploy to Arweave
   - New TX ID: `https://arweave.net/{prod-project-123-tx-id}`
   - Posted on-chain: `Project.production_url = prod-project-123-tx-id`
   - **Token holders see:** Production-ready deployment

**Deployment URL Hierarchy:**

| Environment | Branch | Trigger | URL Field | Example | Audience |
|-------------|--------|---------|-----------|---------|----------|
| **Development** | `development` | Story merge | `Story.staging_url` | `arweave.net/abc123` | Developers testing individual stories |
| **Staging** | `staging` | Epic complete | `Epic.staging_url` | `arweave.net/def456` | Token holders testing epic integration |
| **Production** | `main` | Project complete | `Project.production_url` | `arweave.net/ghi789` | End users, final product |

**Arweave Deployment Tracking (On-Chain)**:

```rust
// Story account (development deployments)
pub struct Story {
    // ... existing fields ...
    pub staging_url: Option<String>,        // Development branch TX ID
    pub deployment_count: u8,               // Number of times deployed
}

// Epic account (staging deployments)
pub struct Epic {
    pub epic_id: u64,
    pub project: Pubkey,
    pub staging_url: Option<String>,        // Staging branch TX ID
    pub story_count: u16,
    pub completed_stories: u16,
    pub status: EpicStatus,                 // InProgress, ReadyForStaging, Completed
}

// Project account (production deployments)
pub struct Project {
    // ... existing fields ...
    pub development_url: Option<String>,    // Latest dev branch TX ID
    pub staging_url: Option<String>,        // Latest staging branch TX ID
    pub production_url: Option<String>,     // Main branch TX ID (final)
}
```

**Backend Deployment Strategy (Akash)**:

Backends are **mutable** (unlike frontends), so we use single persistent Akash deployment per environment:

| Environment | Akash Deployment | Update Method | URL |
|-------------|-----------------|---------------|-----|
| **Development** | 1x Akash lease (persistent) | In-place updates via SDL redeploy | `https://{dev-provider}.akash.network` |
| **Staging** | 1x Akash lease (persistent) | In-place updates via SDL redeploy | `https://{staging-provider}.akash.network` |
| **Production** | 1x Akash lease (persistent) | In-place updates via SDL redeploy | `https://{prod-provider}.akash.network` |

**Cost Implications:**
- **Frontend (Arweave):** ~$0.09 per deployment × 3 environments × 40 stories = **~$10.80 per project**
- **Backend (Akash):** $3/month × 3 environments = **$9/month per project** (stopped when project completes)

**Token Holder Experience:**

```
Project Dashboard (Token Holder View):
├─ 🏗️  Development: https://arweave.net/abc123 (40/40 stories merged)
├─ 🧪 Staging: https://arweave.net/def456 (10/10 epics integrated)
└─ 🚀 Production: https://arweave.net/ghi789 (FINAL - Project Complete!)

Story Progress:
├─ Epic 1: Authentication (✅ Deployed to staging)
│   ├─ Story 1.1: Login page ✅ (dev: arweave.net/s1)
│   ├─ Story 1.2: Signup flow ✅ (dev: arweave.net/s2)
│   └─ Epic 1 staging URL: arweave.net/e1
├─ Epic 2: Dashboard (🔄 4/5 stories complete)
│   ├─ Story 2.1: UI layout ✅ (dev: arweave.net/s3)
│   ├─ Story 2.2: Data fetch ✅ (dev: arweave.net/s4)
│   └─ Story 2.3: Charts 🔄 (in progress)
```

**Recommended Approach for MVP:**
- Use **direct Arweave/Akash URLs** (no custom DNS)
- Deploy to all 3 environments (development/staging/production)
- Track deployment URLs on-chain for full transparency
- Add optional custom subdomains post-MVP if needed (`dev.project-123.slopmachine.fun`)

---

## Remote MCP Server (Human Client Interface)

**Responsibility:** Provides Claude Desktop integration for non-technical users via MCP tools; uses deep links for wallet transactions (no private key access)

**Key Interfaces:**
- **MCP Tools (via fastmcp):**
  - `brainstorm_idea(initial_concept)` → analyst.txt agent workflow
  - `conduct_market_research(topic)` → Web search + analysis
  - `create_brief(brainstorm_results)` → brief.md using BMAD template
  - `generate_prd(brief)` → prd.md using BMAD PRD template
  - `upload_to_arweave(content, metadata)` → Arweave TX ID (paid with SOL via Turbo)
  - `create_project(prd_tx, github_repo, funding_type)` → Generates deep link → Project created
  - `launch_token(project, token_name, symbol)` → PumpPortal API + deep link → Token launched
  - `post_opportunity(project, work_type, budget_usd)` → Converts USD to SOL via Pyth → Deep link
  - `view_bids(opportunity_id)` → Fetch bids from blockchain
  - `accept_bid(opportunity_id, bid_id)` → Deep link for escrow funding
  - `review_work(work_id, decision, feedback, score)` → Deep link for validation transaction

**Dependencies:**
- Solana RPC (Helius) for read-only blockchain queries
- @ardrive/turbo-sdk for Arweave uploads
- PumpPortal API for token creation
- Pyth oracle for SOL/USD conversion
- Wallet deep link generators (Phantom, Solflare, Backpack)

**Technology Stack:**
- Node.js 20 LTS
- TypeScript 5.3+
- fastmcp (MCP framework)
- @solana/web3.js (read-only RPC calls)
- @ardrive/turbo-sdk

**Deployment:**
- **Platform:** Fly.io (selected for WebSocket support, global edge, 256MB free tier)
- **URL:** `https://mcp.slopmachine.com` (production), `https://mcp-staging.slopmachine.com` (devnet)
- **Configuration:** `fly.toml` in `packages/remote-mcp-server/`
- **Scaling:** Auto-scale to 2-4 instances based on load
- **Cost:** ~$5-10/month production (256MB RAM, 1 shared CPU)

---

## Local MCP Server (AI Agent Interface)

**Responsibility:** Provides same MCP tools as Remote MCP but with direct wallet access for autonomous AI agent transactions

**Key Interfaces:**
- **MCP Tools (same as Remote MCP):** All tools from Remote MCP
- **Wallet Management:**
  - `sign_and_submit_transaction(tx)` → Signs with local keypair, submits to Solana
  - `get_balance()` → Current SOL balance
  - `set_spending_limit(max_sol_per_tx, daily_limit)` → Safety controls

**Dependencies:**
- Solana Programs (full read/write access)
- Local encrypted keypair storage
- Same external integrations as Remote MCP (Arweave, PumpPortal, Pyth)

**Technology Stack:**
- Node.js 20 LTS
- TypeScript 5.3+
- fastmcp (MCP framework)
- @solana/web3.js (full transaction signing)
- @coral-xyz/anchor (typed contract calls)
- Keypair encryption (libsodium or similar)

---

## Shared Packages (Monorepo)

**Responsibility:** Common types, utilities, and interfaces shared across all components

**Key Interfaces:**
- **@slop-machine/types:**
  - TypeScript types/interfaces for all data models
  - Anchor IDL-generated types
  - Enum definitions (WorkType, ProjectStatus, etc.)

- **@slop-machine/utils:**
  - `calculateSOLFromUSD(usdAmount, pythPrice)` → SOL amount
  - `generatePDA(seeds, programId)` → PublicKey
  - `validateArweaveTx(txId)` → boolean
  - `formatWalletAddress(pubkey)` → shortened display

- **@slop-machine/bmad:**
  - BMAD template loaders
  - Document sharding utilities (md-tree integration)
  - Context handoff helpers

**Dependencies:**
- None (pure utilities)

**Technology Stack:**
- TypeScript 5.3+
- Vitest (unit testing)

---
