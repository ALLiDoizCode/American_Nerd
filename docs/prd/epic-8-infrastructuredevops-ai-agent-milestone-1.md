# Epic 8: Infrastructure/DevOps AI Agent (Milestone 1)

**Duration:** 3 weeks

**Epic Goal:** Build Infrastructure AI nodes that automatically set up CI/CD pipelines, execute deployments to Arweave (frontends) and Akash (backends), and post permanent URLs on-chain for token holder visibility. This epic creates the infrastructure automation layer that bridges GitHub Actions validation with decentralized hosting, enabling continuous deployment of client projects without manual DevOps work. Infrastructure nodes bid on setup work (Epic 0 stories for client projects), earn fees from deployment costs, and maintain multi-chain wallets (SOL for payments, AKT for Akash).

**Cost Model:** Infrastructure nodes pay deployment costs as operating expenses:
- Frontend: ~$0.09 per Arweave upload (10MB Next.js app)
- Backend: ~$3-5/month per Akash service (API, database, etc.)
- Cross-chain swaps: ~$1/month per node (automated SOL→AKT refills)
- Node recovery: Deployment costs deducted from story payment (85% dev → 84% dev, 1% infrastructure, 5% QA, 10% platform)

---

## Story 8.1: GitHub Actions Workflow Templates

As a platform developer,
I want to create GitHub Actions workflow templates for testing, building, and deploying to Arweave and Akash,
so that infrastructure nodes can generate project-specific CI/CD pipelines.

### Acceptance Criteria

1. **Test Workflow Template** (`templates/workflows/test.yml`):
   - Parameterized for different tech stacks (Rust, Node.js, Python, Go)
   - Runs unit tests, integration tests, linting, type checking
   - Variables: test_command, lint_command, build_command
   - Example for Node.js: `npm test`, `npm run lint`, `npm run build`
2. **Build Workflow Template** (`templates/workflows/build.yml`):
   - Builds production artifacts based on project type
   - For web apps: Static export (Next.js: `npm run build && npm run export`)
   - For CLIs: Cross-platform binaries (Rust: `cargo build --release`)
   - For APIs: Docker image or binary
3. **Arweave Deployment Template** (`templates/workflows/deploy-arweave.yml`):
   - Uploads build artifacts to Arweave via Turbo SDK
   - Uses Solana wallet from secrets
   - Extracts Arweave transaction ID
   - Posts URL to Solana smart contract
   - Variables: build_dir, arweave_wallet_secret
4. **Akash Deployment Template** (`templates/workflows/deploy-akash.yml`):
   - Generates Akash SDL from architecture
   - Deploys to Akash Network
   - Extracts provider URL
   - Posts URL to Solana smart contract
   - Variables: akash_wallet, sdl_template
5. **Combined CI/CD Template** (`templates/workflows/ci-cd.yml`):
   - Triggers on PR to development/staging/main branches
   - Runs tests first
   - If tests pass and branch is development/staging/main: Deploy
   - Posts validation results to Solana via webhook
6. Template variables:
   - `{{tech_stack}}`: "node", "rust", "python", "go"
   - `{{test_framework}}`: "vitest", "cargo_test", "pytest"
   - `{{deployment_target}}`: "arweave", "akash", "github_releases"
7. Documentation:
   - README explaining each template
   - Variable substitution guide
8. Unit tests for template rendering
9. Integration test: Render template with variables, verify valid YAML
10. Example workflows for common stacks (Next.js, Rust CLI, Python API)

---

## Story 8.2: Arweave Deployment Automation for CI/CD

As a platform developer,
I want to integrate Arweave deployment into GitHub Actions using Turbo SDK,
so that web app builds are automatically uploaded to permanent storage on every PR merge.

### Acceptance Criteria

1. GitHub Action step implementation:
   ```yaml
   - name: Deploy to Arweave
     run: |
       npm install -g @ardrive/turbo-sdk
       turbo upload ./dist --wallet ${{ secrets.ARWEAVE_WALLET }}
   ```
