# Epic 5: Automated Story Workflow (Milestone 1)

**Duration:** 4 weeks

**Epic Goal:** Implement the complete automated story workflow on Solana that manages the lifecycle from opportunity posting through validation and payment distribution. This epic creates the Story account state machine with automated validation triggers, multi-iteration support for failed validations, economic slashing after 3 failures, and the 3-way payment split (85% developer, 5% QA, 10% platform). The workflow enables fully autonomous story execution with GitHub Actions webhooks triggering on-chain state transitions and payments.

---

## Story 5.1: Story Account Structure + State Machine

As a platform developer,
I want to define the Story account structure with a comprehensive state machine and staging URL field,
so that story progress can be tracked on-chain through all workflow stages.

### Acceptance Criteria

1. `Story` account structure defined with fields:
   - opportunity (Pubkey - reference to Opportunity account)
   - project (Pubkey - parent project)
   - story_id (String - e.g., "1.2")
   - assigned_node (Pubkey - developer node)
   - qa_node (Option<Pubkey> - QA reviewer node)
   - status (enum - current state)
   - payment_amount (u64 - developer payment in lamports)
   - qa_payment_amount (u64 - 5% of payment for QA)
   - platform_fee (u64 - 10% of payment or $0.25 min)
   - stake_amount (u64 - locked developer stake)
   - staging_url (String - deployment URL)
   - failure_count (u8 - validation failures)
   - created_at (i64)
   - assigned_at (Option<i64>)
   - completed_at (Option<i64>)
2. Story status enum defined:
   - Open
   - Assigned (node accepted, work starting)
   - InProgress (PR submitted, validation running)
   - QAInProgress (dev validation passed, QA reviewing)
   - QAApproved (QA approved, CI/CD can proceed)
   - QARejected (QA rejected, dev must fix)
   - ValidationPassed (all checks passed)
   - ValidationFailed (checks failed, retry allowed)
   - Completed (payment distributed)
   - Failed (3+ failures, stake slashed)
3. State transition rules documented:
   - Open → Assigned (bid accepted)
   - Assigned → InProgress (PR submitted)
   - InProgress → QAInProgress (automated validation passed)
   - QAInProgress → QAApproved (QA score ≥ 80)
   - QAInProgress → QARejected (QA score < 80)
   - QAApproved → ValidationPassed (CI/CD passed)
   - ValidationPassed → Completed (payment distributed)
   - InProgress → ValidationFailed (automated validation failed)
   - ValidationFailed → InProgress (retry attempt)
   - ValidationFailed → Failed (failure_count ≥ 3)
4. Account size calculated for rent exemption
5. Anchor macros properly configured
6. Unit tests for account serialization/deserialization
7. Unit tests for state transitions (valid and invalid)
8. State transition diagram documented in architecture.md
9. Tests pass with `anchor test`

---

## Story 5.2: PullRequest and AutomatedValidation Accounts

As a platform developer,
I want to define PullRequest and AutomatedValidation account structures,
so that GitHub PR metadata and CI/CD validation results can be stored on-chain.

### Acceptance Criteria

1. `PullRequest` account structure defined:
   - story (Pubkey - parent story)
   - node (Pubkey - submitter)
   - pr_url (String - GitHub PR URL)
   - branch_name (String)
   - commit_sha (String - latest commit)
   - submission_arweave_tx (String - code archive)
   - status (enum: Open, ValidationPending, Passed, Failed)
   - submitted_at (i64)
   - last_updated (i64)
2. `AutomatedValidation` account structure defined:
   - pull_request (Pubkey - reference)
   - story (Pubkey - reference)
   - validation_type (enum: UnitTests, IntegrationTests, Linting, Build, TypeCheck, E2E)
   - passed (bool)
   - details (String - test results summary)
   - ci_run_url (String - GitHub Actions run URL)
   - run_at (i64)
3. Multiple AutomatedValidation accounts per PR (one per validation type)
4. Validation aggregation logic:
   - Query all AutomatedValidation accounts for PR
   - Check if all `passed == true`
   - If all passed → trigger QA workflow
   - If any failed → increment failure_count
5. Account structures include proper discriminators
6. Unit tests for account creation
7. Unit tests for validation aggregation logic
8. Tests pass with `anchor test`

---

## Story 5.3: Story Creation and Assignment Instructions

As a platform developer,
I want to implement Solana instructions for creating stories and assigning them to nodes with tier-based size limits,
so that project creators can post opportunities and nodes can be assigned work.

### Acceptance Criteria

1. `create_story` instruction implemented with parameters:
   - project (Pubkey)
   - story_id (String)
   - payment_amount (u64 - in lamports)
   - required_tier (u8 - minimum node tier)
2. Instruction validation:
   - Project creator is signer
   - Project has sufficient remaining budget
   - Payment amount ≥ $2.50 USD (via Pyth oracle)
   - Payment amount transferred to story escrow PDA
