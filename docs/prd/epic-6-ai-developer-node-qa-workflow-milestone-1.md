# Epic 6: AI Developer Node & QA Workflow (Milestone 1)

**Duration:** 6 weeks (4 weeks dev implementation, 2 weeks QA workflow parallel)

**Epic Goal:** Implement the complete AI developer node workflow that downloads stories from Arweave, generates code with tests using the LLM abstraction layer, submits pull requests with fork-based GitHub integration, monitors validation failures, and iterates until passing or aborting to prevent stake slashing. Add QA review workflow where QA AI nodes review code before final CI/CD validation, creating a two-stage quality gate (human-like code review + automated testing). This epic enables fully autonomous code generation and review with economic incentives ensuring quality.

---

## Story 6.1: Auto-Sharding System

As a platform developer,
I want to integrate md-tree for automatic document sharding,
so that large PRDs and architecture documents can be split into manageable sections for LLM context windows.

### Acceptance Criteria

1. md-tree library integrated into node codebase
2. `shardDocument(document: string, maxTokens: number)` function implemented:
   - Takes markdown document as input
   - Splits by headings (##, ###, ####) intelligently
   - Each shard stays within maxTokens limit (default: 8000 tokens)
   - Preserves document structure and references
3. Shard metadata generated:
   - Shard ID (e.g., "prd_section_2_3")
   - Heading hierarchy (e.g., "Epic 1 > Story 1.2")
   - Token count per shard
   - Parent document reference
4. Shard storage:
   - Shards cached locally after first download
   - Cache key: `{arweave_tx_id}_{shard_id}`
   - Cache invalidation: 24 hours
5. Reassembly function for full document viewing:
   - `reassembleDocument(shards: Shard[])` merges shards back
6. Edge case handling:
   - Very large sections (>maxTokens): Split further by paragraph
   - Documents without proper headings: Split by character count
7. Performance: Sharding <2 seconds for 100KB document
8. Unit tests for sharding logic
9. Unit tests for token counting accuracy
10. Integration test: Shard large PRD, verify all sections present

---

## Story 6.2: Relevant Section Identification

As an AI developer node,
I want to use AI to identify which architecture sections are relevant to my assigned story,
so that I load only necessary context and stay within LLM token limits.

### Acceptance Criteria

1. `identifyRelevantSections(story: Story, architecture: Architecture)` function implemented:
   - Uses LLM (via Story 3.6 abstraction layer) to analyze relevance
   - Prompt: "Given this story: {story}, which architecture sections are needed?"
   - Returns list of relevant section IDs
2. Relevance scoring:
   - Each architecture section scored 0-100 for relevance
   - Threshold: Include sections with score ≥ 70
3. Smart section selection:
   - Always include: Tech stack, validation strategy, project metadata
   - Conditionally include: Component diagrams, data models (if story touches those areas)
   - Exclude: Unrelated sections (e.g., frontend spec for backend story)
4. Context budget management:
   - Calculate total tokens for story + selected sections
   - If exceeds budget (e.g., 80K tokens), remove lowest-scoring sections
5. Caching:
   - Cache relevance analysis results per story
   - Avoids re-analyzing same story multiple times
6. Fallback strategy:
   - If LLM fails, include all core sections (tech stack, validation, top-level architecture)
7. Unit tests for relevance scoring
8. Integration test: Analyze story, verify correct sections identified
9. Performance: Relevance analysis <10 seconds per story

---

## Story 6.3: Context Loading

As an AI developer node,
I want to load story, relevant architecture sections, and PRD context from Arweave,
so that I have complete project context for code generation.

### Acceptance Criteria

1. `loadStoryContext(storyId: string, projectId: string)` function implemented:
   - Downloads PRD from Arweave (Epic 2)
   - Downloads architecture from Arweave
   - Downloads story document from Arweave
   - Shards documents if needed (Story 6.1)
   - Identifies relevant architecture sections (Story 6.2)
2. Context object structure:
   ```typescript
   interface StoryContext {
     story: {
       id: string;
       title: string;
       userStory: string;
       acceptanceCriteria: string[];
     };
     architecture: {
       techStack: ArchitectureTechStack;
       validationStrategy: ValidationStrategy;
       relevantSections: ArchitectureSection[];
     };
     prd: {
       goals: string[];
       requirements: string[];
       epic: Epic;
     };
     tokenCount: number;
   }
   ```
3. Token budget enforcement:
   - Maximum context size: 80K tokens (leaves room for LLM response)
   - Priority order: Story > Tech stack > Validation > Architecture sections > PRD
   - Truncate lowest priority items if budget exceeded
4. Context validation:
   - All required fields present
   - No malformed markdown
   - References valid (e.g., story ID matches)
5. Error handling:
   - Document not found on Arweave
   - Parse errors (malformed YAML/markdown)
   - Timeout errors
6. Performance metrics:
   - Context loading time logged
   - Token count logged
7. Unit tests for context assembly
8. Integration test: Load context for devnet story, verify all sections present
9. Cache integration: Context cached for retry attempts

---

## Story 6.4: GitHub Integration (Fork-Based)

As an AI developer node,
I want to use fork-based GitHub workflow to submit pull requests,
so that I don't need write access to client repositories and maintain security isolation.

### Acceptance Criteria

1. `forkRepository(repoUrl: string)` function implemented:
   - Checks if fork already exists for node's GitHub account
   - If not, creates fork via GitHub API
   - Returns fork URL
2. `createBranch(forkUrl: string, branchName: string, baseBranch: string)` function:
   - Creates new branch in fork from base branch
   - Branch name format: `story/{story_id}-{node_pubkey_short}`
   - Returns branch reference
3. `commitFiles(forkUrl: string, branch: string, files: File[], message: string)` function:
   - Commits generated code files to branch
   - Supports multiple files per commit
   - Commit message format: `Implement Story {story_id}: {story_title}`
4. `pushBranch(forkUrl: string, branch: string)` function:
   - Pushes branch to fork remote
   - Handles push errors (conflicts, auth)
5. `createPullRequest(forkUrl: string, upstreamUrl: string, branch: string, title: string, body: string)` function:
   - Creates PR from fork branch to upstream development branch
   - PR title: `Story {story_id}: {story_title}`
   - PR body includes story details, implementation notes, validation checklist
   - Returns PR URL
6. GitHub authentication:
   - Personal access token from node configuration
   - Token permissions: repo, workflow (for triggering CI)
7. Error handling:
   - Fork creation fails (rate limit, permissions)
   - Branch already exists (use unique suffix)
   - PR already exists (update existing PR)
8. Cleanup:
   - Option to delete branch after PR merged/closed
9. Unit tests for fork workflow
10. Integration test: Fork demo repo, create branch, commit file, open PR

---

## Story 6.5: Code Generation with Test Coverage

As an AI developer node,
I want to generate code with comprehensive test coverage using the LLM abstraction layer,
so that submitted work meets quality standards and passes automated validation.

### Acceptance Criteria

1. `generateCode(context: StoryContext, llmProvider: LLMProvider)` function implemented:
   - Constructs prompt with story context (from Story 6.3)
   - Includes BMAD developer agent instructions
   - Specifies required test coverage (unit + integration tests)
   - Calls LLM provider (from Story 3.6 abstraction layer)
   - Returns generated code + tests
2. Prompt structure:
   ```
   You are a senior software developer implementing a user story.

   Context:
   - Story: {userStory}
   - Acceptance Criteria: {acceptanceCriteria}
   - Tech Stack: {techStack}
   - Architecture: {relevantSections}

   Requirements:
   - Implement the story fully meeting all acceptance criteria
   - Write unit tests covering edge cases
   - Write integration tests for API endpoints/components
   - Follow project coding standards
   - Include inline comments for complex logic
   ```
3. Code extraction:
   - Parse LLM response for code blocks
   - Identify file paths from comments (e.g., `// File: src/api/users.ts`)
   - Separate implementation code from tests
4. Test coverage requirements:
   - Unit tests: Cover main function logic, edge cases, error handling
   - Integration tests: Cover API endpoints, database interactions
   - Test naming: Descriptive (e.g., `test_user_creation_with_valid_data`)
5. Code quality checks:
   - No placeholder code (e.g., "TODO", "implement this")
   - No hardcoded credentials
   - Proper error handling
6. File organization:
   - Implementation files: Respect architecture source tree
   - Test files: Follow project test conventions
7. Token management:
   - If context + response exceeds token limit, use multiple LLM calls
   - Split by file or feature
8. LLM provider selection:
   - Use primary provider from config (Story 3.6)
   - Fallback to secondary on failure
9. Unit tests for code extraction logic
10. Integration test: Generate code for test story, verify tests included

---

## Story 6.6: Validation Failure Monitoring

As an AI developer node,
I want to monitor GitHub Actions validation status via webhooks and events,
so that I know when my submission passes or fails and can react accordingly.

### Acceptance Criteria

1. `subscribeToValidationEvents(prUrl: string)` function implemented:
   - Polls GitHub Actions API for workflow run status
   - Or subscribes to GitHub webhooks if configured
   - Checks every 30 seconds for status updates
2. Validation status enum:
   - Pending: Validation not started or in progress
   - Passed: All checks passed
   - Failed: One or more checks failed
3. `getValidationResults(prUrl: string)` function:
   - Fetches detailed check run results from GitHub API
   - Returns results per check type (tests, linting, build, etc.)
   - Includes error logs for failed checks
4. Validation failure analysis:
   - Parse error messages from failed checks
   - Identify failure type (syntax error, test failure, lint error, build error)
   - Extract relevant error lines/files
5. Notification to node:
   - Emit event: `ValidationCompleted { pr, status, results }`
   - Node can query Solana for on-chain validation results
6. Timeout handling:
   - If validation doesn't complete within 30 minutes, mark as timeout
   - Node can decide to retry or abort
7. Status display:
   - Log validation progress to node console
   - Show which checks are running/passed/failed
8. Integration with Story 5.5:
   - Validation results eventually posted to Solana
   - Node queries both GitHub and Solana for complete picture
9. Unit tests for status parsing
10. Integration test: Submit PR, monitor validation, verify status updated

---

## Story 6.7: Auto-Fix Iteration

As an AI developer node,
I want to automatically analyze validation failures and generate fixes,
so that I can iterate toward passing validation without manual intervention.

### Acceptance Criteria

1. `analyzeFailed Validation(results: ValidationResults)` function implemented:
   - Parses error messages from failed checks
   - Identifies fixable errors vs structural issues
   - Categorizes errors: Syntax, test failures, lint violations, type errors
2. `generateFix(error: ValidationError, originalCode: string, context: StoryContext, llmProvider: LLMProvider)` function:
   - Constructs prompt with error details
   - Includes original code and error message
   - Asks LLM to fix specific error
   - Returns fixed code
3. Fix prompt structure:
   ```
   The following code failed validation with this error:
   {errorMessage}

   Original code:
   {originalCode}

   Please fix the error while maintaining all functionality and tests.
   ```
4. Batch fixing:
   - If multiple errors in same file, fix all in one LLM call
   - If errors in different files, process in parallel
5. Fix validation:
   - Verify fix doesn't introduce new issues
   - Ensure tests still cover same cases
   - Check that acceptance criteria still met
6. Retry workflow:
   - Apply fixes to code
   - Commit fixes to same branch (new commit)
   - Push to fork
   - Validation automatically re-runs via GitHub Actions
7. Failure count tracking:
   - Track attempts (1st submission, 1st retry, 2nd retry)
   - Abort after 2 retries to avoid 3rd failure (stake slashing)
8. Non-fixable errors:
   - If error is structural (e.g., story requirements impossible), abort
   - Log reason for abort
   - Return stake (no slashing if impossible requirements)
9. Unit tests for error parsing
10. Integration test: Submit code with test failure → auto-fix → resubmit → pass

---

## Story 6.8: Stake Awareness

As an AI developer node,
I want to track my failure count and abort after 2 failures,
so that I avoid the 3rd failure that triggers stake slashing.

### Acceptance Criteria

1. `trackFailureCount(storyId: string)` function implemented:
   - Queries Story account from Solana for failure_count
   - Stored locally in node state
   - Updated after each validation result
2. Failure count monitoring:
   - After 1st failure: Attempt auto-fix (Story 6.7)
   - After 2nd failure: Attempt auto-fix one more time
   - After 2nd retry fails: ABORT (do not submit 3rd attempt)
3. Abort logic:
   - If failure_count = 2 and retry also failed:
     - Do NOT submit another PR
     - Log abort reason
     - Notify operator
     - Mark story as "Unable to complete"
4. Stake protection calculation:
   - Calculate potential loss: stake_amount (could be 5x bid for Tier 0 node)
   - Display warning: "Risk of losing X SOL if 3rd failure occurs"
5. Operator notification:
   - Email/webhook notification on 2nd failure
   - Gives operator chance to intervene manually if desired
6. Economic decision logic:
   - If story payment < stake at risk, always abort after 2 failures
   - If story payment > stake at risk, operator can configure "aggressive" mode (allow 3 attempts)
7. Grace period:
   - Node holds stake for 24 hours after abort
   - Gives time for story to be reassigned or requirements clarified
8. Reputation impact of abort:
   - Abort does NOT count as "completed" project
   - Abort DOES count as "attempted" project (impacts success rate slightly)
   - Less severe than slashing (no stake loss)
9. Unit tests for failure tracking
10. Integration test: Trigger 2 failures, verify node aborts before 3rd

---

## Story 6.9: QA Opportunity Type

As a platform developer,
I want to add a QA opportunity type to the smart contract that auto-creates when developers submit PRs,
so that QA nodes can bid on code review work.

### Acceptance Criteria

1. `OpportunityType` enum extended in Solana program:
   - Existing: `Development`
   - New: `QAReview`
2. QA opportunity auto-creation in `submit_pull_request` instruction:
   - When dev submits PR and automated validation passes (Story 5.5)
   - Create new Opportunity with type = `QAReview`
   - Payment: 5% of original story payment
   - Required tier: 0 (any QA node can bid)
3. QA opportunity fields:
   - parent_story (Pubkey - links to dev story)
   - pr_url (String - GitHub PR to review)
   - submission_arweave_tx (String - code archive)
   - qa_checklist (String - which checklists to use)
4. QA assignment:
   - Lowest bidder wins (like dev opportunities)
   - QA node stakes based on tier (same staking formula)
   - Assigned QA node has 24 hours to complete review
5. QA escrow:
   - 5% payment locked in QA escrow when QA assigned
   - Released when QA review submitted and validated
6. Event emitted: `QAOpportunityCreated { story, pr_url, payment_amount }`
7. UI display:
   - QA opportunities shown in separate list for QA nodes
   - Links to parent story and PR
8. Unit tests for QA opportunity creation
9. Integration test: Dev submits PR → automated validation passes → QA opportunity created

---

## Story 6.10: QA BMAD Agent & Checklists

As a platform developer,
I want to create BMAD QA agent configuration and review checklists,
so that QA nodes have structured guidance for code reviews.

### Acceptance Criteria

1. BMAD QA agent file created: `.bmad-core/agents/bmad-qa-reviewer.yaml`
   - Agent name: "QA Reviewer"
   - Agent role: Code quality and security review
   - Agent instructions: Review code against checklists
2. QA review checklist created: `.bmad-core/checklists/qa-review-checklist.md`
   - Code Quality items:
     - Code meets acceptance criteria
     - Tests cover happy path and edge cases
     - Error handling implemented properly
     - No code smells (duplication, complexity)
     - Follows project coding standards
   - Functionality items:
     - Implements all user story requirements
     - Tests are meaningful (not just placeholders)
     - No obvious bugs or logic errors
   - Documentation items:
     - Code includes inline comments where needed
     - Complex logic explained
3. Security review checklist created: `.bmad-core/checklists/security-review-checklist.md`
   - Security items:
     - No hardcoded credentials
     - Input validation present
     - SQL injection prevention (if database code)
     - XSS prevention (if frontend code)
     - Authentication/authorization checks (if API code)
   - Each item scorable 0-100
4. Checklist scoring rubric:
   - 0-40: Major issues, needs significant rework
   - 41-79: Minor issues, needs fixes
   - 80-100: Acceptable quality, can proceed
5. QA agent prompt template:
   ```
   You are a senior QA reviewer evaluating code for a user story.

   Story: {userStory}
   Acceptance Criteria: {acceptanceCriteria}
   Code: {submittedCode}

   Review the code against the following checklist:
   {qAChecklist}

   For each item, provide:
   - Score (0-100)
   - Comments (what's good, what needs improvement)

   Final score: Average of all items
   ```
6. Agent execution:
   - Loads QA agent config
   - Loads checklists
   - Constructs prompt with story + code
   - Calls LLM (via Story 3.6 abstraction)
   - Returns QA report with scores
7. Unit tests for checklist parsing
8. Integration test: Execute QA agent with test code, verify report generated

---

## Story 6.11: QA Review Submission

As a QA node operator,
I want my node to submit code reviews on-chain with scores and feedback,
so that review results are permanently recorded and trigger workflow transitions.

### Acceptance Criteria

1. `QAReview` account structure defined in Solana program:
   - opportunity (Pubkey - QA opportunity reference)
   - story (Pubkey - parent dev story)
   - qa_node (Pubkey - reviewer)
   - pr_url (String)
   - overall_score (u8 - 0-100)
   - code_quality_score (u8)
   - security_score (u8)
   - comments (String - truncated feedback)
   - review_report_arweave_tx (String - full report on Arweave)
   - reviewed_at (i64)
2. `submit_qa_review` Solana instruction implemented:
   - Parameters: qa_opportunity, overall_score, comments, report_arweave_tx
   - Validation: QA node is assigned to opportunity
   - Creates QAReview account
   - Emits `QAReviewSubmitted` event
3. GitHub comment posting:
   - Node posts review feedback as GitHub PR comment
   - Comment includes:
     - Overall score
     - Key findings
     - Items to fix (if score < 80)
     - Link to full report on Arweave
   - Formatted markdown for readability
4. Review report structure (uploaded to Arweave):
   ```markdown
   # QA Review Report - Story {story_id}

   ## Overall Score: {score}/100

   ## Code Quality: {score}/100
   [checklist item scores and comments]

   ## Security: {score}/100
   [checklist item scores and comments]

   ## Recommendations
   [list of improvements]
   ```
5. Score thresholds:
   - Score ≥ 80: Approve (proceed to CI/CD)
   - Score < 80: Reject (dev must fix issues)
6. Integration with story state machine:
   - If approved: Story status → QAApproved (Story 6.12)
   - If rejected: Story status → QARejected (dev must address feedback)
7. Unit tests for review submission
8. Integration test: QA node submits review, verify GitHub comment and Solana account created

---

## Story 6.12: QA Integration with Story State Machine

As a platform developer,
I want to integrate QA workflow into the story state machine,
so that QA approval gates CI/CD validation and final payment.

### Acceptance Criteria

1. Story status enum extended (already in Story 5.1, verify here):
   - QAInProgress: QA node assigned, review in progress
   - QAApproved: QA score ≥ 80, can proceed to CI/CD
   - QARejected: QA score < 80, dev must fix and resubmit
2. State transitions updated:
   - InProgress → QAInProgress: Automated validation passed, QA opportunity created
   - QAInProgress → QAApproved: QA submits review with score ≥ 80
   - QAInProgress → QARejected: QA submits review with score < 80
   - QAApproved → ValidationPassed: CI/CD validation passes (final gate)
   - QARejected → InProgress: Dev fixes issues and resubmits PR
3. QA blocking logic:
   - CI/CD validation ONLY runs after QA approval
   - Prevents wasting CI resources on code that won't pass QA
4. QA timeout handling:
   - If QA node doesn't complete review within 24 hours:
     - Reassign to different QA node
     - Original QA node does NOT get slashed (review is effort-based)
5. Dev iteration after QA rejection:
   - Dev reads QA feedback from GitHub comment
   - Dev fixes issues using auto-fix iteration (Story 6.7) or manual fix
   - Dev pushes new commit to same PR
   - QA automatically re-reviews (or can be manual)
6. Multi-QA review (optional future enhancement):
   - For high-value stories (>$50), require 2 QA approvals
   - Both QAs must score ≥ 80
7. Event emissions:
   - `QAApproved { story, qa_node, score }`
   - `QARejected { story, qa_node, score, reason }`
8. Unit tests for state transitions
9. Integration test: Full workflow with QA gate (dev submit → QA review → approve → CI/CD → payment)

---

## Story 6.13: QA Payment & Slashing

As a platform developer,
I want to implement QA payment and slashing logic,
so that QA nodes are economically incentivized to provide accurate reviews.

### Acceptance Criteria

1. QA payment on story completion:
   - When story reaches "Completed" status (after CI/CD passes post-QA approval)
   - QA node receives 5% of story payment
   - Payment transferred from QA escrow to QA node wallet
   - QA stake returned
2. QA slashing scenario:
   - If QA approves code (score ≥ 80) but CI/CD catches failures:
     - QA made a bad approval (should have caught issues)
     - Slash QA stake 50% (same as dev slashing)
     - 50% to project escrow, 50% burned
3. Slashing trigger logic:
   - Story status: QAApproved (QA said it's good)
   - Then CI/CD validation fails (automated checks caught issues)
   - This proves QA missed problems
4. QA reputation impact:
   - Successful QA review (approved + CI/CD passes): Increment completed, tier up
   - Bad approval (approved + CI/CD fails): Increment attempted only, stake slashed, tier down
   - Rejection (rejected + dev eventually passes): No reputation change (correct rejection)
5. False reject protection:
   - If QA rejects (score < 80) but code would have passed CI/CD:
     - Dev can dispute (optional feature)
     - Or dev fixes and resubmits (normal flow)
   - No penalty for false rejects (being cautious is acceptable)
6. QA stake requirements:
   - Same formula as dev nodes: Tier-based multiplier
   - QA opportunity payment is small (5%), so stake is also small
7. Event emitted:
   - `QAPaymentDistributed { story, qa_node, amount }`
   - `QAStakeSlashed { story, qa_node, slash_amount, reason }`
8. Unit tests for QA payment calculation
9. Unit tests for QA slashing scenario
10. Integration test: QA approves bad code → CI/CD fails → QA stake slashed

---

**Epic 6 Success Criteria:**
- ✅ AI developer nodes generate code with comprehensive test coverage
- ✅ Fork-based GitHub workflow maintains security isolation
- ✅ Auto-fix iteration enables nodes to recover from validation failures
- ✅ Stake awareness prevents nodes from triggering slashing after 2 failures
- ✅ QA workflow adds human-like code review before final validation
- ✅ QA nodes economically incentivized to provide accurate reviews (payment for good reviews, slashing for bad approvals)
- ✅ Complete autonomous development + QA workflow (no human intervention required)
- ✅ All integration tests pass on devnet
- ✅ Context loading and relevance identification work within LLM token limits

---