2. `deployToArweave(buildDir: string, wallet: string)` function for node execution:
   - Uploads build directory to Arweave
   - Uses Turbo SDK from Epic 2
   - Pays with SOL from infrastructure node wallet
   - Returns Arweave transaction ID
3. Build artifact preparation:
   - For Next.js: `out/` directory from `npm run build && npm run export`
   - For React: `build/` directory from `npm run build`
   - For static sites: `dist/` or `public/`
4. Upload optimization:
   - Gzip compression before upload (from Epic 2)
   - Typical Next.js app: 10MB → ~3MB compressed
   - Cost: ~$0.09 per deployment
5. Transaction ID extraction:
   - Parse Turbo upload output
   - Extract Arweave transaction ID
   - Format: 43-character alphanumeric string
6. Deployment URL construction:
   - Permanent URL: `https://arweave.net/{transaction_id}`
   - Verify URL accessible (HTTP 200)
7. Retry logic:
   - If upload fails, retry up to 3 times
   - Exponential backoff between retries
8. Cost tracking:
   - Log deployment cost to deployment_costs table (Story 7.7 structure)
   - Track SOL spent on Arweave deployments
9. Unit tests for deployment function
10. Integration test: Deploy test Next.js app to Arweave, verify URL accessible

---

## Story 8.3: Akash CLI Wrapper

As a platform developer,
I want to create a wrapper for Akash CLI that generates SDL files and manages deployments,
so that infrastructure nodes can deploy backend services to Akash Network.

### Acceptance Criteria

1. `AkashDeploymentService` class implemented:
   - Wraps Akash CLI commands
   - Manages deployment lifecycle
2. `generateSDL(architecture: Architecture)` function:
   - Reads architecture.md tech stack
   - Generates Akash SDL YAML file
   - Example for Node.js API:
     ```yaml
     version: "2.0"
     services:
       api:
         image: node:20-alpine
         expose:
           - port: 3000
             as: 80
             to:
               - global: true
         env:
           - NODE_ENV=production
     profiles:
       compute:
         api:
           resources:
             cpu:
               units: 0.5
             memory:
               size: 512Mi
             storage:
               size: 1Gi
       placement:
         westcoast:
           pricing:
             api:
               denom: uakt
               amount: 100
     deployment:
       api:
         westcoast:
           profile: api
           count: 1
     ```
3. `deployToAkash(sdlFile: string, wallet: AkashWallet)` function:
   - Creates deployment on Akash
   - Submits SDL to network
   - Waits for provider bids
   - Selects lowest-priced provider
   - Creates lease with provider
   - Returns: lease ID, provider URL
4. `getDeploymentStatus(leaseId: string)` function:
   - Queries Akash deployment status
   - Returns: status (active, closed), provider info, URL
5. `updateDeployment(leaseId: string, newSDL: string)` function:
   - Updates existing deployment with new SDL
   - For configuration changes without redeployment
6. `closeDeployment(leaseId: string)` function:
   - Closes Akash lease
   - Releases resources
   - Stops billing
7. Provider selection logic:
   - Filters providers by uptime (>95%)
   - Filters by price (<$5/month for basic API)
   - Selects lowest price among qualified providers
8. Deployment verification:
   - Wait for service to be accessible
   - Health check on deployment URL
   - Timeout: 5 minutes
9. Unit tests for SDL generation
10. Integration test: Deploy test API to Akash testnet, verify accessible

---

## Story 8.4: Workflow Generation Logic

As an infrastructure AI node,
I want to automatically detect project tech stack from architecture.md and generate appropriate deployment workflows,
so that CI/CD is tailored to each client project without manual configuration.

### Acceptance Criteria

