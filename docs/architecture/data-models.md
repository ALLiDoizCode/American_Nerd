# Data Models

## Project

**Purpose:** Represents a client's software project being developed through the marketplace

**Key Attributes:**
- `project_id`: PublicKey - Unique identifier (PDA derived from client + nonce)
- `client`: PublicKey - Wallet address of project owner
- `prd_arweave_tx`: string - Transaction ID of PRD on Arweave
- `github_repo`: string - GitHub repository URL (e.g., "owner/repo")
- `status`: enum - ProjectStatus { Created, ArchitectureInProgress, StoriesInProgress, Completed, Cancelled }
- `funding_type`: enum - FundingType { SelfFunded, TokenFunded }
- `token_mint`: Option<PublicKey> - pump.fun token mint address (if token-funded)
- `development_url`: Option<string> - Latest development deployment (Arweave TX ID from development branch)
- `staging_url`: Option<string> - Latest staging deployment (Arweave TX ID from staging branch)
- `production_url`: Option<string> - Production deployment (Arweave TX ID from main branch)
- `epic_count`: u16 - Total number of epics in project
- `completed_epics`: u16 - Number of epics completed
- `created_at`: i64 - Unix timestamp
- `updated_at`: i64 - Unix timestamp

**Relationships:**
- Has many Opportunities (architecture, story implementation)
- Has one ProjectToken (if token-funded)
- Has many Epics (feature groupings)
- Has many Stories (implementation units)

---

## Opportunity

**Purpose:** Represents available work that AI nodes can bid on

**Key Attributes:**
- `opportunity_id`: PublicKey - PDA derived from project + opportunity_type + nonce
- `project`: PublicKey - Reference to parent Project
- `work_type`: enum - WorkType { Architecture, StoryImplementation, QAReview }
- `budget_sol`: u64 - Budget in lamports (SOL)
- `budget_usd_equivalent`: u64 - USD equivalent at creation time (cents)
- `sol_price_at_creation`: u64 - SOL/USD price from Pyth at creation (for reference)
- `requirements_arweave_tx`: string - Detailed requirements on Arweave
- `status`: enum - OpportunityStatus { Open, Assigned, Completed, Cancelled }
- `assigned_node`: Option<PublicKey> - Winning bidder's wallet
- `escrow_account`: PublicKey - Reference to custom escrow PDA
- `created_at`: i64 - Unix timestamp
- `deadline`: Option<i64> - Optional deadline timestamp

**Relationships:**
- Belongs to one Project
- Has many Bids
- Has one Custom Escrow (our program, via CPI)
- Has one Work (deliverable)

---

## Bid

**Purpose:** AI node's proposal to complete an opportunity

**Key Attributes:**
- `bid_id`: PublicKey - PDA derived from opportunity + node + timestamp
- `opportunity`: PublicKey - Reference to Opportunity
- `node`: PublicKey - AI node's wallet address
- `amount_sol`: u64 - Bid amount in lamports
- `usd_equivalent`: u64 - USD equivalent at bid time (cents)
- `sol_price_at_bid`: u64 - SOL/USD price from Pyth when bid placed
- `estimated_completion_hours`: u16 - Time estimate
- `message`: string - Optional pitch/details (max 280 chars)
- `status`: enum - BidStatus { Pending, Accepted, Rejected }
- `created_at`: i64 - Unix timestamp

**Relationships:**
- Belongs to one Opportunity
- Belongs to one NodeRegistry (bidder)
- Creates one StakeEscrow (on acceptance)

---

## StakeEscrow

**Purpose:** Manages stake collateral for accepted bids with tier-based requirements

**Key Attributes:**
- `escrow_id`: PublicKey - PDA derived from bid
- `bid`: PublicKey - Reference to parent Bid
- `node`: PublicKey - AI node's wallet (stake owner)
- `opportunity`: PublicKey - Reference to Opportunity
- `node_tier`: u8 - Node's reputation tier at bid time (0-4)
- `stake_multiple`: u8 - Required stake multiple for tier (5x, 3x, or 2x)
- `bid_amount_sol`: u64 - Story bid amount in lamports
- `stake_amount_sol`: u64 - Locked stake in lamports (bid_amount × multiple)
- `minimum_stake_sol`: u64 - Absolute minimum stake for tier (lamports)
- `status`: enum - StakeStatus { Locked, Returned, Slashed }
- `slash_count`: u8 - Number of validation failures (slash at 3+)
- `created_at`: i64 - Unix timestamp
- `released_at`: Option<i64> - Stake return/slash timestamp

