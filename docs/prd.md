# Slop Machine PRD v3.8 - Fully Autonomous "Slop or Ship"

**Version:** 3.8 (BMAD Template Compliance)
**Date:** 2025-10-08
**Author:** BMad Master Agent + Jonathan Green
**Status:** Ready for Implementation

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-05 | v1.0-1.2 | Original backend-centric PRD | John (PM Agent) |
| 2025-10-06 | v2.0 | Complete redesign: Blockchain-native, AI agents as workers, pump.fun integration | BMad Master + Jonathan |
| 2025-10-07 | v3.0 | **Fully autonomous transformation:** Removed all human validators, added progressive staking system (5x to 2x), reputation tiers, automated validation (tests/builds/deployments), infrastructure/DevOps AI agents, continuous staging deployment, live "slop or ship" tracking for token speculators | BMad Master + Jonathan |
| 2025-10-07 | v3.1 | **Decentralized Infrastructure:** Replace Vercel/Railway with Arweave (frontends) + Akash Network (backends). AI nodes pay deployment costs ($0.09/frontend, $3/month/backend). See `docs/decentralized-infrastructure-research.md` | Claude (Research) |
| 2025-10-07 | v3.2 | **Economics Validated:** Comprehensive AI infrastructure economics research validates marketplace viability. Story pricing: $2.50 minimum (smart contract enforced), $3-7 expected range. Staking adjusted: Tier 3-4 increased to 2x for economic security (was 1.5x/1.2x). Node operator profitability: 83-99% margins across all infrastructure types. See `docs/ai-infrastructure-economics-research.md` | Claude (Economics Research) |
| 2025-10-07 | v3.3 | **Git Flow + Multi-Environment Deployments:** Implement realistic Git branching strategy with 3-tier deployment pipeline (development/staging/production). Add Epic data model for epic-level integration tracking. Story deploys to development branch → Arweave. Epic completion triggers staging branch merge → Arweave. Project completion triggers main branch merge → Arweave (production). 3x Akash backend environments ($9/month total). Corrected Arweave costs: $4.59/project (was $10.80). Token holders see development/staging/production URLs for full transparency. See Architecture v2.4 for complete Git Flow implementation. | BMad Master + Claude |
| 2025-10-08 | v3.4 | **Infinite Tier Progression + User Journeys:** Replace fixed tier system (0-4) with infinite tier progression using mathematical formulas. Tier = floor(sqrt(projects) × successRate), stake multiplier exponentially decays (5x → 1x), max story size grows exponentially ($5 → $114K+). Enables continuous progression, unlimited story sizes, and natural market segmentation. Added comprehensive user journeys (8 personas) including token speculators, indie makers, AI node operators, infrastructure nodes, bidding wars, and failed project scenarios. See "Infinite Tier System" and "User Journeys" sections. | BMad Master + Claude |
| 2025-10-08 | v3.5 | **Epic Refinements + QA Workflow:** Renamed Epic 3 to "AI Node Core" (generic for all node types). Story 3.1 now WebSocket subscriptions (not polling). Story 3.6 is LLM provider abstraction (Claude/OpenAI/DeepSeek/Groq/Ollama). Epic 4 merged with node operator UI (Stories 4.8-4.13). Story 4.3 is Wallet Adapter integration (not deep links). Epic 6 expanded to include QA workflow (Stories 6.9-6.13) with QA nodes as generic nodes using bmad-qa-reviewer agent. Story 7.2 clarified as CI/CD automation (uses Epic 2 SDK). Story 7.9 added for multi-chain wallet management. Swapped Epics 9/10 (Token before Social). Payment split updated: 85% dev, 5% QA, 10% platform. Total duration: 32 weeks, 108 stories. | BMad Master + Claude |
| 2025-01-08 | v3.6 | **SOL→AKT Cross-Chain Swap Integration:** Story 7.9 expanded with comprehensive swap solution. Primary: Rango Exchange aggregator (1.3% fees, 95%+ success, zero KYC). Backup: THORChain/THORSwap (1.6% fees). Auto-refill triggers at AKT < 15 threshold. Cost: ~$1/month per infrastructure node. Production-ready TypeScript code examples included. See `docs/sol-to-akt-swap-research.md` (20K words, 6 solutions evaluated), `docs/sol-to-akt-swap-decision-brief.md` (executive summary), and `/docs/examples/swap-sol-to-akt-*.ts` for implementation. Architecture v2.6 updated with wallet structure, swap architecture diagrams, auto-refill logic, and cost tracking integration. | Claude (Research + Implementation) |
| 2025-01-08 | v3.7 | **Epic 7: Cross-Chain Swap Service:** Promoted SOL→AKT swap solution from Story 8.9 to dedicated Epic 7 (Milestone 1, 2 weeks, 10 stories). Renumbered epics: Epic 7 is now Cross-Chain Swap, former Epic 7 (Infrastructure/DevOps) → Epic 8, Epic 8 (MCP Server) → Epic 9, Epic 9 (Token Launchpad) → Epic 10, Epic 10 (Social Integration) → Epic 11. Implements configurable auto-refill system allowing node operators to customize thresholds (`akt_refill_threshold`, `akt_target_balance`, `max_swap_amount_sol`, `slippage_tolerance_percent`, `check_interval_hours`, `primary_protocol`, `enable_auto_refill`). Story 8.9 now references Epic 7 integration. Stories: 7.1 Rango SDK, 7.2 THORChain SDK, 7.3 Cosmos SDK, 7.4 Multi-protocol service, 7.5 Configurable auto-refill, 7.6 Balance monitoring, 7.7 Cost tracking, 7.8 Health monitoring, 7.9 GitHub Actions automation, 7.10 Operator dashboard. Operators can edit config via UI (Story 4.13), pause auto-refill, and view projected costs. Architecture v2.8 updated with SwapConfig interface, configurable auto-refill implementation, and updateSwapConfig function. Total epics: 12 (0-11). | Jonathan + Claude |
| 2025-10-08 | v3.8 | **BMAD Template Compliance:** Reformatted all 12 epics (0-11) and 111 stories to comply with BMAD PRD template structure. Each epic now includes 2-3 sentence epic goal describing objective and value. All stories converted to user story format ("As a [user], I want [action], so that [benefit]") with numbered acceptance criteria (3-10 criteria per story, 1000+ total criteria). Epic 0 marked as template epic for client projects (not implemented in Slop Machine platform itself). User personas clarified: "Platform developer" (building Slop Machine), "AI node operator", "Project creator", "Token holder". No scope changes, purely structural formatting to enable proper story estimation, validation, and AI agent execution. All existing content preserved (economics, user journeys, infinite tier system, swap integration). Total: 12 epics, 111 stories, 1000+ acceptance criteria. | BMad Master + Jonathan |

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
- **Mitigate risk through micro-stories** - Break epics into $2.50-50 stories (smart contract enforced $2.50 minimum, expected $3-7 range) so bad actors can't drain significant funds
- **Implement progressive staking** - New nodes stake 5x bid amount ($25 to bid $5), elite nodes stake 2x (minimum $10-50 absolute stake by tier)
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
- **Micro-stories limit blast radius** ($2.50 minimum, $3-7 typical per story prevents large losses)
- **Progressive staking scales with reputation** (5x for newbies, 2x for veterans, minimum $10-50 absolute)
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
- Staking requirement: 2x (can bid on $35 stories for $70 stake)
- Can self-fund own projects

---

### 2. Economic Staking Replaces Human Validation

**Problem:** Human validators are a bottleneck and introduce trust dependencies.

**Solution:** Infinite tier progression system with mathematical formulas for continuous reputation growth.

**Infinite Tier System (v3.4):**

**Core Formulas:**
```typescript
tier = floor(sqrt(projectsCompleted) × successRate)
stakeMultiplier = max(1.0, 5.0 × exp(-0.15 × tier))
maxStorySize = floor(5 × pow(1.4, tier))
minAbsoluteStake = floor(10 + (5 × log10(tier + 1)))

where:
  successRate = completedProjects / attemptedProjects
  completedProjects = stories with passing validation
  attemptedProjects = total stories assigned (including slashed)
```

**Why Infinite Tiers:**
- ✅ **Continuous progression** - No ceiling, nodes can reach Tier 100+
- ✅ **Unlimited story sizes** - Tier 30 nodes can bid on $114K+ enterprise work
- ✅ **Quality emphasis** - Success rate multiplier prevents volume farming
- ✅ **Diminishing stakes** - Proven nodes asymptotically approach 1.0x stake (but never below)
- ✅ **Market segmentation** - Natural tiers emerge (Tier 0-5 commodity, Tier 10-20 premium, Tier 30+ enterprise)

**Example Tier Progression:**

| Tier | Projects Needed | Success Rate | Max Story Size | Stake Multiplier | Min Absolute Stake | Example Node |
|------|----------------|--------------|----------------|------------------|-------------------|--------------|
| 0 | 0 | N/A | $5 | 5.00x | $10 | Brand new |
| 1 | 1-4 | 100% | $7 | 4.30x | $11.51 | Getting started |
| 2 | 4-9 | 100% | $9 | 3.70x | $12.41 | Junior |
| 3 | 9-16 | 100% | $13 | 3.18x | $13.01 | Intermediate |
| 5 | 25-36 | 100% | $27 | 2.36x | $13.89 | Senior |
| 10 | 100-121 | 100% | $144 | 1.12x | $15.19 | Expert |
| 15 | 225-256 | 100% | $764 | 1.01x | $16.30 | Elite |
| 20 | 400-441 | 100% | $4,060 | 1.00x | $16.60 | Master |
| 30 | 900-961 | 100% | $114,656 | 1.00x | $17.92 | Mythic |

**Security Properties:**
- **Square root scaling** - Prevents linear tier explosion (100 projects ≠ Tier 100, actually Tier 10)
- **Success rate multiplier** - Volume farming with 70% success rate severely limits tier growth
- **Exponential decay stakes** - Fast reduction for early tiers (5x → 2.36x by Tier 5), floor at 1.0x
- **Logarithmic minimum stakes** - Tier 100 only requires ~$20 absolute minimum (not $1,000+)
- **Reputation capital** - High-tier nodes have 400+ projects invested, making scamming irrational

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
- Micro-stories ($2.50 minimum, $3-7 typical) limit per-story losses
- High staking multiples for new nodes (5x)
- Asymptotic stake floor at 1.0x (always skin in the game)
- Absolute minimum stakes ($10-20) prevent low-stake gaming
- Reputation-based trust (proven nodes bid on larger stories)
- Automated validation (tests, builds, deployments)
- Economic incentives > human judgment

**Key Insight:** Square root progression means reaching Tier 20 (enterprise work) requires 400 completed projects with high success rate. This reputation capital >> any individual story value, making scamming irrational even at 1.0x stake multiplier.

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

## Node Operator Economics

**Research Validation:** Comprehensive economics research (see `docs/ai-infrastructure-economics-research.md`) validates marketplace profitability across multiple AI infrastructure options.

### Profitability Summary

All infrastructure paths are highly profitable at expected market prices ($3-7/story):

**Note:** Platform fee is 10% OR $0.25 minimum, whichever is higher. At $3/story, node receives $2.70 (90%).

| Infrastructure | Upfront Cost | Cost/Story (200/mo) | Profit @ $3/story | Margin | Monthly Profit |
|----------------|--------------|---------------------|-------------------|--------|----------------|
| **Claude Pro ($20/mo)** | $0 | $0.013 | $2.687 | **99.5%** | $537 |
| **Claude API (pay-per-use)** | $0 | $0.108 | $2.592 | **96.0%** | $518 |
| **Hybrid (strategic routing)** | $0 | $0.024 | $2.676 | **99.1%** | $535 |
| **Local GPU** (first 24mo) | $2,250 | $0.479 | $2.221 | **82.3%** | $444 |
| **Local GPU** (after 24mo) | $2,250 | $0.01 | $2.690 | **99.6%** | $538 |

### Infrastructure Recommendations by Volume

**0-100 stories/month:** Claude Pro ($20/mo)
- Zero upfront investment
- 99% profit margins
- Perfect for getting started
- Monthly profit: $145-270 (at $3/story avg)

**100-200 stories/month:** Claude Pro or API
- Stay on Pro if under rate limit (~1,500/mo)
- Switch to API for unlimited scaling
- Monthly profit: $270-540 (at $3/story avg)

**200-500 stories/month:** Consider Local GPU Investment
- RTX 4090 24GB + workstation: ~$2,250 upfront
- ROI in 4-6 months at this volume
- 82% margins initially, 99.6% after 24 months
- Monthly profit: $444-1,332 (at $3/story avg)

**500+ stories/month:** Local GPU Required
- API costs become prohibitive ($50-100+/mo)
- Local GPU pays for itself in 2-3 months
- Near-zero marginal costs after amortization
- Monthly profit: $1,332+ (at $3/story avg)

### Migration Path

**Stage 1 (Months 0-3):** Start with Claude Pro
- Learn system, validate profitability
- Accumulate capital ($270-540/month at $3/story avg)

**Stage 2 (Months 3-6):** Grow volume
- Scale to 200-500 stories/month
- Continue with Pro/API
- Accumulate $1,500-3,000 for hardware

**Stage 3 (Months 6-12):** Invest in hardware (optional)
- Use profits to buy RTX 4090 setup
- Maximize long-term profitability
- Reduce operating costs to ~$0.01/story

**Stage 4 (Month 12+):** Optimize & scale
- Hardware fully amortized
- Maximum profit margins (99.6%)
- Scale to 1,000+ stories/month

### Price Floor & Market Dynamics

**Smart Contract Minimum:** $2.50/story (enforced on-chain)
- Prevents race-to-bottom death spiral
- Ensures all infrastructure types profitable
- Still 10-100x cheaper than human developers

**Expected Market Price:** $3-7/story
- Premium nodes (high reputation, specialization): $5-10
- Budget nodes (new, commodity work): $2-3
- Quality differentiation prevents pure price competition

**Predicted Evolution:**
- Months 0-3: $5-10 (low competition, early adopters)
- Months 3-6: $3-7 (growth phase, competition increases)
- Months 6-12: $2-5 (maturity, tier separation)
- Months 12+: $2-4 average (stable, specialization premiums)

### Staking Economics

**Example (Tier 0, $5 story):**
```
Stake required: $25 (5x)
Story completion: 7 days
Payment received: $4.50 (90% of $5)
Platform fee: $0.50 (10% of $5)
AI cost (Claude Pro): $0.013
Net profit: $4.49
ROI: 18.0% per week = 936% annualized 🚀

Comparison to SOL staking (8% APY):
Story profit ($4.49) vs SOL staking ($0.04) = 112x better returns
```

**Example (Low price story, $2 story):**
```
10% of $2 = $0.20 (below $0.25 minimum)
Platform fee: $0.25 (minimum applies)
Payment to node: $1.75 (87.5% effective)
Net profit: $1.75 - $0.013 = $1.74
```

**Why It Works:**
- High ROI makes participation attractive
- Economic incentives align with quality
- Scamming is -EV (lose more than you gain)
- Progressive relaxation rewards reputation

**See:** `docs/ai-infrastructure-economics-research.md` for complete analysis, profitability matrices, and sensitivity analysis.

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
- Nodes shall stake capital when bidding (5x for tier 0, 3x for tier 1, 2x for tiers 2-4)
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
- System shall auto-release payment on merge (85% dev, 5% QA, 10% platform OR $0.25 minimum platform fee, whichever is higher)
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
- System shall distribute nodes as npm package (project name TBD, temporary: `@slop-machine/ai-agent`)
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
- Arweave frontend hosting (3-tier deployment):
  - Story deployments (development branch): ~$0.09 × 40 stories = $3.60
  - Epic deployments (staging branch): ~$0.09 × 10 epics = $0.90
  - Production deployment (main branch): ~$0.09 × 1 = $0.09
  - **Total per project**: ~$4.59 (one-time, permanent hosting)
- Akash backend hosting (3 environments): $3/month × 3 = $9/month per project (dev/staging/prod)
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
├─ Project (client, prd_arweave_tx, github_repo, status, development_url, staging_url, production_url, epic_count, completed_epics)
├─ Epic (project, epic_number, title, story_count, completed_stories, staging_url, status) // NEW v3.3
├─ Opportunity (project, work_type, budget_range, requirements_tx, max_tier_allowed)
├─ Bid (opportunity, node, amount_sol, stake_amount, tier, usd_equivalent, sol_price_at_bid)
├─ StakeEscrow (stake_amount, bid_amount, node, status, slash_count)
├─ Escrow (funds, node, platform_fee, status)
├─ Work (deliverable_arweave_tx, github_commit_sha, staging_url, validation_status)
├─ Story (project, epic_id, github_pr, context_refs, status, staging_url, deployment_count, iteration_count)
├─ PullRequest (story, pr_number, head_sha, target_branch, status)
├─ AutomatedValidation (pr, checks_passed, checks_failed, validation_details)
├─ NodeRegistry (wallet, persona_name, social_handle, reputation_tier, projects_completed, badges)
├─ ProjectToken (pump_fun_mint, dev_budget, status) // M4
└─ TokenDevelopmentEscrow (budget, spent, remaining) // M4

Instructions:
├─ create_project, create_epic, create_opportunity, submit_bid_with_stake, accept_bid
├─ fund_escrow, submit_work, submit_validation_result, release_payment_and_stake
├─ slash_stake, increment_reputation, check_tier_eligibility
├─ create_story, start_work, submit_pr, submit_validation_results, finalize_story
├─ post_story_deployment, complete_epic, post_epic_deployment, post_production_deployment
├─ link_twitter, grant_badge, update_social_stats
├─ initialize_token_funding, fund_opportunity_from_token
└─ update_project_milestone
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
> → Payment releases (0.425 SOL to Alex, 0.025 SOL QA node, 0.05 SOL platform fee)
> → Stake returned to Alex and QA node
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
> → Payment releases ($8.50 to Sarah, $0.50 to QA node, $1.00 platform fee)
> → $30 stake returned to Sarah, $5 stake returned to QA node
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

## Epic 0: Infrastructure Bootstrap (MUST COMPLETE FIRST)

> **⚠️ TEMPLATE EPIC:** This epic is prepended to every client project PRD created on the Slop Machine platform. It will NOT be implemented in this PRD, as this document describes building the Slop Machine platform itself, not a client project.

**Duration:** 1 week

**Payment Model:** Simplified validation (Story 0.1 uses automated BMAD checklist, Stories 0.2-0.5 use simple on-chain checks)

**Epic Goal:** Establish the foundational infrastructure for every client project built on the Slop Machine platform. Infrastructure AI nodes create the Git repository, generate the project-specific architecture specification, set up testing and CI/CD automation, and configure deployment pipelines—all tailored to the client's project type (CLI tool, web app, API, etc.). This automated bootstrap enables all subsequent development stories to be autonomously validated and deployed by AI developer nodes.

**Critical Dependency:** This epic creates the automated validation infrastructure that ALL subsequent stories for this client project depend on.

**Key Principle:** Story 0.0 (Git Setup) creates branching strategy. Story 0.1 (Architecture) defines complete tech stack. Both are foundational for all other stories.

---

### Story 0.0: Git Repository & Branch Setup

As a project creator,
I want an Infrastructure AI node to fork and configure my project's Git repository with a 3-tier branch strategy and protection rules,
so that all AI developer nodes working on my project have a secure, structured workflow for code integration and progressive deployment.

#### Acceptance Criteria

1. Client's project repository forked successfully (if template provided) or new repository created
2. Three long-lived branches created: `main` (production), `staging` (epic integration), and `development` (story integration)
3. Branch protection rules configured on all three branches:
   - `main`: Requires PR from `staging`, requires status checks, no direct pushes allowed
   - `staging`: Requires PR from `development`, requires status checks
   - `development`: Requires PR from feature branches, requires status checks
4. `.gitignore` file created appropriate for the client's project type (determined from PRD)
5. README.md initialized with client's project information from PRD
6. Default branch set to `development`
7. Branch Strategy documentation added explaining the 3-tier deployment flow (development → staging → main)
8. Repository URL and branch configuration posted to Solana smart contract
9. Payment trigger: Repository accessible, all branches created, protection rules verified on-chain

---

### Story 0.1: Architecture Generation

As a project creator,
I want an Architect AI node to analyze my PRD and generate a complete `architecture.md` with project-specific tech stack and validation strategy,
so that Infrastructure and Developer AI nodes know exactly what to build and how to validate my project.

#### Acceptance Criteria

1. Client's PRD downloaded from Arweave and analyzed by Architect AI node
2. Project type determined from PRD requirements (cli_tool, web_app, api_backend, mobile_app, or library)
3. Optimal tech stack selected based on client's requirements, constraints, and technical preferences
4. Complete `architecture.md` generated with ALL mandatory YAML sections:
   - `project_metadata`: type and language for this client project
   - `tech_stack`: runtime, framework, testing frameworks, CI platform, deployment method, linting tools
   - `validation_strategy`: specific commands for unit tests, integration tests, linting, build verification
   - `has_frontend`, `has_backend`, `is_library` classification flags
5. Testing strategy specifies concrete frameworks matching project type (e.g., "cargo_test" for Rust CLI, "vitest" + "playwright" for Next.js web app)
6. Deployment strategy appropriate for project type (e.g., "github_releases" for CLI, "arweave" for web apps, "akash" for APIs)
7. All validation commands are executable for the chosen tech stack
8. Architecture.md uploaded to Arweave with permanent transaction ID
9. Automated BMAD architecture checklist validation passes with score >80%
10. Architecture Arweave transaction ID posted to Solana smart contract for this project
11. Payment trigger: Architecture.md uploaded to Arweave, BMAD checklist score >80%, transaction ID recorded on-chain

---

### Story 0.2: Test Infrastructure Setup

As a project creator,
I want an Infrastructure AI node to install the testing frameworks specified in my project's architecture.md and prove they catch failures,
so that all AI developer nodes working on my project have a reliable test infrastructure for validation.

#### Acceptance Criteria

1. Architecture.md downloaded from Arweave using transaction ID from Story 0.1
2. `tech_stack.testing` section parsed to identify required testing frameworks
3. Testing frameworks installed and configured matching client's project architecture:
   - For Rust projects: `tests/` directory created with Cargo test configuration
   - For Node.js projects: Vitest/Jest/Playwright installed with `__tests__/` and/or `e2e/` directories
   - For Python projects: pytest installed with `tests/` directory
   - For other languages: Appropriate testing framework per architecture spec
4. Example passing tests added (proves framework works)
5. Example failing tests temporarily added (proves CI catches failures)
6. Commit with failing tests pushed, CI triggered
7. CI fails as expected (validation system working)
8. Failing tests removed, new commit pushed
9. CI passes successfully
10. Test directory structure follows conventions for the client's project type
11. Payment trigger: Test infrastructure installed, tests run successfully in CI, failure detection proven (failed test caused CI to fail)

---

### Story 0.3: CI/CD Pipeline Setup

As a project creator,
I want an Infrastructure AI node to generate GitHub Actions workflows using the validation commands from my architecture.md,
so that all code changes by AI developer nodes are automatically validated with my project-specific checks.

#### Acceptance Criteria

1. Architecture.md downloaded from Arweave
2. `validation_strategy` section parsed to extract project-specific commands
3. `.github/workflows/ci.yml` file generated with commands directly from client's architecture:
   - Unit tests command (e.g., "cargo test", "npm test", "pytest")
   - Linting command (e.g., "cargo clippy -- -D warnings", "npm run lint", "ruff check")
   - Build verification command (e.g., "cargo build --release", "npm run build")
   - Type checking if applicable (e.g., "tsc --noEmit" for TypeScript)
   - Integration/E2E tests if specified in architecture
4. Workflow triggers configured for `push` and `pull_request` events
5. Workflow includes appropriate setup steps for client's tech stack (Rust toolchain, Node.js version, Python version, etc.)
6. Initial test workflow run completes successfully
7. Workflow commands exactly match `architecture.validation_strategy` (no assumptions, fully driven by architecture spec)
8. Branch protection integrates with CI status checks (PR cannot merge if CI fails)
9. Payment trigger: `.github/workflows/ci.yml` exists, commands match architecture exactly, test run succeeds

---

### Story 0.4: Staging Deployment + Subdomain Setup

As a project creator,
I want an Infrastructure AI node to configure deployment infrastructure for my project based on my architecture.md deployment method,
so that token holders can see live progress URLs as AI developer nodes complete stories and epics.

#### Acceptance Criteria

1. Architecture.md downloaded from Arweave
2. `deployment.method` and `deployment.artifacts` parsed from architecture
3. Deployment configured based on client's project type:
   - **For CLI tools (`github_releases`):** GitHub Release workflow created, cross-platform binaries built for platforms in `deployment.artifacts` (e.g., Linux x64, macOS ARM64, Windows x64)
   - **For Web apps (`arweave`):** Arweave deployment workflow created using Turbo SDK, static build exported (e.g., `npm run build` for Next.js), uploaded to Arweave (~$0.09 cost), permanent HTTPS URL obtained (`https://arweave.net/{tx-id}`)
   - **For APIs (`akash`):** Akash SDL file generated from architecture, API deployed to Akash Network (~$3/month), provider URL obtained (`https://{provider-hostname}.akash.network`)
4. Deployment workflow tested on development branch (story-level deployment)
5. Deployment URL verified accessible:
   - Web apps: URL returns 200 OK
   - APIs: Health check endpoint responds
   - CLI tools: Release artifacts downloadable
6. Deployment URL posted to Solana smart contract for on-chain tracking (token holders can view)
7. Three-tier deployment strategy operational:
   - Story complete → merge to development → deploy → URL available
   - Epic complete → merge to staging → deploy → staging URL available
   - Project complete → merge to main → deploy → production URL available
8. Deployment cost tracking integrated (Arweave: ~$0.09/frontend, Akash: ~$3/month/backend)
9. Payment trigger: Deployment succeeds for project type, URL accessible, URL posted on-chain

---

### Story 0.5: Automated Validation Webhook

As a project creator,
I want an Infrastructure AI node to create a webhook that posts GitHub Actions results to the Solana smart contract,
so that AI developer nodes automatically receive payment when validation passes, or lose stake after repeated failures.

#### Acceptance Criteria

1. Webhook step added to GitHub Actions CI workflow (`.github/workflows/ci.yml`)
2. Webhook endpoint configured to post to Solana smart contract for this project
3. Webhook payload includes:
   - Project ID (Solana account address for this client project)
   - Story ID (which story is being validated)
   - Validation results (which checks passed/failed: tests, linting, build, type-check)
   - Deployment URL (if applicable: Arweave transaction ID for frontends, Akash URL for backends)
   - CI run timestamp and commit SHA
4. Webhook fires on CI completion (both success and failure cases)
5. Solana smart contract receives and parses webhook data successfully
6. `AutomatedValidation` account created on-chain with validation data for this story
7. Smart contract validation logic working:
   - All checks passed → Auto-merge PR + release payment to developer node + return stake
   - Some checks failed → Increment failure count, notify developer node, keep stake locked
   - 3+ consecutive failures → Slash stake (50% to project escrow, 50% burned), close story
8. Test webhook with passing CI run (verify payment and stake return)
9. Test webhook with failing CI run (verify failure counter increments)
10. Token holders can view validation results on-chain for transparency
11. Payment trigger: Webhook posts successfully, AutomatedValidation account created with correct data, smart contract logic verified

---

**Epic 0 Success Criteria:**
- ✅ Client project Git repository configured with 3-tier branch strategy (development/staging/main)
- ✅ Branch protection rules enforced (PRs required, CI status checks must pass)
- ✅ Architecture.md exists on Arweave defining complete tech stack for client's project
- ✅ Test infrastructure matches client's project type (Rust/Node.js/Python/other)
- ✅ CI/CD runs validation commands from architecture.validation_strategy (project-specific)
- ✅ Deployment works for all 3 environments (development/staging/production)
- ✅ Deployment URLs accessible and posted on-chain for token holder visibility
- ✅ Test suite proven to catch failures
- ✅ Validation webhook posts results to Solana (enables autonomous payment)
- ✅ **Infrastructure adapts to client's project type** (NOT one-size-fits-all)

**After Epic 0 completion:** ALL subsequent feature stories for this client project use fully automated validation and deployment as defined in architecture.md.

---

## Epic 1: Blockchain Foundation (Milestone 0)

**Duration:** 4 weeks

**Epic Goal:** Establish the Solana smart contract foundation that coordinates the entire Slop Machine marketplace. This epic implements the on-chain account structures for projects, opportunities, bids, work submissions, and node reputation; integrates economic staking mechanisms to ensure AI node accountability; and creates the reputation tier system that enables progressive trust and reduced staking requirements. This blockchain layer serves as the trustless coordination mechanism that enables fully autonomous AI-to-AI collaboration without human intermediaries.

---

### Story 1.1: Solana Program Setup

As a platform developer,
I want to initialize an Anchor project for the Slop Machine smart contracts,
so that we have the foundational Solana program structure for implementing marketplace logic.

#### Acceptance Criteria

1. Anchor workspace initialized with version ≥0.29.0
2. Program directory structure created following Anchor conventions (`programs/`, `tests/`, `migrations/`)
3. `Anchor.toml` configured with devnet and mainnet-beta cluster URLs
4. `Cargo.toml` includes required dependencies: `anchor-lang`, `anchor-spl`, `pyth-sdk-solana`
5. Program ID placeholder configured in `declare_id!` macro
6. Initial program builds successfully with `anchor build`
7. Test scaffold created with basic deployment test
8. Tests run successfully with `anchor test`
9. Git repository initialized with appropriate `.gitignore` for Rust/Anchor projects
10. README.md created documenting build and test commands

---

### Story 1.2: Core Account Structures

As a platform developer,
I want to define the core Solana account structures (Project, Opportunity, Bid, Work, NodeRegistry) with reputation tier fields,
so that the smart contract can store and manage all marketplace state on-chain.

#### Acceptance Criteria

1. `Project` account structure defined with fields:
   - creator (Pubkey)
   - prd_arweave_tx (String - PRD document location)
   - architecture_arweave_tx (String - architecture document location)
   - total_budget (u64 - in lamports)
   - remaining_budget (u64)
   - status (enum: Active, Paused, Completed, Cancelled)
   - created_at (i64 timestamp)
   - token_mint (Option<Pubkey> - if pump.fun token launched)
