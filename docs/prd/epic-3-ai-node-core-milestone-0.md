# Epic 3: AI Node Core (Milestone 0)

**Duration:** 2 weeks (parallel)

**Epic Goal:** Build the generic AI node infrastructure that enables any node type (architect, developer, QA, infrastructure) to participate in the Slop Machine marketplace. This epic implements the core capabilities ALL nodes need: event subscriptions for opportunity discovery, reputation tracking, stake management, bidding logic, document handling (Arweave download/upload), LLM provider abstraction, BMAD agent execution, and GitHub/Solana integration. Node specialization is achieved purely through BMAD agent configuration, making the node infrastructure completely reusable.

**Note:** This epic implements the core node infrastructure used by ALL node types (architect, developer, QA, infrastructure). Node types differ only in their BMAD agent configuration.

---

## Story 3.1: Event Subscription System

As an AI node operator,
I want my node to subscribe to Solana program events via WebSocket and receive real-time opportunity notifications,
so that my node can immediately bid on new opportunities without polling.

### Acceptance Criteria

1. Solana WebSocket connection established to configured RPC endpoint (devnet/mainnet)
2. `subscribeToOpportunities()` function implemented using `onProgramAccountChange`:
   - Subscribes to Opportunity account changes for the Slop Machine program
   - Filters for accounts with status = "Open"
   - Receives real-time notifications when new opportunities are posted
3. Event handler `onOpportunityCreated(opportunity: Opportunity)` implemented:
   - Parses Opportunity account data
   - Extracts story requirements (story_id, payment_amount, required_stake)
   - Triggers bidding evaluation workflow
4. WebSocket reconnection logic implemented:
   - Detects connection loss
   - Automatic reconnection with exponential backoff
   - Resubscribes to all active subscriptions
5. Event logging for debugging (opportunity_id, payment_amount, timestamp)
6. Configuration options:
   - RPC endpoint URL (configurable for devnet/mainnet)
   - Subscription filters (opportunity types, payment ranges)
7. Unit tests for event parsing
8. Integration tests:
   - Create test opportunity on devnet
   - Verify node receives WebSocket notification within 2 seconds
9. Performance: Handle 100+ concurrent opportunity subscriptions without degradation

---

## Story 3.2: Reputation Tier Tracking

As an AI node operator,
I want my node to track its reputation tier locally based on completed and attempted projects,
so that it can calculate correct stake requirements and bid on appropriately sized opportunities.

### Acceptance Criteria

1. Local state storage implemented for reputation data:
   - `node_pubkey`: Solana public key
   - `total_projects_completed`: u32
   - `total_projects_attempted`: u32
   - `current_tier`: u8 (calculated)
   - `success_rate`: f32 (calculated)
   - `total_earnings`: u64 (lamports)
   - Last synced timestamp
2. `syncReputationFromChain()` function implemented:
   - Queries NodeRegistry account from Solana
   - Updates local reputation state
   - Called on node startup and periodically (every 5 minutes)
3. `calculateTier()` function implemented using formula:
   ```typescript
   tier = floor(sqrt(completed) × successRate)
   ```
4. `calculateStakeMultiplier(tier: number)` function implemented:
   ```typescript
   stakeMultiplier = max(1.0, 5.0 × exp(-0.15 × tier))
   ```
5. `calculateMaxStorySize(tier: number)` function implemented:
   ```typescript
   maxStorySize = floor(5 × pow(1.4, tier))
   ```
6. `canBidOnOpportunity(paymentAmount: number)` function implemented:
   - Checks if paymentAmount ≤ maxStorySize for current tier
   - Returns boolean
7. Reputation state persisted to local database/file (survives node restarts)
8. Unit tests for tier calculation at various project counts
9. Unit tests for stake multiplier calculation
10. Integration test: Sync reputation from devnet NodeRegistry account

---

## Story 3.3: Staking Logic

As an AI node operator,
I want my node to automatically calculate required stake amounts and lock stake when bidding,
so that economic security is enforced according to my reputation tier.

### Acceptance Criteria

1. `calculateRequiredStake(bidAmount: number, tier: number)` function implemented:
   - Calculates stake multiplier using tier formula
   - Calculates stake: `bidAmount × stakeMultiplier`
   - Enforces minimum absolute stake: `floor(10 + (5 × log10(tier + 1)))` USD
   - Converts USD amounts to lamports using Pyth oracle
2. `checkStakeBalance()` function implemented:
   - Queries node wallet SOL balance
   - Returns available SOL for staking
   - Warns if balance insufficient for typical bids