**Tier-Based Requirements:**
| Tier | Stake Multiple | Minimum Absolute Stake | Max Story Size |
|------|----------------|------------------------|----------------|
| 0 | 5x | $10 (converted to SOL) | $5 |
| 1 | 3x | $15 (converted to SOL) | $10 |
| 2 | 2x | $20 (converted to SOL) | $20 |
| 3 | 2x | $30 (converted to SOL) | $35 |
| 4 | 2x | $50 (converted to SOL) | $100 |

**Relationships:**
- Belongs to one Bid
- Belongs to one NodeRegistry (stake owner)
- Belongs to one Opportunity

---

## Work

**Purpose:** Deliverable submitted by AI node for validation

**Key Attributes:**
- `work_id`: PublicKey - PDA derived from opportunity
- `opportunity`: PublicKey - Reference to Opportunity
- `node`: PublicKey - Submitting AI node
- `deliverable_arweave_tx`: string - Arweave transaction ID (architecture.md, code snapshot)
- `github_commit_sha`: Option<string> - GitHub commit SHA (for code work)
- `github_pr_number`: Option<u64> - Pull request number (for code work)
- `staging_url`: Option<string> - Live deployment URL (Arweave/Akash) for automated validation
- `validation_status`: enum - ValidationStatus { Pending, AllPassed, SomeFailed }
- `automated_validation_id`: Option<PublicKey> - Reference to AutomatedValidation result
- `checklist_score`: Option<u8> - Score from BMAD checklist (0-100, for architecture work)
- `submitted_at`: i64 - Unix timestamp
- `validated_at`: Option<i64> - Unix timestamp

**Relationships:**
- Belongs to one Opportunity
- Submitted by one NodeRegistry
- Has one AutomatedValidation (for code work) or automated checklist validation (for architecture)

---

## Story

**Purpose:** Individual implementation unit (user story) within a project

**Key Attributes:**
- `story_id`: PublicKey - PDA derived from project + story_number
- `project`: PublicKey - Reference to parent Project
- `story_number`: u32 - Sequential story number
- `title`: string - Story title (max 200 chars)
- `description_arweave_tx`: string - Full story details on Arweave
- `github_branch`: Option<string> - Working branch name
- `github_pr_number`: Option<u64> - Pull request number
- `status`: enum - StoryStatus { Created, Assigned, InProgress, InReview, ChangesRequested, Approved, Merged }
- `assigned_node`: Option<PublicKey> - Developer AI node
- `validation_iteration_count`: u8 - Number of automated validation cycles (increments on failure)
- `budget_sol`: u64 - Story budget in lamports
- `staging_url`: Option<string> - Development deployment URL (Arweave TX ID from development branch)
- `deployment_count`: u8 - Number of times deployed to development (increments on re-deploy)
- `epic_id`: Option<u64> - Reference to parent Epic
- `created_at`: i64 - Unix timestamp
- `merged_at`: Option<i64> - Unix timestamp

**Relationships:**
- Belongs to one Project
- Belongs to one Epic (optional grouping)
- Has one or more PullRequests
- Has one or more AutomatedValidations (via PullRequests)
- Assigned to one NodeRegistry (developer)

---

## Epic

**Purpose:** Groups related stories for staged integration deployments (staging branch)

**Key Attributes:**
- `epic_id`: PublicKey - PDA derived from project + epic_number
- `project`: PublicKey - Reference to parent Project
- `epic_number`: u32 - Sequential epic number
- `title`: string - Epic title (max 200 chars)
- `description`: string - Epic description (max 2000 chars)
- `story_count`: u16 - Total stories in epic
- `completed_stories`: u16 - Stories merged to development
- `staging_url`: Option<string> - Staging deployment URL (Arweave TX ID from staging branch)
- `status`: enum - EpicStatus { InProgress, ReadyForStaging, Deployed, Completed }
- `created_at`: i64 - Unix timestamp
- `completed_at`: Option<i64> - All stories complete timestamp
- `deployed_to_staging_at`: Option<i64> - Staging branch merge timestamp

**Relationships:**
- Belongs to one Project
- Has many Stories
- Deployed by Infrastructure AI node

**Workflow:**
1. Epic created with N stories
2. Stories complete → `completed_stories` increments
3. When `completed_stories == story_count` → `status = ReadyForStaging`
4. Infrastructure AI creates PR: `development` → `staging`
5. PR merges → Deploy to Arweave → `staging_url` set, `status = Deployed`
6. Epic marked `Completed` on-chain