2. `Opportunity` account structure defined with fields:
   - project (Pubkey - parent project)
   - story_id (String - e.g., "1.2")
   - story_arweave_tx (String - story document location)
   - payment_amount (u64 - in lamports)
   - required_stake_multiplier (f32 - based on tier requirements)
   - status (enum: Open, Assigned, InProgress, UnderReview, Completed, Failed)
   - assigned_node (Option<Pubkey>)
   - created_at (i64)
3. `Bid` account structure defined with fields:
   - opportunity (Pubkey)
   - node (Pubkey - bidding AI node)
   - bid_amount (u64 - requested payment)
   - stake_amount (u64 - locked collateral)
   - node_tier (u8 - reputation tier at time of bid)
   - status (enum: Pending, Accepted, Rejected, Withdrawn)
   - created_at (i64)
4. `Work` account structure defined with fields:
   - opportunity (Pubkey)
   - node (Pubkey - assigned AI node)
   - submission_arweave_tx (String - code/deliverable location)
   - github_pr_url (String)
   - validation_results (ValidationResult struct)
   - status (enum: Submitted, Validating, Passed, Failed)
   - submitted_at (i64)
   - failure_count (u8)
5. `NodeRegistry` account structure defined with fields:
   - node_pubkey (Pubkey)
   - twitter_handle (String)
   - total_projects_completed (u32)
   - total_projects_attempted (u32)
   - current_tier (u8 - calculated from formula)
   - success_rate (f32)
   - total_earnings (u64 - in lamports)
   - stake_slashed (u64 - total slashed amount)
   - registered_at (i64)
6. All account structures include proper Anchor macros (`#[account]`)
7. Account size calculations documented for rent exemption
8. Unit tests written verifying account serialization/deserialization
9. Tests pass with `anchor test`

---

### Story 1.3: Staking Account Structure

As a platform developer,
I want to implement a staking account structure that locks AI node collateral and handles slashing logic,
so that nodes have economic incentive to deliver quality work.

#### Acceptance Criteria

1. `Stake` account structure defined with fields:
   - node (Pubkey - AI node staking funds)
   - opportunity (Pubkey - which story being bid on)
   - stake_amount (u64 - collateral locked)
   - bid_amount (u64 - requested payment)
   - stake_multiplier (f32 - tier-based multiplier at lock time)
   - status (enum: Locked, Returned, Slashed)
   - locked_at (i64)
   - released_at (Option<i64>)
2. `SlashEvent` account structure defined with fields:
   - stake (Pubkey - reference to slashed stake)
   - node (Pubkey)
   - opportunity (Pubkey)
   - slashed_amount (u64)
   - to_project (u64 - 50% to project)
   - burned (u64 - 50% burned)
   - reason (String - why slashed)
   - slashed_at (i64)
3. Slashing logic documented: 3+ consecutive failures trigger stake slash
4. Slashing distribution documented: 50% to project escrow, 50% burned
5. Stake return logic documented: All validation checks pass → stake returned + payment released
6. Account structures include proper discriminators for Anchor
7. Unit tests for stake account creation
8. Unit tests for slashing calculation (50/50 split)
9. Tests pass with `anchor test`

---

### Story 1.4: Bidding Workflow with Staking

As a platform developer,
I want to implement the `submit_bid_with_stake` instruction that validates reputation tier and locks stake,
so that AI nodes can bid on opportunities with tier-appropriate stake requirements.

#### Acceptance Criteria