1. `generateWorkflows(architecture: Architecture)` function implemented:
   - Downloads architecture.md from Arweave
   - Parses `project_metadata.type` field (cli_tool, web_app, api_backend, etc.)
   - Parses `tech_stack` section
   - Parses `validation_strategy` section
2. Workflow generation for web apps (`web_app`):
   - Generate test workflow using `validation_strategy.unit_tests`, `validation_strategy.e2e_tests`
   - Generate build workflow using `validation_strategy.build_verification`
   - Generate Arweave deployment workflow (Story 8.2 template)
   - No Akash deployment (frontends use Arweave only)
3. Workflow generation for APIs (`api_backend`):
   - Generate test workflow using validation commands
   - Generate Akash deployment workflow (Story 8.3 template)
   - Generate SDL file based on runtime and resources
4. Workflow generation for CLIs (`cli_tool`):
   - Generate test workflow
   - Generate GitHub Release workflow (cross-platform binaries)
   - No Arweave/Akash deployment
5. Variable substitution:
   - Replace `{{test_command}}` with actual command from architecture
   - Replace `{{build_command}}` with actual command
   - Replace `{{runtime}}` with node version, rust version, etc.
6. Webhook integration:
   - Add validation webhook step (Story 0.5 from Epic 0)
   - Webhook posts results to Solana after validation
7. Branch-specific deployments:
   - development branch: Deploy to development environment
   - staging branch: Deploy to staging environment
   - main branch: Deploy to production environment
8. Output:
   - Creates `.github/workflows/` directory
   - Writes all workflow files
   - Commits to repository
9. Unit tests for workflow generation per project type
10. Integration test: Generate workflows for test architecture, verify valid YAML

---

## Story 8.5: Deployment Health Monitoring

As an infrastructure AI node,
I want to monitor deployment health on Arweave and Akash,
so that I can detect failures and alert project creators.

### Acceptance Criteria

1. `ArweaveHealthCheck` service:
   - Periodically checks Arweave URLs (every 10 minutes)
   - Verifies HTTP 200 response
   - Tracks response time
   - Alerts if unreachable for >30 minutes
2. `AkashHealthCheck` service:
   - Periodically checks Akash provider URLs (every 5 minutes)
   - Calls health check endpoint (e.g., `/health` or `/`)
   - Verifies response status
   - Tracks uptime %
3. Health metrics tracked:
   - Uptime % (rolling 24 hours)
   - Average response time
   - Consecutive failure count
   - Last successful check timestamp
4. Alerting:
   - Alert project creator if deployment down for >30 minutes
   - Alert infrastructure node operator
   - Post status update to Solana (deployment status field)
5. Automatic recovery (optional):
   - If Akash deployment down, attempt redeployment
   - If Arweave gateway unavailable, try alternative gateway
6. Health dashboard:
   - Display deployment status per story
   - Green: Healthy (200 OK)
   - Yellow: Degraded (slow response)
   - Red: Down (unreachable)
7. Historical uptime data:
   - Store health checks for 30 days
   - Chart showing uptime trends per deployment
8. Integration with Story 4.4 (Project Dashboard):
   - Show deployment health indicators in UI
9. Unit tests for health checking logic
10. Integration test: Deploy test app, monitor health, simulate downtime

---

## Story 8.6: Deployment URL Extraction and On-Chain Posting

As an infrastructure AI node,
I want to extract deployment URLs from Arweave/Akash and post them to Solana,
so that token holders can access live staging environments.

### Acceptance Criteria

1. `extractArweaveURL(transactionId: string)` function:
   - Input: Arweave transaction ID (from Story 8.2 deployment)
   - Output: `https://arweave.net/{transaction_id}`
   - Verifies URL accessible before returning
2. `extractAkashURL(leaseId: string)` function:
   - Queries Akash lease for provider info
   - Constructs provider URL: `https://{provider_hostname}.akash.network` or custom domain
   - Verifies URL accessible via health check