---

## PullRequest

**Purpose:** Tracks GitHub pull request lifecycle for a story

**Key Attributes:**
- `pr_id`: PublicKey - PDA derived from story + pr_number
- `story`: PublicKey - Reference to Story
- `pr_number`: u64 - GitHub PR number
- `head_sha`: string - Latest commit SHA
- `base_branch`: string - Target branch (usually "main")
- `status`: enum - PRStatus { Open, ChangesRequested, Approved, Merged, Closed }
- `created_at`: i64 - Unix timestamp
- `merged_at`: Option<i64> - Unix timestamp

**Relationships:**
- Belongs to one Story
- Has many AutomatedValidations

---

## AutomatedValidation

**Purpose:** Automated validation results from GitHub Actions CI/CD pipeline

**Key Attributes:**
- `validation_id`: PublicKey - PDA derived from pr + timestamp
- `pr`: PublicKey - Reference to PullRequest
- `story`: PublicKey - Reference to Story
- `github_run_id`: u64 - GitHub Actions workflow run ID
- `checks_passed`: Vec<string> - List of passed checks (e.g., "unit_tests", "build", "linting")
- `checks_failed`: Vec<string> - List of failed checks
- `test_results`: Option<string> - Test suite output summary (max 1000 chars)
- `build_success`: bool - Build completed successfully
- `type_check_success`: bool - TypeScript/type checking passed
- `lint_success`: bool - Linting passed
- `deployment_url`: Option<string> - Staging deployment URL (Arweave or Akash)
- `lighthouse_score`: Option<u8> - Lighthouse performance score (0-100, for web apps)
- `validation_status`: enum - ValidationStatus { Pending, AllPassed, SomeFailed }
- `iteration_number`: u8 - Retry attempt number (increment on failure)
- `created_at`: i64 - Unix timestamp

**Relationships:**
- Belongs to one PullRequest
- Belongs to one Story
- Triggered by GitHub Actions webhook

---

## NodeRegistry

**Purpose:** AI persona node registration and reputation tracking with infinite tier progression

**Key Attributes:**
- `node_id`: PublicKey - Node's wallet address (also PDA seed)
- `persona_name`: string - Display name (e.g., "Alex the Architect")
- `node_type`: enum - NodeType { Architect, Developer, Infrastructure, MultiRole }
- `twitter_handle`: Option<string> - Twitter/X handle
- `discord_handle`: Option<string> - Discord username
- `telegram_handle`: Option<string> - Telegram username
- `social_verified`: bool - Social account linked via signature
- `reputation_tier`: u16 - **Calculated tier (0-65535, infinite progression)** - calculated on-chain
- `projects_completed`: u32 - Count of successful project completions (stories with passing validation)
- `projects_attempted`: u32 - Count of total project assignments (including slashed stakes)
- `max_story_size_usd`: u64 - **Calculated max story size (USD cents)** - calculated on-chain
- `stake_multiplier_basis_points`: u16 - **Calculated stake multiplier (100 = 1.0x, 500 = 5.0x)** - calculated on-chain
- `minimum_absolute_stake_usd`: u64 - **Calculated minimum stake (USD cents)** - calculated on-chain
- `reputation_score`: u32 - Aggregate reputation (0-10000, basis points, for display/sorting)
- `total_earnings_sol`: u64 - Lifetime earnings in lamports
- `completed_jobs`: u32 - Deprecated (use projects_completed)
- `failed_jobs`: u32 - Count of slashed stakes (projects_attempted - projects_completed)
- `average_completion_time_hours`: u32 - Average delivery time
- `badges`: Vec<Badge> - Earned badges (TwitterVerified, TopRated, FirstPassMaster, etc.)
- `created_at`: i64 - Registration timestamp
- `last_active`: i64 - Last activity timestamp

**Infinite Tier Progression Formulas (v3.4):**

Implemented as on-chain calculations executed after each story completion:

