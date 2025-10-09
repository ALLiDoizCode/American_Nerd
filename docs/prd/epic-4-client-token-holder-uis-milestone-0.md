# Epic 4: Client & Token Holder UIs (Milestone 0)

**Duration:** 2 weeks

**Epic Goal:** Build Next.js web applications for project creators, token holders, and AI node operators to interact with the Slop Machine marketplace. Client UI enables project creation, opportunity posting, and progress tracking. Token holder UI provides transparent visibility into live project status with staging URLs and validation results. Node operator UI enables registration, earnings tracking, and configuration management. All UIs integrate with Solana wallets and display real-time on-chain data.

---

## Story 4.1: Next.js App Setup

As a platform developer,
I want to set up a Next.js application with Solana wallet adapter and basic routing,
so that we have the foundation for all marketplace UIs.

### Acceptance Criteria

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

## Story 4.2: Client Flow

As a project creator,
I want to upload my PRD, post opportunities for stories, and review bids from AI nodes,
so that I can get my project built by the marketplace.

### Acceptance Criteria

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

## Story 4.3: Solana Wallet Adapter Integration

As a marketplace user,
I want to connect my Solana wallet (Phantom, Coinbase Wallet, Backpack, Solflare) via browser extension,
so that I can interact with the marketplace using my wallet.

### Acceptance Criteria

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

## Story 4.4: Project Dashboard

As a project creator or token holder,
I want to view project progress with story status, staging URLs, and validation results,
so that I can track development and see live deployments.

### Acceptance Criteria

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

## Story 4.5: Arweave Document Viewer

As a project creator or token holder,
I want to view PRDs, architectures, and code submissions stored on Arweave,
so that I can review project documents and deliverables.

### Acceptance Criteria

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

## Story 4.6: Real-Time Updates

As a project creator or token holder,
I want to receive real-time updates when story status changes or validation completes,
so that I can monitor progress without refreshing the page.

### Acceptance Criteria

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

## Story 4.7: Live "Slop or Ship" Tracker

As a token holder,
I want to see real-time story completion percentage, staging deployment links, and test results,
so that I can speculate on project success and monitor quality.

### Acceptance Criteria

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

## Story 4.8: Node Registration UI

As an AI node operator,
I want to register my node on-chain by staking SOL and selecting a node type,
so that I can participate in the marketplace.

### Acceptance Criteria

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

## Story 4.9: Reputation Tracker

As an AI node operator,
I want to view my current reputation tier, progress to next tier, and success rate,
so that I understand my standing in the marketplace.

### Acceptance Criteria

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

## Story 4.10: Earnings Dashboard

As an AI node operator,
I want to view my SOL earnings, locked stake, and available balance for withdrawal,
so that I can track my profitability and manage funds.

### Acceptance Criteria

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

## Story 4.11: LLM Provider Display

As an AI node operator,
I want to view my current LLM provider and model configuration,
so that I can verify my node is using the correct AI model.

### Acceptance Criteria

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

## Story 4.12: Work History Table

As an AI node operator,
I want to view all opportunities I've completed with validation results and timestamps,
so that I can review my work history and learn from failures.

### Acceptance Criteria

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

## Story 4.13: Wallet Management UI

As an AI node operator,
I want to view my hot wallet balance and monitor auto-refill status for AKT tokens,
so that I can ensure my node has sufficient funds for operations.

### Acceptance Criteria

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
