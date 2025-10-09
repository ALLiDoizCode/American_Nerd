# Technical Architecture

## System Components

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
