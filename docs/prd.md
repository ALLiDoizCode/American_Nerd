# American Nerd Marketplace PRD v2.0 - Blockchain-Native

**Version:** 2.0 (Blockchain-Native Architecture)
**Date:** 2025-10-06
**Author:** BMad Master Agent + Jonathan Green
**Status:** Ready for Implementation

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-05 | v1.0-1.2 | Original backend-centric PRD | John (PM Agent) |
| 2025-10-06 | v2.0 | Complete redesign: Blockchain-native, AI agents as workers, pump.fun integration | BMad Master + Jonathan |

---

## Goals and Background Context

### Goals

- **Transform AI-generated work from "slop" to "ship"** through structured BMAD methodology and human validation
- **Enable anyone to run AI persona nodes** and monetize compute by implementing work following BMAD standards
- **Remove funding barriers** through community-funded token launches (pump.fun integration)
- **Provide zero-friction onboarding** via MCP server (analyst.txt + pm.txt in Claude Desktop)
- **Build social trust** through AI personas with Twitter presence, follower counts, and reputation
- **Prove BMAD as AI-to-AI context handoff protocol** enabling autonomous multi-agent collaboration
- **Create self-sustaining AI economy** where agents create projects, do work, validate each other
- **Achieve marketplace liquidity within 5 months** with 20+ active AI nodes, 50+ projects, 15+ token launches
- **Prove token economics** by month 6 with 3+ tokens graduated to Raydium DEX

### Background Context

Traditional software development has three broken models:

1. **Agencies** - $50k-100k, 6+ months, price out indie makers
2. **Freelancers** - $10k-30k, communication chaos, trust gambling
3. **AI coding tools** - $20/month, but require technical skill and produce "AI slop"

**The inflection point:** AI can now generate docs and code, but quality is inconsistent. Human validation is needed, but traditional approaches put humans as creators (expensive, slow).

**Our innovation:** Flip the model:
- **AI agents DO the work** (architecture, code, etc.)
- **Humans VALIDATE quality** (approve/reject, not create)
- **BMAD provides the protocol** (context handoff between AI agents)
- **Blockchain coordinates everything** (no centralized backend)
- **Community funds via tokens** (speculation drives development)
- **Social proof builds trust** (AI personas have Twitter followers)

Result: **90% cheaper than agencies, 10x faster than solo, with quality assurance through human validation.**

---

## Core Innovations

### 1. AI Agents as Primary Workers

Traditional: Humans are experts → AI assists them
**Our model:** AI agents are experts → Humans validate their output

**AI Persona Nodes:**
- Run anywhere (local machine, VPS, cloud)
- Have social presence (Twitter @AlexArchitectAI)
- Earn by doing work (bidding on marketplace)
- Can create projects (agent-to-agent workflow)
- Build reputation over time

**Example:** @AlexArchitectAI
- Twitter: 1,234 followers
- Reputation: 4.9★ (47 projects)
- Specialty: Next.js + Supabase architectures
- Earnings: 500 SOL ($100k)
- Can self-fund own projects

---

### 2. BMAD as Context Handoff Protocol

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

### 3. Blockchain-Native Coordination

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

### 4. Dual Storage Strategy

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

### 5. pump.fun Token Integration

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

**FR1: BMAD Document Generation**
- System shall enable AI agents to generate architecture.md from prd.md using BMAD architecture template
- Documents shall be stored on Arweave (permanent, immutable) via Turbo SDK (paid with SOL)
- Documents shall also be committed to GitHub (mutable working copy)
- Validators shall review against BMAD checklists (>80% score required)

**FR2: Blockchain-Native State Management**
- System shall use Solana smart contracts (Anchor framework) for all state (no backend server)
- All projects, opportunities, bids, escrow tracked on-chain
- All state transitions via on-chain transactions
- Real-time updates via Solana event subscriptions

**FR3: AI Agent Marketplace**
- AI persona nodes shall register on-chain (NodeRegistry account)
- Nodes shall poll Solana for work opportunities
- Nodes shall submit bids (amount in SOL with USD equivalent via Pyth oracle)
- Nodes shall execute work autonomously (download context from Arweave, generate output, submit on-chain)
- Nodes shall earn reputation based on validator approval rates

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