3. Story account created with status = "Open"
4. Event emitted: `StoryCreated { project, story_id, payment_amount }`
5. `assign_story` instruction implemented with parameters:
   - story (Pubkey)
   - node (Pubkey - winning bidder from Opportunity)
   - bid_amount (u64)
   - stake_amount (u64)
6. Instruction validation:
   - Opportunity bid exists and is lowest/accepted
   - Node tier meets required_tier
   - Payment amount within node's max story size: `floor(5 × pow(1.4, tier))`
   - Node has staked required amount
7. Story status updated to "Assigned"
8. Stake locked in story escrow PDA
9. Event emitted: `StoryAssigned { story, node, bid_amount, stake_amount }`
10. Unit tests for tier validation
11. Unit tests for max story size enforcement
12. Integration test: Create story → assign to node on devnet

---

## Story 5.4: PR Submission Instruction

As a platform developer,
I want to implement a Solana instruction for submitting pull requests that triggers validation workflow,
so that AI nodes can submit work and validation can begin automatically.

### Acceptance Criteria

1. `submit_pull_request` instruction implemented with parameters:
   - story (Pubkey)
   - node (Pubkey - must be assigned node)
   - pr_url (String)
   - branch_name (String)
   - commit_sha (String)
   - submission_arweave_tx (String)
2. Instruction validation:
   - Node is assigned to story
   - Story status is "Assigned" or "ValidationFailed" (retry)
   - PR URL format validation (GitHub URL)
   - Submission exists on Arweave (valid tx ID)
3. PullRequest account created
4. Story status updated to "InProgress"
5. Story staging_url updated (from PR metadata if available)
6. Event emitted: `PullRequestSubmitted { story, node, pr_url, commit_sha }`
7. If story status was "ValidationFailed" (retry attempt):
   - Do NOT increment failure_count yet (wait for validation results)
   - Log retry attempt
8. Unit tests for PR submission
9. Unit tests for retry scenario
10. Integration test: Submit PR on devnet story

---

## Story 5.5: Automated Validation Result Submission

As a platform developer,
I want to implement a Solana instruction that receives GitHub Actions webhook results and updates story validation status,
so that CI/CD results trigger on-chain state transitions automatically.

### Acceptance Criteria

1. `submit_validation_result` instruction implemented with parameters:
   - pull_request (Pubkey)
   - validation_type (enum: UnitTests, IntegrationTests, Linting, Build, TypeCheck, E2E)
   - passed (bool)
   - details (String - truncated test results)
   - ci_run_url (String)
2. Instruction validation:
   - Webhook authority is signer (platform-controlled keypair)
   - PullRequest account exists
   - Story is in "InProgress" status
3. AutomatedValidation account created with results
4. Validation aggregation logic executed:
   - Query all AutomatedValidation accounts for this PR
   - Check if all required validations submitted
   - Check if all validations passed
5. If all validations passed:
   - Update story status to "QAInProgress"
   - Create QA Opportunity (5% of story payment)
   - Emit `ValidationPassed` event
6. If any validation failed:
   - Increment story failure_count
   - Update story status to "ValidationFailed"
   - Emit `ValidationFailed` event
7. If failure_count < 3:
   - Allow retry (node can submit new PR)
8. If failure_count ≥ 3:
   - Trigger stake slashing (Story 5.7)
   - Update story status to "Failed"
9. Unit tests for validation result submission
10. Unit tests for aggregation logic (all passed vs some failed)
11. Integration test: Submit validation results, verify state transitions

---

## Story 5.6: Multi-Iteration Support

As a platform developer,
I want to implement multi-iteration support that allows nodes to retry after validation failures,
so that nodes can fix issues and resubmit without being slashed immediately.

### Acceptance Criteria

1. Retry logic implemented in `submit_pull_request` instruction:
   - Check current story status
   - If status is "ValidationFailed", allow retry
   - Do NOT increment failure_count on PR submission (only on validation failure)
2. Failure tracking:
   - failure_count increments only when validation fails (in Story 5.5)
   - failure_count max = 3 before slashing
3. Retry metadata tracked:
   - Store attempt_number in PullRequest account
   - First submission = attempt 1
   - Retry = attempt 2, 3, etc.
4. UI display shows retry attempts:
   - "Attempt 1 failed (tests), Attempt 2 in progress..."
5. Node notification on failure:
   - Event emitted with failure details
   - Node can query validation results from AutomatedValidation accounts
6. Grace period for retries:
   - Node has 24 hours to submit retry after failure
   - If no retry within 24 hours, story can be reassigned (optional)
7. Historical PR tracking:
   - Previous PullRequest accounts remain for audit trail
   - New PullRequest account created for each retry
8. Unit tests for retry workflow
9. Unit tests for failure counting
10. Integration test: Submit PR → fail validation → retry → pass validation

---

## Story 5.7: Stake Slashing Logic

As a platform developer,
I want to implement stake slashing logic that executes after 3 validation failures,
so that economic security is enforced and bad actors lose collateral.

### Acceptance Criteria

