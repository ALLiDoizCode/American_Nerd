# Slop Machine PRD v3.4 - Fully Autonomous "Slop or Ship"

**Version:** 3.4 (Infinite Tier Progression + User Journeys)
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
- System shall auto-release payment on merge (90% dev, 10% platform OR $0.25 minimum platform fee, whichever is higher)
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
> → Payment releases (0.45 SOL to Alex, 0.05 SOL platform fee = 10%)
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
> → Payment releases ($9.00 to Sarah, $1.00 platform fee = 10%)
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

**Key Principle:** Story 0.0 (Git Setup) creates branching strategy. Story 0.1 (Architecture) defines complete tech stack. Both are foundational for all other stories.

---

#### **Story 0.0: Git Repository & Branch Setup** ⭐ **FOUNDATION - MUST COMPLETE FIRST**

**Why First:** Establishes Git Flow branching strategy for 3-tier deployments (development/staging/production).

**Infrastructure AI Responsibilities:**
- Fork client repository (fork-based workflow for security)
- Create 3 long-lived branches:
  ```
  main (production - protected)
    ↑
  staging (epic integration - protected)
    ↑
  development (story integration - protected)
  ```
- Configure branch protection rules:
  - `main`: Require PR from `staging`, require status checks, no direct pushes
  - `staging`: Require PR from `development`, require status checks
  - `development`: Require PR from feature branches, require status checks
- Create `.gitignore` appropriate for project type
- Initialize README.md with project info
- Set default branch to `development`

**Branch Strategy Documentation:**
```markdown
# Branch Strategy

- **main**: Production deployments only (Arweave permanent URL)
- **staging**: Epic integration testing (Arweave epic URL)
- **development**: Story integration (Arweave story URLs)
- **feature/story-{id}**: Individual story work

## Deployment Flow
Story complete → development → Arweave (dev URL)
Epic complete → staging → Arweave (staging URL)
Project complete → main → Arweave (production URL)
```

**Payment Trigger:**
- Repository forked successfully
- 3 branches created (development, staging, main)
- Branch protection rules configured
- On-chain confirmation of repository setup

---

#### **Story 0.1: Architecture Generation** ⭐ **FOUNDATION - MUST COMPLETE SECOND**

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
✅ Git repository forked with 3-tier branch strategy (development/staging/main)
✅ Branch protection rules configured (PRs required, status checks enforced)
✅ Architecture.md exists on Arweave (defines COMPLETE tech stack)
✅ Test infrastructure matches project type (not one-size-fits-all)
✅ CI/CD runs validation commands from architecture.validation_strategy
✅ Deployment works for all 3 environments:
   - Development: Story merges → development branch → Arweave deployment
   - Staging: Epic complete → staging branch → Arweave deployment
   - Production: Project complete → main branch → Arweave deployment
✅ Deployment URLs use direct Arweave/Akash URLs (e.g., `https://arweave.net/{tx-id}`)
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
- **Story 5.8:** Payment distribution (90% dev, 10% platform OR $0.25 minimum, whichever is higher)
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
- Node recovery: Deployment costs deducted from story payment (90% dev → 89% dev, 1% infrastructure)

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
- **Story 8.8:** Deploy remote MCP (slopmachine.com/mcp)
- **Story 8.9:** Publish npm package (@slop-machine/mcp-server)

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
