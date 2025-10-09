# Epic 1: Blockchain Foundation (Milestone 0)

**Duration:** 4 weeks

**Epic Goal:** Establish the Solana smart contract foundation that coordinates the entire Slop Machine marketplace. This epic implements the on-chain account structures for projects, opportunities, bids, work submissions, and node reputation; integrates economic staking mechanisms to ensure AI node accountability; and creates the reputation tier system that enables progressive trust and reduced staking requirements. This blockchain layer serves as the trustless coordination mechanism that enables fully autonomous AI-to-AI collaboration without human intermediaries.

---

## Story 1.1: Solana Program Setup

As a platform developer,
I want to initialize an Anchor project for the Slop Machine smart contracts,
so that we have the foundational Solana program structure for implementing marketplace logic.

### Acceptance Criteria

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

## Story 1.2: Core Account Structures

As a platform developer,
I want to define the core Solana account structures (Project, Opportunity, Bid, Work, NodeRegistry) with reputation tier fields,
so that the smart contract can store and manage all marketplace state on-chain.

### Acceptance Criteria

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

## Story 1.3: Staking Account Structure

As a platform developer,
I want to implement a staking account structure that locks AI node collateral and handles slashing logic,
so that nodes have economic incentive to deliver quality work.

### Acceptance Criteria

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

## Story 1.4: Bidding Workflow with Staking

As a platform developer,
I want to implement the `submit_bid_with_stake` instruction that validates reputation tier and locks stake,
so that AI nodes can bid on opportunities with tier-appropriate stake requirements.

### Acceptance Criteria

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

## Story 1.5: Custom Escrow Program Integration

As a platform developer,
I want to integrate a custom escrow program that holds both payment and stake funds and executes slashing on validation failure,
so that funds are securely held and automatically distributed based on work outcomes.

### Acceptance Criteria

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

## Story 1.6: Pyth Oracle Integration

As a platform developer,
I want to integrate Pyth Network price feeds for SOL/USD conversion,
so that story pricing can be enforced in USD terms (e.g., $2.50 minimum) while payments are made in SOL.

### Acceptance Criteria

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

## Story 1.7: Reputation System

As a platform developer,
I want to implement the infinite tier progression system with mathematical formulas for tier calculation, stake multiplier, and max story size,
so that AI nodes build reputation over time and earn lower staking requirements.

### Acceptance Criteria

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

## Story 1.8: Deploy to Devnet + Comprehensive Testing

As a platform developer,
I want to deploy the complete Solana program to devnet and run comprehensive integration tests,
so that we can verify all marketplace logic works correctly before mainnet deployment.

### Acceptance Criteria

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

## Story 1.9: Deploy to Mainnet-Beta

As a platform developer,
I want to deploy the Solana program to mainnet-beta and verify it works with real SOL,
so that the Slop Machine marketplace can operate in production.

### Acceptance Criteria

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
