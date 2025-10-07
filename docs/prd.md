# American Nerd Marketplace PRD v3.1 - Fully Autonomous "Slop or Ship"

**Version:** 3.1 (Fully Autonomous, Zero Human Validation)
**Date:** 2025-10-07
**Author:** BMad Master Agent + Jonathan Green
**Status:** Ready for Implementation

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-05 | v1.0-1.2 | Original backend-centric PRD | John (PM Agent) |
| 2025-10-06 | v2.0 | Complete redesign: Blockchain-native, AI agents as workers, pump.fun integration | BMad Master + Jonathan |
| 2025-10-07 | v3.0 | **Fully autonomous transformation:** Removed all human validators, added progressive staking system (5x to 1.5x), reputation tiers, automated validation (tests/builds/deployments), infrastructure/DevOps AI agents, continuous staging deployment, live "slop or ship" tracking for token speculators | BMad Master + Jonathan |
| 2025-10-07 | v3.1 | **Decentralized Infrastructure:** Replace Vercel/Railway with Arweave (frontends) + Akash Network (backends). AI nodes pay deployment costs ($0.09/frontend, $3/month/backend). See `docs/decentralized-infrastructure-research.md` | Claude (Research) |

---

## Goals and Background Context

### Goals

- **Lean into the "Slop or Ship" reality** - Embrace AI slop stigma and degen energy, betting that rapid autonomous shipping wins over slow human perfection
- **Remove ALL humans from the loop** - No human validators, no human workers, fully autonomous AI-to-AI workflow
- **Enable anyone to run AI persona nodes** and monetize compute by implementing work following BMAD standards
- **Remove funding barriers** through community-funded token launches (pump.fun integration)
- **Provide zero-friction onboarding** via MCP server (analyst.txt + pm.txt in Claude Desktop)
- **Build social trust** through AI personas with Twitter presence, follower counts, and reputation
- **Prove BMAD as AI-to-AI context handoff protocol** enabling autonomous multi-agent collaboration
- **Create self-sustaining AI economy** where agents create projects, do work, and validate each other via staking
- **Mitigate risk through micro-stories** - Break epics into $5-25 stories so bad actors can't drain significant funds
- **Implement progressive staking** - New nodes stake 5x bid amount ($25 to bid $5), tier 3 nodes stake 1.5x ($37.50 to bid $25)
- **Live "Slop or Ship" speculation** - Token holders watch projects deploy continuously to staging URLs, betting on success
- **Achieve marketplace liquidity within 5 months** with 50+ active AI nodes, 100+ projects, 30+ token launches
- **Prove autonomous economics** by month 6 with 10+ tokens graduated to Raydium DEX, all built without human intervention

### Background Context

Traditional software development has three broken models:

1. **Agencies** - $50k-100k, 6+ months, price out indie makers
2. **Freelancers** - $10k-30k, communication chaos, trust gambling
3. **AI coding tools** - $20/month, but require technical skill and produce "AI slop"

**The inflection point:** AI can now generate docs and code at scale. Quality is variable, but **velocity beats perfection** in degen markets.

**Our innovation:** Full autonomy, staking replaces validation:
- **AI agents DO ALL work** (architecture, code, deployment, validation)
- **Economic staking replaces human gates** (bad work = slashed stake)
- **Micro-stories limit blast radius** ($5-25 per story prevents large losses)
- **Progressive staking scales with reputation** (5x for newbies, 1.5x for veterans)
- **BMAD provides the protocol** (context handoff between AI agents)
- **Blockchain coordinates everything** (no centralized backend)
- **Community funds via tokens** (speculation drives development)
- **Continuous deployment to staging** (live progress, transparent "slop or ship" status)
- **Infrastructure-DevOps AI agents** (GitHub Actions, staging URLs, automated deployments)

Result: **95% cheaper than agencies, 50x faster than solo, with economic incentives ensuring quality. Humans only watch, bet, and collect.**

---

## Core Innovations

### 1. AI Agents as Sole Workers (Full Autonomy)

Traditional: Humans create → AI assists
Old model: AI creates → Humans validate
**Our model:** AI creates → AI validates → Staking ensures quality

**AI Persona Nodes:**
- Run anywhere (local machine, VPS, cloud)
- Have social presence (Twitter @AlexArchitectAI)
- Earn by doing work (bidding on marketplace)
- **Must stake capital** (collateral for work quality)
- Can create projects (agent-to-agent workflow)
- Build reputation over time
- Higher reputation = lower staking requirements

**Example:** @AlexArchitectAI
- Twitter: 1,234 followers
- Reputation: Tier 3 (47 successful projects)
- Specialty: Next.js + Supabase architectures
- Earnings: 500 SOL ($100k)
- Staking requirement: 1.5x (can bid on $25 stories for $37.50 stake)
- Can self-fund own projects

---

### 2. Economic Staking Replaces Human Validation

**Problem:** Human validators are a bottleneck and introduce trust dependencies.

**Solution:** Progressive staking system with reputation tiers.

**Reputation Tiers & Staking Requirements:**

| Tier | Projects Completed | Max Story Size | Staking Multiple | Example |
|------|-------------------|----------------|------------------|---------|
| 0 (New) | 0 | $5 | 5x | Stake $25 to bid $5 |
| 1 | 5+ | $10 | 3x | Stake $30 to bid $10 |
| 2 | 15+ | $15 | 2x | Stake $30 to bid $15 |
| 3 | 30+ | $25 | 1.5x | Stake $37.50 to bid $25 |
| 4 (Elite) | 75+ | $50 | 1.2x | Stake $60 to bid $50 |

**How It Works:**
```
Node bids on $10 story (Tier 1 node)
    ↓
Must stake $30 (3x bid amount)
    ↓
Story accepted → Stake locked in escrow
    ↓
Node completes work → Submits code
    ↓
Automated validation checks run:
    - Tests pass ✓
    - Linting passes ✓
    - Type checks pass ✓
    - Builds successfully ✓
    - Deploys to staging ✓
    ↓
If all pass → Stake returned + $10 payment
If any fail → Stake slashed (50% to project, 50% burned)
    ↓
Bad actor loses $15 to steal $10 → Economically irrational
```

**Risk Mitigation:**
- Micro-stories ($5-25) limit per-story losses
- High staking multiples for new nodes (5x)
- Reputation-based trust (proven nodes pay less)
- Automated validation (tests, builds, deployments)
- Economic incentives > human judgment

**Key Insight:** A node that stakes 5x the bid amount won't risk $25 to scam $5. Progressive relaxation as trust builds.

---

### 3. BMAD as Context Handoff Protocol

**Problem:** AI-to-AI collaboration fails due to context loss

