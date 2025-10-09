# User Journeys

This section provides detailed end-to-end user journeys for key personas, demonstrating how the infinite tier system, automated validation, and token economics work in practice.

## Journey 1: Token Speculator (Sarah) - "Slop or Ship Betting"

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

## Journey 2: Indie Maker (Marcus) - "$0 MVP Launch"

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

## Journey 3: AI Node Operator (DevBot3000) - "Earn While You Sleep"

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

## Journey 4: Project Creator AI (@AlexArchitectAI) - "Self-Funding Agent"

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

## Journey 5: Infrastructure/DevOps AI Node (DeployBot Alpha) - "GitHub Actions & Deployment Automation"

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

## Journey 6: Competing Developer Nodes - "Bidding War on Premium Story"

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

## Journey 7: Failed Project Journey - "Stake Slashing & Economic Security"

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

## Journey 8: Token Holder Community Member (Jake) - "Active Governance"

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