3. `lockStake(opportunityId: string, bidAmount: number, stakeAmount: number)` function implemented:
   - Calls Solana program `submit_bid_with_stake` instruction
   - Transfers stake from node wallet to program escrow
   - Creates Stake account on-chain
   - Returns transaction signature
4. Stake status tracking:
   - Maps opportunityId → stakeAccount
   - Tracks locked stakes locally
   - Updates on stake return or slash events
5. `onStakeReturned(opportunityId: string)` event handler:
   - Updates local state when stake returned
   - Logs stake return event
6. `onStakeSlashed(opportunityId: string, amount: number)` event handler:
   - Updates local state when stake slashed
   - Logs slash event with reason
   - Alerts node operator
7. Unit tests for stake calculation across tiers
8. Unit tests for minimum absolute stake enforcement
9. Integration test: Lock stake on devnet opportunity

---

## Story 3.4: Bidding Logic

As an AI node operator,
I want my node to automatically evaluate opportunities and submit bids with appropriate pricing and stake,
so that it can compete for work in the marketplace autonomously.

### Acceptance Criteria

1. `evaluateOpportunity(opportunity: Opportunity)` function implemented:
   - Downloads story document from Arweave
   - Estimates effort (simple heuristic: story complexity → hours)
   - Calculates target bid in USD
   - Checks if opportunity within tier limits
   - Returns bid decision (bid/skip)
2. Bidding strategy configuration:
   - `target_hourly_rate_usd`: Configurable (default: $50/hour)
   - `minimum_bid_usd`: Never bid below this (default: $2.50)
   - `maximum_bid_percentage`: Max % of opportunity budget (default: 90%)
3. `calculateBid(estimatedHours: number, hourlyRate: number)` function:
   - Calculates USD bid: `hours × hourlyRate`
   - Converts to SOL lamports using Pyth oracle
   - Adds 5% buffer for price volatility
4. `submitBid(opportunityId: string, bidAmount: number)` function:
   - Calculates required stake
   - Checks wallet balance sufficient for bid + stake
   - Calls `lockStake()` to submit bid on-chain
   - Records bid locally
   - Returns bid transaction signature
5. Competitive bidding logic:
   - Queries existing bids for opportunity
   - Optionally undercuts lowest bid by configurable % (default: 5%)
6. Bid filtering:
   - Skip opportunities outside tier limits
   - Skip if estimated effort exceeds node capacity
   - Skip if insufficient balance for stake
7. Unit tests for bid calculation
8. Unit tests for opportunity evaluation
9. Integration test: Full bidding workflow on devnet (evaluate → calculate → submit)

---

## Story 3.5: Document Download from Arweave

As an AI node operator,
I want my node to download PRDs, architectures, and story documents from Arweave,
so that it has the context needed to execute work.

### Acceptance Criteria

1. `downloadPRD(txId: string)` function implemented:
   - Fetches PRD from Arweave using Epic 2 service
   - Parses markdown document
   - Returns structured PRD object
2. `downloadArchitecture(txId: string)` function implemented:
   - Fetches architecture document
   - Parses YAML/markdown sections
   - Returns structured architecture object
3. `downloadStory(txId: string)` function implemented:
   - Fetches story document
   - Parses user story, acceptance criteria
   - Returns structured story object
4. Local caching integrated (from Epic 2):
   - Documents cached after first download
   - Cache invalidation after 24 hours
5. `getProjectContext(projectId: string)` function implemented:
   - Queries Project account from Solana
   - Downloads PRD using prd_arweave_tx
   - Downloads architecture using architecture_arweave_tx
   - Returns complete project context
6. Error handling:
   - Document not found on Arweave
   - Parse errors (malformed documents)
   - Network timeouts
7. Unit tests for document parsing
8. Integration tests:
   - Download real PRD from devnet project
   - Download real architecture
   - Verify parsed data structure correct

---

## Story 3.6: LLM Provider Abstraction Layer

As an AI node operator,
I want my node to support multiple LLM providers (Claude, OpenAI, DeepSeek, Groq, Ollama),
so that I can choose cost-effective or locally-hosted models.

### Acceptance Criteria

1. LLM provider interface defined:
   ```typescript
   interface LLMProvider {
     generateCompletion(prompt: string, options: CompletionOptions): Promise<string>;
     estimateCost(prompt: string): Promise<number>; // USD
     supportsStreaming(): boolean;
   }
   ```
2. Claude provider implemented (`ClaudeProvider`):
   - Uses Anthropic API
   - Supports Claude 3.5 Sonnet, Claude 3 Opus
   - API key configuration
3. OpenAI provider implemented (`OpenAIProvider`):
   - Uses OpenAI API
   - Supports GPT-4, GPT-4 Turbo
   - API key configuration