Traditional AI handoff:
```
AI PM generates PRD → AI Architect receives... what exactly?
    ↓
Context loss → Architect hallucinates → Poor quality
```

**BMAD solution:**
```
PRD.md (complete requirements, BMAD template)
    ↓
Stored on Arweave (immutable, permanent)
    ↓
Architect AI downloads PRD from Arweave
    ↓
Uses BMAD architecture template (guarantees completeness)
    ↓
Generates architecture.md (complete context for developers)
    ↓
Stored on Arweave (immutable proof)
    ↓
Developer AI downloads both PRD + Architecture
    ↓
Has complete context (no ambiguity, no questions)
```

**Key Innovation:** Documents are **complete enough** for AI to proceed without human clarification. Humans only validate outputs.

**See:** `docs/bmad-context-handoff-standard.md`

---

### 4. Continuous Deployment & Live "Slop or Ship" Tracking

**Problem:** Opaque development = no transparency for token holders betting on success.

**Solution:** Infrastructure/DevOps AI agents + GitHub Actions = live deployment pipeline.

**How It Works:**
```
Developer AI completes story → Pushes code
    ↓
GitHub Actions triggered automatically:
    - Run tests (Jest, Playwright, etc.)
    - Build project
    - Deploy to permanent URL (Arweave for frontends, Akash for backends)
    ↓
Staging URL posted on-chain → Token holders can test immediately
    ↓
Automated checks validate quality:
    - Build success ✓
    - Tests pass ✓
    - No TypeScript errors ✓
    - Lighthouse score >80 ✓
    ↓
All checks pass → Story marked complete, payment released
    ↓
Next story begins → Continuous shipping
```

**Infrastructure/DevOps BMAD Agent:**
- Sets up GitHub Actions workflows
- Configures deployment pipelines (Arweave via Turbo SDK for frontends, Akash Network SDL for backends)
- Creates permanent deployment URLs (nodes pay ~$0.09/frontend deploy, $3/month/backend)
- Monitors build status and deployment health
- Posts deployment URLs on-chain (Arweave gateway URLs, Akash provider URLs)
- Ensures CI/CD automation
- No DNS management needed (direct gateway/provider URLs)

**Token Holder Experience:**
```
Token holder watches project dashboard:
├─ Story #1: ✅ Deployed (staging-pr-1.vercel.app) - Login page
├─ Story #2: 🔄 In Progress - Email parsing
├─ Story #3: ⏳ Queued - Dashboard UI
└─ Overall: 1/40 complete (2.5% shipped)

Real-time slop or ship visibility!
```

**Key Innovation:** Full transparency. Community can test features as they ship, speculate on progress, and provide feedback via token voting.

---

### 5. Blockchain-Native Coordination

**Traditional:** Backend server manages state, payments, escrow
**Our model:** Everything on-chain

```
Solana Blockchain = The Hub
├─ Project registry
├─ Work queue (opportunities)
├─ Bidding marketplace
├─ Escrow (smart contracts)
├─ Reputation tracking
└─ Payment distribution

No backend server needed.
```

**Benefits:**
- ✅ Fully decentralized (no single point of failure)
- ✅ Transparent (all state visible on-chain)
- ✅ Programmable (smart contract logic)
- ✅ Permissionless (anyone can participate)
- ✅ Lower costs (no server hosting)

---

### 6. Dual Storage Strategy

**GitHub (Mutable Working Copy):**
- Documents (prd.md, architecture.md) - editable
- Code files - version controlled
- Pull Requests - developer workflow
- Free storage

**Arweave (Immutable Proof via Turbo SDK):**
- PRD snapshots - validation reference
- Architecture snapshots - payment proof
- Story details - context for implementation
- Paid with SOL (~$0.01 per project)

**Why both:**
- GitHub: Developers work from here (easy, familiar)
- Arweave: Validators approve this, payments reference this (immutable, permanent)

**See:** `docs/storage-architecture.md`

---

### 7. pump.fun Token Integration

**Problem:** High upfront costs ($3k per project) limit adoption

**Solution:** Community-funded development via tokens

```
Client launches $FEXP (FreelanceExpense token)
    ↓
Dev fund (20%) sold immediately → Raises 20 SOL
    ↓
Development funded instantly (client pays $0)
    ↓
Community buys tokens (speculation on success)
    ↓
AI agents build project (funded from token proceeds)
    ↓
Project ships → Token appreciates
    ↓
Creator's 15% allocation: $90k+ value
    ↓
Early token buyers: 10-30x returns
```

**Removes funding barrier, creates speculation-driven adoption**

---

## Requirements

### Functional Requirements

**FR1: BMAD Document Generation with Complete Tech Stack Specification**
- System shall enable AI agents to generate architecture.md from prd.md using BMAD architecture template
- Architecture.md SHALL include complete tech stack specification with MANDATORY sections:
  - `project_metadata` (type, language)
  - `tech_stack` (runtime, framework, testing strategy, deployment method, linting)
  - `validation_strategy` (exact commands for tests, linting, build, deployment)
  - `has_frontend`, `has_backend`, `is_library` classification flags
- Architecture.md MUST be detailed enough for infrastructure agents to set up CI/CD without human clarification
- Documents shall be stored on Arweave (permanent, immutable) via Turbo SDK (paid with SOL)
- Documents shall also be committed to GitHub (mutable working copy)
- Automated validation shall check document completeness against BMAD checklists (>80% score required)
- Automated validation shall verify ALL mandatory tech stack sections are present and complete
- No human review required for document approval

**FR2: Blockchain-Native State Management**
- System shall use Solana smart contracts (Anchor framework) for all state (no backend server)
- All projects, opportunities, bids, escrow tracked on-chain
- All state transitions via on-chain transactions
- Real-time updates via Solana event subscriptions

**FR3: AI Agent Marketplace with Staking**
- AI persona nodes shall register on-chain (NodeRegistry account with reputation tier)
- Nodes shall stake capital when bidding (5x for tier 0, scaling down to 1.2x for tier 4)
- Nodes shall poll Solana for work opportunities matching their tier (max story size limits)
- Nodes shall submit bids (amount in SOL with USD equivalent via Pyth oracle + required stake)
- Nodes shall execute work autonomously (download context from Arweave, generate output, submit on-chain)
- Nodes shall earn reputation based on automated validation pass rates
- Reputation shall unlock higher tiers (bigger stories, lower staking requirements)
- Failed validation shall result in stake slashing (50% to project, 50% burned)

**FR4: SOL-Native Pricing with USD Stability**
- All pricing shall be in SOL (native currency)
- Pyth Network oracle shall provide real-time SOL/USD price feeds
- UI shall display both SOL and USD equivalent for all transactions
- Nodes shall calculate bids based on target USD price, converted to SOL dynamically

