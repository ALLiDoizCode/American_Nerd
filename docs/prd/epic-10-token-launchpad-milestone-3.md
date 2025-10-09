# Epic 10: Token Launchpad (Milestone 3)

**Duration:** 4 weeks

**Epic Goal:** Integrate pump.fun token launches via PumpPortal API, enabling project creators to community-fund projects through token sales. This epic implements token creation in MCP, automatic dev fund selling (20% of supply → project escrow), on-chain token escrow accounts, opportunity funding from token proceeds, milestone tracking for token holder updates, and creator fee claiming. Projects transition from self-funded (creator pays SOL) to community-funded (token holders speculate on success), with creators earning 1% trading fees on pump.fun bonding curve.

---

## Story 10.1: PumpPortal API Integration

As a platform developer,
I want to integrate PumpPortal API for pump.fun token operations,
so that we can create tokens, execute trades, and collect creator fees.

### Acceptance Criteria

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

## Story 10.2: Token Trading Endpoints

As a platform developer,
I want to expose token trading functionality through backend endpoints,
so that the web UI can execute token purchases and sales.

### Acceptance Criteria

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

## Story 10.3: Token Creation Flow (in MCP)

As a project creator using Claude Desktop,
I want to launch a pump.fun token for my project through MCP tools,
so that I can community-fund my project without leaving Claude.

### Acceptance Criteria

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

## Story 10.4: Automatic Dev Fund Sale

As a platform developer,
I want to automatically sell 20% of token supply and deposit proceeds to project escrow,
so that projects are funded from token launches without creator depositing SOL.

### Acceptance Criteria

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

## Story 10.5: ProjectToken and TokenEscrow Accounts

As a platform developer,
I want to define ProjectToken and TokenEscrow account structures on Solana,
so that token-project relationships and escrow funding are tracked on-chain.

### Acceptance Criteria

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

## Story 10.6: Fund Opportunities from Token Escrow

As a project creator,
I want to fund story opportunities from token escrow proceeds automatically,
so that community-funded projects continue without requiring my SOL deposits.

### Acceptance Criteria

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

## Story 10.7: Milestone Tracking

As a token holder,
I want to receive updates when project milestones complete (epic completion, production deployment),
so that I can track progress and make informed trading decisions.

### Acceptance Criteria

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

## Story 10.8: Token Holder Dashboard

As a token holder,
I want to view my token holdings, project progress, and price charts,
so that I can monitor my speculation investments.

### Acceptance Criteria

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

## Story 10.9: Creator Fee Claiming UI

As a project creator,
I want to claim accumulated 1% trading fees from my token,
so that I can earn from token trading activity.

### Acceptance Criteria

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