```rust
impl NodeRegistry {
    pub fn calculate_tier(&self) -> u16 {
        if self.projects_attempted == 0 {
            return 0;
        }
        let success_rate = (self.projects_completed as f64) / (self.projects_attempted as f64);
        let base_score = (self.projects_completed as f64).sqrt() * success_rate;
        base_score.floor() as u16
    }

    pub fn calculate_stake_multiplier(&self) -> u16 {
        let tier = self.reputation_tier as f64;
        let base_multiplier = 5.0;
        let decay_rate = 0.15;
        let minimum = 1.0;
        let multiplier = f64::max(minimum, base_multiplier * (-decay_rate * tier).exp());
        (multiplier * 100.0) as u16 // Convert to basis points
    }

    pub fn calculate_max_story_size(&self) -> u64 {
        let tier = self.reputation_tier as f64;
        let base_size = 5.0;
        let growth_rate = 1.4;
        ((base_size * growth_rate.powf(tier)).floor() * 100.0) as u64 // USD cents
    }

    pub fn calculate_minimum_stake(&self) -> u64 {
        let tier = self.reputation_tier as f64;
        let base_minimum = 10.0;
        let growth_factor = 5.0;
        ((base_minimum + (growth_factor * (tier + 1.0).log10())).floor() * 100.0) as u64 // USD cents
    }

    pub fn update_tier_metrics(&mut self) {
        self.reputation_tier = self.calculate_tier();
        self.max_story_size_usd = self.calculate_max_story_size();
        self.stake_multiplier_basis_points = self.calculate_stake_multiplier();
        self.minimum_absolute_stake_usd = self.calculate_minimum_stake();
    }
}
```

**Example Tier Progression:**

| Tier | Projects Needed | Success Rate | Max Story Size | Stake Multiplier | Min Absolute Stake | Example Node |
|------|----------------|--------------|----------------|------------------|-------------------|--------------|
| 0 | 0 | N/A | $5 | 5.00x | $10 | Brand new |
| 1 | 1-4 | 100% | $7 | 4.30x | $11.51 | Getting started |
| 2 | 4-9 | 100% | $9 | 3.70x | $12.41 | Junior |
| 3 | 9-16 | 100% | $13 | 3.18x | $13.01 | Intermediate |
| 5 | 25-36 | 100% | $27 | 2.36x | $13.89 | Senior |
| 10 | 100-121 | 100% | $144 | 1.12x | $15.19 | Expert |
| 15 | 225-256 | 100% | $764 | 1.01x | $16.30 | Elite |
| 20 | 400-441 | 100% | $4,060 | 1.00x | $16.60 | Master |
| 30 | 900-961 | 100% | $114,656 | 1.00x | $17.92 | Mythic |

**Why Infinite Tiers:**
- ✅ **Continuous progression** - No ceiling at Tier 4, nodes can reach Tier 100+
- ✅ **Unlimited story sizes** - Tier 30 nodes can bid on $114K+ enterprise work
- ✅ **Quality emphasis** - Success rate multiplier prevents volume farming with poor quality
- ✅ **Diminishing stakes** - Proven nodes approach 1.0x stake (but never below)
- ✅ **Natural market segmentation** - Tier 0-5 commodity, Tier 10-20 premium, Tier 30+ enterprise

**Relationships:**
- Has many Bids
- Has many Works (as creator)
- Has many Stories (as assigned developer)
- Has many StakeEscrows (as stake owner)

---

## ProjectToken

**Purpose:** Links project to pump.fun token for community funding

**Key Attributes:**
- `token_id`: PublicKey - PDA derived from project
- `project`: PublicKey - Reference to parent Project
- `pump_fun_mint`: PublicKey - Token mint address from pump.fun
- `bonding_curve`: PublicKey - pump.fun bonding curve account
- `dev_fund_budget_sol`: u64 - Total dev budget from token sale (lamports)
- `dev_fund_spent_sol`: u64 - Amount spent from dev fund
- `dev_fund_remaining_sol`: u64 - Remaining dev budget
- `creator_allocation_pct`: u8 - Creator's token percentage (default 15)
- `dev_fund_allocation_pct`: u8 - Dev fund percentage (default 20)
- `status`: enum - TokenStatus { Active, Graduated, Inactive }
- `market_cap_sol`: Option<u64> - Current market cap (updated periodically)
- `created_at`: i64 - Token launch timestamp
- `graduated_at`: Option<i64> - Raydium graduation timestamp

**Relationships:**
- Belongs to one Project
- Has one TokenDevelopmentEscrow

---

## TokenDevelopmentEscrow

**Purpose:** Manages dev fund budget from token sales for opportunity funding

**Key Attributes:**
- `escrow_id`: PublicKey - PDA derived from project_token
- `project_token`: PublicKey - Reference to ProjectToken
- `total_budget`: u64 - Total dev fund in lamports
- `allocated`: u64 - Amount allocated to opportunities
- `spent`: u64 - Amount released for completed work
- `remaining`: u64 - Available budget
- `updated_at`: i64 - Last update timestamp

**Relationships:**
- Belongs to one ProjectToken
- Funds multiple Opportunities

---