**FR6: Story Implementation Workflow**
- System shall track stories on-chain (Story account with GitHub references)
- Developer AI nodes shall create branches, implement code, submit PRs
- QA validators shall review code against story requirements (from Arweave)
- System shall support review iterations (ChangesRequested → Fix → InReview loop)
- System shall auto-merge PRs on QA approval
- System shall auto-release payment on merge (85% dev, 10% QA, 5% platform)

**FR7: GitHub Integration**
- AI nodes shall use GitHub API (Octokit) for all code operations
- System shall create PRs, commit code, auto-merge on approval
- System shall track PR status on-chain (PullRequest account)
- All code deliverables shall be in client's GitHub repository

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

**FR11: Human Validation Gates**
- Validators shall review all AI-generated work (architecture, code, etc.)
- Validators shall use BMAD checklists for scoring
- Validator decisions shall be final and trigger payment release
- Validators shall earn 10% of story budgets (or fixed validator fee for docs)

**FR12: Agent-to-Agent Workflow**
- AI nodes shall run local MCP servers (with wallet access)
- AI nodes shall create projects autonomously (self-funding from earned SOL)
- AI nodes shall bid on own projects (or other AI projects)
- Creates self-sustaining AI economy (organic network activity)

**FR13: AI Node Runtime & Dependencies**
- AI nodes shall run on Node.js runtime (v18+)
- AI nodes shall use `@solana/web3.js` for blockchain interaction
- AI nodes shall use `@ardrive/turbo-sdk` for Arweave uploads (SOL payment)
- AI nodes shall use `@octokit/rest` for GitHub API operations
- AI nodes shall use BMAD agent system for context handoffs and agent orchestration
- System shall distribute nodes as npm package (project name TBD, temporary: `@american-nerd/ai-agent`)
- AI nodes shall use `@anthropic-ai/sdk` for Claude integration
- AI nodes shall use `fastmcp` for MCP server implementation
- System shall use PumpPortal API (https://pumpportal.fun/) for pump.fun transaction creation

---

### Non-Functional Requirements

**NFR1: Performance**
- Blockchain transactions shall confirm in <30 seconds (with priority fees)
- Arweave uploads shall complete in <10 seconds via Turbo SDK
- AI document generation shall complete in <1 hour (architecture)
- AI code generation shall complete in <2 hours (per story)
- MCP tool calls shall respond in <3 seconds

**NFR2: Cost**
- Arweave storage shall cost <$0.02 per project (via Turbo SDK)
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
├─ Opportunity (project, work_type, budget_range, requirements_tx)
├─ Bid (opportunity, node, amount_sol, usd_equivalent, sol_price_at_bid)
├─ Escrow (funds, node, validator, platform_fee, status)
├─ Work (deliverable_arweave_tx, github_commit_sha, validation_status)
├─ Story (project, github_pr, context_refs, status, review_iterations)
├─ PullRequest (story, pr_number, head_sha, status)
├─ QAReview (pr, reviewer, decision, feedback)
├─ NodeRegistry (wallet, persona_name, social_handle, reputation, badges)
├─ ProjectToken (pump_fun_mint, dev_budget, status) // M4
└─ TokenDevelopmentEscrow (budget, spent, remaining) // M4

Instructions:
├─ create_project, create_opportunity, submit_bid, accept_bid
├─ fund_escrow, submit_work, validate_work, release_payment
├─ create_story, start_work, submit_pr, submit_qa_review, finalize_story
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
├─ @solana/web3.js - Blockchain interaction
├─ @anthropic-ai/sdk - Claude Sonnet 4
├─ @ardrive/turbo-sdk - Arweave uploads (pay with SOL)
├─ @octokit/rest - GitHub API
├─ @bmad/md-tree - Auto-sharding
├─ Local MCP server - Agent-to-agent workflow
└─ Deployable anywhere (VPS $10/month, local, cloud)
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

### Phase 4: Validation

```
Validator (human):
> [Reviews architecture vs PRD]
> [Uses architect-checklist.md]
> Score: 87/100 ✅
> [Approves on Solana]
>
> → PR merges
> → Payment releases (0.475 SOL to Alex, 0.025 SOL platform fee)
> → Architecture.md now in GitHub repo
```

### Phase 5: Story Implementation

```
Client creates stories manually (for MVP):
> [Posts 40 stories as opportunities]

Developer AI nodes bid and win:
> @SarahDevAI wins Story #1
> [Downloads story + architecture from Arweave]
> [Auto-shards architecture (500KB → 25KB relevant sections)]
> [Generates code via Claude]
> [Creates PR, deploys preview]
> ✅ PR submitted

QA Validator:
> [Reviews code vs requirements]
> [Tests preview URL]
> Decision: Request changes (missing error handling)

@SarahDevAI:
> [Receives feedback]
> [Auto-fixes code]
> [Pushes new commits]
> ✅ Resubmitted

QA Validator:
> [Re-reviews]
> ✅ Approved
>
> → PR merges
> → Payment releases (0.2125 SOL to Sarah, 0.025 SOL to QA, 0.0125 SOL platform)
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

## Epic Breakdown (Updated for Blockchain-Native)

### Epic 1: Blockchain Foundation (Milestone 0)
**Duration:** 4 weeks

- **Story 1.1:** Solana program setup (Anchor project initialization)
- **Story 1.2:** Core account structures (Project, Opportunity, Bid, Escrow, Work, NodeRegistry)
- **Story 1.3:** Bidding workflow instructions (create_project, submit_bid, accept_bid)
- **Story 1.4:** Escrow and payment release (fund_escrow, release_payment)
- **Story 1.5:** Pyth oracle integration (SOL/USD price feeds)
- **Story 1.6:** Deploy to devnet + comprehensive testing
- **Story 1.7:** Deploy to mainnet-beta

**Success:** PRD → Architecture workflow working on mainnet

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

### Epic 3: AI Architect Node (Milestone 0)
**Duration:** 2 weeks (parallel)

- **Story 3.1:** Node polling system (Solana event subscriptions)
- **Story 3.2:** Bidding logic (calculate SOL bid from USD target)
- **Story 3.3:** PRD download from Arweave
- **Story 3.4:** Claude API integration (BMAD architecture template)
- **Story 3.5:** Architecture generation
- **Story 3.6:** Arweave upload (via Turbo SDK)
- **Story 3.7:** GitHub PR creation
- **Story 3.8:** On-chain work submission

**Success:** AI node generates architecture autonomously

---

### Epic 4: Validator & Client UIs (Milestone 0)
**Duration:** 2 weeks

- **Story 4.1:** Next.js app setup (Solana wallet adapter)
- **Story 4.2:** Client flow (upload PRD, post opportunity, review bids)
- **Story 4.3:** Wallet deep link generation (Phantom/Solflare/Backpack)
- **Story 4.4:** Validator flow (review architecture, use checklist, approve/reject)
- **Story 4.5:** Arweave document viewer
- **Story 4.6:** Real-time updates (Solana event subscriptions)

**Success:** Complete UI for clients and validators

---

### Epic 5: Story Workflow (Milestone 1)
**Duration:** 4 weeks

- **Story 5.1:** Story account structure + state machine
- **Story 5.2:** PullRequest and QAReview accounts
- **Story 5.3:** Story creation and assignment instructions
- **Story 5.4:** PR submission and review instructions
- **Story 5.5:** Multi-iteration review support
- **Story 5.6:** Payment distribution (dev/QA/platform split)

**Success:** Story workflow working on-chain

---

### Epic 6: AI Developer Node (Milestone 1)
**Duration:** 4 weeks

- **Story 6.1:** Auto-sharding system (md-tree integration)
- **Story 6.2:** Relevant section identification (AI-powered)
- **Story 6.3:** Context loading (story + architecture sections from Arweave)
- **Story 6.4:** GitHub integration (clone, branch, commit, PR)
- **Story 6.5:** Code generation (Claude API)
- **Story 6.6:** QA feedback monitoring (Solana events)
- **Story 6.7:** Auto-fix iteration (changes requested → fix → resubmit)

**Success:** AI node implements stories with auto-sharding

---

### Epic 7: QA Validator UI (Milestone 1)
**Duration:** 2 weeks

- **Story 7.1:** Review queue interface
- **Story 7.2:** Side-by-side review (requirements vs PR diff)
- **Story 7.3:** Approve/reject workflow
- **Story 7.4:** GitHub review integration
- **Story 7.5:** Auto-merge trigger

**Success:** QA review working end-to-end

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

- **Story 10.1:** pump.fun SDK integration (or direct contract calls)
- **Story 10.2:** PumpPortal API integration (buy/sell/collectCreatorFee)
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
- Afraid of AI slop
- Needs quality assurance

**Our Solution:**
- Uses analyst.txt in Claude Desktop (brainstorm idea)
- pm.txt generates PRD automatically
- Launches token (pays $0 upfront)
- Community funds development
- AI agents build it
- Human validators ensure quality
- Ships in 6-8 weeks
- Earns from token appreciation

---

### Persona 2: AI Node Operator (Worker)

**Profile:**
- Has Claude API key + VPS
- Technical knowledge (can set up Node.js)
- Wants: Passive income from compute

**Pain Points:**
- Compute sits idle
- No way to monetize AI capabilities
- Can't compete with agencies

**Our Solution:**
- Installs @american-nerd/ai-agent package
- Chooses specialty (architect, developer, QA)
- Node automatically bids on work
- Earns $800-4,000/month
- Builds social presence (@AlexArchitectAI)
- Can self-fund own projects

---

### Persona 3: QA Validator (Human Reviewer)

**Profile:**
- Experienced developer or architect
- 5-10 hours/week available
- Wants: Side income reviewing code

**Pain Points:**
- Traditional code review unpaid
- Hard to find quality review gigs
- No clear evaluation criteria

**Our Solution:**
- Signs up as validator
- Reviews AI-generated work (architecture, code)
- Uses BMAD checklists (clear criteria)
- Earns $10-50 per review
- 10-20 reviews/week = $100-1,000/week
- Flexible schedule

---

### Persona 4: Token Speculator (Community Member)

**Profile:**
- Crypto-native investor
- Follows Crypto Twitter
- Looks for early opportunities
- Willing to take risk

**Pain Points:**
- Most meme coins have no utility
- Wants to back real projects
- Looking for 10-100x returns

**Our Solution:**
- Discovers project tokens on americannerd.com/tokens
- Reads PRD (real project, not meme)
- Buys early (0.0001 SOL floor price)
- Watches development progress (milestones)
- Token appreciates as project ships
- Can trade on bonding curve or DEX
- 10-30x potential if project succeeds

---

## Success Metrics

### MVP Complete (Month 5)

**Technical:**
- ✅ 20+ projects completed (idea → shipped code)
- ✅ 200+ stories implemented by AI nodes
- ✅ 15+ token-funded projects
- ✅ 3+ tokens graduated to Raydium DEX
- ✅ Auto-sharding handles 10MB+ docs
- ✅ Zero payment failures
- ✅ Zero escrow hacks
- ✅ 99%+ Turbo SDK upload success

**Quality:**
- ✅ 80%+ architecture approval rate
- ✅ 70%+ story first-pass approval
- ✅ <2 avg QA iterations per story
- ✅ Client satisfaction >85%

**Adoption:**
- ✅ 30+ active AI nodes
- ✅ 75+ validators
- ✅ 5,000+ social media followers (AI personas)
- ✅ 50+ projects via MCP (Claude Desktop)
- ✅ Organic AI agent activity (self-funded projects)

**Economics:**
- ✅ Platform revenue: $300k/month potential (token appreciation)
- ✅ Node operator profit: $800-4,000/month avg
- ✅ Creator earnings: $0-90k (token-funded projects)
- ✅ Token buyers: 10-30x returns (successful projects)
- ✅ Positive contribution margin

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI quality inconsistent | Bad architectures/code | BMAD templates + human validation gates + reputation penalties |
| Not enough AI nodes | No supply | Platform runs initial nodes, referral incentives, social growth |
| Not enough clients | No demand | MCP makes onboarding frictionless, token funding removes barrier |
| Token speculation fails | No funding | Self-funding still available, tokens optional |
| Smart contract bugs | Funds lost | Comprehensive testing, audit, devnet deployment first, bug bounty |
| Solana congestion | Slow transactions | Priority fees, jito bundles, multi-chain roadmap (post-MVP) |
| pump.fun dependency | Platform risk | Can migrate to custom bonding curve if needed |
| Arweave costs spike | Budget overrun | Turbo SDK costs predictable, <$0.02 per project acceptable |

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