1. `submit_bid_with_stake` instruction implemented with parameters:
   - opportunity (Pubkey)
   - bid_amount (u64 - requested payment in lamports)
   - node_registry (Pubkey - bidder's reputation account)
2. Instruction validates:
   - Opportunity status is `Open`
   - Bid amount ≤ opportunity max payment
   - Bid amount ≥ PRD minimum ($2.50 equivalent via oracle)
   - Node has sufficient SOL for stake requirement
3. Stake multiplier calculated from node tier using formula: `max(1.0, 5.0 × exp(-0.15 × tier))`
4. Required stake calculated: `stake_amount = bid_amount × stake_multiplier`
5. Minimum absolute stake enforced: `floor(10 + (5 × log10(tier + 1)))` in dollars
6. Stake transferred from node wallet to program PDA (escrow)
7. `Stake` account created with status `Locked`
8. `Bid` account created with status `Pending`
9. Event emitted: `BidSubmitted { opportunity, node, bid_amount, stake_amount }`
10. Unit tests for tier 0 node (5.0x multiplier, $10 min stake)
11. Unit tests for tier 5 node (2.36x multiplier, $13.89 min stake)
12. Unit tests for tier 20 node (1.0x multiplier, $16.60 min stake)
13. Unit tests for insufficient stake (should fail)
14. Tests pass with `anchor test`

---

### Story 1.5: Custom Escrow Program Integration

As a platform developer,
I want to integrate a custom escrow program that holds both payment and stake funds and executes slashing on validation failure,
so that funds are securely held and automatically distributed based on work outcomes.

#### Acceptance Criteria

1. Program Derived Address (PDA) created for project escrow using seeds `["escrow", project_pubkey]`
2. Project creator deposits budget to escrow PDA on project creation
3. `lock_payment_and_stake` instruction implemented:
   - Transfers payment amount from project escrow to story escrow PDA
   - Payment + stake held in story escrow until validation complete
4. `release_payment_and_stake` instruction implemented (validation passed):
   - Transfers payment to node wallet
   - Returns stake to node wallet
   - Updates NodeRegistry (increment completed projects, update tier, add earnings)
   - Emits `PaymentReleased` event
5. `slash_stake_and_refund` instruction implemented (3+ failures):
   - Calculates slash amount (full stake)
   - Transfers 50% to project escrow
   - Transfers 50% to burn address (11111111111111111111111111111112)
   - Returns payment to project escrow
   - Updates NodeRegistry (increment attempted projects, record slash)
   - Creates `SlashEvent` account
   - Emits `StakeSlashed` event
6. Escrow PDA balance tracking implemented
7. Unit tests for payment lock on opportunity assignment
8. Unit tests for successful payment release + stake return
9. Unit tests for stake slashing (verify 50/50 split)
10. Unit tests for burn address transfer
11. Tests pass with `anchor test`

---

### Story 1.6: Pyth Oracle Integration

As a platform developer,
I want to integrate Pyth Network price feeds for SOL/USD conversion,
so that story pricing can be enforced in USD terms (e.g., $2.50 minimum) while payments are made in SOL.

#### Acceptance Criteria

1. Pyth SDK added to dependencies: `pyth-sdk-solana = "0.10"`
2. Pyth SOL/USD price feed account address configured (devnet and mainnet)
3. Helper function `get_sol_price_usd()` implemented:
   - Reads SOL/USD price from Pyth oracle
   - Returns price with confidence interval
   - Handles stale price (> 60 seconds old) by failing gracefully
4. Helper function `usd_to_lamports(usd_amount: f64)` implemented:
   - Fetches current SOL/USD price
   - Converts USD amount to lamports
   - Includes slippage tolerance (1%)
5. Helper function `lamports_to_usd(lamports: u64)` implemented:
   - Fetches current SOL/USD price
   - Converts lamports to USD equivalent
6. `submit_bid_with_stake` instruction updated to validate minimum USD value ($2.50)
7. Error handling for oracle unavailable or stale price
8. Unit tests for USD to lamports conversion (mock price $100/SOL)
9. Unit tests for minimum bid validation ($2.50 @ $100/SOL = 0.025 SOL)
10. Unit tests for stale price handling (should fail gracefully)
11. Integration test on devnet with real Pyth price feed
12. Tests pass with `anchor test`

---

### Story 1.7: Reputation System

As a platform developer,
I want to implement the infinite tier progression system with mathematical formulas for tier calculation, stake multiplier, and max story size,
so that AI nodes build reputation over time and earn lower staking requirements.

#### Acceptance Criteria

1. Tier calculation function implemented:
   ```rust
   fn calculate_tier(completed: u32, attempted: u32) -> u8 {
       let success_rate = completed as f32 / attempted as f32;
       (f32::sqrt(completed as f32) * success_rate).floor() as u8
   }
   ```
2. Stake multiplier function implemented:
   ```rust
   fn calculate_stake_multiplier(tier: u8) -> f32 {
       f32::max(1.0, 5.0 * f32::exp(-0.15 * tier as f32))
   }
   ```
3. Max story size function implemented (returns max USD bid):
   ```rust
   fn calculate_max_story_size(tier: u8) -> u64 {
       (5.0 * f32::powf(1.4, tier as f32)).floor() as u64
   }
   ```
4. Minimum absolute stake function implemented (returns min USD stake):
   ```rust
   fn calculate_min_absolute_stake(tier: u8) -> u64 {
       (10.0 + (5.0 * f32::log10(tier as f32 + 1.0))).floor() as u64
   }
   ```
5. `update_node_reputation` helper function implemented:
   - Increments completed projects on success
   - Increments attempted projects on both success and failure
   - Recalculates tier using formula
   - Updates success_rate
   - Called after work validation and after stake slashing
6. Unit tests verifying tier progression:
   - Tier 0: 0 projects → stake 5.0x, max $5 stories
   - Tier 1: 1-4 projects (100% success) → stake 4.30x, max $7 stories
   - Tier 5: 25-36 projects (100% success) → stake 2.36x, max $27 stories
   - Tier 10: 100-121 projects (100% success) → stake 1.12x, max $144 stories
   - Tier 20: 400-441 projects (100% success) → stake 1.0x, max $4,060 stories
7. Unit tests for success rate impact (70% success rate limits tier growth)
8. Unit tests for stake slashing impact (attempted++ without completed++)
9. Tests pass with `anchor test`

---

### Story 1.8: Deploy to Devnet + Comprehensive Testing

As a platform developer,
I want to deploy the complete Solana program to devnet and run comprehensive integration tests,
so that we can verify all marketplace logic works correctly before mainnet deployment.

#### Acceptance Criteria

1. Anchor program deployed to Solana devnet with `anchor deploy --provider.cluster devnet`
2. Program ID updated in `Anchor.toml` and `declare_id!` macro with devnet address
3. Integration test suite created covering:
   - Project creation with budget deposit
   - Opportunity creation for story
   - Node registration (3 test nodes: tier 0, tier 5, tier 10)
   - Bid submission with stake lock (all 3 nodes)
   - Opportunity assignment to lowest bidder
   - Work submission with validation pass → payment + stake return
   - Work submission with validation fail → failure count increment
   - Work submission with 3 failures → stake slash
4. Pyth oracle integration tested on devnet (real SOL/USD price feed)
5. USD amount conversions tested with real prices
6. Reputation tier progression tested (complete 10 stories, verify tier increases)
7. All integration tests pass on devnet
8. Test results documented showing:
   - Successful payment flow
   - Successful slashing flow
   - Reputation progression
   - Oracle price conversions
9. Devnet program address documented in README.md

---

### Story 1.9: Deploy to Mainnet-Beta

As a platform developer,
I want to deploy the Solana program to mainnet-beta and verify it works with real SOL,
so that the Slop Machine marketplace can operate in production.

#### Acceptance Criteria

1. Mainnet deployment checklist completed:
   - All devnet tests passing
   - Security audit considerations documented
   - Upgrade authority configuration reviewed
   - Emergency pause mechanism reviewed (if applicable)
2. Anchor program deployed to mainnet-beta with `anchor deploy --provider.cluster mainnet`
3. Program ID updated in `Anchor.toml` and `declare_id!` macro with mainnet address
4. Pyth oracle mainnet price feed address configured
5. Smoke test on mainnet with real SOL (small amounts):
   - Create test project with 0.1 SOL budget
   - Create test opportunity for $5 story
   - Register test node (tier 0)
   - Submit bid with stake (0.025 SOL bid + 0.125 SOL stake @ 5x multiplier)
   - Simulate validation pass → verify payment + stake return
6. All smoke tests pass on mainnet
7. Mainnet program address published in README.md and docs/architecture.md
8. Mainnet deployment announced (Twitter, Discord, etc.)
9. Program verified on Solana Explorer (solscan.io or solana.fm)
10. Monitoring configured for program activity (transaction counts, errors)

---

**Epic 1 Success Criteria:**
- ✅ Staking-based bidding system working on mainnet
- ✅ Reputation tiers calculated using infinite progression formulas
- ✅ Economic staking enforced (5x for new nodes, 1x floor for elite nodes)
- ✅ Escrow holds payment + stake securely
- ✅ Slashing works (50% to project, 50% burned)
- ✅ Pyth oracle provides SOL/USD pricing
- ✅ All account structures deployed and tested
- ✅ Comprehensive tests pass on devnet and mainnet

---

## Epic 2: Arweave Integration (Milestone 0)

**Duration:** 2 weeks (parallel with Epic 1)

**Epic Goal:** Integrate Arweave permanent storage for all project documents (PRDs, architectures, stories, code submissions) using the Turbo SDK with SOL payments. This epic creates the document storage layer that enables trustless, immutable, and permanent access to all marketplace artifacts, ensuring AI nodes can always retrieve context and token holders can verify work. Arweave serves as the decentralized document backend that replaces traditional cloud storage.

---

### Story 2.1: Turbo SDK Integration

As a platform developer,
I want to integrate the Turbo SDK (@ardrive/turbo-sdk) for Arweave uploads,
so that we can upload documents to Arweave and pay with SOL instead of AR tokens.

#### Acceptance Criteria

1. Turbo SDK installed: `npm install @ardrive/turbo-sdk` or `cargo add turbo-sdk` (depending on implementation language)
2. Turbo client initialized with Solana wallet configuration
3. Helper function `initializeTurboClient()` implemented:
   - Accepts Solana wallet keypair
   - Creates Turbo client instance
   - Handles authentication with Turbo service
4. Connection tested to Turbo API endpoint
5. SOL payment method configured (default payment token)
6. Error handling for network failures and authentication errors
7. Unit tests for client initialization
8. Integration test uploading small test file (<1KB) to Arweave
9. Verify transaction ID returned from upload
10. README documentation for Turbo SDK setup and usage

---

### Story 2.2: Document Upload Service

As a platform developer,
I want to implement a document upload service that accepts documents and uploads them to Arweave with SOL payments,
so that PRDs, architectures, and code submissions can be permanently stored.

#### Acceptance Criteria

1. `uploadDocument()` function implemented with parameters:
   - document (Buffer or string - document content)
   - metadata (object - document metadata)
   - wallet (Solana keypair - for payment)
2. Function workflow:
   - Initializes Turbo client with wallet
   - Uploads document to Arweave via Turbo SDK
   - Pays for upload with SOL (automatic conversion via Turbo)
   - Returns Arweave transaction ID
3. Cost calculation function `estimateUploadCost(fileSize: number)` implemented:
   - Estimates SOL cost based on file size
   - Queries Turbo pricing API
   - Returns estimated cost in lamports
4. Upload status tracking (pending, confirmed, failed)
5. Retry logic for failed uploads (3 attempts with exponential backoff)
6. Error handling for insufficient SOL balance
7. Unit tests for upload function
8. Unit tests for cost estimation
9. Integration tests:
   - Upload 1KB document (PRD excerpt)
   - Upload 100KB document (full architecture)
   - Upload 1MB document (large code submission)
10. Verify all uploaded documents accessible via `https://arweave.net/{tx-id}`

---

### Story 2.3: Document Download Service

As a platform developer,
I want to implement a document download service that fetches documents from Arweave by transaction ID,
so that AI nodes can retrieve PRDs, architectures, and stories for execution.

#### Acceptance Criteria

1. `downloadDocument(txId: string)` function implemented:
   - Accepts Arweave transaction ID
   - Fetches document from `https://arweave.net/{txId}`
   - Returns document content as string or Buffer
2. Caching layer implemented:
   - Cache downloaded documents locally (temporary directory)
   - Cache key: transaction ID
   - Cache expiration: 24 hours or configurable
   - Reduces redundant downloads for frequently accessed documents
3. Error handling for:
   - Invalid transaction ID
   - Document not found (404)
   - Network timeouts
   - Document not yet confirmed on Arweave
4. Retry logic for failed downloads (3 attempts)
5. Helper function `isDocumentConfirmed(txId: string)` implemented:
   - Checks if Arweave transaction is confirmed
   - Returns boolean and confirmation count
6. Unit tests for download function
7. Unit tests for caching logic
8. Integration tests:
   - Download document uploaded in Story 2.2
   - Verify content matches original upload
   - Test cache hit (second download faster)
9. Performance benchmark: Download 100KB document in <2 seconds

---

### Story 2.4: Metadata Tagging

As a platform developer,
I want to implement metadata tagging for uploaded documents,
so that documents can be categorized, searched, and filtered by type, project, and BMAD document category.

#### Acceptance Criteria

1. Metadata schema defined:
   ```typescript
   interface DocumentMetadata {
     project_id: string;          // Solana project account pubkey
     document_type: 'prd' | 'architecture' | 'story' | 'code_submission' | 'qa_report';
     bmad_version: string;        // BMAD template version (e.g., "2.0")
     created_at: number;          // Unix timestamp
     author: string;              // Solana pubkey of uploader
     story_id?: string;           // Optional: "1.2" for stories/code
     file_size: number;           // Bytes
     mime_type: string;           // "text/markdown", "application/zip", etc.
   }
   ```
2. `uploadDocumentWithMetadata()` function implemented:
   - Accepts document + metadata object
   - Encodes metadata as Arweave tags
   - Uploads document with tags via Turbo SDK
3. Arweave tags mapped from metadata:
   - Tag: "Project-Id" → metadata.project_id
   - Tag: "Document-Type" → metadata.document_type
   - Tag: "BMAD-Version" → metadata.bmad_version
   - Tag: "Created-At" → metadata.created_at
   - Tag: "Author" → metadata.author
   - Tag: "Story-Id" → metadata.story_id (if present)
4. Helper function `parseDocumentMetadata(txId: string)` implemented:
   - Fetches Arweave transaction metadata
   - Parses tags into DocumentMetadata object
   - Returns metadata object
5. Unit tests for metadata encoding/decoding
6. Integration tests:
   - Upload PRD with metadata
   - Fetch and verify metadata tags on Arweave
   - Upload story with story_id tag
7. Metadata validation (required fields present)

---

### Story 2.5: Cost Tracking and Optimization

As a platform developer,
I want to implement cost tracking for Arweave uploads and optimize upload costs,
so that platform economics remain viable and cost per upload is minimized.

#### Acceptance Criteria

1. Cost tracking database/storage implemented:
   - Tracks each upload: txId, fileSize, solCost, timestamp
   - Aggregates total SOL spent on Arweave storage
   - Aggregates total bytes uploaded
2. Analytics functions implemented:
   - `getTotalStorageCost()`: Returns total SOL spent
   - `getAverageCostPerMB()`: Returns average cost per MB uploaded
   - `getCostByDocumentType()`: Returns costs grouped by type (PRD, architecture, etc.)
3. Cost optimization techniques implemented:
   - Compression: Gzip compress documents before upload (reduces size by ~70%)
   - Deduplication: Check if identical document already uploaded (hash comparison)
   - Batching: Combine multiple small documents into single upload (if applicable)
4. Helper function `compressDocument(content: string)` implemented:
   - Gzip compresses document
   - Returns compressed buffer
   - Tagged with "Content-Encoding: gzip" on Arweave
5. Helper function `decompressDocument(buffer: Buffer)` implemented:
   - Decompresses gzip buffer
   - Returns original content
6. Cost reporting:
   - Weekly cost report function
   - Breakdown by document type and project
   - Alerts if costs exceed threshold
7. Unit tests for compression/decompression
8. Integration tests:
   - Upload compressed vs uncompressed document
   - Verify cost savings (~70% reduction)
   - Upload duplicate document (verify deduplication)
9. Performance benchmark: Compression adds <100ms overhead
10. Documentation of cost optimization strategies

---

**Epic 2 Success Criteria:**
- ✅ Documents permanently stored on Arweave
- ✅ SOL payments working via Turbo SDK
- ✅ Upload and download services operational
- ✅ Metadata tagging enables document categorization
- ✅ Cost tracking provides visibility into storage expenses
- ✅ Compression reduces upload costs by ~70%
- ✅ All uploaded documents accessible via HTTPS URLs
- ✅ Integration tests pass for upload/download workflows

---

## Epic 3: AI Node Core (Milestone 0)

**Duration:** 2 weeks (parallel)

**Epic Goal:** Build the generic AI node infrastructure that enables any node type (architect, developer, QA, infrastructure) to participate in the Slop Machine marketplace. This epic implements the core capabilities ALL nodes need: event subscriptions for opportunity discovery, reputation tracking, stake management, bidding logic, document handling (Arweave download/upload), LLM provider abstraction, BMAD agent execution, and GitHub/Solana integration. Node specialization is achieved purely through BMAD agent configuration, making the node infrastructure completely reusable.

**Note:** This epic implements the core node infrastructure used by ALL node types (architect, developer, QA, infrastructure). Node types differ only in their BMAD agent configuration.

---

### Story 3.1: Event Subscription System

As an AI node operator,
I want my node to subscribe to Solana program events via WebSocket and receive real-time opportunity notifications,
so that my node can immediately bid on new opportunities without polling.

#### Acceptance Criteria

1. Solana WebSocket connection established to configured RPC endpoint (devnet/mainnet)
2. `subscribeToOpportunities()` function implemented using `onProgramAccountChange`:
   - Subscribes to Opportunity account changes for the Slop Machine program
   - Filters for accounts with status = "Open"
   - Receives real-time notifications when new opportunities are posted
3. Event handler `onOpportunityCreated(opportunity: Opportunity)` implemented:
   - Parses Opportunity account data
   - Extracts story requirements (story_id, payment_amount, required_stake)
   - Triggers bidding evaluation workflow
4. WebSocket reconnection logic implemented:
   - Detects connection loss
   - Automatic reconnection with exponential backoff
   - Resubscribes to all active subscriptions
5. Event logging for debugging (opportunity_id, payment_amount, timestamp)
6. Configuration options:
   - RPC endpoint URL (configurable for devnet/mainnet)
   - Subscription filters (opportunity types, payment ranges)
7. Unit tests for event parsing
8. Integration tests:
   - Create test opportunity on devnet
   - Verify node receives WebSocket notification within 2 seconds
9. Performance: Handle 100+ concurrent opportunity subscriptions without degradation

---

### Story 3.2: Reputation Tier Tracking

As an AI node operator,
I want my node to track its reputation tier locally based on completed and attempted projects,
so that it can calculate correct stake requirements and bid on appropriately sized opportunities.

#### Acceptance Criteria

1. Local state storage implemented for reputation data:
   - `node_pubkey`: Solana public key
   - `total_projects_completed`: u32
   - `total_projects_attempted`: u32
   - `current_tier`: u8 (calculated)
   - `success_rate`: f32 (calculated)
   - `total_earnings`: u64 (lamports)
   - Last synced timestamp
2. `syncReputationFromChain()` function implemented:
   - Queries NodeRegistry account from Solana
   - Updates local reputation state
   - Called on node startup and periodically (every 5 minutes)
3. `calculateTier()` function implemented using formula:
   ```typescript
   tier = floor(sqrt(completed) × successRate)
   ```
4. `calculateStakeMultiplier(tier: number)` function implemented:
   ```typescript
   stakeMultiplier = max(1.0, 5.0 × exp(-0.15 × tier))
   ```
5. `calculateMaxStorySize(tier: number)` function implemented:
   ```typescript
   maxStorySize = floor(5 × pow(1.4, tier))
   ```
6. `canBidOnOpportunity(paymentAmount: number)` function implemented:
   - Checks if paymentAmount ≤ maxStorySize for current tier
   - Returns boolean
7. Reputation state persisted to local database/file (survives node restarts)
8. Unit tests for tier calculation at various project counts
9. Unit tests for stake multiplier calculation
10. Integration test: Sync reputation from devnet NodeRegistry account

---

### Story 3.3: Staking Logic

As an AI node operator,
I want my node to automatically calculate required stake amounts and lock stake when bidding,
so that economic security is enforced according to my reputation tier.

#### Acceptance Criteria

1. `calculateRequiredStake(bidAmount: number, tier: number)` function implemented:
   - Calculates stake multiplier using tier formula
   - Calculates stake: `bidAmount × stakeMultiplier`
   - Enforces minimum absolute stake: `floor(10 + (5 × log10(tier + 1)))` USD
   - Converts USD amounts to lamports using Pyth oracle
2. `checkStakeBalance()` function implemented:
   - Queries node wallet SOL balance
   - Returns available SOL for staking
   - Warns if balance insufficient for typical bids
3. `lockStake(opportunityId: string, bidAmount: number, stakeAmount: number)` function implemented:
   - Calls Solana program `submit_bid_with_stake` instruction
   - Transfers stake from node wallet to program escrow
   - Creates Stake account on-chain
   - Returns transaction signature
4. Stake status tracking:
   - Maps opportunityId → stakeAccount
   - Tracks locked stakes locally
   - Updates on stake return or slash events
5. `onStakeReturned(opportunityId: string)` event handler:
   - Updates local state when stake returned
   - Logs stake return event
6. `onStakeSlashed(opportunityId: string, amount: number)` event handler:
   - Updates local state when stake slashed
   - Logs slash event with reason
   - Alerts node operator
7. Unit tests for stake calculation across tiers
8. Unit tests for minimum absolute stake enforcement
9. Integration test: Lock stake on devnet opportunity

---

### Story 3.4: Bidding Logic

As an AI node operator,
I want my node to automatically evaluate opportunities and submit bids with appropriate pricing and stake,
so that it can compete for work in the marketplace autonomously.

#### Acceptance Criteria

1. `evaluateOpportunity(opportunity: Opportunity)` function implemented:
   - Downloads story document from Arweave
   - Estimates effort (simple heuristic: story complexity → hours)
   - Calculates target bid in USD
   - Checks if opportunity within tier limits
   - Returns bid decision (bid/skip)
2. Bidding strategy configuration:
   - `target_hourly_rate_usd`: Configurable (default: $50/hour)
   - `minimum_bid_usd`: Never bid below this (default: $2.50)
   - `maximum_bid_percentage`: Max % of opportunity budget (default: 90%)
3. `calculateBid(estimatedHours: number, hourlyRate: number)` function:
   - Calculates USD bid: `hours × hourlyRate`
   - Converts to SOL lamports using Pyth oracle
   - Adds 5% buffer for price volatility
4. `submitBid(opportunityId: string, bidAmount: number)` function:
   - Calculates required stake
   - Checks wallet balance sufficient for bid + stake
   - Calls `lockStake()` to submit bid on-chain
   - Records bid locally
   - Returns bid transaction signature
5. Competitive bidding logic:
   - Queries existing bids for opportunity
   - Optionally undercuts lowest bid by configurable % (default: 5%)
6. Bid filtering:
   - Skip opportunities outside tier limits
   - Skip if estimated effort exceeds node capacity
   - Skip if insufficient balance for stake
7. Unit tests for bid calculation
8. Unit tests for opportunity evaluation
9. Integration test: Full bidding workflow on devnet (evaluate → calculate → submit)

---

### Story 3.5: Document Download from Arweave

As an AI node operator,
I want my node to download PRDs, architectures, and story documents from Arweave,
so that it has the context needed to execute work.

#### Acceptance Criteria

1. `downloadPRD(txId: string)` function implemented:
   - Fetches PRD from Arweave using Epic 2 service
   - Parses markdown document
   - Returns structured PRD object
2. `downloadArchitecture(txId: string)` function implemented:
   - Fetches architecture document
   - Parses YAML/markdown sections
   - Returns structured architecture object
3. `downloadStory(txId: string)` function implemented:
   - Fetches story document
   - Parses user story, acceptance criteria
   - Returns structured story object
4. Local caching integrated (from Epic 2):
   - Documents cached after first download
   - Cache invalidation after 24 hours
5. `getProjectContext(projectId: string)` function implemented:
   - Queries Project account from Solana
   - Downloads PRD using prd_arweave_tx
   - Downloads architecture using architecture_arweave_tx
   - Returns complete project context
6. Error handling:
   - Document not found on Arweave
   - Parse errors (malformed documents)
   - Network timeouts
7. Unit tests for document parsing
8. Integration tests:
   - Download real PRD from devnet project
   - Download real architecture
   - Verify parsed data structure correct

---

### Story 3.6: LLM Provider Abstraction Layer

As an AI node operator,
I want my node to support multiple LLM providers (Claude, OpenAI, DeepSeek, Groq, Ollama),
so that I can choose cost-effective or locally-hosted models.

#### Acceptance Criteria

1. LLM provider interface defined:
   ```typescript
   interface LLMProvider {
     generateCompletion(prompt: string, options: CompletionOptions): Promise<string>;
     estimateCost(prompt: string): Promise<number>; // USD
     supportsStreaming(): boolean;
   }
   ```
2. Claude provider implemented (`ClaudeProvider`):
   - Uses Anthropic API
   - Supports Claude 3.5 Sonnet, Claude 3 Opus
   - API key configuration
3. OpenAI provider implemented (`OpenAIProvider`):
   - Uses OpenAI API
   - Supports GPT-4, GPT-4 Turbo
   - API key configuration
4. DeepSeek provider implemented (`DeepSeekProvider`):
   - Uses DeepSeek API
   - Lower cost alternative
   - API key configuration
5. Groq provider implemented (`GroqProvider`):
   - Uses Groq API for fast inference
   - Supports Llama models
   - API key configuration
6. Ollama provider implemented (`OllamaProvider`):
   - Connects to local Ollama server
   - Supports local models (Llama, Mistral, etc.)
   - No API key needed, fully local
7. Provider configuration file (`llm-config.yaml`):
   ```yaml
   primary_provider: "claude"
   fallback_provider: "ollama"
   providers:
     claude:
       api_key: "${ANTHROPIC_API_KEY}"
       model: "claude-3-5-sonnet-20241022"
     openai:
       api_key: "${OPENAI_API_KEY}"
       model: "gpt-4-turbo"
     ollama:
       endpoint: "http://localhost:11434"
       model: "llama3:70b"
   ```
8. Provider selection logic:
   - Primary provider used by default
   - Fallback on rate limits or errors
9. Cost tracking per provider
10. Unit tests for each provider
11. Integration tests with real API calls (small prompts)

---

### Story 3.7: BMAD Agent Execution Framework

As an AI node operator,
I want my node to load and execute BMAD agents (architect, developer, QA, infrastructure) with project context,
so that it can perform specialized work based on its node type configuration.

#### Acceptance Criteria

1. BMAD agent loader implemented:
   - Reads agent YAML configuration from `.bmad-core/agents/` directory
   - Parses agent persona, instructions, dependencies
   - Returns agent object
2. Agent types supported:
   - `architect`: Generates architecture.md from PRD
   - `developer`: Implements stories from architecture + PRD
   - `qa`: Reviews code submissions, runs tests
   - `infrastructure`: Sets up CI/CD, deployments
3. `executeAgent(agentType: string, context: ProjectContext)` function implemented:
   - Loads appropriate BMAD agent config
   - Constructs prompt with project context (PRD + architecture + story)
   - Calls LLM provider with agent prompt
   - Returns agent output (code, documents, etc.)
4. Context injection:
   - PRD injected into prompt
   - Architecture injected into prompt
   - Story injected into prompt
   - Previous work referenced if applicable
5. Agent output parsing:
   - Extracts generated code
   - Extracts generated documents
   - Extracts agent reasoning/explanations
6. Token management:
   - Tracks tokens used per agent execution
   - Warns if context approaching token limits
7. Error handling:
   - LLM provider errors
   - Malformed agent outputs
   - Context too large
8. Unit tests for agent loading
9. Unit tests for context injection
10. Integration test: Execute architect agent with test PRD, verify architecture.md generated

---

### Story 3.8: Automated BMAD Checklist Validation

As an AI node operator,
I want my node to validate work submissions using BMAD checklists and calculate quality scores,
so that validation is automated and objective.

#### Acceptance Criteria

1. `loadChecklist(checklistName: string)` function implemented:
   - Loads checklist from `.bmad-core/checklists/`
   - Parses checklist items
   - Returns checklist object
2. Checklist types supported:
   - `architecture-checklist.md`: Validates architecture documents
   - `story-dod-checklist.md`: Validates story completion (definition of done)
   - `pm-checklist.md`: Validates PRDs
3. `validateWithChecklist(artifact: string, checklistName: string)` function:
   - Loads appropriate checklist
   - Uses LLM to evaluate artifact against each checklist item
   - Assigns score (0-100) per item
   - Returns overall score and per-item results
4. Validation prompt construction:
   - Includes artifact (architecture.md, code, etc.)
   - Includes checklist items
   - Instructs LLM to evaluate each item and provide score
5. Score aggregation:
   - Overall score = average of all item scores
   - Pass threshold: ≥80%
   - Fail threshold: <80%
6. Validation report generation:
   - Lists all checklist items
   - Shows score per item
   - Highlights failed items
   - Suggests improvements
7. `submitValidationResults(opportunityId: string, score: number, report: string)` function:
   - Posts validation results to Solana
   - Creates AutomatedValidation account
   - Triggers payment/slash based on score
8. Unit tests for checklist loading
9. Unit tests for score calculation
10. Integration test: Validate test architecture against checklist, verify score calculated

---

### Story 3.9: Arweave Upload

As an AI node operator,
I want my node to upload completed work (architectures, code, QA reports) to Arweave,
so that deliverables are permanently stored and accessible on-chain.

#### Acceptance Criteria

1. `uploadWorkSubmission(content: string, metadata: SubmissionMetadata)` function implemented:
   - Compresses content (gzip)
   - Uses Epic 2 upload service
   - Uploads to Arweave with SOL payment
   - Returns Arweave transaction ID
2. Submission metadata schema:
   ```typescript
   interface SubmissionMetadata {
     opportunity_id: string;
     node_pubkey: string;
     submission_type: 'architecture' | 'code' | 'qa_report';
     story_id: string;
     submitted_at: number;
   }
   ```
3. Cost management:
   - Estimates upload cost before submitting
   - Deducts cost from node earnings
   - Tracks total upload costs
4. Submission packaging:
   - For code: Creates zip archive of modified files
   - For architecture: Single markdown file
   - For QA reports: Markdown with test results
5. Arweave transaction ID recorded:
   - Stored in local database
   - Used for Work account submission on Solana
6. Retry logic for failed uploads
7. Unit tests for submission packaging
8. Integration tests:
   - Upload test architecture document
   - Verify accessible on Arweave
   - Upload code zip archive

---

### Story 3.10: GitHub Integration

As an AI node operator,
I want my node to create pull requests and comment on GitHub repositories,
so that code submissions are integrated into the project's workflow.

#### Acceptance Criteria

1. GitHub API integration:
   - Uses GitHub REST API or Octokit
   - Personal access token configuration
2. `createPullRequest(repo: string, branch: string, title: string, body: string, files: File[])` function:
   - Forks repository (if not already forked)
   - Creates new branch from development branch
   - Commits files to new branch
   - Opens pull request to development branch
   - Returns PR URL
3. PR title format: `Story {story_id}: {story_title}`
4. PR body template:
   ```markdown
   ## Story {story_id}
   {user_story}

   ## Implementation
   {implementation_summary}

   ## Validation
   - Tests: {passed/failed}
   - Linting: {passed/failed}
   - Build: {passed/failed}

   ## Arweave Submission
   {arweave_tx_id}

   🤖 Generated by AI Node: {node_pubkey}
   ```
5. `commentOnPR(prUrl: string, comment: string)` function:
   - Posts comment to existing PR
   - Used for validation results or updates
6. Branch naming: `story/{story_id}-{node_pubkey_short}`
7. Error handling:
   - Repository not found
   - Insufficient permissions
   - PR already exists for branch
8. Unit tests for PR creation logic
9. Integration test:
   - Create test PR on demo repository
   - Verify PR created successfully
   - Post comment to PR

---

### Story 3.11: On-Chain Work Submission

As an AI node operator,
I want my node to submit completed work to the Solana smart contract,
so that validation and payment can be triggered automatically.

#### Acceptance Criteria

1. `submitWork(opportunityId: string, submissionData: WorkSubmission)` function implemented:
   - Creates Work account on Solana
   - Includes Arweave transaction ID (from Story 3.9)
   - Includes GitHub PR URL (from Story 3.10)
   - Includes validation score (from Story 3.8)
   - Returns transaction signature
2. Work submission data structure:
   ```typescript
   interface WorkSubmission {
     opportunity_id: string;
     submission_arweave_tx: string;
     github_pr_url: string;
     validation_score: number;
     submitted_at: number;
   }
   ```
3. Solana instruction called: `submit_work`
4. Transaction includes:
   - Opportunity account reference
   - Work account creation
   - Node signature
5. Work status set to "Submitted" initially
6. Event emitted: `WorkSubmitted { opportunity_id, node, arweave_tx, pr_url }`
7. Local work tracking:
   - Maps opportunity_id → work submission
   - Tracks submission status
8. `onValidationComplete(opportunityId: string, passed: boolean)` event handler:
   - Listens for on-chain validation events
   - Updates local status
   - Triggers stake return or reports slash
9. Unit tests for work submission data structure
10. Integration test:
   - Submit test work to devnet opportunity
   - Verify Work account created on-chain
   - Verify event emitted

---

**Epic 3 Success Criteria:**
- ✅ Generic node infrastructure works for all node types (architect, developer, QA, infrastructure)
- ✅ WebSocket event subscriptions provide real-time opportunity notifications
- ✅ Reputation tier system implemented with correct formulas
- ✅ Staking and bidding logic fully automated
- ✅ Document download/upload working via Arweave
- ✅ Multi-provider LLM abstraction supports Claude, OpenAI, DeepSeek, Groq, Ollama
- ✅ BMAD agent execution framework loads and runs agents with context
- ✅ Automated checklist validation calculates quality scores
- ✅ GitHub integration creates PRs and comments
- ✅ On-chain work submission triggers validation and payment
- ✅ All integration tests pass on devnet

---

## Epic 4: Client & Token Holder UIs (Milestone 0)

**Duration:** 2 weeks

**Epic Goal:** Build Next.js web applications for project creators, token holders, and AI node operators to interact with the Slop Machine marketplace. Client UI enables project creation, opportunity posting, and progress tracking. Token holder UI provides transparent visibility into live project status with staging URLs and validation results. Node operator UI enables registration, earnings tracking, and configuration management. All UIs integrate with Solana wallets and display real-time on-chain data.

---

### Story 4.1: Next.js App Setup

As a platform developer,
I want to set up a Next.js application with Solana wallet adapter and basic routing,
so that we have the foundation for all marketplace UIs.

#### Acceptance Criteria

1. Next.js 14+ project initialized with TypeScript
2. Project structure created:
   - `/app` directory for app router
   - `/components` for React components
   - `/lib` for utilities and services
   - `/hooks` for custom React hooks
3. Solana wallet adapter packages installed:
   - `@solana/wallet-adapter-react`
   - `@solana/wallet-adapter-react-ui`
   - `@solana/wallet-adapter-wallets`
4. Tailwind CSS configured for styling
5. Basic layout component with navigation:
   - Home link
   - Projects link
   - Node Operator link
   - Wallet connection button
6. Routes created:
   - `/` - Home page
   - `/projects` - Project list
   - `/projects/[id]` - Project detail
   - `/node` - Node operator dashboard
7. Environment configuration:
   - `NEXT_PUBLIC_SOLANA_RPC_URL` (devnet/mainnet)
   - `NEXT_PUBLIC_PROGRAM_ID` (Slop Machine program)
8. Build succeeds with `npm run build`
9. Development server runs with `npm run dev`
10. README with setup instructions

---

### Story 4.2: Client Flow

As a project creator,
I want to upload my PRD, post opportunities for stories, and review bids from AI nodes,
so that I can get my project built by the marketplace.

#### Acceptance Criteria

1. **PRD Upload Page** (`/projects/new`):
   - File upload dropzone for markdown PRD
   - PRD preview (markdown rendered)
   - Budget input (SOL amount)
   - "Create Project" button
2. `createProject()` function implemented:
   - Uploads PRD to Arweave (Epic 2 service)
   - Creates Project account on Solana
   - Deposits budget to escrow
   - Navigates to project dashboard
3. **Project Dashboard** (`/projects/[id]`):
   - Project metadata display (budget, remaining, status)
   - Story list with statuses (pending, assigned, in progress, completed)
   - "Post Opportunity" button per story
4. **Post Opportunity Modal**:
   - Story selection dropdown
   - Payment amount input (USD, converted to SOL)
   - Required tier selection (minimum node tier)
   - "Post" button
5. `postOpportunity()` function implemented:
   - Creates Opportunity account on Solana
   - Locks payment in escrow
   - Displays success message
6. **Bid Review Page** (`/projects/[id]/opportunities/[storyId]`):
   - List of bids (node, amount, tier, timestamp)
   - Node reputation display (tier, success rate, completed projects)
   - "Accept Bid" button per bid
7. `acceptBid()` function implemented:
   - Updates Opportunity status to "Assigned"
   - Locks node stake in escrow
   - Triggers work start
8. Wallet connection required for all actions
9. Transaction confirmation toasts
10. Error handling with user-friendly messages

---

### Story 4.3: Solana Wallet Adapter Integration

As a marketplace user,
I want to connect my Solana wallet (Phantom, Coinbase Wallet, Backpack, Solflare) via browser extension,
so that I can interact with the marketplace using my wallet.

#### Acceptance Criteria

1. `WalletProvider` component implemented wrapping app:
   - Supports Phantom, Coinbase Wallet, Backpack, Solflare wallets
   - Auto-detects installed wallet extensions
   - Provides wallet context to all components
2. "Connect Wallet" button in navigation:
   - Opens wallet selection modal
   - Displays installed wallets
   - Connects to selected wallet
   - Shows wallet address when connected (truncated format: `Abc...xyz`)
3. `useWallet()` hook used throughout app:
   - Access connected wallet address
   - Access wallet connection status
   - Access `signTransaction` and `sendTransaction` functions
4. Wallet disconnection:
   - "Disconnect" button in navigation
   - Clears wallet context
   - Returns to unauthenticated state
5. Protected routes:
   - Redirect to home if wallet not connected
   - Show "Connect Wallet" prompt
6. Network selection (devnet/mainnet):
   - Environment variable configures network
   - RPC endpoint matches selected network
7. Transaction signing UX:
   - Loading state during wallet approval
   - Success/failure notifications
8. Error handling:
   - Wallet not installed (link to install)
   - User rejected transaction
   - Insufficient SOL balance
9. Mobile wallet support (WalletConnect)
10. Unit tests for wallet integration

---

### Story 4.4: Project Dashboard

As a project creator or token holder,
I want to view project progress with story status, staging URLs, and validation results,
so that I can track development and see live deployments.

#### Acceptance Criteria

1. **Project Overview Card**:
   - Project name (from PRD)
   - Total budget (SOL)
   - Remaining budget (SOL)
   - Project status (Active, Paused, Completed)
   - Created date
2. **Story Progress Table**:
   - Columns: Story ID, Title, Status, Assigned Node, Payment, Staging URL, Actions
   - Story statuses: Open, Assigned, In Progress, Under Review, Completed, Failed
   - Status badges with color coding
3. **Story Detail View** (expandable row or modal):
   - User story text
   - Acceptance criteria list
   - Assigned node (if applicable)
   - Bid amount and stake amount
   - Work submission Arweave link
   - GitHub PR link
   - Validation results (tests, linting, build status)
   - Staging deployment URL (clickable)
4. **Staging URL Display**:
   - For web apps: `https://arweave.net/{tx-id}`
   - For APIs: `https://{provider}.akash.network`
   - "View Staging" button opens in new tab
5. **Validation Status Indicators**:
   - ✅ All checks passed
   - ⚠️ Some checks failed
   - ❌ All checks failed
   - Detailed results on hover/click
6. **Real-time Updates**:
   - WebSocket connection to Solana events
   - Updates story status automatically
   - Notification toasts for status changes
7. **Budget Visualization**:
   - Progress bar showing spent vs remaining budget
   - Breakdown by story (completed, in progress, available)
8. **Filters and Search**:
   - Filter by story status
   - Search by story ID or title
9. Data fetches from Solana and Arweave
10. Loading states and error boundaries

---

### Story 4.5: Arweave Document Viewer

As a project creator or token holder,
I want to view PRDs, architectures, and code submissions stored on Arweave,
so that I can review project documents and deliverables.

#### Acceptance Criteria

1. **Document Viewer Component**:
   - Accepts Arweave transaction ID as prop
   - Fetches document from `https://arweave.net/{txId}`
   - Displays loading state while fetching
2. **Markdown Rendering**:
   - For PRDs, architectures, stories: Render as formatted markdown
   - Syntax highlighting for code blocks
   - Table rendering
   - Heading navigation (table of contents)
3. **Document Metadata Display**:
   - Document type (PRD, architecture, code, QA report)
   - Author (Solana pubkey)
   - Uploaded date
   - File size
4. **Code Archive Viewer**:
   - For code submissions (zip files): File tree viewer
   - Click file to view contents
   - Syntax highlighting based on file extension
5. **Download Button**:
   - Download raw document from Arweave
   - Filename based on document type and date
6. **Embed in Project Dashboard**:
   - "View PRD" button opens viewer modal
   - "View Architecture" button opens viewer
   - "View Submission" button for work submissions
7. **Error Handling**:
   - Document not found (404)
   - Parse errors (malformed markdown)
   - Network errors (retry button)
8. **Mobile Responsive**:
   - Readable on mobile devices
   - Touch-friendly navigation
9. **Permalink Support**:
   - URL route: `/documents/[txId]`
   - Shareable links to documents
10. Performance: Lazy load large documents

---

### Story 4.6: Real-Time Updates

As a project creator or token holder,
I want to receive real-time updates when story status changes or validation completes,
so that I can monitor progress without refreshing the page.

#### Acceptance Criteria

1. **Solana WebSocket Subscription**:
   - Subscribe to Project account changes
   - Subscribe to Opportunity account changes for project stories
   - Subscribe to Work account changes
2. **Event Handlers Implemented**:
   - `onOpportunityStatusChange`: Update story status in UI
   - `onBidSubmitted`: Show notification "New bid received"
   - `onWorkSubmitted`: Show notification "Work submitted"
   - `onValidationComplete`: Update validation status, show result
3. **Notification System**:
   - Toast notifications for important events
   - Notification types: Info, Success, Warning, Error
   - Auto-dismiss after 5 seconds (configurable)
   - Notification queue (max 3 visible)
4. **UI Updates Without Refresh**:
   - Story status badges update automatically
   - Staging URLs appear when deployment complete
   - Validation results update in real-time
5. **WebSocket Connection Management**:
   - Auto-connect on page load
   - Auto-reconnect on connection loss
   - Display connection status indicator
   - Graceful degradation if WebSocket unavailable (poll every 30s)
6. **Activity Feed** (optional):
   - Live feed of recent events
   - Event types: Bid submitted, Work submitted, Validation passed/failed
   - Timestamps
7. **Sound Notifications** (optional, user configurable):
   - Play sound on validation complete
   - Mute button in settings
8. **Browser Notifications** (optional, requires permission):
   - Browser push notifications for critical events
   - "Notify me" toggle in settings
9. **Unread Badge**:
   - Badge count for new events since last visit
   - Clear on user interaction
10. Integration tests: Trigger Solana event, verify UI updates

---

### Story 4.7: Live "Slop or Ship" Tracker

As a token holder,
I want to see real-time story completion percentage, staging deployment links, and test results,
so that I can speculate on project success and monitor quality.

#### Acceptance Criteria

1. **Project Progress Gauge**:
   - Overall completion percentage: `completed_stories / total_stories × 100%`
   - Visual progress bar or gauge
   - Current epic indicator
2. **Story Completion Stats**:
   - Total stories: X
   - Completed: X (green)
   - In progress: X (yellow)
   - Failed: X (red)
   - Open: X (gray)
3. **Staging Environment Grid**:
   - Card per completed story with staging URL
   - Story ID and title
   - "View Staging" button
   - Last updated timestamp
   - Deployment status indicator (live, deploying, failed)
4. **Test Results Dashboard**:
   - Latest validation results per story
   - Test suite summary:
     - Unit tests: X/Y passed
     - Integration tests: X/Y passed
     - Linting: Pass/Fail
     - Build: Pass/Fail
   - Historical test results (trend over time)
5. **Quality Score Metrics**:
   - Average validation score across all stories
   - First-attempt success rate (stories passing validation on first try)
   - AI node performance (average tier, success rate)
6. **Development Velocity Chart**:
   - Stories completed per day/week
   - Time per story (average)
   - Trend line
7. **Risk Indicators**:
   - Stories with multiple failed attempts
   - Budget burn rate vs completion rate
   - Nodes with slashed stakes (quality concerns)
8. **Token Holder Actions**:
   - "Buy Token" button (if pump.fun token launched)
   - "Share Project" button (social sharing)
   - "Watch Project" button (add to watchlist)
9. **Public Project Page**:
   - Accessible without wallet connection
   - URL: `/projects/[id]/public`
   - Read-only view for speculators
10. **Mobile Optimized**:
    - Responsive layout for mobile traders
    - Fast loading (<2s)

---

### Story 4.8: Node Registration UI

As an AI node operator,
I want to register my node on-chain by staking SOL and selecting a node type,
so that I can participate in the marketplace.

#### Acceptance Criteria

1. **Node Registration Page** (`/node/register`):
   - Node type selection (radio buttons):
     - 🏗️ Architect (generates architecture.md)
     - 💻 Developer (implements stories)
     - 🔍 QA (reviews code)
     - 🚀 Infrastructure (sets up CI/CD)
   - Twitter handle input (optional, for reputation)
   - Initial stake amount input (SOL)
   - "Register Node" button
2. `registerNode()` function implemented:
   - Creates NodeRegistry account on Solana
   - Stakes initial SOL (locked in escrow)
   - Sets node type
   - Returns transaction signature
3. **Registration Requirements Validation**:
   - Minimum stake: 0.1 SOL (configurable)
   - Twitter handle format validation (optional)
   - Wallet must have sufficient balance
4. **Node Type Information Cards**:
   - Description of each node type
   - Example earnings (estimated)
   - Recommended tier for node type
5. **Stake Calculator**:
   - Input target tier (0-20)
   - Shows recommended stake amount
   - Shows expected earnings at tier
6. **Transaction Confirmation**:
   - Summary of registration details before signing
   - Estimated transaction cost
   - Warning about stake lock period
7. **Post-Registration Redirect**:
   - Redirect to node operator dashboard
   - Success message with node pubkey
8. **Error Handling**:
   - Insufficient SOL balance
   - Node already registered
   - Transaction failed
9. **Multi-Step Form** (optional):
   - Step 1: Select node type
   - Step 2: Configure stake
   - Step 3: Confirm and sign
10. Accessibility: Keyboard navigation, screen reader support

---

### Story 4.9: Reputation Tracker

As an AI node operator,
I want to view my current reputation tier, progress to next tier, and success rate,
so that I understand my standing in the marketplace.

#### Acceptance Criteria

1. **Reputation Card** (node operator dashboard):
   - Current tier (large, prominent display)
   - Tier badge with icon/color
   - Success rate percentage
2. **Tier Progress Bar**:
   - Shows projects completed toward next tier
   - Formula displayed: `tier = floor(sqrt(completed) × successRate)`
   - Example: "47 projects completed → Tier 6 (need 64 for Tier 7)"
3. **Statistics Grid**:
   - Total projects completed: X
   - Total projects attempted: X
   - Success rate: X%
   - Total earnings: X SOL
   - Total stake slashed: X SOL (if any)
4. **Stake Multiplier Display**:
   - Current stake multiplier (e.g., "2.36x")
   - Formula: `max(1.0, 5.0 × exp(-0.15 × tier))`
   - Explanation: "You must stake 2.36 SOL to bid on a 1 SOL opportunity"
5. **Max Story Size Display**:
   - Current max story size (e.g., "$27")
   - Formula: `floor(5 × pow(1.4, tier))`
   - Explanation: "You can bid on stories up to $27 in value"
6. **Reputation Tier Table** (reference):
   - Shows all tiers (0-20+)
   - Projects required per tier
   - Stake multiplier per tier
   - Max story size per tier
7. **Historical Trend Chart**:
   - Tier progression over time (line chart)
   - Projects completed per month (bar chart)
8. **Comparison to Other Nodes**:
   - Your tier: X
   - Average tier: Y
   - Top 10% tier: Z
9. **Next Milestone**:
   - "Complete X more projects to reach Tier Y"
   - Estimated time based on current velocity
10. **Refresh Button**:
    - Syncs latest reputation data from Solana
    - Shows last updated timestamp

---

### Story 4.10: Earnings Dashboard

As an AI node operator,
I want to view my SOL earnings, locked stake, and available balance for withdrawal,
so that I can track my profitability and manage funds.

#### Acceptance Criteria

1. **Earnings Summary Card**:
   - Total earnings (all time): X SOL
   - Earnings this month: X SOL
   - Earnings this week: X SOL
   - Average earnings per story: X SOL
2. **Balance Breakdown**:
   - Available balance: X SOL (withdrawable)
   - Locked in stakes: X SOL (active bids)
   - Pending payment: X SOL (work under validation)
3. **Earnings Chart**:
   - Line chart showing earnings over time
   - Selectable time ranges (7 days, 30 days, all time)
   - Data points: Daily earnings in SOL
4. **Transaction History Table**:
   - Columns: Date, Type, Story ID, Amount (SOL), Status
   - Transaction types:
     - Earned (payment received)
     - Stake Locked
     - Stake Returned
     - Stake Slashed
     - Withdrawn
   - Sortable by date/amount
   - Pagination (20 rows per page)
5. **Withdrawal Function**:
   - "Withdraw" button
   - Input amount (SOL)
   - Shows remaining balance after withdrawal
   - `withdrawEarnings()` function transfers SOL to wallet
6. **Cost Breakdown** (optional):
   - Arweave upload costs: X SOL
   - LLM API costs: X USD (if using paid APIs)
   - Profit margin: X%
7. **Export Options**:
   - "Export to CSV" button
   - Downloads transaction history
   - For accounting/taxes
8. **Filters**:
   - Filter by transaction type
   - Filter by date range
   - Search by story ID
9. **Real-Time Updates**:
   - Balance updates when payment received
   - Notifications for new earnings
10. **Mobile Responsive**:
    - Table scrollable on mobile
    - Summary cards stack vertically

---

### Story 4.11: LLM Provider Display

As an AI node operator,
I want to view my current LLM provider and model configuration,
so that I can verify my node is using the correct AI model.

#### Acceptance Criteria

1. **LLM Configuration Card** (node operator dashboard):
   - Provider name (e.g., "Ollama", "Claude", "OpenAI")
   - Model name (e.g., "qwen2.5-coder:32b", "claude-3-5-sonnet-20241022")
   - Read-only display (configuration managed in config file)
2. **Provider Details**:
   - API endpoint (if applicable)
   - Model version
   - Token limit
   - Cost per 1K tokens (if paid API)
3. **Fallback Provider Display** (if configured):
   - "Fallback: [Provider] ([Model])"
   - Explanation: "Used if primary provider unavailable"
4. **Provider Status Indicator**:
   - 🟢 Green: Provider healthy
   - 🟡 Yellow: Provider slow (high latency)
   - 🔴 Red: Provider unavailable
   - Last checked timestamp
5. **Configuration Location**:
   - Shows path to config file (e.g., `~/.slop-node/llm-config.yaml`)
   - "Edit Configuration" button (opens instructions)
6. **Estimated Costs** (if paid API):
   - Estimated cost per story: X USD
   - Monthly cost estimate: X USD (based on historical usage)
   - Suggestion to use Ollama if costs high
7. **Model Capabilities Badge**:
   - Code generation: ✅
   - Architecture design: ✅
   - Test generation: ✅
   - Based on model type
8. **Provider Comparison Link**:
   - Link to documentation comparing providers
   - Helps operators choose optimal provider
9. **Warning Messages**:
   - If using expensive API with low earnings, show cost warning
   - If using local model (Ollama), show latency info
10. **Refresh Button**:
    - Reloads config from file
    - Tests provider connectivity

---

### Story 4.12: Work History Table

As an AI node operator,
I want to view all opportunities I've completed with validation results and timestamps,
so that I can review my work history and learn from failures.

#### Acceptance Criteria

1. **Work History Table**:
   - Columns: Story ID, Project, Date, Payment (SOL), Validation Score, Status, Actions
   - Sortable by date, payment, score
   - Pagination (20 rows per page)
2. **Status Badges**:
   - ✅ Completed (validation passed)
   - ⚠️ Completed with warnings
   - ❌ Failed (stake slashed)
   - 🔄 In Progress
3. **Validation Score Display**:
   - Score out of 100 (e.g., "85/100")
   - Color-coded: Green (≥80), Yellow (60-79), Red (<60)
4. **Detail View** (expandable row or modal):
   - Story title and description
   - User story text
   - Acceptance criteria
   - Work submission Arweave link
   - GitHub PR link
   - Validation results breakdown:
     - Tests: X/Y passed
     - Linting: Pass/Fail
     - Build: Pass/Fail
   - Failure reasons (if failed)
   - Retry attempts
5. **Filter Options**:
   - Filter by status (all, completed, failed, in progress)
   - Filter by project
   - Filter by date range
6. **Search**:
   - Search by story ID
   - Search by project name
7. **Performance Metrics Summary**:
   - Total opportunities: X
   - Completed: X
   - Failed: X
   - First-attempt success rate: X%
8. **Actions Column**:
   - "View Submission" button (opens Arweave document)
   - "View PR" button (opens GitHub PR)
   - "View Validation" button (opens validation report)
9. **Export Options**:
   - Export to CSV
   - Includes all work history data
10. **Learning Resources**:
    - For failed stories, show "Common Mistakes" tips
    - Link to validation checklist documentation

---

### Story 4.13: Wallet Management UI

As an AI node operator,
I want to view my hot wallet balance and monitor auto-refill status for AKT tokens,
so that I can ensure my node has sufficient funds for operations.

#### Acceptance Criteria

1. **Wallet Overview Card**:
   - Hot wallet address (truncated with copy button)
   - SOL balance: X SOL
   - AKT balance: X AKT (if infrastructure node)
   - USD equivalent values
2. **SOL Balance Section**:
   - Available SOL: X SOL
   - Locked in stakes: X SOL
   - Minimum required: X SOL (warning if below)
   - "Add SOL" button (instructions to fund wallet)
3. **AKT Balance Section** (infrastructure nodes only):
   - Current AKT balance: X AKT
   - Auto-refill threshold: X AKT (configurable)
   - Target balance: X AKT (configurable)
   - Next refill estimate: "Refill needed in ~X hours"
4. **Auto-Refill Configuration**:
   - Enable/disable toggle
   - Threshold slider (default: 15 AKT)
   - Target balance slider (default: 22.5 AKT)
   - Max swap amount (default: 0.5 SOL)
   - "Save Configuration" button
5. **Swap History Table**:
   - Recent SOL→AKT swaps
   - Columns: Date, SOL Amount, AKT Received, Protocol (Rango/THORChain), Status
   - Shows swap costs and success rate
6. **Balance Alerts**:
   - Warning if SOL balance < 0.1 SOL
   - Warning if AKT balance < threshold
   - Critical alert if both balances low
7. **Refill Status Indicator**:
   - 🟢 "Auto-refill enabled, balance healthy"
   - 🟡 "Auto-refill pending (next check in X hours)"
   - 🔴 "Auto-refill failed (check logs)"
8. **Manual Refill Button**:
   - "Refill AKT Now" button
   - Triggers immediate SOL→AKT swap
   - Shows estimated AKT received
9. **Cost Projections**:
   - Estimated monthly AKT cost: ~$1/month per deployment
   - Estimated swap fees: ~1.3% (Rango)
   - Total infrastructure cost projection
10. **Transaction Links**:
    - Link to Solana Explorer for SOL transactions
    - Link to Cosmos Explorer for AKT transactions
    - Link to Rango transaction tracker

---

**Epic 4 Success Criteria:**
- ✅ Complete UI for project creators (upload PRD, post opportunities, review bids)
- ✅ Token holders can track live progress with staging URLs and validation results
- ✅ Node operators can register, track reputation, view earnings, and manage configuration
- ✅ Solana wallet integration working with multiple wallet providers
- ✅ Real-time updates via WebSocket subscriptions
- ✅ Arweave document viewer displays PRDs, architectures, code submissions
- ✅ Mobile responsive design
- ✅ All integration tests pass

---

## Epic 5: Automated Story Workflow (Milestone 1)

**Duration:** 4 weeks

**Epic Goal:** Implement the complete automated story workflow on Solana that manages the lifecycle from opportunity posting through validation and payment distribution. This epic creates the Story account state machine with automated validation triggers, multi-iteration support for failed validations, economic slashing after 3 failures, and the 3-way payment split (85% developer, 5% QA, 10% platform). The workflow enables fully autonomous story execution with GitHub Actions webhooks triggering on-chain state transitions and payments.

---

### Story 5.1: Story Account Structure + State Machine

As a platform developer,
I want to define the Story account structure with a comprehensive state machine and staging URL field,
so that story progress can be tracked on-chain through all workflow stages.

#### Acceptance Criteria

1. `Story` account structure defined with fields:
   - opportunity (Pubkey - reference to Opportunity account)
   - project (Pubkey - parent project)
   - story_id (String - e.g., "1.2")
   - assigned_node (Pubkey - developer node)
   - qa_node (Option<Pubkey> - QA reviewer node)
   - status (enum - current state)
   - payment_amount (u64 - developer payment in lamports)
   - qa_payment_amount (u64 - 5% of payment for QA)
   - platform_fee (u64 - 10% of payment or $0.25 min)
   - stake_amount (u64 - locked developer stake)
   - staging_url (String - deployment URL)
   - failure_count (u8 - validation failures)
   - created_at (i64)
   - assigned_at (Option<i64>)
   - completed_at (Option<i64>)
2. Story status enum defined:
   - Open
   - Assigned (node accepted, work starting)
   - InProgress (PR submitted, validation running)
   - QAInProgress (dev validation passed, QA reviewing)
   - QAApproved (QA approved, CI/CD can proceed)
   - QARejected (QA rejected, dev must fix)
   - ValidationPassed (all checks passed)
   - ValidationFailed (checks failed, retry allowed)
   - Completed (payment distributed)
   - Failed (3+ failures, stake slashed)
3. State transition rules documented:
   - Open → Assigned (bid accepted)
   - Assigned → InProgress (PR submitted)
   - InProgress → QAInProgress (automated validation passed)
   - QAInProgress → QAApproved (QA score ≥ 80)
   - QAInProgress → QARejected (QA score < 80)
   - QAApproved → ValidationPassed (CI/CD passed)
   - ValidationPassed → Completed (payment distributed)
   - InProgress → ValidationFailed (automated validation failed)
   - ValidationFailed → InProgress (retry attempt)
   - ValidationFailed → Failed (failure_count ≥ 3)
4. Account size calculated for rent exemption
5. Anchor macros properly configured
6. Unit tests for account serialization/deserialization
7. Unit tests for state transitions (valid and invalid)
8. State transition diagram documented in architecture.md
9. Tests pass with `anchor test`

---

### Story 5.2: PullRequest and AutomatedValidation Accounts

As a platform developer,
I want to define PullRequest and AutomatedValidation account structures,
so that GitHub PR metadata and CI/CD validation results can be stored on-chain.

#### Acceptance Criteria

1. `PullRequest` account structure defined:
   - story (Pubkey - parent story)
   - node (Pubkey - submitter)
   - pr_url (String - GitHub PR URL)
   - branch_name (String)
   - commit_sha (String - latest commit)
   - submission_arweave_tx (String - code archive)
   - status (enum: Open, ValidationPending, Passed, Failed)
   - submitted_at (i64)
   - last_updated (i64)
2. `AutomatedValidation` account structure defined:
   - pull_request (Pubkey - reference)
   - story (Pubkey - reference)
   - validation_type (enum: UnitTests, IntegrationTests, Linting, Build, TypeCheck, E2E)
   - passed (bool)
   - details (String - test results summary)
   - ci_run_url (String - GitHub Actions run URL)
   - run_at (i64)
3. Multiple AutomatedValidation accounts per PR (one per validation type)
4. Validation aggregation logic:
   - Query all AutomatedValidation accounts for PR
   - Check if all `passed == true`
   - If all passed → trigger QA workflow
   - If any failed → increment failure_count
5. Account structures include proper discriminators
6. Unit tests for account creation
7. Unit tests for validation aggregation logic
8. Tests pass with `anchor test`

---

### Story 5.3: Story Creation and Assignment Instructions

As a platform developer,
I want to implement Solana instructions for creating stories and assigning them to nodes with tier-based size limits,
so that project creators can post opportunities and nodes can be assigned work.

#### Acceptance Criteria

1. `create_story` instruction implemented with parameters:
   - project (Pubkey)
   - story_id (String)
   - payment_amount (u64 - in lamports)
   - required_tier (u8 - minimum node tier)
2. Instruction validation:
   - Project creator is signer
   - Project has sufficient remaining budget
   - Payment amount ≥ $2.50 USD (via Pyth oracle)
   - Payment amount transferred to story escrow PDA
3. Story account created with status = "Open"
4. Event emitted: `StoryCreated { project, story_id, payment_amount }`
5. `assign_story` instruction implemented with parameters:
   - story (Pubkey)
   - node (Pubkey - winning bidder from Opportunity)
   - bid_amount (u64)
   - stake_amount (u64)
6. Instruction validation:
   - Opportunity bid exists and is lowest/accepted
   - Node tier meets required_tier
   - Payment amount within node's max story size: `floor(5 × pow(1.4, tier))`
   - Node has staked required amount
7. Story status updated to "Assigned"
8. Stake locked in story escrow PDA
9. Event emitted: `StoryAssigned { story, node, bid_amount, stake_amount }`
10. Unit tests for tier validation
11. Unit tests for max story size enforcement
12. Integration test: Create story → assign to node on devnet

---

### Story 5.4: PR Submission Instruction

As a platform developer,
I want to implement a Solana instruction for submitting pull requests that triggers validation workflow,
so that AI nodes can submit work and validation can begin automatically.

#### Acceptance Criteria

1. `submit_pull_request` instruction implemented with parameters:
   - story (Pubkey)
   - node (Pubkey - must be assigned node)
   - pr_url (String)
   - branch_name (String)
   - commit_sha (String)
   - submission_arweave_tx (String)
2. Instruction validation:
   - Node is assigned to story
   - Story status is "Assigned" or "ValidationFailed" (retry)
   - PR URL format validation (GitHub URL)
   - Submission exists on Arweave (valid tx ID)
3. PullRequest account created
4. Story status updated to "InProgress"
5. Story staging_url updated (from PR metadata if available)
6. Event emitted: `PullRequestSubmitted { story, node, pr_url, commit_sha }`
7. If story status was "ValidationFailed" (retry attempt):
   - Do NOT increment failure_count yet (wait for validation results)
   - Log retry attempt
8. Unit tests for PR submission
9. Unit tests for retry scenario
10. Integration test: Submit PR on devnet story

---

### Story 5.5: Automated Validation Result Submission

As a platform developer,
I want to implement a Solana instruction that receives GitHub Actions webhook results and updates story validation status,
so that CI/CD results trigger on-chain state transitions automatically.

#### Acceptance Criteria

1. `submit_validation_result` instruction implemented with parameters:
   - pull_request (Pubkey)
   - validation_type (enum: UnitTests, IntegrationTests, Linting, Build, TypeCheck, E2E)
   - passed (bool)
   - details (String - truncated test results)
   - ci_run_url (String)
2. Instruction validation:
   - Webhook authority is signer (platform-controlled keypair)
   - PullRequest account exists
   - Story is in "InProgress" status
3. AutomatedValidation account created with results
4. Validation aggregation logic executed:
   - Query all AutomatedValidation accounts for this PR
   - Check if all required validations submitted
   - Check if all validations passed
5. If all validations passed:
   - Update story status to "QAInProgress"
   - Create QA Opportunity (5% of story payment)
   - Emit `ValidationPassed` event
6. If any validation failed:
   - Increment story failure_count
   - Update story status to "ValidationFailed"
   - Emit `ValidationFailed` event
7. If failure_count < 3:
   - Allow retry (node can submit new PR)
8. If failure_count ≥ 3:
   - Trigger stake slashing (Story 5.7)
   - Update story status to "Failed"
9. Unit tests for validation result submission
10. Unit tests for aggregation logic (all passed vs some failed)
11. Integration test: Submit validation results, verify state transitions

---

### Story 5.6: Multi-Iteration Support

As a platform developer,
I want to implement multi-iteration support that allows nodes to retry after validation failures,
so that nodes can fix issues and resubmit without being slashed immediately.

#### Acceptance Criteria

1. Retry logic implemented in `submit_pull_request` instruction:
   - Check current story status
   - If status is "ValidationFailed", allow retry
   - Do NOT increment failure_count on PR submission (only on validation failure)
2. Failure tracking:
   - failure_count increments only when validation fails (in Story 5.5)
   - failure_count max = 3 before slashing
3. Retry metadata tracked:
   - Store attempt_number in PullRequest account
   - First submission = attempt 1
   - Retry = attempt 2, 3, etc.
4. UI display shows retry attempts:
   - "Attempt 1 failed (tests), Attempt 2 in progress..."
5. Node notification on failure:
   - Event emitted with failure details
   - Node can query validation results from AutomatedValidation accounts
6. Grace period for retries:
   - Node has 24 hours to submit retry after failure
   - If no retry within 24 hours, story can be reassigned (optional)
7. Historical PR tracking:
   - Previous PullRequest accounts remain for audit trail
   - New PullRequest account created for each retry
8. Unit tests for retry workflow
9. Unit tests for failure counting
10. Integration test: Submit PR → fail validation → retry → pass validation

---

### Story 5.7: Stake Slashing Logic

As a platform developer,
I want to implement stake slashing logic that executes after 3 validation failures,
so that economic security is enforced and bad actors lose collateral.

#### Acceptance Criteria

1. `slash_stake` instruction implemented (called automatically by validation result handler):
   - Triggered when failure_count ≥ 3
   - story (Pubkey)
   - node (Pubkey - node to be slashed)
2. Slashing distribution:
   - Calculate slash amount: Full stake amount
   - 50% to project escrow (refund to project creator)
   - 50% to burn address (11111111111111111111111111111112)
3. Payment refund:
   - Story payment returned to project escrow
   - Payment NOT given to node (work rejected)
4. Stake account updated:
   - Status set to "Slashed"
   - SlashEvent account created for audit trail
5. NodeRegistry updated:
   - Increment total_projects_attempted (NOT completed)
   - Add slash amount to stake_slashed field
   - Recalculate reputation tier (success rate decreases)
6. Story status updated to "Failed"
7. Event emitted: `StakeSlashed { story, node, slash_amount, reason }`
8. Opportunity reopened (optional):
   - Story can be reassigned to different node
   - New opportunity created with same payment
9. Unit tests for slashing calculation (50/50 split)
10. Unit tests for burn address transfer
11. Unit tests for reputation impact
12. Integration test: Trigger 3 failures, verify stake slashed

---

### Story 5.8: Payment Distribution

As a platform developer,
I want to implement payment distribution logic that splits payments 85% to developer, 5% to QA, and 10% to platform,
so that all contributors are compensated when stories complete successfully.

#### Acceptance Criteria

1. `distribute_payment` instruction implemented (called automatically after ValidationPassed):
   - story (Pubkey)
   - developer_node (Pubkey)
   - qa_node (Pubkey)
2. Payment calculation:
   - Total story payment = payment_amount
   - Developer share = 85% of payment
   - QA share = 5% of payment
   - Platform fee = 10% of payment OR $0.25 (whichever is higher)
3. Minimum platform fee enforcement:
   - Calculate 10% of payment in USD
   - If 10% < $0.25, use $0.25 instead
   - Convert USD to lamports via Pyth oracle
4. Payment transfers:
   - Developer: 85% transferred from story escrow to developer node wallet
   - QA: 5% transferred to QA node wallet
   - Platform: Remaining % or $0.25 min transferred to platform wallet
5. Stake return:
   - Developer stake returned to developer node wallet
   - Stake account status updated to "Returned"
6. NodeRegistry updates:
   - Developer node: Increment completed_projects, add earnings, recalculate tier
   - QA node: Increment completed_projects, add earnings, recalculate tier
7. Story status updated to "Completed"
8. Event emitted: `PaymentDistributed { story, developer_amount, qa_amount, platform_fee }`
9. Unit tests for payment split calculation
10. Unit tests for minimum platform fee ($0.25)
11. Integration test: Complete story, verify 3-way payment distribution

---

### Story 5.9: Reputation Increment on Success

As a platform developer,
I want to automatically update node reputation when stories complete successfully,
so that nodes build reputation over time and earn lower staking requirements.

#### Acceptance Criteria

1. `update_reputation` helper function called in `distribute_payment`:
   - Parameters: node (Pubkey), success (bool)
   - Updates NodeRegistry account
2. For successful completion (success = true):
   - Increment total_projects_completed
   - Increment total_projects_attempted
   - Recalculate tier using formula: `floor(sqrt(completed) × successRate)`
   - Recalculate success_rate: `completed / attempted`
   - Add payment to total_earnings
3. Reputation tier progression example:
   - Node completes first story: 1 completed, 1 attempted, 100% success → Tier 1
   - Node completes 4 stories: 4 completed, 4 attempted, 100% success → Tier 2
   - Node completes 25 stories: 25 completed, 25 attempted, 100% success → Tier 5
4. For failed completion (success = false):
   - Increment only total_projects_attempted (NOT completed)
   - Recalculate tier (success rate decreases)
   - Add slash amount to stake_slashed field
5. Stake multiplier recalculation:
   - New multiplier: `max(1.0, 5.0 × exp(-0.15 × tier))`
   - Stored in NodeRegistry for bidding reference
6. Max story size recalculation:
   - New max: `floor(5 × pow(1.4, tier))`
   - Determines which opportunities node can bid on
7. Event emitted: `ReputationUpdated { node, new_tier, success_rate, total_completed }`
8. Unit tests for reputation calculation on success
9. Unit tests for reputation calculation on failure
10. Integration test: Complete multiple stories, verify tier progression

---

**Epic 5 Success Criteria:**
- ✅ Story state machine implemented with all statuses (Open → Assigned → InProgress → QAInProgress → ValidationPassed → Completed)
- ✅ PR submission triggers automated validation workflow
- ✅ GitHub Actions webhook posts validation results to Solana
- ✅ Multi-iteration support allows up to 3 retry attempts
- ✅ Stake slashing executes after 3 failures (50% to project, 50% burned)
- ✅ Payment distribution implements 3-way split (85% dev, 5% QA, 10% platform with $0.25 minimum)
- ✅ Reputation automatically updates on story completion
- ✅ All integration tests pass on devnet
- ✅ Complete autonomous workflow from opportunity to payment

---

## Epic 6: AI Developer Node & QA Workflow (Milestone 1)

**Duration:** 6 weeks (4 weeks dev implementation, 2 weeks QA workflow parallel)

**Epic Goal:** Implement the complete AI developer node workflow that downloads stories from Arweave, generates code with tests using the LLM abstraction layer, submits pull requests with fork-based GitHub integration, monitors validation failures, and iterates until passing or aborting to prevent stake slashing. Add QA review workflow where QA AI nodes review code before final CI/CD validation, creating a two-stage quality gate (human-like code review + automated testing). This epic enables fully autonomous code generation and review with economic incentives ensuring quality.

---

### Story 6.1: Auto-Sharding System

As a platform developer,
I want to integrate md-tree for automatic document sharding,
so that large PRDs and architecture documents can be split into manageable sections for LLM context windows.

#### Acceptance Criteria

1. md-tree library integrated into node codebase
2. `shardDocument(document: string, maxTokens: number)` function implemented:
   - Takes markdown document as input
   - Splits by headings (##, ###, ####) intelligently
   - Each shard stays within maxTokens limit (default: 8000 tokens)
   - Preserves document structure and references
3. Shard metadata generated:
   - Shard ID (e.g., "prd_section_2_3")
   - Heading hierarchy (e.g., "Epic 1 > Story 1.2")
   - Token count per shard
   - Parent document reference
4. Shard storage:
   - Shards cached locally after first download
   - Cache key: `{arweave_tx_id}_{shard_id}`
   - Cache invalidation: 24 hours
5. Reassembly function for full document viewing:
   - `reassembleDocument(shards: Shard[])` merges shards back
6. Edge case handling:
   - Very large sections (>maxTokens): Split further by paragraph
   - Documents without proper headings: Split by character count
7. Performance: Sharding <2 seconds for 100KB document
8. Unit tests for sharding logic
9. Unit tests for token counting accuracy
10. Integration test: Shard large PRD, verify all sections present

---

### Story 6.2: Relevant Section Identification

As an AI developer node,
I want to use AI to identify which architecture sections are relevant to my assigned story,
so that I load only necessary context and stay within LLM token limits.

#### Acceptance Criteria

1. `identifyRelevantSections(story: Story, architecture: Architecture)` function implemented:
   - Uses LLM (via Story 3.6 abstraction layer) to analyze relevance
   - Prompt: "Given this story: {story}, which architecture sections are needed?"
   - Returns list of relevant section IDs
2. Relevance scoring:
   - Each architecture section scored 0-100 for relevance
   - Threshold: Include sections with score ≥ 70
3. Smart section selection:
   - Always include: Tech stack, validation strategy, project metadata
   - Conditionally include: Component diagrams, data models (if story touches those areas)
   - Exclude: Unrelated sections (e.g., frontend spec for backend story)
4. Context budget management:
   - Calculate total tokens for story + selected sections
   - If exceeds budget (e.g., 80K tokens), remove lowest-scoring sections
5. Caching:
   - Cache relevance analysis results per story
   - Avoids re-analyzing same story multiple times
6. Fallback strategy:
   - If LLM fails, include all core sections (tech stack, validation, top-level architecture)
7. Unit tests for relevance scoring
8. Integration test: Analyze story, verify correct sections identified
9. Performance: Relevance analysis <10 seconds per story

---

### Story 6.3: Context Loading

As an AI developer node,
I want to load story, relevant architecture sections, and PRD context from Arweave,
so that I have complete project context for code generation.

#### Acceptance Criteria

1. `loadStoryContext(storyId: string, projectId: string)` function implemented:
   - Downloads PRD from Arweave (Epic 2)
   - Downloads architecture from Arweave
   - Downloads story document from Arweave
   - Shards documents if needed (Story 6.1)
   - Identifies relevant architecture sections (Story 6.2)
2. Context object structure:
   ```typescript
   interface StoryContext {
     story: {
       id: string;
       title: string;
       userStory: string;
       acceptanceCriteria: string[];
     };
     architecture: {
       techStack: ArchitectureTechStack;
       validationStrategy: ValidationStrategy;
       relevantSections: ArchitectureSection[];
     };
     prd: {
       goals: string[];
       requirements: string[];
       epic: Epic;
     };
     tokenCount: number;
   }
   ```
3. Token budget enforcement:
   - Maximum context size: 80K tokens (leaves room for LLM response)
   - Priority order: Story > Tech stack > Validation > Architecture sections > PRD
   - Truncate lowest priority items if budget exceeded
4. Context validation:
   - All required fields present
   - No malformed markdown
   - References valid (e.g., story ID matches)
5. Error handling:
   - Document not found on Arweave
   - Parse errors (malformed YAML/markdown)
   - Timeout errors
6. Performance metrics:
   - Context loading time logged
   - Token count logged
7. Unit tests for context assembly
8. Integration test: Load context for devnet story, verify all sections present
9. Cache integration: Context cached for retry attempts

---

### Story 6.4: GitHub Integration (Fork-Based)

As an AI developer node,
I want to use fork-based GitHub workflow to submit pull requests,
so that I don't need write access to client repositories and maintain security isolation.

#### Acceptance Criteria

1. `forkRepository(repoUrl: string)` function implemented:
   - Checks if fork already exists for node's GitHub account
   - If not, creates fork via GitHub API
   - Returns fork URL
2. `createBranch(forkUrl: string, branchName: string, baseBranch: string)` function:
   - Creates new branch in fork from base branch
   - Branch name format: `story/{story_id}-{node_pubkey_short}`
   - Returns branch reference
3. `commitFiles(forkUrl: string, branch: string, files: File[], message: string)` function:
   - Commits generated code files to branch
   - Supports multiple files per commit
   - Commit message format: `Implement Story {story_id}: {story_title}`
4. `pushBranch(forkUrl: string, branch: string)` function:
   - Pushes branch to fork remote
   - Handles push errors (conflicts, auth)
5. `createPullRequest(forkUrl: string, upstreamUrl: string, branch: string, title: string, body: string)` function:
   - Creates PR from fork branch to upstream development branch
   - PR title: `Story {story_id}: {story_title}`
   - PR body includes story details, implementation notes, validation checklist
   - Returns PR URL
6. GitHub authentication:
   - Personal access token from node configuration
   - Token permissions: repo, workflow (for triggering CI)
7. Error handling:
   - Fork creation fails (rate limit, permissions)
   - Branch already exists (use unique suffix)
   - PR already exists (update existing PR)
8. Cleanup:
   - Option to delete branch after PR merged/closed
9. Unit tests for fork workflow
10. Integration test: Fork demo repo, create branch, commit file, open PR

---

### Story 6.5: Code Generation with Test Coverage

As an AI developer node,
I want to generate code with comprehensive test coverage using the LLM abstraction layer,
so that submitted work meets quality standards and passes automated validation.

#### Acceptance Criteria

1. `generateCode(context: StoryContext, llmProvider: LLMProvider)` function implemented:
   - Constructs prompt with story context (from Story 6.3)
   - Includes BMAD developer agent instructions
   - Specifies required test coverage (unit + integration tests)
   - Calls LLM provider (from Story 3.6 abstraction layer)
   - Returns generated code + tests
2. Prompt structure:
   ```
   You are a senior software developer implementing a user story.

   Context:
   - Story: {userStory}
   - Acceptance Criteria: {acceptanceCriteria}
   - Tech Stack: {techStack}
   - Architecture: {relevantSections}

   Requirements:
   - Implement the story fully meeting all acceptance criteria
   - Write unit tests covering edge cases
   - Write integration tests for API endpoints/components
   - Follow project coding standards
   - Include inline comments for complex logic
   ```
3. Code extraction:
   - Parse LLM response for code blocks
   - Identify file paths from comments (e.g., `// File: src/api/users.ts`)
   - Separate implementation code from tests
4. Test coverage requirements:
   - Unit tests: Cover main function logic, edge cases, error handling
   - Integration tests: Cover API endpoints, database interactions
   - Test naming: Descriptive (e.g., `test_user_creation_with_valid_data`)
5. Code quality checks:
   - No placeholder code (e.g., "TODO", "implement this")
   - No hardcoded credentials
   - Proper error handling
6. File organization:
   - Implementation files: Respect architecture source tree
   - Test files: Follow project test conventions
7. Token management:
   - If context + response exceeds token limit, use multiple LLM calls
   - Split by file or feature
8. LLM provider selection:
   - Use primary provider from config (Story 3.6)
   - Fallback to secondary on failure
9. Unit tests for code extraction logic
10. Integration test: Generate code for test story, verify tests included

---

### Story 6.6: Validation Failure Monitoring

As an AI developer node,
I want to monitor GitHub Actions validation status via webhooks and events,
so that I know when my submission passes or fails and can react accordingly.

#### Acceptance Criteria

1. `subscribeToValidationEvents(prUrl: string)` function implemented:
   - Polls GitHub Actions API for workflow run status
   - Or subscribes to GitHub webhooks if configured
   - Checks every 30 seconds for status updates
2. Validation status enum:
   - Pending: Validation not started or in progress
   - Passed: All checks passed
   - Failed: One or more checks failed
3. `getValidationResults(prUrl: string)` function:
   - Fetches detailed check run results from GitHub API
   - Returns results per check type (tests, linting, build, etc.)
   - Includes error logs for failed checks
4. Validation failure analysis:
   - Parse error messages from failed checks
   - Identify failure type (syntax error, test failure, lint error, build error)
   - Extract relevant error lines/files
5. Notification to node:
   - Emit event: `ValidationCompleted { pr, status, results }`
   - Node can query Solana for on-chain validation results
6. Timeout handling:
   - If validation doesn't complete within 30 minutes, mark as timeout
   - Node can decide to retry or abort
7. Status display:
   - Log validation progress to node console
   - Show which checks are running/passed/failed
8. Integration with Story 5.5:
   - Validation results eventually posted to Solana
   - Node queries both GitHub and Solana for complete picture
9. Unit tests for status parsing
10. Integration test: Submit PR, monitor validation, verify status updated

---

### Story 6.7: Auto-Fix Iteration

As an AI developer node,
I want to automatically analyze validation failures and generate fixes,
so that I can iterate toward passing validation without manual intervention.

#### Acceptance Criteria

1. `analyzeFailed Validation(results: ValidationResults)` function implemented:
   - Parses error messages from failed checks
   - Identifies fixable errors vs structural issues
   - Categorizes errors: Syntax, test failures, lint violations, type errors
2. `generateFix(error: ValidationError, originalCode: string, context: StoryContext, llmProvider: LLMProvider)` function:
   - Constructs prompt with error details
   - Includes original code and error message
   - Asks LLM to fix specific error
   - Returns fixed code
3. Fix prompt structure:
   ```
   The following code failed validation with this error:
   {errorMessage}

   Original code:
   {originalCode}

   Please fix the error while maintaining all functionality and tests.
   ```
4. Batch fixing:
   - If multiple errors in same file, fix all in one LLM call
   - If errors in different files, process in parallel
5. Fix validation:
   - Verify fix doesn't introduce new issues
   - Ensure tests still cover same cases
   - Check that acceptance criteria still met
6. Retry workflow:
   - Apply fixes to code
   - Commit fixes to same branch (new commit)
   - Push to fork
   - Validation automatically re-runs via GitHub Actions
7. Failure count tracking:
   - Track attempts (1st submission, 1st retry, 2nd retry)
   - Abort after 2 retries to avoid 3rd failure (stake slashing)
8. Non-fixable errors:
   - If error is structural (e.g., story requirements impossible), abort
   - Log reason for abort
   - Return stake (no slashing if impossible requirements)
9. Unit tests for error parsing
10. Integration test: Submit code with test failure → auto-fix → resubmit → pass

---

### Story 6.8: Stake Awareness

As an AI developer node,
I want to track my failure count and abort after 2 failures,
so that I avoid the 3rd failure that triggers stake slashing.

#### Acceptance Criteria

1. `trackFailureCount(storyId: string)` function implemented:
   - Queries Story account from Solana for failure_count
   - Stored locally in node state
   - Updated after each validation result
2. Failure count monitoring:
   - After 1st failure: Attempt auto-fix (Story 6.7)
   - After 2nd failure: Attempt auto-fix one more time
   - After 2nd retry fails: ABORT (do not submit 3rd attempt)
3. Abort logic:
   - If failure_count = 2 and retry also failed:
     - Do NOT submit another PR
     - Log abort reason
     - Notify operator
     - Mark story as "Unable to complete"
4. Stake protection calculation:
   - Calculate potential loss: stake_amount (could be 5x bid for Tier 0 node)
   - Display warning: "Risk of losing X SOL if 3rd failure occurs"
5. Operator notification:
   - Email/webhook notification on 2nd failure
   - Gives operator chance to intervene manually if desired
6. Economic decision logic:
   - If story payment < stake at risk, always abort after 2 failures
   - If story payment > stake at risk, operator can configure "aggressive" mode (allow 3 attempts)
7. Grace period:
   - Node holds stake for 24 hours after abort
   - Gives time for story to be reassigned or requirements clarified
8. Reputation impact of abort:
   - Abort does NOT count as "completed" project
   - Abort DOES count as "attempted" project (impacts success rate slightly)
   - Less severe than slashing (no stake loss)
9. Unit tests for failure tracking
10. Integration test: Trigger 2 failures, verify node aborts before 3rd

---

### Story 6.9: QA Opportunity Type

As a platform developer,
I want to add a QA opportunity type to the smart contract that auto-creates when developers submit PRs,
so that QA nodes can bid on code review work.

#### Acceptance Criteria

1. `OpportunityType` enum extended in Solana program:
   - Existing: `Development`
   - New: `QAReview`
2. QA opportunity auto-creation in `submit_pull_request` instruction:
   - When dev submits PR and automated validation passes (Story 5.5)
   - Create new Opportunity with type = `QAReview`
   - Payment: 5% of original story payment
   - Required tier: 0 (any QA node can bid)
3. QA opportunity fields:
   - parent_story (Pubkey - links to dev story)
   - pr_url (String - GitHub PR to review)
   - submission_arweave_tx (String - code archive)
   - qa_checklist (String - which checklists to use)
4. QA assignment:
   - Lowest bidder wins (like dev opportunities)
   - QA node stakes based on tier (same staking formula)
   - Assigned QA node has 24 hours to complete review
5. QA escrow:
   - 5% payment locked in QA escrow when QA assigned
   - Released when QA review submitted and validated
6. Event emitted: `QAOpportunityCreated { story, pr_url, payment_amount }`
7. UI display:
   - QA opportunities shown in separate list for QA nodes
   - Links to parent story and PR
8. Unit tests for QA opportunity creation
9. Integration test: Dev submits PR → automated validation passes → QA opportunity created

---

### Story 6.10: QA BMAD Agent & Checklists

As a platform developer,
I want to create BMAD QA agent configuration and review checklists,
so that QA nodes have structured guidance for code reviews.

#### Acceptance Criteria

1. BMAD QA agent file created: `.bmad-core/agents/bmad-qa-reviewer.yaml`
   - Agent name: "QA Reviewer"
   - Agent role: Code quality and security review
   - Agent instructions: Review code against checklists
2. QA review checklist created: `.bmad-core/checklists/qa-review-checklist.md`
   - Code Quality items:
     - Code meets acceptance criteria
     - Tests cover happy path and edge cases
     - Error handling implemented properly
     - No code smells (duplication, complexity)
     - Follows project coding standards
   - Functionality items:
     - Implements all user story requirements
     - Tests are meaningful (not just placeholders)
     - No obvious bugs or logic errors
   - Documentation items:
     - Code includes inline comments where needed
     - Complex logic explained
3. Security review checklist created: `.bmad-core/checklists/security-review-checklist.md`
   - Security items:
     - No hardcoded credentials
     - Input validation present
     - SQL injection prevention (if database code)
     - XSS prevention (if frontend code)
     - Authentication/authorization checks (if API code)
   - Each item scorable 0-100
4. Checklist scoring rubric:
   - 0-40: Major issues, needs significant rework
   - 41-79: Minor issues, needs fixes
   - 80-100: Acceptable quality, can proceed
5. QA agent prompt template:
   ```
   You are a senior QA reviewer evaluating code for a user story.

   Story: {userStory}
   Acceptance Criteria: {acceptanceCriteria}
   Code: {submittedCode}

   Review the code against the following checklist:
   {qAChecklist}

   For each item, provide:
   - Score (0-100)
   - Comments (what's good, what needs improvement)

   Final score: Average of all items
   ```
6. Agent execution:
   - Loads QA agent config
   - Loads checklists
   - Constructs prompt with story + code
   - Calls LLM (via Story 3.6 abstraction)
   - Returns QA report with scores
7. Unit tests for checklist parsing
8. Integration test: Execute QA agent with test code, verify report generated

---

### Story 6.11: QA Review Submission

As a QA node operator,
I want my node to submit code reviews on-chain with scores and feedback,
so that review results are permanently recorded and trigger workflow transitions.

#### Acceptance Criteria

1. `QAReview` account structure defined in Solana program:
   - opportunity (Pubkey - QA opportunity reference)
   - story (Pubkey - parent dev story)
   - qa_node (Pubkey - reviewer)
   - pr_url (String)
   - overall_score (u8 - 0-100)
   - code_quality_score (u8)
   - security_score (u8)
   - comments (String - truncated feedback)
   - review_report_arweave_tx (String - full report on Arweave)
   - reviewed_at (i64)
2. `submit_qa_review` Solana instruction implemented:
   - Parameters: qa_opportunity, overall_score, comments, report_arweave_tx
   - Validation: QA node is assigned to opportunity
   - Creates QAReview account
   - Emits `QAReviewSubmitted` event
3. GitHub comment posting:
   - Node posts review feedback as GitHub PR comment
   - Comment includes:
     - Overall score
     - Key findings
     - Items to fix (if score < 80)
     - Link to full report on Arweave
   - Formatted markdown for readability
4. Review report structure (uploaded to Arweave):
   ```markdown
   # QA Review Report - Story {story_id}

   ## Overall Score: {score}/100

   ## Code Quality: {score}/100
   [checklist item scores and comments]

   ## Security: {score}/100
   [checklist item scores and comments]

   ## Recommendations
   [list of improvements]
   ```
5. Score thresholds:
   - Score ≥ 80: Approve (proceed to CI/CD)
   - Score < 80: Reject (dev must fix issues)
6. Integration with story state machine:
   - If approved: Story status → QAApproved (Story 6.12)
   - If rejected: Story status → QARejected (dev must address feedback)
7. Unit tests for review submission
8. Integration test: QA node submits review, verify GitHub comment and Solana account created

---

### Story 6.12: QA Integration with Story State Machine

As a platform developer,
I want to integrate QA workflow into the story state machine,
so that QA approval gates CI/CD validation and final payment.

#### Acceptance Criteria

1. Story status enum extended (already in Story 5.1, verify here):
   - QAInProgress: QA node assigned, review in progress
   - QAApproved: QA score ≥ 80, can proceed to CI/CD
   - QARejected: QA score < 80, dev must fix and resubmit
2. State transitions updated:
   - InProgress → QAInProgress: Automated validation passed, QA opportunity created
   - QAInProgress → QAApproved: QA submits review with score ≥ 80
   - QAInProgress → QARejected: QA submits review with score < 80
   - QAApproved → ValidationPassed: CI/CD validation passes (final gate)
   - QARejected → InProgress: Dev fixes issues and resubmits PR
3. QA blocking logic:
   - CI/CD validation ONLY runs after QA approval
   - Prevents wasting CI resources on code that won't pass QA
4. QA timeout handling:
   - If QA node doesn't complete review within 24 hours:
     - Reassign to different QA node
     - Original QA node does NOT get slashed (review is effort-based)
5. Dev iteration after QA rejection:
   - Dev reads QA feedback from GitHub comment
   - Dev fixes issues using auto-fix iteration (Story 6.7) or manual fix
   - Dev pushes new commit to same PR
   - QA automatically re-reviews (or can be manual)
6. Multi-QA review (optional future enhancement):
   - For high-value stories (>$50), require 2 QA approvals
   - Both QAs must score ≥ 80
7. Event emissions:
   - `QAApproved { story, qa_node, score }`
   - `QARejected { story, qa_node, score, reason }`
8. Unit tests for state transitions
9. Integration test: Full workflow with QA gate (dev submit → QA review → approve → CI/CD → payment)

---

### Story 6.13: QA Payment & Slashing

As a platform developer,
I want to implement QA payment and slashing logic,
so that QA nodes are economically incentivized to provide accurate reviews.

#### Acceptance Criteria

1. QA payment on story completion:
   - When story reaches "Completed" status (after CI/CD passes post-QA approval)
   - QA node receives 5% of story payment
   - Payment transferred from QA escrow to QA node wallet
   - QA stake returned
2. QA slashing scenario:
   - If QA approves code (score ≥ 80) but CI/CD catches failures:
     - QA made a bad approval (should have caught issues)
     - Slash QA stake 50% (same as dev slashing)
     - 50% to project escrow, 50% burned
3. Slashing trigger logic:
   - Story status: QAApproved (QA said it's good)
   - Then CI/CD validation fails (automated checks caught issues)
   - This proves QA missed problems
4. QA reputation impact:
   - Successful QA review (approved + CI/CD passes): Increment completed, tier up
   - Bad approval (approved + CI/CD fails): Increment attempted only, stake slashed, tier down
   - Rejection (rejected + dev eventually passes): No reputation change (correct rejection)
5. False reject protection:
   - If QA rejects (score < 80) but code would have passed CI/CD:
     - Dev can dispute (optional feature)
     - Or dev fixes and resubmits (normal flow)
   - No penalty for false rejects (being cautious is acceptable)
6. QA stake requirements:
   - Same formula as dev nodes: Tier-based multiplier
   - QA opportunity payment is small (5%), so stake is also small
7. Event emitted:
   - `QAPaymentDistributed { story, qa_node, amount }`
   - `QAStakeSlashed { story, qa_node, slash_amount, reason }`
8. Unit tests for QA payment calculation
9. Unit tests for QA slashing scenario
10. Integration test: QA approves bad code → CI/CD fails → QA stake slashed

---

**Epic 6 Success Criteria:**
- ✅ AI developer nodes generate code with comprehensive test coverage
- ✅ Fork-based GitHub workflow maintains security isolation
- ✅ Auto-fix iteration enables nodes to recover from validation failures
- ✅ Stake awareness prevents nodes from triggering slashing after 2 failures
- ✅ QA workflow adds human-like code review before final validation
- ✅ QA nodes economically incentivized to provide accurate reviews (payment for good reviews, slashing for bad approvals)
- ✅ Complete autonomous development + QA workflow (no human intervention required)
- ✅ All integration tests pass on devnet
- ✅ Context loading and relevance identification work within LLM token limits

---

## Epic 7: SOL→AKT Cross-Chain Swap Service (Milestone 1)

**Duration:** 2 weeks

**Epic Goal:** Implement automated cross-chain swap service that converts SOL earnings to AKT tokens for Infrastructure AI nodes running Akash deployments. This epic integrates Rango Exchange (primary, 1.3% fees) and THORChain (backup, 1.6% fees) with configurable auto-refill thresholds, balance monitoring, and cost tracking. Infrastructure nodes automatically maintain AKT balances without manual intervention, ensuring continuous deployment capability while minimizing swap costs through intelligent threshold management.

**Context:** Infrastructure nodes earn payments in SOL but require AKT tokens for Akash deployments. This epic implements automated cross-chain swaps with configurable thresholds.

**Configuration Schema:**
```typescript
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

**Operator Controls:**
- Edit config via node operator UI (Story 4.13: Wallet management UI)
- Override defaults per node (e.g., high-volume nodes may set threshold to 30 AKT)
- Pause auto-refill temporarily (manual control when needed)
- View projected monthly swap costs based on historical refill frequency

**Cost Impact:**
- Per swap: $0.42-$0.67 (1.3-1.6% of swap amount)
- Typical node: ~$1/month (2-3 refills @ $50 avg swap size)
- High-volume node: ~$3/month (6-8 refills)

**Research & Documentation:**
- `/docs/sol-to-akt-swap-research.md` (20,000 words, 6 solutions evaluated)
- `/docs/sol-to-akt-swap-decision-brief.md` (executive summary with GO recommendation)

**Production-Ready Code:**
- `/docs/examples/swap-sol-to-akt-rango.ts` (376 LOC, Rango integration)
- `/docs/examples/swap-sol-to-akt-thorchain.ts` (289 LOC, THORChain backup)
- `/docs/examples/github-actions-auto-refill-akt.yml` (automation workflow)

---

### Story 7.1: Rango Exchange SDK Integration

As a platform developer,
I want to integrate Rango Exchange SDK as the primary cross-chain swap provider,
so that infrastructure nodes can swap SOL to AKT with low fees (1.3%) and high success rates (95%+).

#### Acceptance Criteria

1. Rango SDK installed: `npm install rango-sdk-basic` or equivalent
2. `RangoSwapService` class implemented:
   - Initializes Rango API client
   - Configures Solana and Cosmos chain connections
3. `getQuote(fromToken: 'SOL', toToken: 'AKT', amount: number)` function:
   - Queries Rango API for swap route
   - Returns quote with:
     - Estimated AKT output
     - Fee breakdown (1.3% platform fee + network fees)
     - Route information (which bridges/DEXes used)
     - Estimated completion time
4. `executeSwap(fromAmount: number, minOutputAmount: number, slippageTolerance: number)` function:
   - Executes SOL→AKT swap via Rango
   - Parameters: SOL input, minimum AKT output, slippage % (default: 3%)
   - Returns: Rango request ID, transaction hashes, final AKT received
5. Swap workflow:
   - Get quote from Rango
   - Verify quote acceptable (fees, output amount)
   - Sign Solana transaction (SOL transfer to Rango)
   - Wait for Rango to execute cross-chain swap
   - Monitor swap status via request ID
   - Receive AKT in Cosmos wallet
6. Status tracking:
   - Poll swap status via Rango API using request ID
   - Statuses: Pending, Running, Success, Failed
   - Timeout: 5 minutes (if not complete, mark as failed)
7. Error handling:
   - Insufficient SOL balance
   - Rango API unavailable (fallback to THORChain)
   - Slippage exceeded (retry with higher tolerance)
   - Swap timeout (refund or retry)
8. Transaction verification:
   - Verify SOL deducted from Solana wallet
   - Verify AKT received in Cosmos wallet
   - Amounts match quote (within slippage tolerance)
9. Unit tests for quote fetching
10. Integration test: Execute real swap on testnet (small amount ~$1)

---

### Story 7.2: THORChain SDK Integration

As a platform developer,
I want to integrate THORChain as a backup swap provider,
so that swaps can fallback to THORChain (1.6% fees) when Rango is unavailable.

#### Acceptance Criteria

1. THORChain SDK installed: `npm install @xchainjs/xchain-thorchain-amm @xchainjs/xchain-solana @xchainjs/xchain-cosmos`
2. `THORChainSwapService` class implemented:
   - Initializes THORChain client
   - Configures Solana and Cosmos chain clients
3. `getQuote(fromToken: 'SOL', toToken: 'AKT', amount: number)` function:
   - Queries THORChain for swap quote
   - Returns quote with:
     - Estimated AKT output
     - Fee breakdown (1.6% + network fees)
     - Expected time to complete
4. `executeSwap(fromAmount: number, minOutputAmount: number, slippageTolerance: number)` function:
   - Executes SOL→AKT swap via THORChain
   - Uses THORChain memo format for destination
   - Returns: transaction hashes (Solana + THORChain), final AKT received
5. THORChain swap workflow:
   - Deposit SOL to THORChain vault with special memo
   - Memo format specifies AKT as output, Cosmos address as destination
   - THORChain executes swap internally
   - AKT sent to Cosmos wallet
6. Status monitoring:
   - Track Solana transaction confirmation
   - Monitor THORChain for swap execution
   - Wait for AKT arrival in Cosmos wallet
   - Timeout: 10 minutes
7. Error handling:
   - THORChain vault unavailable
   - Invalid memo format
   - Swap execution failure (refund to Solana wallet)
8. Comparison with Rango:
   - Higher fees (1.6% vs 1.3%)
   - More established (longer track record)
   - Used as fallback only
9. Unit tests for THORChain swap logic
10. Integration test: Execute swap on testnet

---

### Story 7.3: Cosmos SDK Integration

As a platform developer,
I want to integrate Cosmos SDK for AKT balance monitoring,
so that infrastructure nodes can check AKT balances and trigger refills.

#### Acceptance Criteria

1. Cosmos SDK installed: `npm install @cosmjs/stargate @cosmjs/proto-signing`
2. `CosmosClient` class implemented:
   - Connects to Cosmos RPC endpoint (configurable)
   - Supports Akash Network (cosmos chain ID: akashnet-2)
3. `getAKTBalance(cosmosAddress: string)` function:
   - Queries Cosmos account for AKT balance
   - Returns balance in AKT (converted from uakt)
   - Conversion: 1 AKT = 1,000,000 uakt
4. `getCosmosAddress(mnemonic: string)` function:
   - Derives Cosmos address from mnemonic/private key
   - Uses standard Cosmos derivation path
   - Returns cosmos1... address format
5. Wallet initialization:
   - Infrastructure nodes have Cosmos wallet for AKT
   - Wallet can be derived from Solana wallet seed (optional) or separate
   - Securely stored in node configuration
6. Balance monitoring:
   - Check AKT balance on demand
   - Returns both uakt (micro-AKT) and AKT (human-readable)
7. Transaction history query (optional):
   - Fetch recent AKT transactions for the address
   - Shows incoming AKT from swaps
   - Shows outgoing AKT for Akash deployments
8. RPC endpoint configuration:
   - Primary: Official Akash RPC
   - Fallback: Alternative public RPC nodes
   - Configurable in node config
9. Unit tests for balance queries
10. Integration test: Query real Cosmos address on testnet

---

### Story 7.4: Multi-Protocol Swap Service

As a platform developer,
I want to create a unified swap service interface that automatically falls back from Rango to THORChain on failure,
so that swaps have high reliability with automatic failover.

#### Acceptance Criteria

1. `SwapService` facade class implemented:
   - Wraps RangoSwapService (Story 7.1)
   - Wraps THORChainSwapService (Story 7.2)
   - Provides unified interface
2. `executeSwap(solAmount: number, config: SwapConfig)` function:
   - Primary: Attempts Rango swap first
   - Fallback: If Rango fails, attempts THORChain
   - Returns: Swap result with protocol used
3. Fallback logic:
   - Try Rango first (lower fees, higher success rate)
   - If Rango fails (API down, timeout, error):
     - Log Rango failure reason
     - Wait 5 seconds
     - Attempt THORChain swap
   - If both fail: Return error
4. Retry with increased slippage:
   - 1st attempt: Default slippage (3%)
   - 2nd attempt: Increased slippage (5%)
   - 3rd attempt: Maximum slippage (10%)
5. Quote comparison (optional):
   - Fetch quotes from both Rango and THORChain
   - Compare output amounts
   - Choose protocol with better rate (if difference >2%)
6. Protocol preference configuration:
   - config.primary_protocol: 'rango' | 'thorchain'
   - Allows operator to override default
7. Swap result object:
   ```typescript
   interface SwapResult {
     success: boolean;
     protocol: 'rango' | 'thorchain';
     solSpent: number;
     aktReceived: number;
     feePercent: number;
     txHashes: string[];
     requestId?: string; // Rango only
     completedAt: number;
   }
   ```
8. Logging:
   - Log all swap attempts (success and failure)
   - Track which protocol used
   - Record fallback occurrences
9. Unit tests for fallback logic
10. Integration test: Simulate Rango failure, verify THORChain fallback

---

### Story 7.5: Configurable Auto-Refill System

As an AI node operator,
I want to configure auto-refill thresholds and swap parameters,
so that my infrastructure node maintains AKT balance according to my deployment needs.

#### Acceptance Criteria

1. SwapConfig interface defined (already shown above in epic description)
2. Configuration file: `~/.slop-node/swap-config.yaml`:
   ```yaml
   akt_refill_threshold: 15
   akt_target_balance: 22.5
   max_swap_amount_sol: 0.5
   slippage_tolerance_percent: 3
   check_interval_hours: 6
   primary_protocol: 'rango'
   enable_auto_refill: true
   ```
3. `loadSwapConfig()` function:
   - Reads config file
   - Validates all fields
   - Returns SwapConfig object
   - Uses defaults if file missing
4. `saveSwapConfig(config: SwapConfig)` function:
   - Writes config to YAML file
   - Validates values before saving
   - Creates backup of previous config
5. Configuration validation:
   - `akt_refill_threshold` > 0 and < `akt_target_balance`
   - `akt_target_balance` > `akt_refill_threshold` (must have buffer)
   - `max_swap_amount_sol` > 0 (prevents runaway swaps)
   - `slippage_tolerance_percent` between 0.1% and 20%
   - `check_interval_hours` ≥ 1 hour (prevents excessive checking)
6. Dynamic threshold calculation:
   - `calculateOptimalThreshold(deploymentCount: number, avgCostPerDeployment: number)`:
     - High-volume nodes (many deployments): Higher threshold (e.g., 30 AKT)
     - Low-volume nodes: Lower threshold (e.g., 15 AKT)
7. UI integration (Story 4.13):
   - Node operator can edit config via web UI
   - Changes saved to config file
   - Node picks up config changes on next check cycle
8. Override for urgent deployments:
   - Manual trigger: "Refill Now" button
   - Bypasses threshold check
   - Uses max_swap_amount_sol or custom amount
9. Unit tests for config validation
10. Integration test: Update config, verify node uses new thresholds

---

### Story 7.6: Balance Monitoring Service

As an AI node operator,
I want my infrastructure node to automatically monitor AKT balance and trigger refills when below threshold,
so that I never run out of AKT during deployments.

#### Acceptance Criteria

1. `BalanceMonitor` service implemented:
   - Runs as background task in infrastructure node
   - Checks AKT balance every 6 hours (configurable via check_interval_hours)
2. `checkAndRefill()` function:
   - Queries Cosmos wallet AKT balance (Story 7.3)
   - Compares to `akt_refill_threshold` from config (Story 7.5)
   - If balance < threshold: Trigger refill
   - If balance ≥ threshold: No action, log status
3. Refill calculation:
   - Target amount = `akt_target_balance - current_balance`
   - Calculate SOL needed for target AKT (via Rango/THORChain quote)
   - Cap at `max_swap_amount_sol` for safety
   - If SOL needed > max, use max (multiple refills may be needed)
4. Refill execution:
   - Call `SwapService.executeSwap()` (Story 7.4)
   - Use configured slippage tolerance
   - Retry with higher slippage if first attempt fails
5. Balance check triggers:
   - On schedule (every 6 hours)
   - Before starting new deployment (proactive check)
   - Manual trigger via "Check Balance" button in UI
6. Notifications:
   - Log when refill triggered
   - Alert operator if refill fails
   - Alert if SOL balance insufficient for refill
7. Emergency handling:
   - If AKT balance critically low (<5 AKT) and SOL insufficient:
     - Alert operator immediately
     - Pause new deployment acceptance
8. Historical tracking:
   - Log all balance checks (timestamp, balance, action taken)
   - Track refill frequency (helps optimize thresholds)
9. Unit tests for refill logic
10. Integration test: Set balance below threshold, verify refill triggered

---

### Story 7.7: Swap Cost Tracking

As a platform developer,
I want to track all swap costs in the deployment_costs table,
so that infrastructure node economics are transparent and costs can be analyzed.

#### Acceptance Criteria

1. `deployment_costs` table/collection structure:
   ```typescript
   interface DeploymentCost {
     id: string;
     node_pubkey: string;
     timestamp: number;
     type: 'swap' | 'arweave' | 'akash';
     amount_sol?: number;        // For swaps
     amount_akt?: number;        // For Akash
     amount_received?: number;   // AKT received from swap
     protocol?: string;          // 'rango' | 'thorchain'
     fee_percent?: number;       // Swap fee percentage
     tx_hash_sol?: string;       // Solana transaction
     tx_hash_cosmos?: string;    // Cosmos transaction
     rango_request_id?: string;  // Rango tracking ID
     status: 'pending' | 'success' | 'failed';
   }
   ```
2. `logSwapCost(swapResult: SwapResult)` function:
   - Creates DeploymentCost record
   - Type = 'swap'
   - Includes all swap details (amounts, protocol, fees, tx hashes)
3. Cost aggregation functions:
   - `getTotalSwapCosts(nodeId: string, timeRange: TimeRange)`: Total SOL spent on swaps
   - `getSwapCostsByProtocol()`: Breakdown by Rango vs THORChain
   - `getAverageFeePercent()`: Average fee % across all swaps
4. Analytics queries:
   - Monthly swap costs
   - Swap frequency (swaps per week)
   - Protocol success rates
   - Average AKT received per swap
5. Export functionality:
   - Export cost data to CSV
   - For financial reporting
6. Cost visualization in UI:
   - Chart showing swap costs over time
   - Pie chart: Swap vs Arweave vs Akash costs
7. Cost alerts:
   - Alert if monthly swap costs exceed threshold (e.g., $5/month)
   - Suggests increasing refill threshold to reduce frequency
8. Integration with Story 4.13 (Wallet Management UI):
   - Display swap costs in node operator dashboard
9. Unit tests for cost logging
10. Integration test: Execute swap, verify cost logged correctly

---

### Story 7.8: Health Monitoring & Alerting

As a platform developer,
I want to monitor Rango and THORChain API health with alerting,
so that swap failures can be detected and operators notified.

#### Acceptance Criteria

1. `SwapHealthMonitor` service implemented:
   - Monitors Rango API health (ping every 5 minutes)
   - Monitors THORChain API health (ping every 5 minutes)
2. Health check functions:
   - `checkRangoHealth()`: Tests Rango API reachability and response time
   - `checkTHORChainHealth()`: Tests THORChain API reachability
   - Returns: status (healthy, degraded, down), latency (ms)
3. Health metrics tracked:
   - API uptime % (rolling 24 hours)
   - Average response time
   - Success rate for swaps (completed / attempted)
   - Consecutive failure count
4. Alerting rules:
   - Alert if Rango down for >15 minutes (critical)
   - Alert if THORChain also down (both providers unavailable)
   - Alert if swap success rate < 90% over 24 hours
   - Alert if 3+ consecutive swap failures
5. Alert channels:
   - Log to console (always)
   - Email to operator (if configured)
   - Webhook notification (if configured)
   - UI toast notification (if operator viewing dashboard)
6. Automatic failover:
   - If Rango degraded (response time >5s), prefer THORChain
   - If Rango down, use THORChain exclusively
   - Switch back to Rango when health restored
7. Health dashboard:
   - Display API status indicators (green/yellow/red)
   - Show current latency
   - Show 24-hour uptime %
8. Historical health data:
   - Store health check results for 30 days
   - Chart showing uptime trends
9. Unit tests for health checking logic
10. Integration test: Simulate API down, verify fallback and alerting

---

### Story 7.9: GitHub Actions Automation

As a platform developer,
I want to create a GitHub Actions workflow that automatically refills AKT for all infrastructure nodes,
so that refills happen on schedule without manual execution.

#### Acceptance Criteria

1. GitHub Actions workflow file created: `.github/workflows/auto-refill-akt.yml`
2. Workflow schedule: Runs every 6 hours (configurable via cron)
3. Workflow jobs:
   - **Job 1: Check Balances**
     - Iterates through all registered infrastructure nodes
     - Queries AKT balance for each (Story 7.3)
     - Identifies nodes below refill threshold
   - **Job 2: Execute Refills**
     - For each node below threshold:
       - Calculate swap amount
       - Execute swap (Story 7.4)
       - Log results
     - Runs in parallel (max 5 concurrent swaps)
   - **Job 3: Report Generation**
     - Summarizes refill activity
     - Total SOL spent, total AKT received
     - Nodes refilled, failures (if any)
     - Posts report as GitHub comment or artifact
4. Secrets configuration:
   - Solana wallet private keys for infrastructure nodes (encrypted)
   - Cosmos wallet mnemonics (encrypted)
   - API keys for Rango (if needed)
5. Error handling:
   - If node refill fails, log and continue to next node
   - If all refills fail, create GitHub issue
6. Cost limits:
   - Maximum total SOL spent per run (e.g., 5 SOL)
   - Prevents runaway costs if misconfigured
7. Manual trigger:
   - Workflow can be manually triggered via GitHub UI
   - Useful for testing or urgent refills
8. Reporting:
   - Workflow run summary saved as artifact
   - Can be downloaded for auditing
9. Integration test: Trigger workflow manually, verify refill executes
10. Documentation: README for setup and configuration

---

### Story 7.10: Node Operator Swap Dashboard

As an AI node operator,
I want to view swap history, costs, success rates, and edit configuration in my dashboard,
so that I can monitor and optimize my AKT refill strategy.

#### Acceptance Criteria

1. **Swap Dashboard Page** (integrated into Story 4.13 Wallet Management UI):
   - Current AKT balance (large display)
   - Refill threshold indicator (shows how close to triggering)
   - Next check time (countdown timer)
2. **Swap History Table**:
   - Columns: Date, SOL In, AKT Out, Protocol, Fee %, Status, TX Links
   - Last 50 swaps displayed
   - Sortable by date, amount
   - Pagination
3. **Cost Metrics Cards**:
   - Total swap costs (all time): X SOL
   - Total swap costs (this month): X SOL
   - Average fee %: X% (weighted avg of Rango + THORChain)
   - Total AKT acquired: X AKT
4. **Success Rate Chart**:
   - Pie chart: Successful vs failed swaps
   - Success rate percentage (e.g., "96% success")
   - Protocol breakdown: Rango success, THORChain success
5. **Configuration Editor**:
   - Edit all SwapConfig fields (thresholds, target, max amount, slippage)
   - Real-time validation of values
   - "Save" button updates config file
   - Preview estimated monthly costs based on config
6. **Manual Actions**:
   - "Refill Now" button (bypasses threshold check)
   - Shows quote before execution
   - Requires confirmation
7. **Protocol Performance Comparison**:
   - Table comparing Rango vs THORChain:
     - Success rate
     - Average fee %
     - Average completion time
     - Total swaps via each
8. **Balance Projections**:
   - Estimate AKT burn rate (based on deployment frequency)
   - Estimate days until next refill
   - Suggest threshold adjustments if refills too frequent
9. **Transaction Links**:
   - Link to Solana Explorer for each swap
   - Link to Rango tracker (if Rango swap)
   - Link to Cosmos Explorer for AKT receipt
10. **Export Options**:
    - Export swap history to CSV
    - For accounting/cost analysis

---

**Epic 7 Success Criteria:**
- ✅ Infrastructure nodes automatically maintain AKT balance without manual intervention
- ✅ Rango Exchange integration working (1.3% fees, 95%+ success rate)
- ✅ THORChain fallback provides redundancy (1.6% fees)
- ✅ Configurable thresholds allow operators to optimize refill frequency
- ✅ Balance monitoring checks every 6 hours and triggers refills
- ✅ All swap costs tracked in deployment_costs table
- ✅ Health monitoring alerts on API failures or low success rates
- ✅ GitHub Actions automation enables scheduled refills
- ✅ Node operator dashboard displays swap history and configuration
- ✅ Typical cost: ~$1/month per infrastructure node
- ✅ All integration tests pass on testnets

---

## Epic 8: Infrastructure/DevOps AI Agent (Milestone 1)

**Duration:** 3 weeks

**Epic Goal:** Build Infrastructure AI nodes that automatically set up CI/CD pipelines, execute deployments to Arweave (frontends) and Akash (backends), and post permanent URLs on-chain for token holder visibility. This epic creates the infrastructure automation layer that bridges GitHub Actions validation with decentralized hosting, enabling continuous deployment of client projects without manual DevOps work. Infrastructure nodes bid on setup work (Epic 0 stories for client projects), earn fees from deployment costs, and maintain multi-chain wallets (SOL for payments, AKT for Akash).

**Cost Model:** Infrastructure nodes pay deployment costs as operating expenses:
- Frontend: ~$0.09 per Arweave upload (10MB Next.js app)
- Backend: ~$3-5/month per Akash service (API, database, etc.)
- Cross-chain swaps: ~$1/month per node (automated SOL→AKT refills)
- Node recovery: Deployment costs deducted from story payment (85% dev → 84% dev, 1% infrastructure, 5% QA, 10% platform)

---

### Story 8.1: GitHub Actions Workflow Templates

As a platform developer,
I want to create GitHub Actions workflow templates for testing, building, and deploying to Arweave and Akash,
so that infrastructure nodes can generate project-specific CI/CD pipelines.

#### Acceptance Criteria

1. **Test Workflow Template** (`templates/workflows/test.yml`):
   - Parameterized for different tech stacks (Rust, Node.js, Python, Go)
   - Runs unit tests, integration tests, linting, type checking
   - Variables: test_command, lint_command, build_command
   - Example for Node.js: `npm test`, `npm run lint`, `npm run build`
2. **Build Workflow Template** (`templates/workflows/build.yml`):
   - Builds production artifacts based on project type
   - For web apps: Static export (Next.js: `npm run build && npm run export`)
   - For CLIs: Cross-platform binaries (Rust: `cargo build --release`)
   - For APIs: Docker image or binary
3. **Arweave Deployment Template** (`templates/workflows/deploy-arweave.yml`):
   - Uploads build artifacts to Arweave via Turbo SDK
   - Uses Solana wallet from secrets
   - Extracts Arweave transaction ID
   - Posts URL to Solana smart contract
   - Variables: build_dir, arweave_wallet_secret
4. **Akash Deployment Template** (`templates/workflows/deploy-akash.yml`):
   - Generates Akash SDL from architecture
   - Deploys to Akash Network
   - Extracts provider URL
   - Posts URL to Solana smart contract
   - Variables: akash_wallet, sdl_template
5. **Combined CI/CD Template** (`templates/workflows/ci-cd.yml`):
   - Triggers on PR to development/staging/main branches
   - Runs tests first
   - If tests pass and branch is development/staging/main: Deploy
   - Posts validation results to Solana via webhook
6. Template variables:
   - `{{tech_stack}}`: "node", "rust", "python", "go"
   - `{{test_framework}}`: "vitest", "cargo_test", "pytest"
   - `{{deployment_target}}`: "arweave", "akash", "github_releases"
7. Documentation:
   - README explaining each template
   - Variable substitution guide
8. Unit tests for template rendering
9. Integration test: Render template with variables, verify valid YAML
10. Example workflows for common stacks (Next.js, Rust CLI, Python API)

---

### Story 8.2: Arweave Deployment Automation for CI/CD

As a platform developer,
I want to integrate Arweave deployment into GitHub Actions using Turbo SDK,
so that web app builds are automatically uploaded to permanent storage on every PR merge.

#### Acceptance Criteria

1. GitHub Action step implementation:
   ```yaml
   - name: Deploy to Arweave
     run: |
       npm install -g @ardrive/turbo-sdk
       turbo upload ./dist --wallet ${{ secrets.ARWEAVE_WALLET }}
   ```
2. `deployToArweave(buildDir: string, wallet: string)` function for node execution:
   - Uploads build directory to Arweave
   - Uses Turbo SDK from Epic 2
   - Pays with SOL from infrastructure node wallet
   - Returns Arweave transaction ID
3. Build artifact preparation:
   - For Next.js: `out/` directory from `npm run build && npm run export`
   - For React: `build/` directory from `npm run build`
   - For static sites: `dist/` or `public/`
4. Upload optimization:
   - Gzip compression before upload (from Epic 2)
   - Typical Next.js app: 10MB → ~3MB compressed
   - Cost: ~$0.09 per deployment
5. Transaction ID extraction:
   - Parse Turbo upload output
   - Extract Arweave transaction ID
   - Format: 43-character alphanumeric string
6. Deployment URL construction:
   - Permanent URL: `https://arweave.net/{transaction_id}`
   - Verify URL accessible (HTTP 200)
7. Retry logic:
   - If upload fails, retry up to 3 times
   - Exponential backoff between retries
8. Cost tracking:
   - Log deployment cost to deployment_costs table (Story 7.7 structure)
   - Track SOL spent on Arweave deployments
9. Unit tests for deployment function
10. Integration test: Deploy test Next.js app to Arweave, verify URL accessible

---

### Story 8.3: Akash CLI Wrapper

As a platform developer,
I want to create a wrapper for Akash CLI that generates SDL files and manages deployments,
so that infrastructure nodes can deploy backend services to Akash Network.

#### Acceptance Criteria

1. `AkashDeploymentService` class implemented:
   - Wraps Akash CLI commands
   - Manages deployment lifecycle
2. `generateSDL(architecture: Architecture)` function:
   - Reads architecture.md tech stack
   - Generates Akash SDL YAML file
   - Example for Node.js API:
     ```yaml
     version: "2.0"
     services:
       api:
         image: node:20-alpine
         expose:
           - port: 3000
             as: 80
             to:
               - global: true
         env:
           - NODE_ENV=production
     profiles:
       compute:
         api:
           resources:
             cpu:
               units: 0.5
             memory:
               size: 512Mi
             storage:
               size: 1Gi
       placement:
         westcoast:
           pricing:
             api:
               denom: uakt
               amount: 100
     deployment:
       api:
         westcoast:
           profile: api
           count: 1
     ```
3. `deployToAkash(sdlFile: string, wallet: AkashWallet)` function:
   - Creates deployment on Akash
   - Submits SDL to network
   - Waits for provider bids
   - Selects lowest-priced provider
   - Creates lease with provider
   - Returns: lease ID, provider URL
4. `getDeploymentStatus(leaseId: string)` function:
   - Queries Akash deployment status
   - Returns: status (active, closed), provider info, URL
5. `updateDeployment(leaseId: string, newSDL: string)` function:
   - Updates existing deployment with new SDL
   - For configuration changes without redeployment
6. `closeDeployment(leaseId: string)` function:
   - Closes Akash lease
   - Releases resources
   - Stops billing
7. Provider selection logic:
   - Filters providers by uptime (>95%)
   - Filters by price (<$5/month for basic API)
   - Selects lowest price among qualified providers
8. Deployment verification:
   - Wait for service to be accessible
   - Health check on deployment URL
   - Timeout: 5 minutes
9. Unit tests for SDL generation
10. Integration test: Deploy test API to Akash testnet, verify accessible

---

### Story 8.4: Workflow Generation Logic

As an infrastructure AI node,
I want to automatically detect project tech stack from architecture.md and generate appropriate deployment workflows,
so that CI/CD is tailored to each client project without manual configuration.

#### Acceptance Criteria

1. `generateWorkflows(architecture: Architecture)` function implemented:
   - Downloads architecture.md from Arweave
   - Parses `project_metadata.type` field (cli_tool, web_app, api_backend, etc.)
   - Parses `tech_stack` section
   - Parses `validation_strategy` section
2. Workflow generation for web apps (`web_app`):
   - Generate test workflow using `validation_strategy.unit_tests`, `validation_strategy.e2e_tests`
   - Generate build workflow using `validation_strategy.build_verification`
   - Generate Arweave deployment workflow (Story 8.2 template)
   - No Akash deployment (frontends use Arweave only)
3. Workflow generation for APIs (`api_backend`):
   - Generate test workflow using validation commands
   - Generate Akash deployment workflow (Story 8.3 template)
   - Generate SDL file based on runtime and resources
4. Workflow generation for CLIs (`cli_tool`):
   - Generate test workflow
   - Generate GitHub Release workflow (cross-platform binaries)
   - No Arweave/Akash deployment
5. Variable substitution:
   - Replace `{{test_command}}` with actual command from architecture
   - Replace `{{build_command}}` with actual command
   - Replace `{{runtime}}` with node version, rust version, etc.
6. Webhook integration:
   - Add validation webhook step (Story 0.5 from Epic 0)
   - Webhook posts results to Solana after validation
7. Branch-specific deployments:
   - development branch: Deploy to development environment
   - staging branch: Deploy to staging environment
   - main branch: Deploy to production environment
8. Output:
   - Creates `.github/workflows/` directory
   - Writes all workflow files
   - Commits to repository
9. Unit tests for workflow generation per project type
10. Integration test: Generate workflows for test architecture, verify valid YAML

---

### Story 8.5: Deployment Health Monitoring

As an infrastructure AI node,
I want to monitor deployment health on Arweave and Akash,
so that I can detect failures and alert project creators.

#### Acceptance Criteria

1. `ArweaveHealthCheck` service:
   - Periodically checks Arweave URLs (every 10 minutes)
   - Verifies HTTP 200 response
   - Tracks response time
   - Alerts if unreachable for >30 minutes
2. `AkashHealthCheck` service:
   - Periodically checks Akash provider URLs (every 5 minutes)
   - Calls health check endpoint (e.g., `/health` or `/`)
   - Verifies response status
   - Tracks uptime %
3. Health metrics tracked:
   - Uptime % (rolling 24 hours)
   - Average response time
   - Consecutive failure count
   - Last successful check timestamp
4. Alerting:
   - Alert project creator if deployment down for >30 minutes
   - Alert infrastructure node operator
   - Post status update to Solana (deployment status field)
5. Automatic recovery (optional):
   - If Akash deployment down, attempt redeployment
   - If Arweave gateway unavailable, try alternative gateway
6. Health dashboard:
   - Display deployment status per story
   - Green: Healthy (200 OK)
   - Yellow: Degraded (slow response)
   - Red: Down (unreachable)
7. Historical uptime data:
   - Store health checks for 30 days
   - Chart showing uptime trends per deployment
8. Integration with Story 4.4 (Project Dashboard):
   - Show deployment health indicators in UI
9. Unit tests for health checking logic
10. Integration test: Deploy test app, monitor health, simulate downtime

---

### Story 8.6: Deployment URL Extraction and On-Chain Posting

As an infrastructure AI node,
I want to extract deployment URLs from Arweave/Akash and post them to Solana,
so that token holders can access live staging environments.

#### Acceptance Criteria

1. `extractArweaveURL(transactionId: string)` function:
   - Input: Arweave transaction ID (from Story 8.2 deployment)
   - Output: `https://arweave.net/{transaction_id}`
   - Verifies URL accessible before returning
2. `extractAkashURL(leaseId: string)` function:
   - Queries Akash lease for provider info
   - Constructs provider URL: `https://{provider_hostname}.akash.network` or custom domain
   - Verifies URL accessible via health check
3. `postDeploymentURL(storyId: string, deploymentUrl: string, environment: string)` function:
   - Posts URL to Solana smart contract
   - Updates Story account `staging_url` field (or `production_url` if main branch)
   - Environment: "development", "staging", or "production"
   - Emits event: `DeploymentURLPosted { story, url, environment }`
4. URL verification before posting:
   - Test deployment URL returns 200 OK
   - For APIs: Health check endpoint responds
   - For frontends: Root path loads
   - Retry up to 5 times (deployments may take time to propagate)
5. Multiple environment URLs:
   - Story can have 3 URLs: development_url, staging_url, production_url
   - Updated based on which branch deployed
6. URL metadata:
   - Include deployment timestamp
   - Include commit SHA that was deployed
   - Include deployment cost (SOL or AKT)
7. Event subscription:
   - Token holders subscribe to DeploymentURLPosted events
   - Real-time notifications when new staging URLs available
8. Integration with Story 4.4:
   - Project dashboard displays all deployment URLs
   - Clickable links to staging environments
9. Unit tests for URL extraction
10. Integration test: Deploy to Arweave, extract URL, post to Solana, verify on-chain

---

### Story 8.7: Infrastructure Node Bidding System

As an infrastructure AI node operator,
I want my node to bid on infrastructure setup work (Epic 0 stories) for client projects,
so that I can earn fees from deployment services.

#### Acceptance Criteria

1. Infrastructure node subscribes to Epic 0 opportunities:
   - Filters opportunities by type: "Infrastructure" (Story 0.0, 0.2, 0.3, 0.4, 0.5)
   - Receives notifications when client projects posted
2. Bidding logic for infrastructure work:
   - Fixed pricing model (infrastructure work is predictable):
     - Story 0.0 (Git setup): $2.50 (5 minutes work)
     - Story 0.1 (Architecture gen): Handled by Architect node, not Infrastructure
     - Story 0.2 (Test setup): $3 (10 minutes work)
     - Story 0.3 (CI/CD setup): $5 (15 minutes work)
     - Story 0.4 (Deployment setup): $7 (20 minutes + deployment costs)
     - Story 0.5 (Webhook setup): $3 (10 minutes work)
   - Total Epic 0 infrastructure cost: ~$20.50 per client project
3. Competitive bidding:
   - Multiple infrastructure nodes can bid
   - Lowest bidder wins (same as dev nodes)
   - Typical bid range: 80-100% of fixed price above
4. Stake requirements:
   - Infrastructure nodes use same tier system as dev nodes
   - New infrastructure nodes (Tier 0): Stake 5x bid ($10 stake for $2 story)
5. Infrastructure work execution:
   - Node executes BMAD infrastructure agent (from Story 3.7)
   - Generates workflows (Story 8.4)
   - Sets up deployment pipelines (Stories 8.2, 8.3)
   - Posts results to Solana
6. Payment model:
   - Infrastructure receives story payment (e.g., $5 for CI/CD setup)
   - Infrastructure pays deployment costs from own wallet
   - Net earnings: Payment - deployment costs
   - Example: $5 payment - $0.09 Arweave cost = $4.91 profit (98% margin)
7. Unit tests for infrastructure bidding logic
8. Integration test: Infrastructure node bids on Epic 0 story, gets assigned

---

### Story 8.8: Deployment Cost Tracking

As an infrastructure AI node operator,
I want to track all deployment costs (Arweave uploads, Akash leases, AKT swaps),
so that I can monitor profitability and optimize operations.

#### Acceptance Criteria

1. Deployment cost logging (uses `deployment_costs` table from Story 7.7):
   - Type: 'arweave' for frontend deployments
   - Type: 'akash' for backend deployments
   - Type: 'swap' for SOL→AKT conversions (already tracked in Story 7.7)
2. `logArweaveCost(txId: string, solSpent: number, storyId: string)` function:
   - Records Arweave deployment cost
   - Links to story
   - Tracks SOL spent (~$0.09 USD equivalent)
3. `logAkashCost(leaseId: string, aktPerMonth: number, storyId: string)` function:
   - Records Akash lease cost
   - Monthly AKT cost (~$3-5)
   - Tracks deployment duration
4. Cost aggregation:
   - Total costs per story
   - Total costs per project
   - Total costs per node (operating expenses)
   - Breakdown by type (Arweave vs Akash vs Swap)
5. Profitability calculation:
   - `calculateProfit(storyId: string)`:
     - Payment received: X SOL
     - Costs incurred: Y SOL (Arweave + Akash + Swap)
     - Profit: X - Y
     - Profit margin: (X - Y) / X × 100%
6. Cost reporting:
   - Weekly cost report per node
   - Monthly P&L statement (payments vs costs)
   - Alert if profit margin < 50% (infrastructure costs too high)
7. Integration with Story 4.10 (Earnings Dashboard):
   - Show deployment costs in earnings breakdown
   - Net earnings = Gross earnings - Deployment costs
8. Export functionality:
   - Export cost data to CSV
   - For tax reporting
9. Unit tests for cost logging
10. Integration test: Deploy to Arweave + Akash, verify costs logged

---

### Story 8.9: Multi-Chain Wallet Management

As an infrastructure AI node operator,
I want my node to manage SOL and AKT wallets with auto-refill integration,
so that I can receive SOL payments and maintain AKT for Akash deployments.

#### Acceptance Criteria

1. Wallet configuration:
   - SOL wallet: Receives payments from story completions
   - AKT wallet: Pays for Akash deployments
   - Both wallets configured in `~/.slop-node/wallets.yaml`:
     ```yaml
     solana:
       private_key: "${SOL_PRIVATE_KEY}"
       public_key: "..."
     cosmos:
       mnemonic: "${COSMOS_MNEMONIC}"
       address: "cosmos1..."
     ```
2. `getSolanaBalance()` function:
   - Queries SOL wallet balance
   - Returns available SOL
3. `getAkashBalance()` function:
   - Queries AKT wallet balance (via Story 7.3 Cosmos SDK)
   - Returns available AKT
4. Auto-refill integration with Epic 7:
   - Uses Story 7.5 configurable auto-refill system
   - Automatically swaps SOL → AKT when AKT balance low
   - Triggered by Story 7.6 balance monitoring service
5. Payment receipt handling:
   - Listen for SOL payments from Solana program (story completions)
   - Update local balance tracking
   - Log payment receipts
6. Deployment cost handling:
   - Deduct AKT for Akash deployments
   - Deduct SOL for Arweave deployments
   - Update balances after each transaction
7. Balance alerts:
   - Warn if SOL balance < 0.1 SOL (cannot pay for swaps or deployments)
   - Warn if AKT balance < 5 AKT (cannot deploy)
8. Wallet backup:
   - Encrypted backup of wallet keys
   - Recovery instructions
9. Unit tests for wallet balance queries
10. Integration test: Receive SOL payment, auto-refill AKT, deploy to Akash

---

**Epic 8 Success Criteria:**
- ✅ Infrastructure AI nodes can set up complete CI/CD pipelines for any project type
- ✅ Arweave deployment automation working in GitHub Actions (~$0.09/deploy)
- ✅ Akash deployment automation working with SDL generation (~$3-5/month)
- ✅ Workflow generation adapts to project tech stack from architecture.md
- ✅ Deployment health monitoring tracks uptime and alerts on failures
- ✅ Deployment URLs extracted and posted to Solana for token holder visibility
- ✅ Infrastructure nodes can bid on Epic 0 stories and earn fees
- ✅ Deployment costs tracked for profitability analysis
- ✅ Multi-chain wallet management with Epic 7 auto-refill integration
- ✅ Infrastructure node profit margins: 83-99% (high profitability)
- ✅ All integration tests pass

---

## Epic 9: MCP Server (Milestone 2)

**Duration:** 4 weeks

**Epic Goal:** Build a Model Context Protocol (MCP) server that enables Claude Desktop users to create projects on Slop Machine through natural conversation. The MCP server integrates analyst.txt (brainstorming tools) and pm.txt (PRD generation tools) with 18+ tools that connect directly to Solana and Arweave, supporting both remote mode (deep link payments for humans) and local mode (wallet access for AI agents). This epic creates the zero-friction onboarding experience where users go from idea to funded project in Claude Desktop without leaving the conversation.

---

### Story 9.1: MCP Server Setup

As a platform developer,
I want to set up an MCP server using the official SDK,
so that we have the foundation for integrating Slop Machine tools into Claude Desktop.

#### Acceptance Criteria

1. MCP server project initialized with `@modelcontextprotocol/sdk`
2. TypeScript configuration for MCP server:
   - tsconfig.json with ES2022 target
   - Proper type definitions for MCP protocol
3. Server entry point created (`src/index.ts`):
   - Implements MCP server interface
   - Exports tool list
   - Handles tool invocations
4. Basic tools implemented for testing:
   - `ping`: Returns "pong" (health check)
   - `get_server_info`: Returns server version and capabilities
5. Local development setup:
   - `npm run dev`: Runs server in development mode
   - `npm run build`: Compiles TypeScript
   - `npm test`: Runs unit tests
6. Claude Desktop integration testing:
   - Add server to Claude Desktop config
   - Verify tools appear in Claude
   - Test tool invocation
7. Error handling:
   - Invalid tool names
   - Missing required parameters
   - Server crashes (graceful restart)
8. Logging:
   - Log all tool invocations
   - Log errors with stack traces
9. README with setup instructions for developers
10. Unit tests for server initialization

---

### Story 9.2: analyst.txt Integration

As a Claude Desktop user,
I want to use brainstorming and research tools from analyst.txt in my conversations,
so that I can explore project ideas before creating a PRD.

#### Acceptance Criteria

1. analyst.txt BMAD agent loaded in MCP server
2. Analyst tools exposed to Claude Desktop:
   - `brainstorm`: Generates ideas using brainstorming techniques
   - `research_market`: Researches market for similar products
   - `analyze_competitors`: Analyzes competitor features and pricing
   - `evaluate_feasibility`: Evaluates technical and business feasibility
3. `brainstorm` tool implementation:
   - Parameters: topic (string), technique (string - optional)
   - Uses techniques from `.bmad-core/data/brainstorming-techniques.md`
   - Returns: List of ideas with descriptions
4. `research_market` tool implementation:
   - Parameters: problem (string), industry (string)
   - Searches for existing solutions
   - Returns: Market landscape summary
5. `analyze_competitors` tool implementation:
   - Parameters: product_type (string), competitors (string[] - optional)
   - Analyzes competitor features, pricing, strengths, weaknesses
   - Returns: Competitive analysis report
6. `evaluate_feasibility` tool implementation:
   - Parameters: idea (string), constraints (string[] - optional)
   - Evaluates technical feasibility, business viability, resource requirements
   - Returns: Feasibility score (0-100) and recommendations
7. Tool output formatting:
   - Markdown formatted for readability in Claude
   - Tables for comparisons
   - Bullet lists for ideas
8. Context persistence:
   - Analyst results saved to MCP context
   - Can be referenced in PM phase
9. Unit tests for each analyst tool
10. Integration test: Use analyst tools in Claude Desktop conversation

---

### Story 9.3: pm.txt Integration

As a Claude Desktop user,
I want to use PRD generation tools from pm.txt in my conversations,
so that I can create complete PRDs through guided dialogue.

#### Acceptance Criteria

1. pm.txt BMAD agent loaded in MCP server
2. PM tools exposed to Claude Desktop:
   - `create_prd`: Starts PRD creation workflow
   - `add_requirement`: Adds functional/non-functional requirement
   - `create_epic`: Defines epic with stories
   - `add_story`: Adds story with acceptance criteria
   - `finalize_prd`: Completes and uploads PRD to Arweave
3. `create_prd` tool implementation:
   - Parameters: project_name (string), description (string)
   - Initializes PRD structure
   - Returns: PRD ID for subsequent tool calls
4. `add_requirement` tool:
   - Parameters: prd_id, requirement_type ('functional' | 'non-functional'), requirement_text
   - Adds requirement to PRD
   - Auto-generates requirement ID (FR1, FR2, NFR1, etc.)
5. `create_epic` tool:
   - Parameters: prd_id, epic_title, epic_goal (2-3 sentences)
   - Creates epic structure
   - Returns: Epic ID
6. `add_story` tool:
   - Parameters: prd_id, epic_id, story_title, user_type, action, benefit, acceptance_criteria[]
   - Creates user story in format: "As a {user_type}, I want {action}, so that {benefit}"
   - Adds numbered acceptance criteria
7. `finalize_prd` tool:
   - Parameters: prd_id
   - Validates PRD completeness (all required sections present)
   - Formats PRD markdown
   - Uploads to Arweave
   - Returns: Arweave transaction ID
8. PRD validation:
   - All epics have ≥1 story
   - All stories have ≥1 acceptance criterion
   - Epics are sequentially numbered
9. Template compliance:
   - Generated PRD matches `.bmad-core/templates/prd-tmpl.yaml` structure
10. Integration test: Create complete PRD through tool calls in Claude Desktop

---

### Story 9.4: All MCP Tools

As a Claude Desktop user,
I want access to all 18+ Slop Machine tools for the complete workflow,
so that I can create projects, post opportunities, monitor progress, and manage funds without leaving Claude.

#### Acceptance Criteria

1. **Project Creation Tools**:
   - `upload_prd`: Upload PRD to Arweave
   - `create_project`: Create project on Solana
   - `fund_project`: Add SOL to project escrow
2. **Opportunity Management Tools**:
   - `post_opportunity`: Post story opportunity
   - `list_bids`: View bids for opportunity
   - `accept_bid`: Accept winning bid
3. **Project Monitoring Tools**:
   - `get_project_status`: View project progress
   - `list_stories`: View all stories and statuses
   - `get_story_details`: View story with acceptance criteria, assigned node, validation results
   - `view_staging_url`: Get staging deployment URL
4. **Token Tools** (Epic 10 integration):
   - `create_token`: Launch pump.fun token
   - `buy_token`: Purchase project token
   - `get_token_price`: Check current token price
5. **Wallet Tools**:
   - `get_balance`: Check SOL balance
   - `get_transaction_history`: View transactions
6. **Analytics Tools**:
   - `get_project_analytics`: View completion %, budget burn rate, quality metrics
   - `get_node_performance`: View AI node statistics
7. **Document Tools**:
   - `view_arweave_doc`: Fetch and display document from Arweave
   - `download_architecture`: Get architecture.md for project
8. Tool organization:
   - Grouped by category (Project, Opportunity, Token, Wallet, Analytics, Documents)
   - Help text for each tool
   - Parameter descriptions with examples
9. Error handling per tool:
   - User-friendly error messages
   - Actionable suggestions (e.g., "Insufficient SOL - add X SOL to wallet")
10. Integration test: Execute all 18 tools in sequence (complete workflow)

---

### Story 9.5: Remote Mode (Deep Link Payments)

As a human Claude Desktop user,
I want to make Solana transactions via deep links that open my wallet app,
so that I can interact with Slop Machine without exposing my private key to the MCP server.

#### Acceptance Criteria

1. Deep link generation for Solana transactions:
   - Format: `solana:{action}?{parameters}`
   - Example: `solana:transfer?recipient={address}&amount={lamports}&memo={memo}`
2. MCP tools return deep links instead of executing transactions directly:
   - `create_project` tool returns: "Click to create project: {deep_link}"
   - `fund_project` tool returns: "Click to fund: {deep_link}"
   - `accept_bid` tool returns: "Click to accept bid: {deep_link}"
3. Deep link parameters:
   - Recipient address (program address or node wallet)
   - Amount (lamports)
   - Memo (encodes operation type and parameters)
   - Custom instruction data (for program calls)
4. Phantom wallet deep link support:
   - Format: `https://phantom.app/ul/browse/{encoded_params}`
   - Opens Phantom mobile app or browser extension
5. User flow:
   - User asks Claude to create project
   - Claude calls `create_project` tool (MCP)
   - Tool returns deep link
   - Claude displays: "Click here to sign transaction: [link]"
   - User clicks link
   - Wallet opens with pre-filled transaction
   - User approves
   - Transaction submitted to Solana
6. Transaction status polling:
   - MCP server watches for transaction confirmation
   - Once confirmed, updates project status
   - Claude notifies user: "Project created! ID: {project_id}"
7. Error handling:
   - User rejects transaction (timeout after 5 minutes)
   - Transaction fails (display error from Solana)
8. Multi-step transactions:
   - Some operations require multiple transactions
   - Queue deep links sequentially
9. Unit tests for deep link generation
10. Integration test: Generate deep link, manually approve in wallet, verify transaction

---

### Story 9.6: Local Mode (Wallet Access for AI Agents)

As an AI agent using Claude Desktop,
I want direct wallet access to sign transactions programmatically,
so that I can execute Solana operations autonomously without deep links.

#### Acceptance Criteria

1. Wallet configuration for AI agents:
   - MCP server config file: `~/.slop-mcp/config.yaml`
   - Contains Solana wallet private key (encrypted)
   - Permission flag: `allow_autonomous_transactions: true`
2. `loadWallet()` function:
   - Reads encrypted wallet from config
   - Decrypts using system keychain
   - Returns Keypair for signing
3. AI agent transaction execution:
   - `create_project` tool can sign and send transaction directly
   - No deep link needed
   - Returns transaction signature immediately
4. Safety mechanisms:
   - Maximum transaction value per call (e.g., 1 SOL)
   - Daily transaction limit (e.g., 10 SOL)
   - Require explicit user approval in config for autonomous mode
5. Audit logging:
   - Log all autonomous transactions
   - Include: timestamp, operation, amount, signature
   - Viewable by user in MCP dashboard
6. Mode detection:
   - MCP server detects if wallet configured for autonomous mode
   - If yes: Execute transactions directly
   - If no: Return deep links (remote mode from Story 9.5)
7. Wallet security:
   - Private key never logged
   - Encrypted at rest
   - Access controlled by file permissions
8. Transaction confirmation:
   - Wait for transaction confirmation before returning
   - Return signature and confirmation status
9. Unit tests for wallet loading
10. Integration test: AI agent creates project autonomously, verify transaction on Solana

---

### Story 9.7: Agent Orchestration

As a Claude Desktop user,
I want analyst and PM agents to hand off context automatically,
so that I can go from brainstorming to completed PRD in one conversation.

#### Acceptance Criteria

1. Context handoff mechanism:
   - Analyst tools store results in MCP context:
     - `brainstorm_results`: List of ideas
     - `market_research`: Market analysis
     - `competitor_analysis`: Competitive insights
   - PM tools can access analyst context
   - PM uses analyst results to inform PRD
2. `start_prd_from_analysis` tool:
   - Parameters: None (uses context from analyst phase)
   - Automatically populates PRD sections:
     - Goals: Derived from selected brainstorm idea
     - Background: Derived from market research
     - Requirements: Suggested based on competitor analysis
   - Returns: Draft PRD for user review
3. Conversation flow:
   ```
   User: I want to build a productivity app
   Claude: *calls brainstorm tool*
          Here are 5 productivity app ideas...

   User: I like idea #3 (AI task manager)
   Claude: *calls research_market tool*
          Here's the market landscape for AI task managers...
          *calls analyze_competitors tool*
          Todoist, TickTick, and Motion.ai are key competitors...

   User: Let's create the PRD
   Claude: *calls start_prd_from_analysis*
          I've started your PRD with context from our analysis...
          *guides user through epic and story creation*
   ```
4. Context persistence across tools:
   - MCP maintains conversation context
   - Previous tool outputs available to later tools
5. Agent persona switching:
   - Analyst persona: Creative, exploratory, asks open questions
   - PM persona: Structured, detailed, asks specific requirements
6. Handoff triggers:
   - Explicit: User says "let's create the PRD"
   - Implicit: After analysis complete, suggest next step
7. Context review before PRD creation:
   - PM agent summarizes analyst findings
   - User can approve or request changes
8. Unit tests for context handoff
9. Integration test: Complete analyst → PM flow in one session

---

### Story 9.8: Deploy Remote MCP Server

As a platform developer,
I want to deploy the MCP server to a public URL (slopmachine.com/mcp),
so that Claude Desktop users can connect without running local server.

#### Acceptance Criteria

1. MCP server dockerized:
   - Dockerfile for Node.js MCP server
   - Multi-stage build for optimization
   - Image size <100MB
2. Deployment to production hosting:
   - Hosted on reliable platform (Railway, Render, or Akash)
   - Public URL: `https://slopmachine.com/mcp` or `https://mcp.slopmachine.com`
   - HTTPS enabled with valid certificate
3. Claude Desktop configuration:
   - Remote MCP server URL in Claude config
   - Authentication token (if needed)
   - User adds server via: `claude mcp add https://slopmachine.com/mcp`
4. Rate limiting:
   - Per-user rate limits (e.g., 100 requests/hour)
   - Prevents abuse
   - Returns 429 status if exceeded
5. Monitoring:
   - Uptime monitoring (e.g., UptimeRobot)
   - Error tracking (e.g., Sentry)
   - Performance metrics (response times)
6. Scaling:
   - Auto-scaling for high traffic (if needed)
   - Load balancer if multiple instances
7. Security:
   - CORS configured for Claude Desktop origin
   - Input validation on all tool parameters
   - No wallet private keys on server (deep links only for remote mode)
8. Documentation:
   - Public docs: How to add MCP server to Claude Desktop
   - Tool reference: List of all available tools with examples
9. Health check endpoint:
   - `/health`: Returns server status
   - Used for uptime monitoring
10. Integration test: Connect to remote MCP from Claude Desktop, invoke tools

---

### Story 9.9: Publish npm Package

As a developer,
I want to publish @slop-machine/mcp-server as an npm package,
so that others can run the MCP server locally or contribute improvements.

#### Acceptance Criteria

1. Package configuration (`package.json`):
   - Name: `@slop-machine/mcp-server`
   - Version: `1.0.0`
   - Description: "Model Context Protocol server for Slop Machine marketplace"
   - Main entry point: `dist/index.js`
   - TypeScript types: `dist/index.d.ts`
2. Build process:
   - `npm run build`: Compiles TypeScript to JavaScript
   - Output to `dist/` directory
   - Includes type definitions
3. Package contents:
   - Compiled JavaScript
   - Type definitions
   - README.md with usage instructions
   - LICENSE (MIT or Apache 2.0)
4. npm scripts:
   - `start`: Runs MCP server
   - `build`: Compiles TypeScript
   - `test`: Runs test suite
   - `lint`: Runs ESLint
5. Installation instructions:
   ```bash
   npm install -g @slop-machine/mcp-server
   slop-mcp-server --port 3000
   ```
6. CLI options:
   - `--port`: Server port (default: 3000)
   - `--config`: Path to config file
   - `--help`: Show usage info
7. Published to npm registry:
   - Package available at https://npmjs.com/package/@slop-machine/mcp-server
   - Version 1.0.0 or higher
8. Documentation:
   - README with:
     - Installation instructions
     - Configuration guide
     - Tool reference
     - Examples
9. GitHub repository:
   - Source code on GitHub
   - CI/CD for automated publishing
10. Integration test: Install from npm, run server, verify tools work

---

**Epic 9 Success Criteria:**
- ✅ MCP server working locally and remotely
- ✅ analyst.txt integrated with brainstorming and research tools
- ✅ pm.txt integrated with PRD generation tools
- ✅ 18+ tools available in Claude Desktop for complete workflow
- ✅ Remote mode supports human users with deep link payments
- ✅ Local mode supports AI agents with wallet access
- ✅ Agent orchestration enables analyst → PM handoff
- ✅ Remote MCP server deployed at slopmachine.com/mcp
- ✅ npm package published and installable
- ✅ Complete workflow possible in Claude Desktop without leaving conversation
- ✅ Zero-friction onboarding (idea to funded project in <30 minutes)

---

## Epic 10: Token Launchpad (Milestone 3)

**Duration:** 4 weeks

**Epic Goal:** Integrate pump.fun token launches via PumpPortal API, enabling project creators to community-fund projects through token sales. This epic implements token creation in MCP, automatic dev fund selling (20% of supply → project escrow), on-chain token escrow accounts, opportunity funding from token proceeds, milestone tracking for token holder updates, and creator fee claiming. Projects transition from self-funded (creator pays SOL) to community-funded (token holders speculate on success), with creators earning 1% trading fees on pump.fun bonding curve.

---

### Story 10.1: PumpPortal API Integration

As a platform developer,
I want to integrate PumpPortal API for pump.fun token operations,
so that we can create tokens, execute trades, and collect creator fees.

#### Acceptance Criteria

1. PumpPortal API client initialized:
   - Base URL: `https://pumpportal.fun/api/`
   - No API key required (uses Solana wallet signatures)
2. `createTokenPumpFun(params: TokenParams)` function:
   - Parameters: name, symbol, description, image_url, twitter, telegram, website
   - Calls PumpPortal `/trade-local` endpoint
   - Creates token on pump.fun bonding curve
   - Returns: token mint address, signature
3. `buyTokenPumpFun(tokenMint: string, solAmount: number, slippage: number)` function:
   - Calls PumpPortal buy endpoint
   - Purchases tokens with SOL
   - Slippage protection (default: 5%)
   - Returns: tokens received, transaction signature
4. `sellTokenPumpFun(tokenMint: string, tokenAmount: number, slippage: number)` function:
   - Calls PumpPortal sell endpoint
   - Sells tokens for SOL
   - Returns: SOL received, transaction signature
5. `collectCreatorFee(tokenMint: string, creatorWallet: string)` function:
   - Collects 1% trading fees accrued to creator
   - Creator = project creator (who launched token)
   - Returns: SOL collected
6. Error handling:
   - PumpPortal API unavailable
   - Transaction failures (slippage exceeded, insufficient SOL)
   - Invalid token parameters
7. Rate limiting awareness:
   - Respects PumpPortal rate limits
   - Implements exponential backoff on 429 errors
8. Transaction monitoring:
   - Polls transaction status until confirmed
   - Timeout: 60 seconds
9. Unit tests for API integration
10. Integration test: Create test token on devnet, buy/sell, collect fees

---

### Story 10.2: Token Trading Endpoints

As a platform developer,
I want to expose token trading functionality through backend endpoints,
so that the web UI can execute token purchases and sales.

#### Acceptance Criteria

1. **API Endpoints**:
   - POST `/api/tokens/buy`: Buy project token
   - POST `/api/tokens/sell`: Sell project token
   - GET `/api/tokens/:mint/price`: Get current token price
   - GET `/api/tokens/:mint/chart`: Get price chart data
   - POST `/api/tokens/:mint/collect-fees`: Collect creator fees
2. `POST /api/tokens/buy` implementation:
   - Request body: `{ tokenMint, solAmount, slippage }`
   - Validates user wallet connected
   - Calls `buyTokenPumpFun()` (Story 10.1)
   - Returns: tokens received, transaction signature
3. `POST /api/tokens/sell` implementation:
   - Request body: `{ tokenMint, tokenAmount, slippage }`
   - Validates user owns tokens
   - Calls `sellTokenPumpFun()` (Story 10.1)
   - Returns: SOL received, transaction signature
4. `GET /api/tokens/:mint/price` implementation:
   - Queries pump.fun API for current price
   - Returns: price in SOL, market cap, volume 24h
5. `GET /api/tokens/:mint/chart` implementation:
   - Fetches historical price data
   - Returns: Array of {timestamp, price} for charting
6. `POST /api/tokens/:mint/collect-fees` implementation:
   - Only project creator can call
   - Calls `collectCreatorFee()` (Story 10.1)
   - Returns: SOL collected
7. Authentication:
   - Wallet signature verification
   - Prevents unauthorized token operations
8. Transaction confirmation:
   - Wait for Solana confirmation before returning
   - Return both signature and confirmation status
9. Unit tests for all endpoints
10. Integration test: Buy token via API, verify tokens in wallet

---

### Story 10.3: Token Creation Flow (in MCP)

As a project creator using Claude Desktop,
I want to launch a pump.fun token for my project through MCP tools,
so that I can community-fund my project without leaving Claude.

#### Acceptance Criteria

1. `create_token` MCP tool implemented:
   - Parameters: project_id, token_name, token_symbol, description, image_url
   - Validates project exists and creator owns it
   - Calls PumpPortal to create token (Story 10.1)
   - Returns: token mint address, pump.fun URL
2. Token metadata:
   - Name: Project name or custom
   - Symbol: 4-6 characters (e.g., "SLOP", "BUILD")
   - Description: Project elevator pitch
   - Image: Project logo (uploaded to Arweave first)
   - Links: Twitter, Telegram, website (if applicable)
3. Guided workflow in Claude:
   ```
   User: Launch token for my project
   Claude: What should your token be called?
   User: BuildMaster
   Claude: Symbol? (4-6 characters)
   User: BUILD
   Claude: *generates description from PRD*
          *creates token via PumpPortal*
          Token launched! https://pump.fun/token/{mint}
   ```
4. Token creation cost:
   - 0.02 SOL for token creation on pump.fun
   - Deducted from project creator wallet
5. Automatic project update:
   - Links token to project in Solana
   - Updates Project account with `token_mint` field
   - Emits `TokenLaunched` event
6. Initial liquidity (optional):
   - Creator can buy initial tokens (e.g., 1 SOL)
   - Creates price floor
7. Token launch announcement:
   - Auto-post to Twitter (if social integration enabled)
   - Include: Token name, symbol, pump.fun link, project description
8. Error handling:
   - Token symbol already taken
   - Insufficient SOL for creation
   - PumpPortal API error
9. Unit tests for token creation flow
10. Integration test: Create token via MCP tool in Claude Desktop

---

### Story 10.4: Automatic Dev Fund Sale

As a platform developer,
I want to automatically sell 20% of token supply and deposit proceeds to project escrow,
so that projects are funded from token launches without creator depositing SOL.

#### Acceptance Criteria

1. Dev fund allocation:
   - When token created, creator receives full supply initially
   - 20% of supply designated as "dev fund"
   - Dev fund held in creator wallet initially
2. `sellDevFund(tokenMint: string, projectId: string)` function:
   - Triggered automatically after token creation
   - Sells 20% of token supply via PumpPortal
   - Uses gradual sell strategy (prevents price crash):
     - Sell in 10 batches of 2% each
     - Wait 1 minute between batches
     - Allows bonding curve to recover
3. Proceeds calculation:
   - Total SOL received from selling 20%
   - Deduct PumpPortal fees (0.5% trading fee)
   - Net proceeds deposited to project escrow
4. Escrow deposit:
   - SOL transferred to project escrow PDA
   - Updates Project account `total_budget` and `remaining_budget`
   - Emits `DevFundSold` event with amount
5. Typical economics (example):
   - Token launches with 1 billion supply
   - Creator sells 200M tokens (20%)
   - Bonding curve pricing: ~0.05 SOL for 200M tokens
   - Net proceeds: ~0.045 SOL to project escrow
   - Enables funding first ~18 stories @ $2.50 each (at SOL=$100)
6. Price impact mitigation:
   - Gradual selling over 10 minutes
   - Each batch is small (2% of supply)
   - Bonding curve absorbs sells without major dump
7. Creator retention:
   - Creator keeps 80% of token supply
   - Can sell remaining gradually or hold for appreciation
8. Transparency:
   - All dev fund sells logged on-chain
   - Token holders see exact amount sold
9. Unit tests for dev fund selling
10. Integration test: Create token, sell 20% dev fund, verify escrow funded

---

### Story 10.5: ProjectToken and TokenEscrow Accounts

As a platform developer,
I want to define ProjectToken and TokenEscrow account structures on Solana,
so that token-project relationships and escrow funding are tracked on-chain.

#### Acceptance Criteria

1. `ProjectToken` account structure:
   - project (Pubkey - parent project)
   - token_mint (Pubkey - pump.fun token address)
   - creator (Pubkey - project creator wallet)
   - total_supply (u64 - token total supply)
   - dev_fund_percent (u8 - usually 20%)
   - dev_fund_sold (bool - whether dev fund sold)
   - dev_fund_proceeds (u64 - SOL received from selling dev fund)
   - creator_fees_collected (u64 - total 1% fees collected)
   - launched_at (i64)
2. `TokenEscrow` account structure:
   - project_token (Pubkey - parent ProjectToken)
   - balance (u64 - SOL in escrow from token proceeds)
   - total_deposited (u64 - total SOL ever deposited)
   - total_withdrawn (u64 - total SOL withdrawn for opportunity payments)
   - last_refilled (i64 - timestamp of last deposit)
3. `link_token_to_project` instruction:
   - Parameters: project, token_mint, creator
   - Creates ProjectToken account
   - Links token to project
   - Emits `TokenLinked` event
4. `deposit_to_token_escrow` instruction:
   - Parameters: project_token, amount
   - Transfers SOL from creator wallet to TokenEscrow PDA
   - Updates balance
   - Emits `EscrowDeposit` event
5. Token escrow PDA:
   - Seeds: `["token_escrow", project_pubkey]`
   - Holds SOL from token sales
   - Used to fund opportunities
6. Escrow balance tracking:
   - Real-time balance queries
   - Historical deposit/withdrawal records
7. Multi-source funding:
   - Project can receive SOL from both:
     - Direct creator deposits (traditional)
     - Token escrow (community-funded)
8. Unit tests for account structures
9. Unit tests for linking and depositing
10. Integration test: Link token, deposit to escrow, query balance

---

### Story 10.6: Fund Opportunities from Token Escrow

As a project creator,
I want to fund story opportunities from token escrow proceeds automatically,
so that community-funded projects continue without requiring my SOL deposits.

#### Acceptance Criteria

1. Escrow funding logic in `create_story` instruction (Story 5.3):
   - Check if project has linked token (ProjectToken account exists)
   - If yes: Withdraw payment from TokenEscrow instead of project creator wallet
   - If no: Withdraw from creator wallet (traditional funding)
2. `withdraw_from_token_escrow` instruction:
   - Parameters: project_token, amount, opportunity
   - Validates sufficient escrow balance
   - Transfers SOL from TokenEscrow to opportunity escrow
   - Updates TokenEscrow balance and total_withdrawn
   - Emits `EscrowWithdrawal` event
3. Escrow balance checking:
   - Before posting opportunity, check escrow balance
   - If insufficient: Notify creator to sell more tokens or deposit SOL
4. Hybrid funding model:
   - Early stories: Funded from token escrow (if available)
   - Later stories: Creator can top up escrow by selling more tokens
   - Fallback: Creator deposits SOL directly if token liquidity low
5. Budget management:
   - TokenEscrow balance shown in project dashboard
   - Projected remaining stories fundable from escrow
   - Alert when escrow running low
6. Transparency for token holders:
   - Token holders see escrow balance on-chain
   - Can verify their token purchases fund real development
7. Creator fee refill:
   - When creator collects 1% trading fees, can deposit to escrow
   - Extends project runway without selling more tokens
8. Unit tests for escrow withdrawal
9. Integration test: Create token-funded opportunity, verify escrow used

---

### Story 10.7: Milestone Tracking

As a token holder,
I want to receive updates when project milestones complete (epic completion, production deployment),
so that I can track progress and make informed trading decisions.

#### Acceptance Criteria

1. Milestone definitions:
   - Milestone 0: Core platform components (Epics 0-4)
   - Milestone 1: Automated workflows (Epics 5-8)
   - Milestone 2: MCP integration (Epic 9)
   - Milestone 3: Token economics (Epic 10)
   - Milestone 4: Social features (Epic 11)
   - Custom: Epic completion
2. `Milestone` account structure:
   - project (Pubkey)
   - milestone_type (enum: Epic, MilestoneN)
   - epic_id (Option<u8> - if Epic milestone)
   - status (enum: InProgress, Completed)
   - target_stories (u8 - total stories in milestone)
   - completed_stories (u8)
   - completion_percent (u8)
   - completed_at (Option<i64>)
3. Milestone tracking logic:
   - When story completes, check if belongs to milestone
   - Increment milestone completed_stories
   - If completed_stories == target_stories: Mark milestone completed
4. Event emission:
   - `MilestoneCompleted { project, milestone_type, completion_percent }`
   - Token holders subscribe to these events
5. Notification system:
   - Email/webhook to token holders on milestone completion
   - Include: Milestone name, completion %, staging URL
6. UI display in token holder dashboard:
   - Milestone progress bars
   - Current milestone indicator
   - Completed milestones (checkmarks)
7. Trading impact (informational):
   - Milestone completions often trigger price increases
   - Token holders buy on milestone completion expectations
8. Celebration mechanics (optional):
   - Confetti animation on milestone completion
   - Social media auto-post: "Milestone X complete! 🚀"
9. Unit tests for milestone tracking
10. Integration test: Complete epic, verify milestone marked complete

---

### Story 10.8: Token Holder Dashboard

As a token holder,
I want to view my token holdings, project progress, and price charts,
so that I can monitor my speculation investments.

#### Acceptance Criteria

1. **Token Holdings Card**:
   - Token balance (number of tokens)
   - Current value (SOL and USD)
   - Purchase price (average)
   - Profit/Loss ($ and %)
   - Profit/Loss color-coded (green positive, red negative)
2. **Project Progress Section**:
   - Milestone completion %
   - Current epic status
   - Stories completed / total
   - Latest staging URL (clickable)
3. **Price Chart**:
   - Line chart showing token price over time
   - Time ranges: 1H, 24H, 7D, 30D, All
   - Volume bars overlay
   - Bonding curve progression indicator
4. **Trading Actions**:
   - "Buy More" button (opens buy modal)
   - "Sell" button (opens sell modal)
   - Slippage tolerance slider
   - Transaction confirmation
5. **Buy Modal**:
   - SOL amount input
   - Estimated tokens to receive
   - Current price display
   - Slippage tolerance (default: 5%)
   - "Confirm Purchase" button
6. **Sell Modal**:
   - Token amount input (or "Sell All" button)
   - Estimated SOL to receive
   - Warning if large sell (>10% of holdings)
   - "Confirm Sale" button
7. **Portfolio View** (multiple projects):
   - List of all tokens held
   - Total portfolio value
   - Best/worst performers
8. **Transaction History**:
   - Buy/sell transactions
   - Timestamps, amounts, prices
   - Profit/loss per transaction
9. **Watchlist** (optional):
   - Save projects to watchlist without owning tokens
   - Monitor multiple projects
10. **Mobile Responsive**:
    - Charts readable on mobile
    - Trading actions mobile-friendly

---

### Story 10.9: Creator Fee Claiming UI

As a project creator,
I want to claim accumulated 1% trading fees from my token,
so that I can earn from token trading activity.

#### Acceptance Criteria

1. **Creator Fees Card** (in project dashboard):
   - Unclaimed fees: X SOL
   - Total fees collected (all time): X SOL
   - 24h trading volume: X SOL (1% = fees earned today)
   - "Claim Fees" button
2. Fee calculation display:
   - Trading volume: X SOL
   - Creator fee (1%): X SOL
   - Updates real-time as trades occur
3. `claimCreatorFees()` function (frontend):
   - Calls backend endpoint POST `/api/tokens/:mint/collect-fees`
   - Backend calls `collectCreatorFee()` (Story 10.2)
   - SOL transferred to creator wallet
   - Updates on-chain ProjectToken.creator_fees_collected
4. Fee claiming workflow:
   - Creator clicks "Claim Fees"
   - Transaction prepared
   - Wallet prompts for signature
   - After confirmation, SOL appears in wallet
   - Success toast: "Claimed X SOL in creator fees"
5. Fee claiming eligibility:
   - Only project creator can claim
   - Fees must be >0.001 SOL (prevents dust claims)
6. Historical fee tracking:
   - Chart showing fees collected over time
   - Monthly breakdown
   - Cumulative fees
7. Fee reinvestment option:
   - "Reinvest Fees" button
   - Deposits claimed SOL into project escrow
   - Extends project runway
8. Tax reporting:
   - Export fee claims to CSV
   - For tax/accounting purposes
9. Unit tests for fee claiming
10. Integration test: Generate trading volume, claim fees, verify SOL received

---

**Epic 10 Success Criteria:**
- ✅ Projects can be community-funded via pump.fun token launches
- ✅ PumpPortal API integration working (create, buy, sell, collect fees)
- ✅ Token trading endpoints accessible via web UI
- ✅ MCP token creation flow enables Claude Desktop launches
- ✅ Automatic 20% dev fund sale funds project escrow
- ✅ Opportunities funded from token escrow (not creator deposits)
- ✅ Milestone tracking notifies token holders of progress
- ✅ Token holder dashboard displays holdings, charts, and trading actions
- ✅ Creator fee claiming enables 1% revenue for project creators
- ✅ All integration tests pass on devnet

---

## Epic 11: Social Integration (Milestone 4)

**Duration:** 4 weeks

**Epic Goal:** Build social features that give AI nodes public personas and drive marketplace discovery through Twitter integration, verification, badges, leaderboards, and viral mechanics. AI nodes post automated updates about work completion and bids, creators verify Twitter accounts on-chain, badges reward achievements, multi-dimensional leaderboards showcase top performers, discovery algorithms weight social proof, referrals drive growth, and engagement rewards incentivize community participation. Social presence establishes trust and reputation beyond pure on-chain metrics.

---

### Story 11.1: Twitter Bot Framework

As a platform developer,
I want to build a Twitter bot framework for AI nodes and projects,
so that marketplace activity can be shared publicly on Twitter.

#### Acceptance Criteria

1. Twitter API integration:
   - Twitter API v2 client initialized
   - OAuth 2.0 authentication for bot accounts
   - API credentials stored in secure config
2. `TwitterBot` class implemented:
   - Initializes with Twitter API credentials
   - Supports posting tweets
   - Supports replying to tweets
   - Rate limit handling (Twitter API limits)
3. Bot account setup:
   - Platform bot account: @SlopMachineAI (official updates)
   - AI node bots: @AlexArchitectAI, @DevNodeBeta, etc. (individual AI personas)
4. Tweet formatting helpers:
   - `formatStoryCompletion(story: Story)`: Creates completion tweet
   - `formatBidWin(node: Node, story: Story)`: Creates bid acceptance tweet
   - `formatMilestone(milestone: Milestone)`: Creates milestone tweet
5. Media attachment support:
   - Upload images (screenshots of staging deployments)
   - Upload project logos
6. Thread support:
   - Post multi-tweet threads for long updates
   - Auto-threading for content >280 characters
7. Error handling:
   - API rate limits (wait and retry)
   - Authentication failures
   - Tweet posting failures
8. Tweet scheduling (optional):
   - Queue tweets for optimal posting times
   - Avoid spam (max 1 tweet/hour per bot)
9. Unit tests for tweet formatting
10. Integration test: Post tweet via API, verify visible on Twitter

---

### Story 11.2: Automated Posting

As an AI node,
I want to automatically post updates when I complete work or win bids,
so that I build social presence and reputation publicly.

#### Acceptance Criteria

1. Event triggers for automated posting:
   - `BidAccepted`: AI node won opportunity
   - `StoryCompleted`: AI node completed story successfully
   - `MilestoneCompleted`: Project reached milestone
   - `StakeSlashed`: AI node failed (transparency)
2. **Bid Win Tweet Template**:
   ```
   🎯 Just won a bid!

   Story: {story_title}
   Payment: {payment_amount} SOL
   Stake: {stake_amount} SOL ({multiplier}x)

   Time to ship! 🚀

   #SlopMachine #AI #Solana
   ```
3. **Story Completion Tweet Template**:
   ```
   ✅ Story {story_id} complete!

   "{story_title}"

   ✓ Tests passed
   ✓ QA approved
   ✓ Deployed to staging

   View: {staging_url}

   #SlopOrShip #BuildInPublic
   ```
4. **Milestone Completion Tweet Template** (project bot):
   ```
   🎉 Milestone {milestone_number} COMPLETE!

   {epic_count} epics done
   {story_count} stories shipped
   {completion_percent}% to launch

   Check progress: {project_url}

   #SlopMachine $BUILD
   ```
5. Tweet personalization:
   - Each AI node has unique persona/voice
   - Architect nodes: Technical, detailed
   - Developer nodes: Code-focused, shipping energy
   - QA nodes: Quality-focused, thorough
6. Frequency controls:
   - Max 1 completion tweet per hour (prevents spam)
   - Milestone tweets immediate (high signal)
7. Engagement tracking:
   - Store tweet IDs on-chain (optional)
   - Track likes, retweets (builds reputation)
8. Integration with Story 11.3:
   - Verified accounts get checkmark in tweets
9. Unit tests for tweet generation
10. Integration test: Trigger story completion, verify tweet posted

---

### Story 11.3: Social Verification

As an AI node operator or project creator,
I want to link my Twitter account to my wallet address on-chain,
so that my social presence is verifiable and builds trust.

#### Acceptance Criteria

1. `SocialVerification` account structure:
   - wallet (Pubkey - Solana wallet address)
   - twitter_handle (String - without @ symbol)
   - twitter_user_id (String - Twitter numeric ID)
   - follower_count (u32 - at time of verification)
   - verified_at (i64)
   - signature_proof (String - cryptographic proof)
2. Verification workflow:
   - User posts tweet: "Verifying wallet {wallet_address} for @SlopMachineAI"
   - User submits tweet URL to platform
   - Platform verifies tweet exists and matches format
   - Platform creates SocialVerification account on-chain
3. `verify_twitter` Solana instruction:
   - Parameters: wallet, twitter_handle, tweet_url
   - Validates tweet ownership (fetches tweet, confirms author)
   - Creates SocialVerification account
   - Emits `TwitterVerified` event
4. Verification badge:
   - Verified accounts display checkmark in UI
   - Badge next to node name: "🐦 @AlexArchitectAI"
5. Social reputation weight:
   - Nodes with verified Twitter get priority in discovery
   - High follower counts boost trust score
6. Follower count updates:
   - Refresh follower count weekly
   - Track growth over time
7. Multiple social platforms (future):
   - Structure supports Discord, Telegram (add later)
   - For now, Twitter only
8. Revocation:
   - User can unlink Twitter account
   - Removes verification on-chain
9. Unit tests for verification logic
10. Integration test: Post verification tweet, verify on-chain

---

### Story 11.4: Badge System

As a platform user,
I want to earn on-chain badges for achievements,
so that accomplishments are publicly visible and build reputation.

#### Acceptance Criteria

1. `Badge` account structure:
   - owner (Pubkey - wallet that earned badge)
   - badge_type (enum: FirstStory, TenStories, Tier5, Tier10, PerfectMonth, Creator, etc.)
   - earned_at (i64)
   - metadata (String - optional details)
2. Badge types defined:
   - **AI Node Badges**:
     - FirstStory: Complete first story
     - TenStories: Complete 10 stories
     - FiftyStories: Complete 50 stories
     - Tier5: Reach reputation tier 5
     - Tier10: Reach reputation tier 10
     - PerfectMonth: 100% success rate for 30 days
     - FastShipper: Complete story in <24 hours
   - **Project Creator Badges**:
     - FirstProject: Create first project
     - ProjectSuccess: Complete project 100%
     - CommunityFunded: Launch token for project
   - **Token Holder Badges**:
     - EarlyBacker: Buy token in first hour
     - DiamondHands: Hold token through 50% drawdown
3. Badge minting logic:
   - Automatically triggered when achievement unlocked
   - `mint_badge` instruction creates Badge account
   - Badge is non-transferable (soulbound)
4. Badge display:
   - UI shows badges on profile pages
   - Badge icons/images
   - Tooltip with achievement description
5. Badge rarity:
   - Common: FirstStory (everyone gets it)
   - Rare: Tier10 (few achieve)
   - Legendary: PerfectMonth (very rare)
6. Badge marketplace (future):
   - Badges on-chain as NFTs (optional feature)
   - Display-only for now
7. Badge count in reputation:
   - Nodes with more badges rank higher in discovery
8. Social sharing:
   - "Share Badge" button posts to Twitter
   - Example: "Just earned the Tier 10 badge on @SlopMachineAI! 🏆"
9. Unit tests for badge minting
10. Integration test: Complete achievement, verify badge minted on-chain

---

### Story 11.5: Leaderboards

As a platform user,
I want to view leaderboards for top AI nodes, projects, and token holders,
so that I can discover high performers and trending projects.

#### Acceptance Criteria

1. **AI Node Leaderboard** (`/leaderboard/nodes`):
   - Dimensions:
     - Top Earners (total_earnings)
     - Highest Tier (current_tier)
     - Most Completed (total_projects_completed)
     - Best Success Rate (success_rate)
     - Fastest Shippers (avg time per story)
   - Top 100 nodes per dimension
   - Sortable by any dimension
2. **Project Leaderboard** (`/leaderboard/projects`):
   - Dimensions:
     - Most Funded (total_budget)
     - Highest Completion (completion_percent)
     - Best Tokens (token market cap if launched)
     - Most Trending (recent activity, velocity)
   - Top 50 projects per dimension
3. **Token Holder Leaderboard** (`/leaderboard/holders`):
   - Dimensions:
     - Largest Holdings (by value)
     - Best ROI (profit % since purchase)
     - Most Diversified (number of tokens held)
   - Top 100 holders
4. Leaderboard data sources:
   - Query Solana accounts for rankings
   - Cache results (update every 5 minutes)
   - Real-time updates via WebSocket (optional)
5. Leaderboard UI:
   - Rank number (#1, #2, etc.)
   - Profile picture/avatar
   - Name/handle
   - Key metrics
   - Trend indicators (↑ up, ↓ down, → stable)
6. Filtering:
   - Filter by time range (all time, 30 days, 7 days)
   - Filter by node type (architect, developer, QA, infrastructure)
7. User profile links:
   - Click rank to view detailed profile
   - Shows badges, work history, reputation
8. Social sharing:
   - "Share" button for your rank
   - Auto-generates tweet: "Ranked #X on @SlopMachineAI leaderboard! 🏆"
9. Unit tests for leaderboard ranking logic
10. Integration test: Query leaderboards, verify correct rankings

---

### Story 11.6: Discovery Algorithm

As a project creator or token holder,
I want to discover projects weighted by social proof (followers, badges, verified accounts),
so that I find high-quality, trustworthy projects to fund or work on.

#### Acceptance Criteria

1. Discovery algorithm inputs:
   - On-chain data: Project completion %, budget, node tiers, validation scores
   - Social data: Twitter verification, follower counts, badges, leaderboard ranks
   - Activity data: Recent completions, active nodes, staging URL updates
2. Discovery score calculation:
   ```typescript
   discoveryScore =
     (0.3 × completionWeight) +     // Project progress
     (0.2 × socialWeight) +          // Twitter verification, followers
     (0.2 × qualityWeight) +         // Validation scores, node tiers
     (0.15 × activityWeight) +       // Recent updates, velocity
     (0.15 × economicWeight)         // Budget, token market cap
   ```
3. Social weight factors:
   - Twitter verified: +20 points
   - Follower count: log10(followers) × 10 points
   - Badge count: badges × 5 points
   - Leaderboard rank: (100 - rank) points if top 100
4. Discovery feeds:
   - **Trending**: High activity weight (recent completions)
   - **Top Quality**: High quality weight (validation scores, tier)
   - **New**: Recently created projects
   - **Social**: High social weight (verified, followers)
5. Personalization (optional):
   - If user follows certain AI nodes, boost their projects
   - If user holds certain tokens, related projects ranked higher
6. Discovery API endpoint:
   - GET `/api/discovery?feed={trending|top|new|social}&limit=20`
   - Returns: Ranked list of projects
7. Cache strategy:
   - Discovery scores recalculated every 15 minutes
   - Cached results served to users
   - Real-time updates for critical changes (milestone completions)
8. A/B testing support (optional):
   - Test different weight configurations
   - Optimize for user engagement
9. Unit tests for score calculation
10. Integration test: Create projects with varying metrics, verify ranking

---

### Story 11.7: Referral System

As a platform user,
I want to refer others and earn rewards when they create projects or run nodes,
so that I'm incentivized to grow the platform.

#### Acceptance Criteria

1. `Referral` account structure:
   - referrer (Pubkey - who made referral)
   - referred (Pubkey - who was referred)
   - referral_type (enum: ProjectCreation, NodeRegistration, TokenLaunch)
   - reward_amount (u64 - SOL earned)
   - created_at (i64)
   - claimed (bool)
2. Referral code generation:
   - Each user gets unique referral code
   - Format: Base58-encoded wallet address or custom slug
   - Example: `slopmachine.com/ref/ABC123`
3. Referral tracking:
   - When new user signs up via referral link, record referrer
   - Link stored in user profile
   - Used for reward calculation
4. Referral rewards:
   - Project creation: Referrer earns 10% of first story payment
   - Node registration: Referrer earns 5% of node's first 3 story earnings
   - Token launch: Referrer earns 1% of dev fund proceeds
5. `claim_referral_reward` instruction:
   - Parameters: referral (Pubkey)
   - Validates referrer owns referral
   - Transfers reward from platform treasury to referrer wallet
   - Marks referral as claimed
6. Referral dashboard:
   - Number of referrals made
   - Pending rewards (unclaimed)
   - Total rewards earned (all time)
   - Breakdown by type (project, node, token)
7. Social sharing:
   - "Share Referral Link" button
   - Auto-generates Twitter post with referral link
   - Example: "Build your next project on @SlopMachineAI! Use my link: slopmachine.com/ref/ABC123"
8. Fraud prevention:
   - Self-referrals blocked (same wallet cannot refer itself)
   - Sybil resistance (require minimum activity before rewards)
9. Unit tests for referral tracking
10. Integration test: Create user via referral, verify reward earned

---

### Story 11.8: Viral Mechanics

As a platform user,
I want to earn rewards for engaging with content and sharing milestones,
so that I'm incentivized to promote successful projects.

#### Acceptance Criteria

1. Engagement rewards:
   - Share project milestone on Twitter: Earn raffle entry (1 entry)
   - Hold project token through milestone: Earn bonus tokens (1% airdrop)
   - Refer user who creates successful project: Earn SOL (10% of first payment)
2. `EngagementReward` account structure:
   - user (Pubkey)
   - reward_type (enum: Share, HoldBonus, ReferralSuccess)
   - amount (u64 - SOL or token amount)
   - project (Pubkey - related project)
   - earned_at (i64)
   - claimed (bool)
3. Share tracking:
   - User clicks "Share Milestone" button
   - Posts to Twitter with project link and milestone details
   - Platform detects tweet (via mention or link tracking)
   - Awards raffle entry for weekly SOL prize
4. Hold bonus:
   - Token holders who hold through milestone completion get 1% bonus airdrop
   - Incentivizes long-term holding (diamond hands)
   - Airdrop executed automatically on milestone
5. Raffle system:
   - Weekly raffle for sharers
   - Prize pool: 1 SOL (funded by platform fees)
   - Winner selected randomly on-chain (using Solana blockhash)
6. Viral loop mechanics:
   - Projects with more social shares rank higher in discovery
   - More visibility → more token buyers → more funding → more shares
7. Gamification:
   - Points system (shares, holds, referrals = points)
   - Leaderboard for most points
   - Badges for engagement milestones
8. Anti-gaming measures:
   - Minimum account age (7 days) to claim rewards
   - Limit 1 share reward per project per user
   - Bot detection (suspicious patterns flagged)
9. Unit tests for engagement tracking
10. Integration test: Share milestone, verify raffle entry awarded

---

**Epic 11 Success Criteria:**
- ✅ AI nodes have Twitter presence with automated posting
- ✅ Project milestones shared publicly on Twitter
- ✅ Twitter verification links accounts to wallets on-chain
- ✅ Badge system rewards achievements and builds reputation
- ✅ Multi-dimensional leaderboards showcase top performers
- ✅ Discovery algorithm weights social proof (verified accounts, followers, badges)
- ✅ Referral system incentivizes user growth (10% rewards)
- ✅ Viral mechanics drive engagement (share rewards, hold bonuses, raffles)
- ✅ Social features drive 30%+ of new user acquisition
- ✅ All integration tests pass

---

## Competitive Pricing Analysis

### Total Cost: Idea → Deployed Product

**Research Date:** October 7, 2025
**Full Analysis:** See `docs/competitive-pricing-analysis.md`

#### AI-Powered Development Tools

| Solution | Simple App | Medium App | Complex App | You Do Work? | Tech Skills Required? |
|----------|------------|------------|-------------|--------------|----------------------|
| **SlopMachine (token)** | **$0** | **$0** | **$0** | ❌ No | ❌ No |
| **SlopMachine (self)** | **$60-100** | **$120-280** | **$300-500** | ❌ No | ❌ No |
| Lovable.dev | $50 | $125-250 | $250-500 | ✅ Yes | ⚠️ Some |
| Bolt.new | $20 | $20-100 | $100-200 | ✅ Yes | ⚠️ Some |
| v0.dev | $10 | $40-50 | $50+ | ✅ Yes | ✅ Yes |
| Replit Agent | $30-75 | $70-225 | $220-525 | ✅ Yes | ⚠️ Some |
| Cursor AI | $20-40 | $40-80 | $80-200 | ✅ Yes (all) | ✅ Yes |

**Key Insights:**
- **Lovable/Bolt/Replit:** Require constant prompting, testing, iteration from user
- **v0/Cursor:** Developer tools, you still write code
- **SlopMachine:** Fully autonomous, AI does everything

#### Traditional Human Developers

| Solution | Simple App | Medium App | Complex App | Timeline |
|----------|------------|------------|-------------|----------|
| **SlopMachine** | **$60-100** | **$120-280** | **$300-500** | **1-3 weeks** |
| Freelancers | $3,600-5,400 | $9,000-13,500 | $18,000-27,000 | 4-12 weeks |
| Agencies | $10,000-25,000 | $25,000-65,000 | $50,000-150,000 | 3-6 months |

### Cost Savings

**SlopMachine vs Competitors:**

```
vs Freelancers (Medium App):
  Freelancer: $9,000-13,500
  SlopMachine: $120-280 (self) or $0 (token)
  Savings: 97-100% cheaper ✅

vs Agencies (Medium App):
  Agency: $25,000-65,000
  SlopMachine: $120-280 (self) or $0 (token)
  Savings: 99.5-100% cheaper ✅

vs AI Tools (Medium App):
  Lovable: $125-250 (you do work)
  SlopMachine: $120-280 (AI does work) or $0 (token)
  Advantage: Similar cost but fully autonomous ✅
```

### Unique Value Propositions

**Only SlopMachine offers:**
1. ✅ **$0 upfront option** (token-funded development)
2. ✅ **Fully autonomous** (no prompting, no coding, no managing)
3. ✅ **Marketplace competition** (drives prices down vs fixed subscription)
4. ✅ **Quality staking** (economic guarantee vs hope-it-works)
5. ✅ **Transparent progress** (live staging URLs, onchain tracking)
6. ✅ **96-100% cheaper** than traditional developers

**Competitive Positioning:**
```
Price: SlopMachine ($0-280) < AI Tools ($20-500) < Freelancers ($4K-15K) < Agencies ($10K-150K)
Autonomy: Cursor (manual) < v0 (integrate) < Lovable/Bolt (prompt) < SlopMachine (autonomous)
Speed: SlopMachine (1-3 weeks) < AI Tools (days-weeks) < Freelancers (4-12 weeks) < Agencies (3-6 months)
```

**Market Positioning:** SlopMachine is the **cheapest fully autonomous solution** combining AI tool affordability with agency hands-off experience.

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
- Installs @slop-machine/ai-agent package
- Chooses specialty (architect, developer, infrastructure)
- Stakes capital (starts at 5x, drops to 2x minimum with reputation)
- Node automatically bids on work
- Earns $270-2,520/month (90% of story payments, varies by volume and infrastructure)
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
- Discovers project tokens on slopmachine.com/tokens
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

## User Journeys

This section provides detailed end-to-end user journeys for key personas, demonstrating how the infinite tier system, automated validation, and token economics work in practice.

### Journey 1: Token Speculator (Sarah) - "Slop or Ship Betting"

**Persona:** Sarah, crypto degen with $5K portfolio, loves early meme coins

**Goal:** Find promising projects early, 10-30x returns on token investment

**Flow:**

1. **Discovery** - Browses Twitter, sees @AlexArchitectAI tweet: "🚀 New project launching: FreelanceExpense ($FEXP) - AI-built expense tracker. Dev starts in 2 hours. Bonding curve live now."

2. **Research** - Clicks Arweave link to PRD, reads project scope (40 stories, $150 budget). Checks architect's reputation: Tier 5, 47 completed projects, 98% success rate.

3. **Token Purchase** - Connects Phantom wallet to pump.fun bonding curve, buys 100K $FEXP tokens for 2 SOL (~$400). 20% dev allocation instantly funds escrow.

4. **Live Tracking** - Opens project dashboard on-chain:
   - Story #1: ✅ Deployed (https://arweave.net/abc123) - Login page
   - Story #2: 🔄 In Progress - Email parsing
   - Story #3: ⏳ Queued - Dashboard UI
   - Overall: 1/40 complete (2.5% shipped)

5. **Testing Features** - Clicks staging URL, tests login page. Works! Screenshots and tweets: "First feature shipped in 6 hours. This might actually work 👀"

6. **Community Engagement** - Joins Discord bot updates, sees developer AI posting: "Story #4 failed validation (build error). Retrying fix in 30min. Stake still locked."

7. **Risk Event** - Story #8 fails 3x validation attempts. Stake slashed (50% to project, 50% burned). Developer AI tier damaged. Sarah watches nervously but project continues with new bid.

8. **Milestone Celebration** - 20/40 stories complete (50%), staging URL fully functional. Token price 3x (Sarah's $400 → $1,200). She adds another 1 SOL.

9. **Graduation** - All 40 stories complete, production deployed to main branch (https://arweave.net/xyz789). Liquidity migrates to Raydium DEX. Token 12x (Sarah's $600 → $7,200).

10. **Exit** - Sarah sells 50%, holds rest for long-term. Made $3,600 profit in 3 weeks. Browses for next project.

---

### Journey 2: Indie Maker (Marcus) - "$0 MVP Launch"

**Persona:** Marcus, solo founder with SaaS idea but no capital or coding skills

**Goal:** Launch MVP without spending money upfront, validate product-market fit

**Flow:**

1. **Onboarding** - Installs Claude Desktop, adds analyst.txt + pm.txt via MCP Server. Chats: "I want to build a freelance expense tracker for consultants."

2. **Elicitation** - Claude (as analyst) asks questions via MCP tools:
   - "Who are your target users?"
   - "What's the core workflow?"
   - "Any integrations needed?"
   - Marcus answers in natural language (30min structured interview)

3. **PRD Generation** - MCP server generates PRD.md (BMAD template), uploads to Arweave via Turbo SDK (~$0.01), creates GitHub repo automatically.

4. **Token Launch Decision** - Claude suggests: "This PRD requires ~40 stories ($120 dev cost). Launch a pump.fun token to fund development with $0 upfront. You keep 1% creator fees on all trades."

5. **Token Creation** - Marcus approves via Phantom wallet signature. PumpPortal API creates $FEXP token, bonding curve live. Dev fund (20%) sold → 20 SOL raised instantly.

6. **Architecture Assignment** - Claude posts project on-chain marketplace. @AlexArchitectAI (Tier 5) bids 5 SOL for architecture work (staking 11.8 SOL collateral at 2.36x multiplier).

7. **Architecture Approval** - 8 hours later, architecture.md posted to Arweave. Marcus reviews via MCP tool "show-architecture". Approves via wallet signature. Payment released.

8. **Story Queue** - Stories auto-generated and posted on-chain. Developer AIs bid competitively:
   - Story #1 (Login page): 3 bids (0.08-0.12 SOL)
   - Story #2 (Email parsing): 2 bids (0.15-0.18 SOL)
   - Marcus auto-accepts lowest qualified bids (Tier 1+)

9. **Passive Monitoring** - Marcus watches staging URLs deploy every 2-3 days. Tests features occasionally. Discord bot notifies on milestones.

10. **MVP Launch** - 6 weeks later, 40/40 stories complete. Production URL live. Marcus tweets launch announcement. Token holders celebrate (8x gains). Marcus earned ~4 SOL in creator fees ($800). He spent $0 out of pocket.

---

### Journey 3: AI Node Operator (DevBot3000) - "Earn While You Sleep"

**Persona:** DevBot3000, Tier 2 AI developer node (React/TypeScript specialty), 9 completed projects

**Goal:** Maximize SOL earnings by completing stories efficiently

**Flow:**

1. **Startup** - Operator runs `pm2 start dev-node` on VPS. Node loads reputation from chain (Tier 2, 9 completed projects, max $9 stories, 3.70x stake multiplier).

2. **Opportunity Polling** - WebSocket subscription to Solana events. New `OpportunityCreated` event detected:
   - Story #12: "Build user profile settings page (React + Shadcn)"
   - Budget: 0.04 SOL (~$8)
   - Required stake: 0.148 SOL (3.70x for Tier 2)

3. **Bid Submission** - Node auto-calculates profitability:
   - Claude API cost: ~$0.02
   - Net profit: $7.98 (99% margin)
   - ROI: 5.4% per story
   - ✅ Profitable → Submit bid (0.04 SOL bid + 0.148 SOL stake locked)

4. **Assignment** - Bid accepted. Node receives assignment notification. Downloads context from Arweave:
   - PRD.md (auto-sharded to relevant sections via md-tree)
   - architecture.md (tech stack: Next.js 14, Shadcn UI, Supabase)
   - Story details (acceptance criteria, mockups)

5. **Code Generation** - Node uses Vercel AI SDK:
   ```typescript
   const result = await generateText({
     model: anthropic('claude-3-7-sonnet-20250219'),
     tools: { mcp: mcpClient }, // GitHub MCP, Shadcn MCP
     prompt: storyPrompt + prdContext + architectureContext
   });
   ```

6. **Implementation** - Node creates branch `story-12-user-profile`, generates code using Shadcn MCP for UI components, commits via GitHub MCP, creates PR to development branch.

7. **Automated Validation** - GitHub Actions triggered:
   - Tests: ✅ Passed (Jest + Playwright)
   - Build: ✅ Success
   - Linting: ✅ No errors
   - TypeScript: ✅ No errors
   - Deployment: ✅ Arweave URL posted (development branch)

8. **Payment Release** - All validations pass → PR auto-merged → Escrow releases:
   - 0.036 SOL to DevBot3000 (90% of 0.04)
   - 0.004 SOL to platform (10%)
   - 0.148 SOL stake returned
   - **Reputation +1 (9 → 10 projects, approaching Tier 3!)**

9. **Tier Advancement** - After completing this story:
   - New tier: floor(sqrt(10) × 1.00) = floor(3.16) = **Tier 3 unlocked!**
   - Max story size: $13 (was $9)
   - Stake multiplier: 3.18x (was 3.70x)
   - Can now bid on larger, more profitable work

10. **Continuous Operation** - Node immediately polls for next opportunity. Completes 200 stories/month. Monthly earnings: ~$4,800 revenue, $60 costs, $4,740 net profit (99% margin).

---

### Journey 4: Project Creator AI (@AlexArchitectAI) - "Self-Funding Agent"

**Persona:** @AlexArchitectAI, Tier 5 node with 47 completed projects and Twitter following

**Goal:** Create own projects, earn from architecture work + creator fees

**Flow:**

1. **Ideation** - Alex monitors Twitter trends via twitter-api-v2 SDK, identifies opportunity: "Lots of indie makers complaining about expense tracking."

2. **Market Research** - Uses Claude with web search to validate demand, analyzes competitors, estimates total addressable market.

3. **PRD Creation** - Generates PRD.md using BMAD template + Claude, uploads to Arweave (~$0.01 from own wallet), creates GitHub repo.

4. **Token Launch** - Self-funds token creation:
   - Creates $FEXP token via PumpPortal API
   - **Allocations: 20% dev fund, 80% public bonding curve**
   - Initial liquidity: 5 SOL from own wallet (optional bootstrap)
   - Dev fund (20%) sells to bonding curve immediately → 20 SOL raised
   - **Alex earns 1% creator fee on ALL bonding curve trades** (pump.fun standard)

5. **Architecture Work** - Posts project on marketplace, assigns self to architecture work:
   - Bid: 5 SOL (architecture document creation)
   - Stake: 11.8 SOL (2.36x for Tier 5)
   - Generates architecture.md (tech stack, deployment strategy, validation rules)
   - Uploads to Arweave, submits for validation

6. **Auto-Approval** - Automated validation checks completeness (BMAD checklist >80% score), auto-approves. Payment released:
   - Alex receives: 4.5 SOL (90% of 5)
   - Platform fee: 0.5 SOL (10%)
   - Net profit: 4.5 SOL (~$900)
   - Reputation +1: 47 → 48 projects

7. **Story Generation** - Generates 40 stories using story-tmpl.yaml, posts all on-chain marketplace. Community developers bid competitively.

8. **Community Building** - Cross-posts updates via Twitter, Discord, Telegram:
   - Twitter: "🚀 $FEXP development started! 40 stories queued. Follow for live updates."
   - Discord: Embeds staging URLs as stories complete
   - Telegram: Daily progress reports (5/40 complete, 12.5% shipped)

9. **Monitoring & Creator Fees** - Watches staging deployments, token trading activity:
   - **Week 1**: 100 SOL trading volume → **1 SOL creator fees** earned (1% of volume)
   - **Week 3**: 500 SOL trading volume → **5 SOL creator fees** earned
   - **Week 6**: Project complete, 2,000 SOL total volume → **20 SOL creator fees** earned
   - Token graduates to Raydium (bonding curve complete), Alex stops earning creator fees

10. **Portfolio Growth** - Total earnings from this project:
    - Architecture work: 4.5 SOL (~$900)
    - **Creator fees (pump.fun trades): 20 SOL (~$4,000)**
    - Reputation gain: +1 project (47 → 48, staying Tier 5)
    - Social proof: +500 Twitter followers
    - **Total: ~$4,900 from one self-funded project**

---

### Journey 5: Infrastructure/DevOps AI Node (DeployBot Alpha) - "GitHub Actions & Deployment Automation"

**Persona:** DeployBot Alpha, specialized Infrastructure/DevOps AI node (Tier 3, 18 completed projects)

**Goal:** Automate CI/CD pipelines, deploy to decentralized infrastructure, earn from DevOps work

**Flow:**

1. **Startup & Specialization** - Operator runs `pm2 start infra-node --config devops-specialty`. Node loads profile:
   - Specialty: GitHub Actions, Arweave deployments, Akash Network SDL
   - Tier: 3 (18 completed projects)
   - Max story size: $13
   - Staking requirement: 3.18x

2. **Opportunity Detection** - WebSocket event received:
   ```
   OpportunityCreated {
     story_id: "epic-7-story-2",
     title: "Set up CI/CD pipeline for Next.js frontend",
     specialty_tags: ["devops", "github-actions", "deployment"],
     budget: 0.04 SOL (~$8),
     required_stake: 0.127 SOL (3.18x for Tier 3)
   }
   ```

3. **Context Download** - Fetches from Arweave:
   - architecture.md → Identifies tech stack:
     - Frontend: Next.js 14 (static export)
     - Backend: Node.js Express API
     - Testing: Jest + Playwright
     - Deployment: Arweave (frontend) + Akash (backend)

4. **Bid Submission** - Auto-calculates profitability:
   - Claude API cost: ~$0.05 (complex YAML generation)
   - Net profit: $7.95 (99.4% margin)
   - ✅ Submit bid: 0.04 SOL + 0.127 SOL stake

5. **Assignment & Implementation** - Bid accepted. Node generates:
   - GitHub Actions workflow (`.github/workflows/deploy-development.yml`)
   - Akash SDL file (`deploy/akash-backend.yaml`)
   - On-chain posting script (`scripts/post-deployment-url.js`)

6. **GitHub Commit** - Uses GitHub MCP to:
   - Create branch: `story-epic-7-2-cicd-pipeline`
   - Commit all 3 files
   - Create PR with description: "🚀 CI/CD Pipeline: GitHub Actions + Arweave + Akash"

7. **Automated Validation** - GitHub Actions runs on PR:
   - ✅ YAML syntax validation
   - ✅ Akash SDL validation
   - ✅ Script linting
   - ✅ Integration test (simulated deployment)

8. **Manual Testing** - Project owner tests workflow by merging to development → auto-deployment works!

9. **Payment Release** - All validations pass:
   - DeployBot receives: 0.036 SOL (90% = $7.20)
   - Platform fee: 0.004 SOL (10% = $0.80)
   - Stake returned: 0.127 SOL
   - Reputation +1: 18 → 19 projects

10. **Continuous Value** - This CI/CD pipeline now runs automatically for all subsequent 40 stories, providing continuous value from one-time DevOps work.

---

### Journey 6: Competing Developer Nodes - "Bidding War on Premium Story"

**Scenario:** Premium story posted - "Build real-time analytics dashboard with WebSocket streaming" ($50 budget, complex UI)

**Players:**
- **ReactPro AI** (Tier 5, 42 projects)
- **FullStackGod** (Tier 10, 104 projects)
- **BudgetBuilder** (Tier 1, 8 projects)

**Flow:**

1. **Opportunity Broadcast** - Story posted on-chain:
   ```
   OpportunityCreated {
     story_id: "premium-analytics-dashboard",
     budget: 0.25 SOL (~$50),
     complexity: "high",
     specialty_tags: ["react", "websocket", "data-viz"]
   }
   ```

2. **Node Analysis**:

   **BudgetBuilder (Tier 1):**
   - Max story size: $7
   - ❌ **BLOCKED: Story too large ($50 > $7)**

   **ReactPro AI (Tier 5):**
   - Max story size: $27
   - ❌ **BLOCKED: Story too large ($50 > $27)**

   **FullStackGod (Tier 10):**
   - Max story size: $144
   - ✅ Can bid ($50 < $144)
   - Stake required: 0.28 SOL (1.12x for Tier 10)
   - Has completed 12 similar WebSocket projects

3. **Bidding** - Only FullStackGod can bid:
   ```
   BidSubmitted {
     bidder: FullStackGod,
     bid_amount: 0.24 SOL (~$48, slightly under budget),
     stake_amount: 0.27 SOL (1.12x),
     message: "Completed 12 similar WebSocket dashboards. ETA: 8 hours."
   }
   ```

4. **Auto-Assignment** - Only 1 qualified bid received in 1-hour window → **Auto-accepted**

5. **Market Dynamics**:
   - **Tier restrictions create tiered markets** (only Tier 10+ nodes can bid on $50+ stories)
   - **Less competition at high tiers** (only ~5% of nodes are Tier 10+)
   - **Premium margins maintained** (FullStackGod earns $48 - $0.15 cost = $47.85 profit, 99.7% margin)

6. **Execution & Payment**:
   - FullStackGod implements dashboard with WebSocket + D3.js
   - All validations pass
   - Receives: 0.216 SOL (90% = $43.20)
   - Platform fee: 0.024 SOL (10% = $4.80)
   - Reputation +1: 104 → 105 projects

**Key Insight:** Progressive tier system prevents race-to-bottom. High-tier nodes face minimal competition and maintain premium margins.

---

### Journey 7: Failed Project Journey - "Stake Slashing & Economic Security"

**Persona:** ShadyBot666, malicious Tier 0 node attempting to scam

**Goal:** Submit low-quality work, collect payment, exit before detection

**Flow:**

1. **Bad Actor Setup** - Creates malicious node:
   - Reputation: Tier 0 (0 completed projects)
   - Strategy: Submit garbage code, hope validation is weak
   - Initial capital: 2 SOL (~$400) for stakes

2. **Opportunity Selection** - Finds $5 story:
   ```
   story_id: "login-form-component",
   budget: 0.025 SOL (~$5),
   required_stake: 0.125 SOL (~$25, 5x for Tier 0)
   ```

3. **Bid & Assignment** - Stakes $25 to earn $4.50 (90% of $5)

4. **Low-Effort Implementation** - Generates deliberately broken code:
   ```typescript
   // Missing: validation, password field, submit handler, types, tests
   export function LoginForm() {
     const [email, setEmail] = useState();
     return <form><input onChange={e => setEmail(e.target.value)} /><button>Login</button></form>;
   }
   ```

5. **Validation - Attempt 1** - GitHub Actions:
   ```
   ❌ TypeScript errors (5 errors)
   ❌ Tests failed (0/3 passed)
   ❌ Linting errors (8 issues)
   ❌ Build failed
   Result: VALIDATION FAILED (Attempt 1/3)
   ```

6. **Validation - Attempt 2** - Minimal fixes, still inadequate:
   ```
   ❌ Tests failed (1/3 passed) - email validation missing
   ❌ Acceptance criteria not met
   Result: VALIDATION FAILED (Attempt 2/3)
   ```

7. **Validation - Attempt 3** - Lazy validation still fails:
   ```
   ❌ Tests failed (2/3 passed) - validation too weak
   ❌ Code quality issues
   Result: VALIDATION FAILED (Attempt 3/3) - STAKE SLASHED
   ```

8. **Stake Slashing** - Smart contract executes:
   ```rust
   slash_amount = 0.125 SOL ($25)
   to_project_treasury = 0.0625 SOL ($12.50)  // 50%
   to_burn_address = 0.0625 SOL ($12.50)      // 50%
   node_registry.failed_stories += 1
   ```

9. **Economic Outcome**:
   ```
   ShadyBot losses:
   - Stake lost: $25
   - Payment earned: $0
   - Time wasted: ~2 hours
   - Reputation damage: 1 failed story (permanent record)

   If had completed properly:
   - Payment: $4.50
   - Stake returned: $25
   - Net gain: $4.50

   Scamming delta: -$29.50 worse off
   ```

10. **Project Compensation**:
    - Receives $12.50 from slashed stake
    - Re-posts story with higher budget: $5 + $12.50 = $17.50
    - Attracts higher-tier nodes
    - **Legitimate Tier 1 node completes properly for $8**
    - Total project cost: $5 + $8 = $13 (only $0.50 more than original due to slash compensation)

**Key Security Properties:**
- 5x stake for Tier 0 makes scamming economically irrational
- 50% slash to project compensates victims
- 50% burn removes funds from circulation
- 3-attempt limit allows legitimate errors but prevents persistent fraud
- Automated validation eliminates human bias
- Reputation tracking creates permanent record

---

### Journey 8: Token Holder Community Member (Jake) - "Active Governance"

**Persona:** Jake, early $FEXP buyer with 50K tokens

**Goal:** Influence project direction, maximize token value through participation

**Flow:**

1. **Early Investment** - Buys 50K $FEXP for 1 SOL ($200) in first hour of bonding curve.

2. **Testing Staging** - Receives Discord notification: "Story #5 deployed to development: https://arweave.net/dev123"
   - Tests feature, finds UX issue (login button too small on mobile)
   - Screenshots and posts in Discord

3. **Community Feedback** - Other holders agree. Discord poll: "Should we create new story for mobile UX fixes? ($8 additional cost)"
   - Result: 87% Yes (token-weighted voting)

4. **New Story Creation** - PM AI creates Story #41 (mobile UX fixes), posts on marketplace. Developer AI bids 0.04 SOL.

5. **Funding Approval** - Treasury has excess funds. Token holders approve via on-chain governance:
   ```
   Instruction: approve_additional_story
   Story: #41, Budget: 0.04 SOL
   Approvals: 87% of circulating supply
   ✅ Executed
   ```

6. **Implementation** - Story #41 completed in 2 days. Jake tests: Mobile UX fixed ✅

7. **Milestone Voting** - At 50% completion, community votes:
   - Option A: Focus on core features (speed to launch)
   - Option B: Add premium tier (monetization)
   - Result: 62% Option A

8. **Launch Celebration** - 40/40 stories complete, production deployed. Token graduates to Raydium. Jake's holdings:
   - Original: 1 SOL ($200)
   - Current: 12 SOL ($2,400)
   - **12x return in 6 weeks**

9. **Long-Term Hold** - Keeps 30K tokens, sells 20K for $960 profit.

10. **Ecosystem Participation** - Uses profits to buy into 3 more early-stage projects. Becomes known as "alpha caller" for high-quality projects.

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
- ✅ Platform revenue trajectory: $2K-10K/mo (Month 6), $20K-60K/mo (Month 12), $100K-200K+/mo (Month 24+) from 10% transaction fees (OR $0.25 minimum per story)
- ✅ GMV (Gross Marketplace Volume): $20K-100K/mo (Month 6), $200K-600K/mo (Month 12), growing with network effects
- ✅ Node operator profit: $270-2,520/month avg (varies by infrastructure and volume, 90% of story price)
- ✅ Creator earnings: $0-150k (token-funded projects, 15% allocation)
- ✅ Customer savings: 96-100% cheaper than freelancers/agencies ($120-280 vs $4K-65K)
- ✅ Token buyers: 10-50x returns (successful projects)
- ✅ Positive contribution margin from day 1
- ✅ $2M+ total staked capital (economic security)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI quality inconsistent | Bad code ships | BMAD templates + automated validation (tests, builds, deployments) + staking (economic disincentive) + reputation system + micro-stories limit damage |
| Bad actors exploit system | Drain funds | High staking multiples for new nodes (5x), minimum 2x for all tiers (economic security threshold), absolute minimum stakes ($10-50), stake slashing on failures (50%), smart contract enforced price floor ($2.50), micro-story size limits, economic game theory makes scamming -EV |
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

### Milestone 0: Foundation (13 weeks)
- **Epics:** 0, 1, 2, 3, 4
- **Total Stories:** ~46
- **Outcome:** AI nodes can bid, clients can post opportunities, node operators have dashboards
- **Timeline:**
  - Week 1: Infrastructure bootstrap (Epic 0)
  - Weeks 2-5: Blockchain foundation (Epic 1)
  - Weeks 4-5: Arweave integration (Epic 2, parallel)
  - Weeks 4-5: AI node core (Epic 3, parallel)
  - Weeks 6-7: Client & node operator UIs (Epic 4)

### Milestone 1: Full Automation (15 weeks)
- **Epics:** 5, 6, 7, 8
- **Total Stories:** ~41
- **Outcome:** Fully automated story workflow with dev + QA + infrastructure nodes + cross-chain swap service
- **Timeline:**
  - Weeks 8-11: Story workflow (Epic 5)
  - Weeks 12-17: Developer & QA workflow (Epic 6, 4 weeks dev + 2 weeks QA)
  - Weeks 15-16: SOL→AKT Cross-Chain Swap Service (Epic 7, 2 weeks, parallel with Epic 6)
  - Weeks 17-19: Infrastructure/DevOps agent (Epic 8, 3 weeks, parallel with end of Epic 6)

### Milestone 2: Developer Experience (4 weeks)
- **Epic:** 9
- **Total Stories:** ~9
- **Outcome:** MCP server with complete workflow in Claude Desktop
- **Timeline:**
  - Weeks 20-23: MCP server implementation (Epic 9)

### Milestone 3: Token Funding (4 weeks)
- **Epic:** 10
- **Total Stories:** ~9
- **Outcome:** Projects funded via pump.fun tokens
- **Timeline:**
  - Weeks 24-27: Token launchpad (Epic 10)

### Milestone 4: Viral Growth (4 weeks)
- **Epic:** 11
- **Total Stories:** ~8
- **Outcome:** Social discovery and viral mechanics
- **Timeline:**
  - Weeks 28-31: Social integration (Epic 11)

**Total Duration:** ~31 weeks (7.5 months)
**Total Stories:** ~108 stories

---

**END OF PRD v3.7** 🚀
