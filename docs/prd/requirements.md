# Requirements

## Functional Requirements

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

## Non-Functional Requirements

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