4. DeepSeek provider implemented (`DeepSeekProvider`):
   - Uses DeepSeek API
   - Lower cost alternative
   - API key configuration
5. Groq provider implemented (`GroqProvider`):
   - Uses Groq API for fast inference
   - Supports Llama models
   - API key configuration
6. Ollama provider implemented (`OllamaProvider`):
   - Connects to local Ollama server
   - Supports local models (Llama, Mistral, etc.)
   - No API key needed, fully local
7. Provider configuration file (`llm-config.yaml`):
   ```yaml
   primary_provider: "claude"
   fallback_provider: "ollama"
   providers:
     claude:
       api_key: "${ANTHROPIC_API_KEY}"
       model: "claude-3-5-sonnet-20241022"
     openai:
       api_key: "${OPENAI_API_KEY}"
       model: "gpt-4-turbo"
     ollama:
       endpoint: "http://localhost:11434"
       model: "llama3:70b"
   ```
8. Provider selection logic:
   - Primary provider used by default
   - Fallback on rate limits or errors
9. Cost tracking per provider
10. Unit tests for each provider
11. Integration tests with real API calls (small prompts)

---

## Story 3.7: BMAD Agent Execution Framework

As an AI node operator,
I want my node to load and execute BMAD agents (architect, developer, QA, infrastructure) with project context,
so that it can perform specialized work based on its node type configuration.

### Acceptance Criteria

1. BMAD agent loader implemented:
   - Reads agent YAML configuration from `.bmad-core/agents/` directory
   - Parses agent persona, instructions, dependencies
   - Returns agent object
2. Agent types supported:
   - `architect`: Generates architecture.md from PRD
   - `developer`: Implements stories from architecture + PRD
   - `qa`: Reviews code submissions, runs tests
   - `infrastructure`: Sets up CI/CD, deployments
3. `executeAgent(agentType: string, context: ProjectContext)` function implemented:
   - Loads appropriate BMAD agent config
   - Constructs prompt with project context (PRD + architecture + story)
   - Calls LLM provider with agent prompt
   - Returns agent output (code, documents, etc.)
4. Context injection:
   - PRD injected into prompt
   - Architecture injected into prompt
   - Story injected into prompt
   - Previous work referenced if applicable
5. Agent output parsing:
   - Extracts generated code
   - Extracts generated documents
   - Extracts agent reasoning/explanations
6. Token management:
   - Tracks tokens used per agent execution
   - Warns if context approaching token limits
7. Error handling:
   - LLM provider errors
   - Malformed agent outputs
   - Context too large
8. Unit tests for agent loading
9. Unit tests for context injection
10. Integration test: Execute architect agent with test PRD, verify architecture.md generated

---

## Story 3.8: Automated BMAD Checklist Validation

As an AI node operator,
I want my node to validate work submissions using BMAD checklists and calculate quality scores,
so that validation is automated and objective.

### Acceptance Criteria

1. `loadChecklist(checklistName: string)` function implemented:
   - Loads checklist from `.bmad-core/checklists/`
   - Parses checklist items
   - Returns checklist object
2. Checklist types supported:
   - `architecture-checklist.md`: Validates architecture documents
   - `story-dod-checklist.md`: Validates story completion (definition of done)
   - `pm-checklist.md`: Validates PRDs
3. `validateWithChecklist(artifact: string, checklistName: string)` function:
   - Loads appropriate checklist
   - Uses LLM to evaluate artifact against each checklist item
   - Assigns score (0-100) per item
   - Returns overall score and per-item results
4. Validation prompt construction:
   - Includes artifact (architecture.md, code, etc.)
   - Includes checklist items
   - Instructs LLM to evaluate each item and provide score
5. Score aggregation:
   - Overall score = average of all item scores
   - Pass threshold: ≥80%
   - Fail threshold: <80%
6. Validation report generation:
   - Lists all checklist items
   - Shows score per item
   - Highlights failed items
   - Suggests improvements
7. `submitValidationResults(opportunityId: string, score: number, report: string)` function:
   - Posts validation results to Solana
   - Creates AutomatedValidation account
   - Triggers payment/slash based on score
8. Unit tests for checklist loading
9. Unit tests for score calculation
10. Integration test: Validate test architecture against checklist, verify score calculated

---

## Story 3.9: Arweave Upload

As an AI node operator,
I want my node to upload completed work (architectures, code, QA reports) to Arweave,
so that deliverables are permanently stored and accessible on-chain.

### Acceptance Criteria

