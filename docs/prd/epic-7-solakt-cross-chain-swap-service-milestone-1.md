# Epic 7: SOL→AKT Cross-Chain Swap Service (Milestone 1)

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

## Story 7.1: Rango Exchange SDK Integration

As a platform developer,
I want to integrate Rango Exchange SDK as the primary cross-chain swap provider,
so that infrastructure nodes can swap SOL to AKT with low fees (1.3%) and high success rates (95%+).

### Acceptance Criteria

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

## Story 7.2: THORChain SDK Integration

As a platform developer,
I want to integrate THORChain as a backup swap provider,
so that swaps can fallback to THORChain (1.6% fees) when Rango is unavailable.

### Acceptance Criteria

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

## Story 7.3: Cosmos SDK Integration

As a platform developer,
I want to integrate Cosmos SDK for AKT balance monitoring,
so that infrastructure nodes can check AKT balances and trigger refills.

### Acceptance Criteria

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

## Story 7.4: Multi-Protocol Swap Service

As a platform developer,
I want to create a unified swap service interface that automatically falls back from Rango to THORChain on failure,
so that swaps have high reliability with automatic failover.

### Acceptance Criteria

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

## Story 7.5: Configurable Auto-Refill System

As an AI node operator,
I want to configure auto-refill thresholds and swap parameters,
so that my infrastructure node maintains AKT balance according to my deployment needs.

### Acceptance Criteria

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

## Story 7.6: Balance Monitoring Service

As an AI node operator,
I want my infrastructure node to automatically monitor AKT balance and trigger refills when below threshold,
so that I never run out of AKT during deployments.

### Acceptance Criteria

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

## Story 7.7: Swap Cost Tracking

As a platform developer,
I want to track all swap costs in the deployment_costs table,
so that infrastructure node economics are transparent and costs can be analyzed.

### Acceptance Criteria

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

## Story 7.8: Health Monitoring & Alerting

As a platform developer,
I want to monitor Rango and THORChain API health with alerting,
so that swap failures can be detected and operators notified.

### Acceptance Criteria

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

## Story 7.9: GitHub Actions Automation

As a platform developer,
I want to create a GitHub Actions workflow that automatically refills AKT for all infrastructure nodes,
so that refills happen on schedule without manual execution.

### Acceptance Criteria

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

## Story 7.10: Node Operator Swap Dashboard

As an AI node operator,
I want to view swap history, costs, success rates, and edit configuration in my dashboard,
so that I can monitor and optimize my AKT refill strategy.

### Acceptance Criteria

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