3. `postDeploymentURL(storyId: string, deploymentUrl: string, environment: string)` function:
   - Posts URL to Solana smart contract
   - Updates Story account `staging_url` field (or `production_url` if main branch)
   - Environment: "development", "staging", or "production"
   - Emits event: `DeploymentURLPosted { story, url, environment }`
4. URL verification before posting:
   - Test deployment URL returns 200 OK
   - For APIs: Health check endpoint responds
   - For frontends: Root path loads
   - Retry up to 5 times (deployments may take time to propagate)
5. Multiple environment URLs:
   - Story can have 3 URLs: development_url, staging_url, production_url
   - Updated based on which branch deployed
6. URL metadata:
   - Include deployment timestamp
   - Include commit SHA that was deployed
   - Include deployment cost (SOL or AKT)
7. Event subscription:
   - Token holders subscribe to DeploymentURLPosted events
   - Real-time notifications when new staging URLs available
8. Integration with Story 4.4:
   - Project dashboard displays all deployment URLs
   - Clickable links to staging environments
9. Unit tests for URL extraction
10. Integration test: Deploy to Arweave, extract URL, post to Solana, verify on-chain

---

## Story 8.7: Infrastructure Node Bidding System

As an infrastructure AI node operator,
I want my node to bid on infrastructure setup work (Epic 0 stories) for client projects,
so that I can earn fees from deployment services.

### Acceptance Criteria

1. Infrastructure node subscribes to Epic 0 opportunities:
   - Filters opportunities by type: "Infrastructure" (Story 0.0, 0.2, 0.3, 0.4, 0.5)
   - Receives notifications when client projects posted
2. Bidding logic for infrastructure work:
   - Fixed pricing model (infrastructure work is predictable):
     - Story 0.0 (Git setup): $2.50 (5 minutes work)
     - Story 0.1 (Architecture gen): Handled by Architect node, not Infrastructure
     - Story 0.2 (Test setup): $3 (10 minutes work)
     - Story 0.3 (CI/CD setup): $5 (15 minutes work)
     - Story 0.4 (Deployment setup): $7 (20 minutes + deployment costs)
     - Story 0.5 (Webhook setup): $3 (10 minutes work)
   - Total Epic 0 infrastructure cost: ~$20.50 per client project
3. Competitive bidding:
   - Multiple infrastructure nodes can bid
   - Lowest bidder wins (same as dev nodes)
   - Typical bid range: 80-100% of fixed price above
4. Stake requirements:
   - Infrastructure nodes use same tier system as dev nodes
   - New infrastructure nodes (Tier 0): Stake 5x bid ($10 stake for $2 story)
5. Infrastructure work execution:
   - Node executes BMAD infrastructure agent (from Story 3.7)
   - Generates workflows (Story 8.4)
   - Sets up deployment pipelines (Stories 8.2, 8.3)
   - Posts results to Solana
6. Payment model:
   - Infrastructure receives story payment (e.g., $5 for CI/CD setup)
   - Infrastructure pays deployment costs from own wallet
   - Net earnings: Payment - deployment costs
   - Example: $5 payment - $0.09 Arweave cost = $4.91 profit (98% margin)
7. Unit tests for infrastructure bidding logic
8. Integration test: Infrastructure node bids on Epic 0 story, gets assigned

---

## Story 8.8: Deployment Cost Tracking

As an infrastructure AI node operator,
I want to track all deployment costs (Arweave uploads, Akash leases, AKT swaps),
so that I can monitor profitability and optimize operations.

### Acceptance Criteria

1. Deployment cost logging (uses `deployment_costs` table from Story 7.7):
   - Type: 'arweave' for frontend deployments
   - Type: 'akash' for backend deployments
   - Type: 'swap' for SOL→AKT conversions (already tracked in Story 7.7)
2. `logArweaveCost(txId: string, solSpent: number, storyId: string)` function:
   - Records Arweave deployment cost
   - Links to story
   - Tracks SOL spent (~$0.09 USD equivalent)