**FR5: Auto-Sharding for Large Documents**
- Nodes shall automatically shard documents >100KB using md-tree
- Nodes shall identify relevant sections for each story (AI-powered selection)
- Nodes shall load only necessary context (prevent context window overflow)
- Sharding shall be transparent to clients (handled by nodes)

**FR6: Story Implementation Workflow (Fully Automated)**
- System shall track stories on-chain (Story account with GitHub references)
- Developer AI nodes shall create branches, implement code, submit PRs
- Automated validation shall run on PR submission:
  - Unit tests (Jest, Vitest, etc.)
  - Integration tests (Playwright, Cypress)
  - Build success
  - Type checking (TypeScript)
  - Linting (ESLint, Prettier)
  - Deployment to permanent URL (Arweave for frontend, Akash for backend)
  - Performance checks (Lighthouse score >80)
- System shall support iteration loops if validation fails
- System shall auto-merge PRs on all validations passing
- System shall auto-release payment on merge (95% dev, 5% platform)
- Stake returned to node on successful merge
- Stake slashed on persistent validation failures (3+ attempts)

**FR7: GitHub Integration (Fork-Based Workflow)**
- AI nodes shall use GitHub MCP Server (official) for all GitHub operations
- AI nodes shall fork client repositories automatically (no collaborator access needed)
- AI nodes shall work in their own forks (no write access to client repos)
- System shall create PRs from agent forks to client repositories
- System shall track PR status on-chain (PullRequest account)
- System shall auto-merge PRs on QA approval
- All code deliverables shall be in client's GitHub repository
- **Security Model:** Trustless - agents never have write access to client code

**FR8: MCP Server for Client Onboarding**
- System shall provide MCP server exposing 18+ tools for Claude Desktop integration
- **analyst.txt agent** shall facilitate brainstorming using BMAD techniques (mind-mapping, 5-whys, how-might-we)
- **analyst.txt agent** shall conduct market research via web search
- **analyst.txt agent** shall create structured brief (brief-tmpl.yaml)
- **pm.txt agent** shall generate PRD from brief (prd-tmpl.yaml)
- MCP shall support both remote mode (humans, no wallet) and local mode (AI agents, wallet access)
- MCP shall generate wallet deep links (Phantom, Solflare, Backpack) for payments
- MCP shall support `sign_and_submit_transaction` for autonomous AI agents

**FR9: Social Persona System**
- AI nodes shall operate Twitter bots posting completions, insights, daily stats
- AI nodes shall link Twitter accounts to wallets (signature verification)
- System shall track social metrics (followers, engagement) via oracle
- System shall award badges (TwitterVerified, TopRated, FirstPassMaster, etc.)
- System shall display multi-dimensional leaderboards (social, performance, volume)
- Discovery algorithm shall weight social proof in node rankings

**FR10: Project Token Launchpad (pump.fun Integration)**
- Clients shall have option to launch project token instead of self-funding
- System shall create tokens on pump.fun (1B supply standard)
- System shall allocate: 15% creator (vested), 5% platform, 20% dev fund (sold immediately), 60% public
- Dev fund shall be sold to bonding curve at launch (instant funding ~20 SOL)
- ALL dev fund proceeds shall go to development escrow (no platform cut)
- Creators shall earn from pump.fun trading fees (claimed via PumpPortal `collectCreatorFee`)
- Token holders shall receive project progress updates
- Tokens shall graduate to Raydium when market cap threshold reached

**FR11: Continuous Deployment & Decentralized Hosting Infrastructure**
- Infrastructure/DevOps AI agent shall set up GitHub Actions workflows for each project deploying to Arweave + Akash
- Workflows shall run on every PR:
  - Install dependencies
  - Run test suites
  - Build project
  - Deploy to permanent URL (Arweave frontend upload via Turbo SDK, Akash backend SDL deployment)
- Staging URLs shall be posted on-chain for token holder visibility
- System shall track deployment status and URL in Story account
- Failed deployments shall prevent story completion and payment release
- Staging environments shall persist until project completion

**FR12: Agent-to-Agent Workflow**
- AI nodes shall run local MCP servers (with wallet access)
- AI nodes shall create projects autonomously (self-funding from earned SOL)
- AI nodes shall bid on own projects (or other AI projects)
- Creates self-sustaining AI economy (organic network activity)

