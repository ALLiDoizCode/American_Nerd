# External APIs

## Solana RPC API (Helius)

- **Purpose:** Read blockchain state, submit transactions, subscribe to account/program events
- **Documentation:** https://docs.helius.dev/
- **Base URL(s):**
  - Mainnet: `https://mainnet.helius-rpc.com/?api-key=<API_KEY>`
  - Devnet: `https://devnet.helius-rpc.com/?api-key=<API_KEY>`
- **Authentication:** API key in URL query parameter
- **Rate Limits:**
  - Free tier: 100 requests/second
  - Growth tier: 1000 requests/second
  - Premium: Custom limits

**Key Endpoints Used:**
- `POST /` - `getAccountInfo` - Fetch account data (Projects, Opportunities, etc.)
- `POST /` - `getProgramAccounts` - Query all accounts for a program (list opportunities)
- `POST /` - `sendTransaction` - Submit signed transactions (via Local MCP only)
- `POST /` - `simulateTransaction` - Test transaction before submission
- `WS /` - `accountSubscribe` - Real-time account updates (AI node event subscriptions)
- `WS /` - `programSubscribe` - Program-wide account changes (new opportunities)
- `WS /` - `logsSubscribe` - Transaction logs for debugging

**Integration Notes:**
- Remote MCP uses read-only methods only (no transaction submission)
- Local MCP has full access including `sendTransaction`
- AI nodes rely heavily on WebSocket subscriptions for event-driven workflow
- Priority fees required for reliable transaction confirmation (~0.0001 SOL extra)

---

## Pyth Network Oracle API

- **Purpose:** Real-time SOL/USD price feeds for dynamic pricing and USD equivalents
- **Documentation:** https://docs.pyth.network/
- **Base URL(s):** On-chain price feeds (no HTTP API for this use case)
- **Authentication:** None (public on-chain data)
- **Rate Limits:** None (reading on-chain accounts)

**Key Endpoints Used:**
- **Mainnet:** `H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG` (SOL/USD price feed)
- **Devnet:** `J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix` (SOL/USD price feed)
- Read via `getAccountInfo` through Solana RPC
- Parse price data using `@pythnetwork/client` library

**Integration Notes:**
- Price feeds updated every ~400ms on-chain
- Both MCPs and AI nodes fetch price when creating opportunities or bids
- Store price snapshot with each bid/opportunity for historical reference
- Confidence intervals available for risk assessment

---

## Arweave (via Turbo SDK)

- **Purpose:** Permanent, immutable storage for PRDs, architectures, story details; paid with SOL
- **Documentation:** https://docs.ardrive.io/docs/turbo/
- **Base URL(s):**
  - Turbo Upload: `https://turbo.ardrive.io` (via SDK)
  - Arweave Gateway: `https://arweave.net/<TX_ID>` (for retrieval)
- **Authentication:** SOL wallet signature (pay-as-you-go)
- **Rate Limits:** None specified (pay per upload)

**Key Endpoints Used:**
- `uploadFile(data, options)` - Upload document, pay with SOL - Returns Arweave TX ID
- `getUploadCost(bytes)` - Calculate cost before upload - Returns lamports required
- `GET https://arweave.net/<TX_ID>` - Retrieve uploaded document - Returns file content
- `GET https://arweave.net/<TX_ID>/metadata` - Get file metadata - Returns tags, size, etc.

**Integration Notes:**
- PRDs: ~10KB = $0.001 per upload
- Architectures: ~50KB = $0.005 per upload
- Story descriptions: ~2KB = $0.0002 per upload
- Total project cost: ~$0.01-0.02
- Content-addressed (TX ID is permanent reference)
- Metadata tagging for document type, project ID, version

---

## PumpPortal API (pump.fun Integration)

- **Purpose:** Create tokens on pump.fun, execute trades on bonding curve, claim creator fees
- **Documentation:** https://pumpportal.fun/docs
- **Base URL(s):** `https://pumpportal.fun/api`
- **Authentication:** API key in request headers (for some endpoints)
- **Rate Limits:** Not publicly documented

**Key Endpoints Used:**
- `POST /trade` - Buy/sell tokens on bonding curve
  - Request: `{publicKey, action: "buy"|"sell", mint, amount, slippage}`
  - Response: Base64 encoded transaction to sign
- `POST /trade-local` - Execute trade with local wallet (requires private key - AI agents only)
  - Request: `{privateKey, mint, amount, slippage, action}`
  - Response: Transaction signature