3. `logAkashCost(leaseId: string, aktPerMonth: number, storyId: string)` function:
   - Records Akash lease cost
   - Monthly AKT cost (~$3-5)
   - Tracks deployment duration
4. Cost aggregation:
   - Total costs per story
   - Total costs per project
   - Total costs per node (operating expenses)
   - Breakdown by type (Arweave vs Akash vs Swap)
5. Profitability calculation:
   - `calculateProfit(storyId: string)`:
     - Payment received: X SOL
     - Costs incurred: Y SOL (Arweave + Akash + Swap)
     - Profit: X - Y
     - Profit margin: (X - Y) / X × 100%
6. Cost reporting:
   - Weekly cost report per node
   - Monthly P&L statement (payments vs costs)
   - Alert if profit margin < 50% (infrastructure costs too high)
7. Integration with Story 4.10 (Earnings Dashboard):
   - Show deployment costs in earnings breakdown
   - Net earnings = Gross earnings - Deployment costs
8. Export functionality:
   - Export cost data to CSV
   - For tax reporting
9. Unit tests for cost logging
10. Integration test: Deploy to Arweave + Akash, verify costs logged

---

## Story 8.9: Multi-Chain Wallet Management

As an infrastructure AI node operator,
I want my node to manage SOL and AKT wallets with auto-refill integration,
so that I can receive SOL payments and maintain AKT for Akash deployments.

### Acceptance Criteria

1. Wallet configuration:
   - SOL wallet: Receives payments from story completions
   - AKT wallet: Pays for Akash deployments
   - Both wallets configured in `~/.slop-node/wallets.yaml`:
     ```yaml
     solana:
       private_key: "${SOL_PRIVATE_KEY}"
       public_key: "..."
     cosmos:
       mnemonic: "${COSMOS_MNEMONIC}"
       address: "cosmos1..."
     ```
2. `getSolanaBalance()` function:
   - Queries SOL wallet balance
   - Returns available SOL
3. `getAkashBalance()` function:
   - Queries AKT wallet balance (via Story 7.3 Cosmos SDK)
   - Returns available AKT
4. Auto-refill integration with Epic 7:
   - Uses Story 7.5 configurable auto-refill system
   - Automatically swaps SOL → AKT when AKT balance low
   - Triggered by Story 7.6 balance monitoring service
5. Payment receipt handling:
   - Listen for SOL payments from Solana program (story completions)
   - Update local balance tracking
   - Log payment receipts
6. Deployment cost handling:
   - Deduct AKT for Akash deployments
   - Deduct SOL for Arweave deployments
   - Update balances after each transaction
7. Balance alerts:
   - Warn if SOL balance < 0.1 SOL (cannot pay for swaps or deployments)
   - Warn if AKT balance < 5 AKT (cannot deploy)
8. Wallet backup:
   - Encrypted backup of wallet keys
   - Recovery instructions
9. Unit tests for wallet balance queries
10. Integration test: Receive SOL payment, auto-refill AKT, deploy to Akash

---

**Epic 8 Success Criteria:**
- ✅ Infrastructure AI nodes can set up complete CI/CD pipelines for any project type
- ✅ Arweave deployment automation working in GitHub Actions (~$0.09/deploy)
- ✅ Akash deployment automation working with SDL generation (~$3-5/month)
- ✅ Workflow generation adapts to project tech stack from architecture.md
- ✅ Deployment health monitoring tracks uptime and alerts on failures
- ✅ Deployment URLs extracted and posted to Solana for token holder visibility
- ✅ Infrastructure nodes can bid on Epic 0 stories and earn fees
- ✅ Deployment costs tracked for profitability analysis
- ✅ Multi-chain wallet management with Epic 7 auto-refill integration
- ✅ Infrastructure node profit margins: 83-99% (high profitability)
- ✅ All integration tests pass

---