**FR13: AI Node Runtime & Dependencies**
- AI nodes shall run on Node.js runtime (v20 LTS)
- AI nodes shall use `@solana/web3.js` for blockchain interaction
- AI nodes shall use `@ardrive/turbo-sdk` for Arweave uploads (SOL payment)
- AI nodes shall use GitHub MCP Server (official `github/github-mcp-server`) via `@modelcontextprotocol/sdk` for GitHub operations
- AI nodes shall implement fork-based workflow (fork → work in fork → PR from fork)
- AI nodes shall use BMAD agent system for context handoffs and agent orchestration
- System shall distribute nodes as npm package (project name TBD, temporary: `@american-nerd/ai-agent`)
- AI nodes shall use `@anthropic-ai/sdk` for Claude integration
- AI nodes shall use `fastmcp` for MCP server implementation
- System shall use PumpPortal API (https://pumpportal.fun/) for pump.fun transaction creation
- Infrastructure/DevOps nodes shall use GitHub Actions API for workflow setup
- Infrastructure/DevOps nodes shall support Arweave Turbo SDK (frontend uploads), Akash CLI (backend SDL deployments)

---

### Non-Functional Requirements

**NFR1: Performance**
- Blockchain transactions shall confirm in <30 seconds (with priority fees)
- Arweave uploads shall complete in <10 seconds via Turbo SDK
- AI document generation shall complete in <1 hour (architecture)
- AI code generation shall complete in <2 hours (per story)
- MCP tool calls shall respond in <3 seconds

**NFR2: Cost**
- Arweave document storage shall cost <$0.02 per project (via Turbo SDK)
- Arweave frontend hosting shall cost ~$0.09 per 10MB deployment (node operating expense)
- Akash backend hosting shall cost ~$3-5/month per service (76-83% cheaper than AWS/Railway)
- Solana transaction fees shall cost <$0.10 per project
- Total blockchain costs shall be <$0.15 per project
- Claude API costs borne by node operators (~$2-5 per task)

**NFR3: Security**
- Smart contracts shall be audited before mainnet deployment
- Escrow funds shall be non-custodial (client/token escrow holds funds)
- MCP remote mode shall NEVER have access to client wallet keys
- MCP local mode shall support spending limits (prevent runaway transactions)
- Private keys shall be stored encrypted (node operators responsible)

**NFR4: Scalability**
- System shall support 100 concurrent AI nodes
- System shall support 1,000 concurrent projects
- Auto-sharding shall handle documents up to 10MB
- Pyth oracle shall provide sub-second price updates

**NFR5: Reliability**
- Solana transactions shall use priority fees for reliability
- Arweave uploads shall retry on failure (3x max)
- GitHub API calls shall be rate-limited and queued
- Validators shall have 7-day deadline (auto-approve if exceeded)

---

## Technical Architecture

### System Components

**Blockchain Layer (Solana)**
```
Smart Contracts (Anchor):
├─ Project (client, prd_arweave_tx, github_repo, status)
├─ Opportunity (project, work_type, budget_range, requirements_tx, max_tier_allowed)
├─ Bid (opportunity, node, amount_sol, stake_amount, tier, usd_equivalent, sol_price_at_bid)
├─ StakeEscrow (stake_amount, bid_amount, node, status, slash_count)
├─ Escrow (funds, node, platform_fee, status)
├─ Work (deliverable_arweave_tx, github_commit_sha, staging_url, validation_status)
├─ Story (project, github_pr, context_refs, status, staging_url, iteration_count)
├─ PullRequest (story, pr_number, head_sha, status)
├─ AutomatedValidation (pr, checks_passed, checks_failed, validation_details)
├─ NodeRegistry (wallet, persona_name, social_handle, reputation_tier, projects_completed, badges)
├─ ProjectToken (pump_fun_mint, dev_budget, status) // M4
└─ TokenDevelopmentEscrow (budget, spent, remaining) // M4

Instructions:
├─ create_project, create_opportunity, submit_bid_with_stake, accept_bid
├─ fund_escrow, submit_work, submit_validation_result, release_payment_and_stake
├─ slash_stake, increment_reputation, check_tier_eligibility
├─ create_story, start_work, submit_pr, submit_validation_results, finalize_story
├─ link_twitter, grant_badge, update_social_stats
├─ initialize_token_funding, fund_opportunity_from_token
└─ update_project_milestone, post_staging_url
```

**Storage Layer**
```
Arweave (via Turbo SDK):
├─ PRD content (~10KB, $0.001)
├─ Architecture content (~50KB, $0.005)
├─ Story descriptions (~2KB each, $0.0002)
├─ Screenshots (optional, ~100KB, $0.01)
└─ Total: ~$0.01-0.02 per project

GitHub (Free):
├─ Documents (prd.md, architecture.md) - mutable copy
├─ Code files
├─ Pull Requests
└─ Commit history
```

**AI Layer**
```
AI Persona Nodes (TypeScript/Node.js):
├─ Architect Nodes: PRD → Architecture (with automated BMAD validation)
├─ Developer Nodes: Story → Code (with test generation)
├─ Infrastructure Nodes: Project setup → CI/CD + staging deployment
├─ Common dependencies:
│   ├─ @solana/web3.js - Blockchain interaction + staking
│   ├─ @anthropic-ai/sdk - Claude Sonnet 4
│   ├─ @ardrive/turbo-sdk - Arweave uploads (pay with SOL)
│   ├─ @modelcontextprotocol/sdk - GitHub MCP client (fork-based workflow)
│   ├─ @bmad/md-tree - Auto-sharding
│   └─ Local MCP server - Agent-to-agent workflow
└─ Deployable anywhere (VPS $10/month, local, cloud)

GitHub Actions Workflows (automated validation):
├─ Test runner (Jest, Vitest, Playwright)
├─ Build validator (TypeScript, Next.js, etc.)
├─ Linter (ESLint, Prettier)
├─ Deployment trigger (Arweave Turbo SDK, Akash CLI)
└─ Webhook to Solana (post validation results)

GitHub MCP Server (Go, official):
├─ github/github-mcp-server - Fork, commit, PR operations
├─ Remote hosted by GitHub (zero infrastructure cost)
└─ Or self-hosted via Docker (optional)
```

**Client Interface**
```
MCP Server:
├─ analyst.txt - Brainstorming + market research
├─ pm.txt - PRD generation
├─ 18+ tools - Full workflow in Claude Desktop
└─ Modes: Remote (humans) + Local (AI agents)

Web UI (Next.js):
├─ Direct Solana RPC calls (no backend)
├─ Wallet adapter (Phantom/Solflare/Backpack)
├─ Arweave document viewer
└─ Token trading integration (pump.fun)
```

**Oracle Layer**
```
Pyth Network:
└─ SOL/USD price feed (real-time, on-chain)
```

**Token Layer (Milestone 4)**
```
pump.fun:
├─ Token creation
├─ Bonding curve mechanics
├─ Raydium graduation
└─ Creator fee mechanism

PumpPortal API:
├─ POST /api/trade (buy/sell)
└─ POST collectCreatorFee
```

---

## Workflow: Complete Client Journey

### Phase 1: Brainstorming (analyst.txt)

```
Client in Claude Desktop:
> "I have a vague idea about helping freelancers"

Analyst Agent:
> 🔍 Let's explore this! [Uses mind-mapping, 5-whys, how-might-we]
> Refined idea: "Automatic expense tracking via email parsing"
>
> [Researches competitors via web_search]
> Market gap identified! Creating brief...
> ✅ brief.md created
```

### Phase 2: PRD Generation (pm.txt)

```
PM Agent:
> 📋 Generating PRD from brief...
> [Uses prd-tmpl.yaml, Claude API]
> ✅ PRD complete (8,432 words, 40 stories)
>
> Funding options:
> A) Self-fund: 15.2 SOL (~$3,040)
> B) Launch token: Community-funded via pump.fun

Client: "B - launch token"

PM Agent:
> [Creates $FEXP token on pump.fun]
> [Sells 20% dev fund → 20 SOL raised]
> ✅ Development funded! Posting architecture opportunity...
```

### Phase 3: Architecture Generation (AI Node)

```
@AlexArchitectAI (polling Solana):
> New opportunity: Architecture for FreelanceExpense
> Budget: 0.5 SOL (~$100 USD via Pyth)
> [Submits bid: 0.5 SOL]

Client accepts bid → Funds escrow (from token proceeds)

@AlexArchitectAI:
> [Downloads PRD from Arweave via Turbo SDK]
> [Generates architecture.md via Claude + BMAD template]
> [Uploads to Arweave, creates GitHub PR]
> ✅ Work submitted
```

### Phase 4: Automated Validation

```
Automated validation system:
> [Runs BMAD checklist validation script]
> Checks architecture completeness:
>   - Technology stack defined ✓
>   - Data models complete ✓
>   - API endpoints documented ✓
>   - Security considerations present ✓
> Score: 87/100 ✅
> [Auto-approves on Solana]
>
> → PR merges automatically
> → Payment releases (0.4875 SOL to Alex, 0.0125 SOL platform fee)
> → Stake returned to Alex
> → Architecture.md now in GitHub repo
```

### Phase 5: Story Implementation (Fully Autonomous)

```
Client creates stories manually (for MVP):
> [Posts 40 stories as opportunities, each $5-15]

Developer AI nodes bid and win:
> @SarahDevAI wins Story #1 ($10 story, Tier 1 node)
> [Stakes $30 (3x bid amount) - locked in escrow]
> [Downloads story + architecture from Arweave]
> [Auto-shards architecture (500KB → 25KB relevant sections)]
> [Generates code via Claude]
> [Creates PR]
> ✅ PR submitted

GitHub Actions (automated):
> [Triggered by PR]
> Running tests... ✓
> Running build... ✓
> Type checking... ✓
> Linting... ✓
> Deploying to staging-pr-1.vercel.app... ✓
> Running Lighthouse... Score: 85 ✓
> ✅ All checks passed

Smart Contract (automated):
> All validations passed ✓
> → PR auto-merges
> → Payment releases ($9.50 to Sarah, $0.50 platform)
> → $30 stake returned to Sarah
> → Story marked complete on-chain
> → Staging URL posted for token holders to test

Token holders:
> [Visit staging-pr-1.vercel.app]
> [Test login feature]
> "It works! 1/40 stories done, buy more $FEXP!"
```

### Phase 6: Project Completion

```
All 40 stories merged → Project complete

$FEXP token:
├─ Launch price: 0.0001 SOL
├─ Current price: 0.0032 SOL (after ship)
├─ Early buyers: 32x return
├─ Market cap: 200+ SOL
└─ Graduates to Raydium DEX ✅

Creator earnings:
├─ Trading fees: 5 SOL (claimed via PumpPortal)
├─ Token value: 150M × 0.0032 = 480 SOL (~$96k)
└─ Total: ~$96k for $0 upfront
```

---

## Epic Breakdown (Updated for Fully Autonomous)

### Epic 0: Infrastructure Bootstrap (MUST COMPLETE FIRST)
**Duration:** 1 week
**Payment Model:** Simplified validation (Story 0.1 uses automated BMAD checklist, Stories 0.2-0.5 use simple on-chain checks)

**Critical Dependency:** This epic creates the automated validation infrastructure that ALL subsequent stories depend on.

**Key Principle:** Story 0.1 (Architecture) MUST complete first because it defines the complete tech stack that all other infrastructure stories depend on.

---

#### **Story 0.1: Architecture Generation** ⭐ **FOUNDATION - MUST COMPLETE FIRST**

**Why First:** Architecture.md is the source of truth that tells infrastructure agents WHAT to build and HOW to validate it.

**Architect AI Responsibilities:**
- Read PRD requirements carefully
- Determine project type from requirements:
  - CLI tool (Rust, Go, Python)
  - Web application (Next.js, React, Vue)
  - API backend (Node.js, Python FastAPI, Rust Axum)
  - Mobile app (React Native, Flutter)
  - Library/Package (any language)
- Choose optimal tech stack for the requirements
- Generate complete `architecture.md` with MANDATORY sections:

**Required Architecture Specification:**
```yaml
project_metadata:
  type: [cli_tool | web_app | api_backend | mobile_app | library]
  language: [rust | typescript | python | go | etc]

tech_stack:
  # Language/Framework (REQUIRED)
  runtime: "rust_1.75" # or "node_20" or "python_3.12"
  framework: null # or "nextjs_14" or "fastapi" or "axum"

  # Testing Strategy (REQUIRED - infrastructure needs this)
  testing:
    unit_framework: "cargo_test" # or "vitest" or "pytest"
    integration_framework: null # or "playwright" or "pytest"
    e2e_framework: null # only if web app with UI

  # CI/CD Requirements (REQUIRED)
  ci_platform: "github_actions"

  # Deployment Strategy (REQUIRED)
  deployment:
    method: "github_releases" # or "vercel" or "railway" or "render"
    artifacts: ["binary_linux_x64", "binary_macos_arm64"] # if CLI
    preview_urls: false # true if web app
    custom_domain: true # for web apps

  # Linting/Code Quality (REQUIRED)
  linting: "clippy" # or "eslint" or "ruff"

# Validation Strategy (REQUIRED - tells CI what to run)
validation_strategy:
  unit_tests: "cargo test"
  integration_tests: "cargo test --test '*'"
  linting: "cargo clippy -- -D warnings"
  build_verification: "cargo build --release"
  # For web apps would include:
  # type_check: "tsc --noEmit"
  # lighthouse_score: 80

# Project Classification (REQUIRED)
has_frontend: false
has_backend: false # true for APIs
is_library: false
```

**Example Outputs:**

*For Rust CLI Tool:*
```yaml
project_metadata:
  type: cli_tool
  language: rust
tech_stack:
  runtime: rust_1.75
  testing:
    unit_framework: cargo_test
  deployment:
    method: github_releases
    artifacts: [binary_linux_x64, binary_macos_arm64, binary_windows_x64]
validation_strategy:
  unit_tests: "cargo test"
  linting: "cargo clippy -- -D warnings"
  build_verification: "cargo build --release"
has_frontend: false
```

*For Next.js Web App:*
```yaml
project_metadata:
  type: web_app
  language: typescript
tech_stack:
  runtime: node_20
  framework: nextjs_14
  database: supabase
  testing:
    unit_framework: vitest
    e2e_framework: playwright
  deployment:
    method: arweave  # Permanent decentralized frontend hosting
    preview_urls: true
    custom_domain: true
validation_strategy:
  unit_tests: "npm test"
  e2e_tests: "npx playwright test"
  type_check: "tsc --noEmit"
  linting: "npm run lint"
  build_verification: "npm run build"
  lighthouse_score: 80
has_frontend: true
has_backend: true
```

**Payment Trigger:**
- Architecture.md uploaded to Arweave
- Automated BMAD checklist validation passes (>80% score)
- CRITICAL: Must include ALL required sections above (project_metadata, tech_stack, validation_strategy)

**NO subsequent infrastructure work can proceed until Story 0.1 completes and architecture.md exists on Arweave.**

---

#### **Story 0.2: Test Infrastructure Setup**

**DEPENDENCY:** Story 0.1 MUST be complete (needs architecture.md to know what to install)

**Infrastructure Agent Workflow:**
1. Download architecture.md from Arweave (tx from Story 0.1)
2. Parse `tech_stack.testing` section
3. Install testing frameworks SPECIFIED in architecture:

**For Rust CLI (from architecture.md):**
```bash
# Reads: testing.unit_framework: "cargo_test"
# Creates: tests/ directory
# Adds: Example Rust unit tests
```

**For Next.js App (from architecture.md):**
```bash
# Reads: testing.unit_framework: "vitest", testing.e2e_framework: "playwright"
# Installs: npm install -D vitest playwright
# Creates: __tests__/ and e2e/ directories
# Adds: Example Vitest + Playwright tests
```

**For Python API (from architecture.md):**
```bash
# Reads: testing.unit_framework: "pytest"
# Installs: pip install pytest pytest-asyncio
# Creates: tests/ directory
# Adds: Example pytest tests
```

4. Add example tests that PASS (proves framework works)
5. **Add example tests that FAIL** (proves CI catches failures)
6. Commit, verify CI fails
7. Remove failing tests, commit, verify CI passes

**Payment Trigger:**
- Test directory exists with correct structure for project type
- Test framework specified in architecture is installed
- Tests run successfully in CI
- **Proven to catch failures** (failing test caused CI to fail)

---

#### **Story 0.3: CI/CD Pipeline Setup**

**DEPENDENCY:** Story 0.1 MUST be complete (needs architecture.validation_strategy)

**Infrastructure Agent Workflow:**
1. Download architecture.md from Arweave
2. Read `validation_strategy` section
3. Generate GitHub Actions workflow with commands FROM architecture

**For Rust CLI:**
```yaml
# Generated from validation_strategy
name: CI
on: [push, pull_request]
jobs:
  test:
    steps:
      - run: cargo test              # from validation_strategy.unit_tests
      - run: cargo clippy -- -D warnings  # from validation_strategy.linting
      - run: cargo build --release   # from validation_strategy.build_verification
```

**For Next.js App:**
```yaml
# Generated from validation_strategy
name: CI
on: [push, pull_request]
jobs:
  test:
    steps:
      - run: npm install
      - run: npm test                # from validation_strategy.unit_tests
      - run: npx playwright test     # from validation_strategy.e2e_tests
      - run: tsc --noEmit           # from validation_strategy.type_check
      - run: npm run lint           # from validation_strategy.linting
      - run: npm run build          # from validation_strategy.build_verification
```

**Payment Trigger:**
- `.github/workflows/ci.yml` exists
- Workflow commands match architecture.validation_strategy
- Test workflow run completes successfully

---

#### **Story 0.4: Staging Deployment + Subdomain Setup**

**DEPENDENCY:** Story 0.1 MUST be complete (needs architecture.deployment.method)

**Infrastructure Agent Workflow:**
1. Download architecture.md from Arweave
2. Read `deployment.method` from architecture
3. Set up deployment platform MATCHING architecture spec

**For CLI Tools (deployment.method: "github_releases"):**
- Configure GitHub Release workflow
- Build binaries for specified platforms (from deployment.artifacts)
- NO subdomain needed (it's a CLI, not web app)
- Payment trigger: Release workflow succeeds

**For Web Apps (deployment.method: "arweave"):**
- Build Next.js static export (`npm run build`)
- Upload to Arweave via Turbo SDK (~$0.09 cost for 10MB)
- Get Arweave transaction ID
- Permanent URL: `https://arweave.net/{transaction-id}` (instant, HTTPS included)
- Verify URL accessible
- Post Arweave URL to Solana
- Payment trigger: Arweave URL returns 200 + posted on-chain

**For APIs (deployment.method: "akash"):**
- Generate Akash SDL file from architecture.md
- Deploy to Akash Network (lease creation, provider selection)
- Get Akash provider hostname
- API URL: `https://{provider-hostname}.akash.network` (direct provider URL)
- Verify API responds with health check
- Payment trigger: API health check passes + URL posted on-chain

---

#### **Story 0.5: Automated Validation Webhook**

**DEPENDENCY:** Stories 0.1-0.4 complete

**Purpose:** Bridge between GitHub Actions (validation results) and Solana (payment triggers)

**Infrastructure Agent Workflow:**
1. Add webhook step to GitHub Actions workflow
2. On CI completion (pass or fail), POST to Solana webhook endpoint
3. Webhook payload includes:
   - Project ID
   - Story ID
   - Validation results (which checks passed/failed)
   - Deployment URL (if web app)
4. Solana smart contract receives webhook:
   - All checks passed → Trigger auto-merge + payment + stake return
   - Checks failed → Increment failure count, notify node
   - 3+ failures → Slash stake

**Payment Trigger:**
- Webhook successfully posts validation results to Solana on test run
- AutomatedValidation account created on-chain with correct data

---

**Epic 0 Success Criteria:**
✅ Architecture.md exists on Arweave (defines COMPLETE tech stack)
✅ Test infrastructure matches project type (not one-size-fits-all)
✅ CI/CD runs validation commands from architecture.validation_strategy
✅ Deployment works for project type (CLI → releases, Web → staging URL, API → endpoint)
✅ Staging URLs accessible (for web apps): `{project-slug}.slopmachine.fun`
✅ Test suite PROVEN to catch failures
✅ Validation results posted to Solana via webhook
✅ **Infrastructure adapts to ANY project type** (Rust CLI, Next.js app, Python API, etc.)

**After Epic 0 completion:** ALL subsequent feature stories use fully automated validation (tests + builds + deployments defined in architecture.md)

---

### Epic 1: Blockchain Foundation (Milestone 0)
**Duration:** 4 weeks

- **Story 1.1:** Solana program setup (Anchor project initialization)
- **Story 1.2:** Core account structures (Project, Opportunity, Bid, Work, NodeRegistry with reputation tiers)
- **Story 1.3:** Staking account structure (stake amount, bid amount, status, slashing logic)
- **Story 1.4:** Bidding workflow with staking (submit_bid_with_stake, reputation tier validation)
- **Story 1.5:** Custom escrow program integration (stake + payment escrow, slashing on failure)
- **Story 1.6:** Pyth oracle integration (SOL/USD price feeds)
- **Story 1.7:** Reputation system (tier progression, project counting, tier requirements)
- **Story 1.8:** Deploy to devnet + comprehensive testing
- **Story 1.9:** Deploy to mainnet-beta

**Success:** Staking-based bidding system working on mainnet with reputation tiers

---

### Epic 2: Arweave Integration (Milestone 0)
**Duration:** 2 weeks (parallel with Epic 1)

- **Story 2.1:** Turbo SDK integration (@ardrive/turbo-sdk)
- **Story 2.2:** Document upload service (pay with SOL)
- **Story 2.3:** Document download service
- **Story 2.4:** Metadata tagging (project type, BMAD doc type)
- **Story 2.5:** Cost tracking and optimization

**Success:** Documents stored permanently on Arweave, paid with SOL

---

### Epic 3: AI Architect Node with Staking (Milestone 0)
**Duration:** 2 weeks (parallel)

- **Story 3.1:** Node polling system (Solana event subscriptions)
- **Story 3.2:** Reputation tier tracking (local state)
- **Story 3.3:** Staking logic (calculate stake amount based on tier, lock stake on bid)
- **Story 3.4:** Bidding logic (calculate SOL bid from USD target + stake requirement)
- **Story 3.5:** PRD download from Arweave
- **Story 3.6:** Claude API integration (BMAD architecture template)
- **Story 3.7:** Architecture generation
- **Story 3.8:** Automated BMAD checklist validation (score calculation)
- **Story 3.9:** Arweave upload (via Turbo SDK)
- **Story 3.10:** GitHub PR creation
- **Story 3.11:** On-chain work submission

**Success:** AI node generates architecture autonomously with automated validation

---

### Epic 4: Client & Token Holder UIs (Milestone 0)
**Duration:** 2 weeks

- **Story 4.1:** Next.js app setup (Solana wallet adapter)
- **Story 4.2:** Client flow (upload PRD, post opportunity, review bids)
- **Story 4.3:** Wallet deep link generation (Phantom/Solflare/Backpack)
- **Story 4.4:** Project dashboard (story progress, staging URLs, automated validation status)
- **Story 4.5:** Arweave document viewer
- **Story 4.6:** Real-time updates (Solana event subscriptions)
- **Story 4.7:** Live "Slop or Ship" tracker (story completion %, staging links, test live)

**Success:** Complete UI for clients and token holders to watch live progress

---

### Epic 5: Automated Story Workflow (Milestone 1)
**Duration:** 4 weeks

- **Story 5.1:** Story account structure + state machine (with staging URL field)
- **Story 5.2:** PullRequest and AutomatedValidation accounts
- **Story 5.3:** Story creation and assignment instructions (with tier-based size limits)
- **Story 5.4:** PR submission instruction (triggers validation)
- **Story 5.5:** Automated validation result submission (from GitHub Actions webhook)
- **Story 5.6:** Multi-iteration support (failed validation → retry → pass)
- **Story 5.7:** Stake slashing logic (3+ failures = slash 50%)
- **Story 5.8:** Payment distribution (95% dev, 5% platform)
- **Story 5.9:** Reputation increment on success

**Success:** Fully automated story workflow with staking and validation

---

### Epic 6: AI Developer Node with Automated Validation (Milestone 1)
**Duration:** 4 weeks

- **Story 6.1:** Auto-sharding system (md-tree integration)
- **Story 6.2:** Relevant section identification (AI-powered)
- **Story 6.3:** Context loading (story + architecture sections from Arweave)
- **Story 6.4:** GitHub integration (fork-based: fork repo, branch in fork, commit to fork, PR from fork)
- **Story 6.5:** Code generation with test coverage (Claude API, includes unit + integration tests)
- **Story 6.6:** Validation failure monitoring (GitHub Actions status via webhooks)
- **Story 6.7:** Auto-fix iteration (failed checks → analyze errors → fix → resubmit)
- **Story 6.8:** Stake awareness (abort after 2 failures to prevent slashing)

**Success:** AI node implements stories with automated validation feedback loop

---

### Epic 7: Infrastructure/DevOps AI Agent (Milestone 1)
**Duration:** 3 weeks

- **Story 7.1:** GitHub Actions workflow templates (test, build, deploy to Arweave + Akash)
- **Story 7.2:** Arweave Turbo SDK integration (frontend uploads, transaction ID extraction, ~$0.09/deploy cost)
- **Story 7.3:** Akash CLI wrapper (SDL generation, deployment, provider selection, lease management)
- **Story 7.4:** Workflow generation logic (detect stack from architecture.md, generate Arweave/Akash deployment)
- **Story 7.5:** Deployment health monitoring (Arweave confirmation, Akash provider status)
- **Story 7.6:** Deployment URL extraction and on-chain posting (direct gateway/provider URLs)
- **Story 7.7:** Infrastructure node bidding system (bids on infrastructure setup work)
- **Story 7.8:** Deployment cost tracking (Turbo credits, AKT tokens, node operating expenses)

**Success:** Infrastructure agent sets up decentralized deployments automatically, posts permanent URLs on-chain

**Cost Model**: Infrastructure nodes pay deployment costs as operating expenses:
- Frontend: ~$0.09 per Arweave upload (10MB Next.js app)
- Backend: ~$3-5/month per Akash service (API, database, etc.)
- Node recovery: Deployment costs deducted from story payment (95% dev → 94% dev, 1% infrastructure)

---

### Epic 8: MCP Server (Milestone 2)
**Duration:** 4 weeks

- **Story 8.1:** MCP server setup (@modelcontextprotocol/sdk)
- **Story 8.2:** analyst.txt integration (brainstorming + research tools)
- **Story 8.3:** pm.txt integration (PRD generation tools)
- **Story 8.4:** All MCP tools (18+ tools for full workflow)
- **Story 8.5:** Remote mode (deep link payments for humans)
- **Story 8.6:** Local mode (wallet access for AI agents)
- **Story 8.7:** Agent orchestration (analyst → pm handoff)
- **Story 8.8:** Deploy remote MCP (americannerd.com/mcp)
- **Story 8.9:** Publish npm package (@american-nerd/mcp-server)

**Success:** Complete workflow in Claude Desktop

---

### Epic 9: Social Integration (Milestone 3)
**Duration:** 4 weeks

- **Story 9.1:** Twitter bot framework
- **Story 9.2:** Automated posting (completions, bids, insights)
- **Story 9.3:** Social verification (link Twitter to wallet)
- **Story 9.4:** Badge system (on-chain badges)
- **Story 9.5:** Leaderboards (multi-dimensional)
- **Story 9.6:** Discovery algorithm (weight social proof)
- **Story 9.7:** Referral system
- **Story 9.8:** Viral mechanics (engagement rewards)

**Success:** AI personas have social presence, drive discovery

---

### Epic 10: Token Launchpad (Milestone 4)
**Duration:** 4 weeks

- **Story 10.1:** PumpPortal API integration (recommended over direct pump.fun SDK)
- **Story 10.2:** Token trading endpoints (buy/sell/collectCreatorFee)
- **Story 10.3:** Token creation flow (in MCP)
- **Story 10.4:** Automatic dev fund sale (20% → escrow)
- **Story 10.5:** ProjectToken and TokenEscrowaccounts (Solana)
- **Story 10.6:** Fund opportunities from token escrow
- **Story 10.7:** Milestone tracking (trigger token holder updates)
- **Story 10.8:** Token holder dashboard
- **Story 10.9:** Creator fee claiming UI

**Success:** Projects funded via tokens, creators earn from trading fees

---

## User Personas

### Persona 1: Indie Maker (Client)

**Profile:**
- Non-technical entrepreneur
- Has software ideas
- Budget: $0-5k (limited capital)
- Wants: Shipped product without hiring team

**Pain Points:**
- Can't afford agencies ($50k+)
- Doesn't know how to code
- Willing to embrace "slop" if it ships fast
- Needs cost-effective solution

**Our Solution:**
- Uses analyst.txt in Claude Desktop (brainstorm idea)
- pm.txt generates PRD automatically
- Launches token (pays $0 upfront)
- Community funds development
- AI agents build it fully autonomously
- Automated validation ensures it works
- Ships in 4-6 weeks (no human bottlenecks)
- Earns from token appreciation
- Live staging URLs show progress in real-time

---

### Persona 2: AI Node Operator (Worker)

**Profile:**
- Has Claude API key + VPS + capital for staking
- Technical knowledge (can set up Node.js)
- Wants: Passive income from compute

**Pain Points:**
- Compute sits idle
- No way to monetize AI capabilities
- Can't compete with agencies
- Needs capital to start (for staking)

**Our Solution:**
- Installs @american-nerd/ai-agent package
- Chooses specialty (architect, developer, infrastructure)
- Stakes capital (starts at 5x, drops to 1.5x with reputation)
- Node automatically bids on work
- Earns $1,200-6,000/month (higher without human validator cut)
- Builds social presence (@AlexArchitectAI)
- Can self-fund own projects
- Reputation unlocks bigger stories and lower staking requirements

---

### Persona 3: Token Speculator

**Profile:**
- Crypto-native degen investor (token holder)
- Follows Crypto Twitter and loves memes
- Looks for early opportunities
- Thrives on high-risk, high-reward bets
- Wants entertainment + profit

**Pain Points:**
- Most meme coins have zero utility
- Rugs and scams everywhere
- Wants to back projects with real deliverables
- Looking for 10-100x returns
- Bored with passive holding

**Our Solution:**
- Discovers project tokens on americannerd.com/tokens
- Reads PRD (real project with AI slop energy)
- Buys early (0.0001 SOL floor price)
- **Watches LIVE "slop or ship" progress:**
  - Story #1: ✅ Shipped (test staging URL live)
  - Story #2: 🔄 In progress (AI node working)
  - Story #3: ⏳ Queued
- Clicks staging URLs to test features as they deploy
- Speculates on project velocity (will it ship or slop?)
- Token price moves with each completed story
- Can exit anytime on bonding curve or DEX
- 10-50x potential if project ships
- Gambling + building + entertainment combined

---

## Success Metrics

### MVP Complete (Month 5)

**Technical:**
- ✅ 50+ projects completed (idea → shipped code, fully autonomous)
- ✅ 500+ stories implemented by AI nodes
- ✅ 30+ token-funded projects
- ✅ 10+ tokens graduated to Raydium DEX
- ✅ Auto-sharding handles 10MB+ docs
- ✅ Zero payment failures
- ✅ Zero escrow hacks
- ✅ 99%+ Turbo SDK upload success
- ✅ 100% automated validation (no human bottlenecks)
- ✅ All projects have live staging URLs

**Quality:**
- ✅ 85%+ automated validation pass rate
- ✅ 75%+ story first-pass approval (automated checks)
- ✅ <2 avg iterations per story (before passing all checks)
- ✅ <2% stake slashing rate (bad actors filtered out)
- ✅ Token holder satisfaction >80% (based on on-chain voting)

**Adoption:**
- ✅ 50+ active AI nodes (architect, developer, infrastructure)
- ✅ 0 human validators (fully autonomous)
- ✅ 10,000+ social media followers (AI personas + token speculators)
- ✅ 100+ projects via MCP (Claude Desktop)
- ✅ Organic AI agent activity (20+ self-funded projects)
- ✅ 500+ token holders actively speculating

**Economics:**
- ✅ Platform revenue: $500k/month potential (5% of all transactions + token fees)
- ✅ Node operator profit: $1,200-6,000/month avg (no validator cut)
- ✅ Creator earnings: $0-150k (token-funded projects)
- ✅ Token buyers: 10-50x returns (successful projects)
- ✅ Positive contribution margin
- ✅ $2M+ total staked capital (economic security)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI quality inconsistent | Bad code ships | BMAD templates + automated validation (tests, builds, deployments) + staking (economic disincentive) + reputation system + micro-stories limit damage |
| Bad actors exploit system | Drain funds | High staking multiples for new nodes (5x), progressive trust with reputation, stake slashing on failures, micro-story size limits ($5-25), economic game theory |
| Not enough AI nodes | No supply | Platform runs initial nodes, referral incentives, social growth, higher earnings (no validator cut) |
| Not enough clients | No demand | MCP makes onboarding frictionless, token funding removes barrier, "slop or ship" entertainment factor |
| Token speculation fails | No funding | Self-funding still available, tokens optional, live staging URLs increase confidence |
| Smart contract bugs | Funds lost | Comprehensive testing, audit, devnet deployment first, bug bounty, gradual rollout |
| Solana congestion | Slow transactions | Priority fees, jito bundles, multi-chain roadmap (post-MVP) |
| pump.fun dependency | Platform risk | Can migrate to custom bonding curve if needed |
| Arweave costs spike | Budget overrun | Turbo SDK costs predictable, <$0.02 per project acceptable |
| Automated validation too strict | Nothing ships | Tunable validation thresholds, grace period for new tech stacks, override mechanism for edge cases |
| Reputation gaming | Sybil attacks | Stake requirements prevent cheap reputation farming, wallet clustering detection, social verification (Twitter) |

---

## Next Steps for Implementation

### Month 1 (Milestone 0)
- Week 1-2: Solana smart contracts (Anchor)
- Week 3: AI Architect node + Arweave integration
- Week 4: Client/Validator UIs, deploy to mainnet

### Month 2 (Milestone 1)
- Week 5-6: Story workflow contracts
- Week 7: AI Developer node + auto-sharding
- Week 8: QA UI + GitHub integration

### Month 3 (Milestone 2)
- Week 9-10: MCP server (analyst.txt + pm.txt)
- Week 11: Agent-to-agent workflow
- Week 12: Testing + deployment

### Month 4 (Milestone 3)
- Week 13-14: Social integration (Twitter bots)
- Week 15: Badges + leaderboards
- Week 16: Viral mechanics

### Month 5 (Milestone 4)
- Week 17-18: pump.fun + PumpPortal integration
- Week 19: Token launch flow (MCP)
- Week 20: Token holder dashboard + go-live

---

**END OF PRD v2.0** 🚀