1. `slash_stake` instruction implemented (called automatically by validation result handler):
   - Triggered when failure_count ≥ 3
   - story (Pubkey)
   - node (Pubkey - node to be slashed)
2. Slashing distribution:
   - Calculate slash amount: Full stake amount
   - 50% to project escrow (refund to project creator)
   - 50% to burn address (11111111111111111111111111111112)
3. Payment refund:
   - Story payment returned to project escrow
   - Payment NOT given to node (work rejected)
4. Stake account updated:
   - Status set to "Slashed"
   - SlashEvent account created for audit trail
5. NodeRegistry updated:
   - Increment total_projects_attempted (NOT completed)
   - Add slash amount to stake_slashed field
   - Recalculate reputation tier (success rate decreases)
6. Story status updated to "Failed"
7. Event emitted: `StakeSlashed { story, node, slash_amount, reason }`
8. Opportunity reopened (optional):
   - Story can be reassigned to different node
   - New opportunity created with same payment
9. Unit tests for slashing calculation (50/50 split)
10. Unit tests for burn address transfer
11. Unit tests for reputation impact
12. Integration test: Trigger 3 failures, verify stake slashed

---

## Story 5.8: Payment Distribution

As a platform developer,
I want to implement payment distribution logic that splits payments 85% to developer, 5% to QA, and 10% to platform,
so that all contributors are compensated when stories complete successfully.

### Acceptance Criteria

1. `distribute_payment` instruction implemented (called automatically after ValidationPassed):
   - story (Pubkey)
   - developer_node (Pubkey)
   - qa_node (Pubkey)
2. Payment calculation:
   - Total story payment = payment_amount
   - Developer share = 85% of payment
   - QA share = 5% of payment
   - Platform fee = 10% of payment OR $0.25 (whichever is higher)
3. Minimum platform fee enforcement:
   - Calculate 10% of payment in USD
   - If 10% < $0.25, use $0.25 instead
   - Convert USD to lamports via Pyth oracle
4. Payment transfers:
   - Developer: 85% transferred from story escrow to developer node wallet
   - QA: 5% transferred to QA node wallet
   - Platform: Remaining % or $0.25 min transferred to platform wallet
5. Stake return:
   - Developer stake returned to developer node wallet
   - Stake account status updated to "Returned"
6. NodeRegistry updates:
   - Developer node: Increment completed_projects, add earnings, recalculate tier
   - QA node: Increment completed_projects, add earnings, recalculate tier
7. Story status updated to "Completed"
8. Event emitted: `PaymentDistributed { story, developer_amount, qa_amount, platform_fee }`
9. Unit tests for payment split calculation
10. Unit tests for minimum platform fee ($0.25)
11. Integration test: Complete story, verify 3-way payment distribution

---

## Story 5.9: Reputation Increment on Success

As a platform developer,
I want to automatically update node reputation when stories complete successfully,
so that nodes build reputation over time and earn lower staking requirements.

### Acceptance Criteria

1. `update_reputation` helper function called in `distribute_payment`:
   - Parameters: node (Pubkey), success (bool)
   - Updates NodeRegistry account
2. For successful completion (success = true):
   - Increment total_projects_completed
   - Increment total_projects_attempted
   - Recalculate tier using formula: `floor(sqrt(completed) × successRate)`
   - Recalculate success_rate: `completed / attempted`
   - Add payment to total_earnings
3. Reputation tier progression example:
   - Node completes first story: 1 completed, 1 attempted, 100% success → Tier 1
   - Node completes 4 stories: 4 completed, 4 attempted, 100% success → Tier 2
   - Node completes 25 stories: 25 completed, 25 attempted, 100% success → Tier 5
4. For failed completion (success = false):
   - Increment only total_projects_attempted (NOT completed)
   - Recalculate tier (success rate decreases)
   - Add slash amount to stake_slashed field
5. Stake multiplier recalculation:
   - New multiplier: `max(1.0, 5.0 × exp(-0.15 × tier))`
   - Stored in NodeRegistry for bidding reference
6. Max story size recalculation:
   - New max: `floor(5 × pow(1.4, tier))`
   - Determines which opportunities node can bid on
7. Event emitted: `ReputationUpdated { node, new_tier, success_rate, total_completed }`
8. Unit tests for reputation calculation on success
9. Unit tests for reputation calculation on failure
10. Integration test: Complete multiple stories, verify tier progression

---

**Epic 5 Success Criteria:**
- ✅ Story state machine implemented with all statuses (Open → Assigned → InProgress → QAInProgress → ValidationPassed → Completed)
- ✅ PR submission triggers automated validation workflow
- ✅ GitHub Actions webhook posts validation results to Solana
- ✅ Multi-iteration support allows up to 3 retry attempts
- ✅ Stake slashing executes after 3 failures (50% to project, 50% burned)
- ✅ Payment distribution implements 3-way split (85% dev, 5% QA, 10% platform with $0.25 minimum)
- ✅ Reputation automatically updates on story completion
- ✅ All integration tests pass on devnet
- ✅ Complete autonomous workflow from opportunity to payment

---