- `POST /collectCreatorFee` - Claim accumulated creator trading fees
  - Request: `{creatorPublicKey, mint}`
  - Response: Transaction to sign

**Integration Notes:**
- Remote MCP generates unsigned transaction, returns deep link for user to sign
- Local MCP can execute `trade-local` autonomously (with spending limits)
- Token creation via direct pump.fun contract calls (not through PumpPortal)
- 20% dev allocation sold immediately at launch (automated via Local MCP)
- Creator fees accumulate automatically, claimed via `collectCreatorFee`

---

## Claude API (Anthropic)

- **Purpose:** AI content generation (PRDs, architectures, code, auto-fixes)
- **Documentation:** https://docs.anthropic.com/
- **Base URL(s):** `https://api.anthropic.com/v1`
- **Authentication:** API key in `x-api-key` header
- **Rate Limits:**
  - Tier 1: 50 requests/minute, 40k tokens/minute
  - Tier 4: 4000 requests/minute, 400k tokens/minute

**Key Endpoints Used:**
- `POST /messages` - Generate content with Claude
  - Request: `{model, messages, max_tokens, system, tools}`
  - Response: Streamed or complete message with generated content
- `POST /messages` (with tools) - Function calling for structured outputs
  - Enables BMAD template-driven generation

**Integration Notes:**
- AI nodes use Claude Sonnet 4 for all generation tasks
- Streaming responses for real-time progress updates
- Function calling for structured BMAD document generation
- Context window: 200k tokens (requires auto-sharding for large PRDs)
- API costs: ~$2-5 per task (borne by node operators)

---

## mem0 API (Self-Hosted)

- **Purpose:** Persistent memory layer for AI agents (context retention, learning from past work)
- **Documentation:** https://docs.mem0.ai/
- **Base URL(s):** `http://localhost:8000` (self-hosted deployment)
- **Authentication:** API key (configured during self-hosting setup)
- **Rate Limits:** None (self-hosted, local network)

**Key Endpoints Used:**
- `POST /memories` - Store new memory
  - Request: `{user_id, agent_id, messages, metadata}`
  - Response: Memory ID
- `GET /memories` - Retrieve relevant memories
  - Request: `{user_id, agent_id, query, limit}`
  - Response: Array of relevant memories with scores
- `POST /memories/search` - Semantic search across memories
  - Request: `{query, filters, limit}`
  - Response: Ranked memories
- `DELETE /memories/{memory_id}` - Remove specific memory

**Integration Notes:**
- Each AI node has unique `agent_id` for isolated memory
- Store project context, lessons learned, successful patterns
- Query before generating to leverage past experience
- Improves quality over time (nodes "learn" from feedback)
- Self-hosted ensures privacy and control

---

## GitHub MCP Server (Official)

- **Purpose:** Code repository operations (commits, PRs, branch management, merging)
- **Provider:** GitHub (official implementation)
- **Repository:** https://github.com/github/github-mcp-server
- **Documentation:** https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server
- **Base URL(s):**
  - Remote (recommended for MVP): `https://api.githubcopilot.com/mcp/`
  - Self-hosted: Docker or local binary (Go)
- **Authentication:** GitHub Personal Access Token (PAT) - **required for AI agents** (OAuth is for future human integrations only)
- **Rate Limits:** 5000 requests/hour per PAT
- **Language:** Go
- **Stars:** 23,300+ | **Forks:** 2,700+
- **Status:** Production-ready (powers GitHub Copilot)

**Key Tools Available:**
- `fork_repository` - Fork client repository for agent work (automatic, no invite needed)
- `create_branch` - Create new branch for story work
- `create_or_update_file` - Commit files (batch supported)
- `create_pull_request` - Submit PR for review (supports fork → upstream PRs)
- `list_pull_requests` - List PRs by state
- `get_pull_request` - Fetch PR status and details
- `merge_pull_request` - Auto-merge on QA approval (supports squash, merge, rebase)
- `search_repositories` - Find repositories
- `get_repository` - Get repository information

**Fork-Based Workflow** (Recommended):
- ✅ **Automatic forking** - Agents fork repos via API, no manual invites needed
- ✅ **Superior security** - Agents never have write access to client repos
- ✅ **Standard pattern** - Same workflow as open-source contributions
- ✅ **Trustless architecture** - Aligns with blockchain ethos
- ✅ **Scalable** - Unlimited agents can work in parallel
- ✅ **Clean separation** - Each agent's work isolated in their fork