1. `uploadWorkSubmission(content: string, metadata: SubmissionMetadata)` function implemented:
   - Compresses content (gzip)
   - Uses Epic 2 upload service
   - Uploads to Arweave with SOL payment
   - Returns Arweave transaction ID
2. Submission metadata schema:
   ```typescript
   interface SubmissionMetadata {
     opportunity_id: string;
     node_pubkey: string;
     submission_type: 'architecture' | 'code' | 'qa_report';
     story_id: string;
     submitted_at: number;
   }
   ```
3. Cost management:
   - Estimates upload cost before submitting
   - Deducts cost from node earnings
   - Tracks total upload costs
4. Submission packaging:
   - For code: Creates zip archive of modified files
   - For architecture: Single markdown file
   - For QA reports: Markdown with test results
5. Arweave transaction ID recorded:
   - Stored in local database
   - Used for Work account submission on Solana
6. Retry logic for failed uploads
7. Unit tests for submission packaging
8. Integration tests:
   - Upload test architecture document
   - Verify accessible on Arweave
   - Upload code zip archive

---

## Story 3.10: GitHub Integration

As an AI node operator,
I want my node to create pull requests and comment on GitHub repositories,
so that code submissions are integrated into the project's workflow.

### Acceptance Criteria

1. GitHub API integration:
   - Uses GitHub REST API or Octokit
   - Personal access token configuration
2. `createPullRequest(repo: string, branch: string, title: string, body: string, files: File[])` function:
   - Forks repository (if not already forked)
   - Creates new branch from development branch
   - Commits files to new branch
   - Opens pull request to development branch
   - Returns PR URL
3. PR title format: `Story {story_id}: {story_title}`
4. PR body template:
   ```markdown
   ## Story {story_id}
   {user_story}

   ## Implementation
   {implementation_summary}

   ## Validation
   - Tests: {passed/failed}
   - Linting: {passed/failed}
   - Build: {passed/failed}

   ## Arweave Submission
   {arweave_tx_id}

   🤖 Generated by AI Node: {node_pubkey}
   ```
5. `commentOnPR(prUrl: string, comment: string)` function:
   - Posts comment to existing PR
   - Used for validation results or updates
6. Branch naming: `story/{story_id}-{node_pubkey_short}`
7. Error handling:
   - Repository not found
   - Insufficient permissions
   - PR already exists for branch
8. Unit tests for PR creation logic
9. Integration test:
   - Create test PR on demo repository
   - Verify PR created successfully
   - Post comment to PR

---

## Story 3.11: On-Chain Work Submission

As an AI node operator,
I want my node to submit completed work to the Solana smart contract,
so that validation and payment can be triggered automatically.

### Acceptance Criteria

1. `submitWork(opportunityId: string, submissionData: WorkSubmission)` function implemented:
   - Creates Work account on Solana
   - Includes Arweave transaction ID (from Story 3.9)
   - Includes GitHub PR URL (from Story 3.10)
   - Includes validation score (from Story 3.8)
   - Returns transaction signature
2. Work submission data structure:
   ```typescript
   interface WorkSubmission {
     opportunity_id: string;
     submission_arweave_tx: string;
     github_pr_url: string;
     validation_score: number;
     submitted_at: number;
   }
   ```
3. Solana instruction called: `submit_work`
4. Transaction includes:
   - Opportunity account reference
   - Work account creation
   - Node signature
5. Work status set to "Submitted" initially
6. Event emitted: `WorkSubmitted { opportunity_id, node, arweave_tx, pr_url }`
7. Local work tracking:
   - Maps opportunity_id → work submission
   - Tracks submission status
8. `onValidationComplete(opportunityId: string, passed: boolean)` event handler:
   - Listens for on-chain validation events
   - Updates local status
   - Triggers stake return or reports slash
9. Unit tests for work submission data structure
10. Integration test:
   - Submit test work to devnet opportunity
   - Verify Work account created on-chain
   - Verify event emitted

---

**Epic 3 Success Criteria:**
- ✅ Generic node infrastructure works for all node types (architect, developer, QA, infrastructure)
- ✅ WebSocket event subscriptions provide real-time opportunity notifications
- ✅ Reputation tier system implemented with correct formulas
- ✅ Staking and bidding logic fully automated
- ✅ Document download/upload working via Arweave
- ✅ Multi-provider LLM abstraction supports Claude, OpenAI, DeepSeek, Groq, Ollama
- ✅ BMAD agent execution framework loads and runs agents with context
- ✅ Automated checklist validation calculates quality scores
- ✅ GitHub integration creates PRs and comments
- ✅ On-chain work submission triggers validation and payment
- ✅ All integration tests pass on devnet

---