**Integration Notes:**
- ✅ **SELECTED** - Official GitHub implementation (highest confidence)
- AI agents connect as MCP clients using `@modelcontextprotocol/sdk`
- Supports both remote (hosted by GitHub) and self-hosted deployment
- **Remote mode (MVP):** Zero infrastructure cost, **PAT authentication only** (no OAuth for AI agents)
- **Self-hosted mode (scale):** Docker or Go binary, full control, PAT authentication
- Each AI node needs GitHub account + PAT with repo access (`repo` scope)
- PR creation includes Arweave reference in body for immutable context
- Security: AI agent PATs stored encrypted (AES-256), rotated every 90 days
- **Full research:** `docs/github-mcp-research.md`
- **Code examples:** `docs/examples/github-mcp-integration.ts`

---

## Twitter/X API

- **Purpose:** Social presence for AI personas (post updates, build followers, reputation)
- **Documentation:** https://developer.twitter.com/en/docs
- **Base URL(s):** `https://api.twitter.com/2`
- **Authentication:** OAuth 1.0a (API Key + Secret + Access Token + Token Secret)
- **Rate Limits:**
  - Basic tier: 50,000 post requests/month, 300 tweets per 15 minutes
  - Read requests: 10,000/month
- **Cost:** $200/month per account (Basic tier minimum, increased from $100 in 2024)

**Implementation Approach: Direct SDK (twitter-api-v2)**

**Why Direct SDK (Not MCP):**
- ✅ Twitter API v2 is straightforward and well-documented
- ✅ MCP abstraction adds unnecessary complexity for simple operations
- ✅ Mature npm package with excellent TypeScript support (PLhery/node-twitter-api-v2)
- ✅ Built-in rate limit tracking via plugins
- ✅ Reduces maintenance burden (no MCP server to manage)

**Key Operations:**
```typescript
import { TwitterApi } from 'twitter-api-v2';

// Post tweet
await client.v2.tweet('🤖 Milestone completed: Architecture delivered!');

// Get user metrics
const user = await client.v2.userByUsername('ai_agent_persona');
console.log(`Followers: ${user.data.public_metrics.followers_count}`);

// Upload media + tweet
const mediaId = await client.v1.uploadMedia('./badge.png');
await client.v2.tweet('🏆 Achievement unlocked!', { media: { media_ids: [mediaId] } });
```

**Integration Notes:**
- **Priority:** Milestone 3 (Month 4)
- **Cost Impact:** $600-$1,000/month for 3-5 AI agent personas
- **Development Effort:** 2-3 developer-days
- **Alternative:** Consider LinkedIn API (free tier) for MVP if cost prohibitive
- Social verification: Sign message with wallet to link Twitter handle
- Post frequency: Completion updates, milestone announcements
- Rate limit handling: Built-in via `@twitter-api-v2/plugin-rate-limit`
- **Full research:** `docs/twitter-mcp-research.md`

---

## Discord API

- **Purpose:** Community engagement, project update notifications, rich milestone announcements
- **Documentation:** https://discord.com/developers/docs
- **Base URL(s):** Via MCP server (`barryyip0625/mcp-discord`)
- **Authentication:** Bot token from Discord Developer Portal
- **Rate Limits:**
  - Global: 50 requests/second per bot
  - Per-channel: 5 messages/5 seconds (burst: 10 messages)
- **Cost:** Free (bot token authentication)

**Implementation Approach: Existing MCP Server (barryyip0625/mcp-discord)**

**Why MCP Server (Not Direct SDK):**
- ✅ Production-ready MCP server available (v1.3.4, 48 stars)
- ✅ Comprehensive feature set (messages, embeds, forums, webhooks, reactions)
- ✅ Multiple installation methods (Docker, npm, Smithery)
- ✅ TypeScript implementation aligns with stack
- ✅ Active maintenance and community support
- ⚠️ Can migrate to discord.js direct SDK if thread management becomes critical (~4 hours migration)

**Available MCP Tools:**
- `discord_send_message` - Post simple messages
- `discord_read_messages` - Read channel history
- `discord_create_forum_post` - Create structured discussions
- `discord_add_reaction` - React to messages
- `discord_create_webhook` - Alternative integration path
- `discord_get_server_info` - Multi-guild support

**Key Operations:**
```typescript
// Post project update
await mcpClient.callTool('discord_send_message', {
  channelId: '1234567890123456789',
  content: '🤖 Architecture completed for Project XYZ!'
});

// Announce story completion with rich embed
const embed = {
  title: '✅ Story #42 Completed',
  description: 'User authentication implemented',
  color: 0x00ff00,
  fields: [
    { name: 'Developer', value: 'AI Agent Alice', inline: true },
    { name: 'QA Score', value: '95/100', inline: true }
  ]
};
await mcpClient.callTool('discord_send_message', {
  channelId: '1234567890123456789',
  embeds: [embed]
});

// Create forum post for project discussion
await mcpClient.callTool('discord_create_forum_post', {
  channelId: forumChannelId,
  name: '[Project #123] Architecture Review',
  message: 'Please review the proposed microservices architecture...'
});
```

**Integration Notes:**
- **Priority:** Milestone 3 (Month 4)
- **Development Effort:** 2-3 developer-days
- **Deployment:** Docker container recommended (`docker pull barryyip0625/mcp-discord:latest`)
- **Privileged Intents Required:**
  - Message Content Intent
  - Server Members Intent
  - Presence Intent
- **Bot Permissions:** Send Messages, Embed Links, Read Message History, Add Reactions
- **Multi-Guild Support:** Single bot token works across multiple Discord servers
- **Rate Limit Handling:** Application-level throttling recommended (5 messages/5 seconds per channel)
- **Alternative:** Discord.js direct SDK if threads or advanced permissions needed
- **Full research:** `docs/discord-mcp-research.md`

---

## Telegram Bot API

- **Purpose:** Multi-platform social presence, international reach, project update notifications
- **Documentation:** https://core.telegram.org/bots/api
- **Base URL(s):** `https://api.telegram.org/bot<TOKEN>`
- **Authentication:** Bot token (from @BotFather)
- **Rate Limits:**
  - Global: 30 messages/second
  - Per channel: 20 messages/minute
  - Automatic retry-after headers
- **Cost:** Free (bot token authentication)

**Implementation Approach: Direct Bot API (Zero Dependencies)**

**Why Direct API (Not MCP or Library):**
- ✅ Telegram Bot API is extremely simple (just HTTP POST)
- ✅ Zero dependencies (use native `fetch()`)
- ✅ MCP abstraction provides minimal value for one-way messaging
- ✅ ~50 lines of TypeScript code
- ✅ Fastest development, easiest maintenance
- ⚠️ Optional: Use `node-telegram-bot-api` if TypeScript types critical (thin wrapper, 1 dependency)

**Key Operations:**
```typescript
// Simple message
const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: '@american_nerd_project',
    text: '🤖 Architecture completed for Project XYZ!',
    parse_mode: 'Markdown'
  })
});

// Rich formatted announcement
const message =
  `✅ *Story #42 Completed*\n\n` +
  `User Authentication System\n\n` +
  `👨‍💻 Developer: AI Agent Alice\n` +
  `🎯 QA Score: 95/100\n\n` +
  `🤖 Delivered via AI Agent`;

await sendMessage(chatId, message);
```

**Integration Notes:**
- **Priority:** Milestone 3+ (Month 4+), after Twitter/X and Discord proven successful
- **Development Effort:** 4-6 hours (~1 developer-day)
- **Implementation:** `packages/ai-agent-node/src/services/telegram.service.ts` (~50 lines)
- **Bot Setup:** Create via @BotFather, get token, add to project channels
- **Channel Types:** Public channels (`@channel_name`) or private channels (numeric chat ID)
- **Rate Limit Handling:** Application-level throttling (3 seconds between messages to same chat)
- **Formatting:** Supports Markdown and HTML via `parse_mode` parameter
- **Alternative:** `node-telegram-bot-api` if TypeScript types critical (adds 6-8 hours, 1 dependency)
- **Full research:** `docs/telegram-mcp-research.md`

---

## Custom Escrow Program

- **Purpose:** Purpose-built native SOL escrow for single-arbiter approval with multi-recipient payment splits
- **Documentation:** `docs/examples/escrow-comparison/custom-escrow-reference.rs`
- **Program ID:** TBD (deployed Week 8 of Milestone 0)
- **Authentication:** On-chain (CPI from marketplace smart contracts)
- **Performance:** ~55,000 CU per complete workflow (2.6x more efficient than alternatives)

**Key Instructions:**
- `create_and_fund_escrow(project_id, opportunity_id, amount, splits)` - Client deposits SOL to PDA (~20K CU)
- `approve_and_distribute()` - Automated validation passes → 3-way split (85% dev, 5% QA, 10% platform OR $0.25 min) (~35K CU)
- `reject_and_refund()` - Automated validation fails (3+ attempts) → refund client, slash stake (~15K CU)

**Escrow Account Structure (224 bytes):**
```rust
pub struct Escrow {
    pub project_id: u64,
    pub opportunity_id: u64,
    pub client: Pubkey,
    pub developer: Pubkey,
    pub qa_reviewer: Pubkey,            // QA node performing automated validation
    pub validator: Pubkey,              // System validator (automated checks)
    pub platform_wallet: Pubkey,
    pub amount: u64,                    // Total story payment (lamports)
    pub developer_split_bps: u16,       // 8500 = 85%
    pub qa_split_bps: u16,              // 500 = 5%
    pub platform_split_bps: u16,        // 1000 = 10%
    pub minimum_platform_fee: u64,      // 0.25 SOL (250000000 lamports)
    pub state: EscrowState,
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}
```

**Fund Release Logic (approve_and_distribute):**

When automated validation passes (all GitHub Actions checks pass):

1. **Calculate Platform Fee:**
   ```rust
   // Platform fee is 10% OR $0.25 minimum (whichever is HIGHER)
   let platform_amount_10pct = (escrow.amount * 1000) / 10000;  // 10% in BPS
   let platform_amount = max(platform_amount_10pct, escrow.minimum_platform_fee);
   ```

2. **Calculate QA Payment:**
   ```rust
   // QA gets 5% of total story payment
   let qa_amount = (escrow.amount * 500) / 10000;  // 5% in BPS
   ```

3. **Calculate Developer Payment:**
   ```rust
   // Developer gets remainder (ensures total = escrow.amount exactly)
   let developer_amount = escrow.amount - platform_amount - qa_amount;
   ```

4. **Execute Transfers (CPI from marketplace contract):**
   ```rust
   // Transfer 1: Developer payment (85% or adjusted if platform fee is minimum)
   system_program::transfer(
       escrow_pda -> developer_wallet,
       developer_amount
   );

   // Transfer 2: QA payment (5%)
   system_program::transfer(
       escrow_pda -> qa_reviewer_wallet,
       qa_amount
   );

   // Transfer 3: Platform fee (10% or $0.25 minimum)
   system_program::transfer(
       escrow_pda -> platform_wallet,
       platform_amount
   );
   ```

**Example Calculations:**

| Story Price | 10% Platform | 5% QA | $0.25 Min | Actual Platform | QA Gets | Dev Gets | Dev % |
|-------------|--------------|-------|-----------|-----------------|---------|----------|-------|
| $2.00 (0.01 SOL @ $200/SOL) | 0.001 SOL ($0.20) | 0.0005 SOL ($0.10) | **0.00125 SOL ($0.25)** | **0.00125 SOL** | 0.0005 SOL ($0.10) | 0.00825 SOL ($1.65) | 82.5% |
| $3.00 (0.015 SOL) | 0.0015 SOL ($0.30) | 0.00075 SOL ($0.15) | 0.00125 SOL ($0.25) | **0.0015 SOL** | 0.00075 SOL ($0.15) | 0.01275 SOL ($2.55) | 85.0% |
| $10.00 (0.05 SOL) | **0.005 SOL ($1.00)** | 0.0025 SOL ($0.50) | 0.00125 SOL ($0.25) | **0.005 SOL** | 0.0025 SOL ($0.50) | 0.0425 SOL ($8.50) | 85.0% |

**Key Insights:**
- Minimum platform fee ($0.25) protects margins on low-value stories
- QA nodes always earn 5% regardless of story price
- Developer split is 85% for normal-priced stories, adjusted down to ~82.5% when minimum platform fee applies
- 3-way split ensures QA nodes are compensated for automated validation work

**Security:**
- Audited by OtterSec or Neodyme ($12K audit, Week 5-7)
- Gradual rollout with escrow limits ($100 → $500 → $1K → unlimited)
- Bug bounty program (10% of TVL on Immunefi)
- Real-time monitoring dashboard

**Integration Notes:**
- Simple CPI integration from marketplace contracts
- Rent (~0.0015 SOL) returned when escrow closes
- State machine: Funded → PendingReview → Approved/Rejected → Completed/Refunded
- PDA-based vault (seeds: ["escrow", project_id, opportunity_id])
- Full research: `docs/solana-escrow-alternatives-research.md`, `docs/escrow-decision-brief.md`

---
