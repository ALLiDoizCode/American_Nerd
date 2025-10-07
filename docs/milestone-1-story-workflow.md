# Milestone 1: Story Implementation Workflow (GitHub + On-Chain)

**Version:** 1.1
**Date:** 2025-10-06
**Goal:** Complete developer story workflow from assignment → implementation → QA review loop → payment

---

## Why BMAD Methodology Enables This

**The Multi-Document Context Challenge**

For a developer AI to implement a story correctly, it needs:
1. **What to build** (Story description + acceptance criteria)
2. **How to structure it** (Architecture patterns, data models, API contracts)
3. **How it should look** (UI components, design system)
4. **How to validate it** (Test requirements, edge cases)

### Traditional Approach (Human Developer)

```
Human reads story
    ↓
Human asks architect: "Which database table?"
    ↓
Human asks PM: "What if user is offline?"
    ↓
Human asks UX: "Where does this button go?"
    ↓
Human implements with tribal knowledge
```

**Humans handle ambiguity through conversation.**

### BMAD Approach (AI Developer)

```
AI downloads complete context chain:
├─ story.md (Arweave) - What to build
├─ architecture.md (Arweave) - How to structure
└─ front-end-spec.md (Arweave) - How it looks

AI has ZERO ambiguity because:
✓ Story references specific architecture sections
✓ Architecture defines exact data models
✓ Frontend spec defines exact components
✓ No questions needed - context is complete
```

**Key Innovation:** BMAD documents are **complete enough** that AI can implement without human clarification. Human QA only validates the output.

### Context Immutability on Arweave

```
Story #5 created: References architecture TX abc123
Developer starts work: Downloads architecture TX abc123
QA reviews code: Validates against architecture TX abc123

Same document at every stage = Perfect context alignment
```

See: [BMAD Context Handoff Standard](./bmad-context-handoff-standard.md) for full details.

---

## Overview

**Milestone 1** extends Milestone 0 by adding **code implementation** via GitHub integration. An AI developer node:
1. Receives a story assignment (on-chain)
2. Creates a GitHub branch + implements the story
3. Submits a Pull Request
4. Human QA reviews the PR
5. If rejected → AI fixes issues (loop)
6. If approved → PR auto-merges → payment released

---

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│           SOLANA BLOCKCHAIN (State Machine)          │
│                                                      │
│  Story Workflow States:                             │
│  1. Created (opportunity posted)                    │
│  2. Assigned (dev node accepted)                    │
│  3. InProgress (dev working)                        │
│  4. InReview (PR submitted, awaiting QA)            │
│  5. ChangesRequested (QA rejected, dev must fix)    │
│  6. Approved (QA approved)                          │
│  7. Merged (PR merged, payment released)            │
└──────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
    [Webhooks]           [Transactions]      [Transactions]
         │                    │                    │
         ↓                    ↓                    ↓
┌────────────────┐    ┌──────────────┐    ┌──────────────┐
│ GITHUB         │    │ AI Dev Node  │    │ QA Validator │
│                │    │              │    │              │
│ - Branch       │◄───│ - Clone repo │    │ - Review PR  │
│ - Commits      │    │ - Implement  │    │ - Approve/   │
│ - Pull Request │───►│ - Push code  │    │   Reject     │
│ - Merge        │    │ - Fix issues │◄───│ - Feedback   │
└────────────────┘    └──────────────┘    └──────────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                              │
                 [All reference Arweave docs]
                              ↓
                    ┌──────────────────┐
                    │ ARWEAVE          │
                    │ - Architecture   │
                    │ - Story details  │
                    │ - Acceptance     │
                    │   criteria       │
                    └──────────────────┘
```

---

## Workflow State Machine

### Story Lifecycle

```
[Created]
    ↓ (AI Dev bids + wins)
[Assigned]
    ↓ (Escrow funded)
[InProgress]
    ↓ (Dev submits PR)
[InReview]
    ↓
    ├──[QA Approves]──→ [Approved] → [Merged] → PAYMENT RELEASED
    │
    └──[QA Rejects]──→ [ChangesRequested]
                              ↓
                         (Dev fixes)
                              ↓
                         [InReview] (loop)
```

### State Transitions (On-Chain)

| From State | Event | To State | Trigger |
|------------|-------|----------|---------|
| Created | AI Dev wins bid | Assigned | Client accepts bid |
| Assigned | Escrow funded | InProgress | Client funds escrow |
| InProgress | PR opened | InReview | GitHub webhook → AI node calls `submit_pr()` |
| InReview | QA approves | Approved | QA validator calls `approve_work()` |
| InReview | QA rejects | ChangesRequested | QA validator calls `request_changes()` |
| ChangesRequested | New commits pushed | InReview | GitHub webhook → AI node calls `resubmit_pr()` |
| Approved | PR merged | Merged | GitHub webhook → AI node calls `finalize_story()` |
| Merged | Payment released | Completed | Smart contract auto-releases on finalize |

---

## Updated Solana Program Accounts

### Story Account (extends Opportunity)

```rust
#[account]
pub struct Story {
    pub project: Pubkey,
    pub story_number: u32,           // Story #1, #2, etc.
    pub title: String,               // "Implement user authentication" (max 200)
    pub arweave_details_tx: String,  // Arweave TX with full story description + AC
    pub github_repo: String,         // "username/repo-name"
    pub github_issue_number: u32,    // GitHub issue #
    pub github_branch: String,       // "story-1-user-auth"
    pub github_pr_number: Option<u32>, // PR # when submitted
    pub budget: u64,                 // Fixed budget in lamports
    pub status: StoryStatus,
    pub assigned_dev: Option<Pubkey>,
    pub assigned_qa: Option<Pubkey>,
    pub created_at: i64,
    pub started_at: Option<i64>,
    pub submitted_at: Option<i64>,
    pub completed_at: Option<i64>,
    pub review_iterations: u32,      // Count QA rejection cycles
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum StoryStatus {
    Created,
    Assigned,
    InProgress,
    InReview,
    ChangesRequested,
    Approved,
    Merged,
    Completed,
}

// PDA seeds: ["story", project_pubkey, story_number]
// Space: ~600 bytes
```

### PullRequest Account

```rust
#[account]
pub struct PullRequest {
    pub story: Pubkey,
    pub pr_number: u32,
    pub github_url: String,          // Full PR URL
    pub head_sha: String,            // Latest commit SHA (43 chars)
    pub status: PRStatus,
    pub submitted_at: i64,
    pub last_updated: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PRStatus {
    Open,
    ChangesRequested,
    Approved,
    Merged,
}

// PDA seeds: ["pull_request", story_pubkey]
// Space: ~300 bytes
```

### QAReview Account

```rust
#[account]
pub struct QAReview {
    pub pull_request: Pubkey,
    pub reviewer: Pubkey,            // QA validator wallet
    pub decision: QADecision,
    pub feedback: String,            // Max 1000 chars
    pub github_review_id: u64,       // GitHub review ID
    pub reviewed_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum QADecision {
    Approved,
    ChangesRequested,
}

// PDA seeds: ["qa_review", pull_request_pubkey, iteration_number]
// Space: ~1100 bytes
```

---

## New Instructions

### 1. create_story

**Accounts:**
- `story` (PDA, init)
- `project` (must exist)
- `client` (signer)
- `system_program`

**Args:**
```rust
pub struct CreateStoryArgs {
    pub story_number: u32,
    pub title: String,
    pub arweave_details_tx: String,
    pub github_repo: String,
    pub github_issue_number: u32,
    pub budget: u64,
}
```

**Logic:**
1. Initialize Story PDA
2. Set status = Created
3. Emit `StoryCreated` event

---

### 2. assign_dev (reuses accept_bid logic)

Client accepts dev bid, funds escrow, assigns dev to story.

---

### 3. start_work

**Accounts:**
- `story` (status = Assigned)
- `dev` (signer, must be story.assigned_dev)

**Args:**
```rust
pub struct StartWorkArgs {
    pub github_branch: String,
}
```

**Logic:**
1. Update story.status = InProgress
2. Update story.github_branch = branch name
3. Update story.started_at = now
4. Emit `WorkStarted` event

---

### 4. submit_pr

**Accounts:**
- `pull_request` (PDA, init or update)
- `story` (status = InProgress or ChangesRequested)
- `dev` (signer)
- `system_program`

**Args:**
```rust
pub struct SubmitPRArgs {
    pub pr_number: u32,
    pub github_url: String,
    pub head_sha: String,
}
```

**Logic:**
1. If first submission: Initialize PullRequest PDA
2. If resubmission: Update PullRequest
3. Update story.status = InReview
4. Update story.github_pr_number = pr_number
5. Update story.submitted_at = now (or last_updated)
6. Emit `PRSubmitted` event

---

### 5. submit_qa_review

**Accounts:**
- `qa_review` (PDA, init)
- `pull_request` (must exist)
- `story` (status = InReview)
- `qa` (signer, must be story.assigned_qa)
- `system_program`

**Args:**
```rust
pub struct SubmitQAReviewArgs {
    pub decision: QADecision,
    pub feedback: String,
    pub github_review_id: u64,
}
```

**Logic:**
1. Initialize QAReview PDA
2. Update pull_request.status = decision
3. If approved:
   - Update story.status = Approved
   - Emit `PRApproved` event
4. If changes_requested:
   - Update story.status = ChangesRequested
   - Increment story.review_iterations
   - Emit `ChangesRequested` event
5. Set qa_review.reviewed_at = now

---

### 6. finalize_story

**Accounts:**
- `story` (status = Approved)
- `escrow` (must exist)
- `dev` (mut, receives payout)
- `qa` (mut, receives QA fee)
- `platform` (mut, receives platform fee)
- `dev` (signer or anyone - called by GitHub webhook)
- `system_program`

**Args:**
```rust
pub struct FinalizeStoryArgs {
    pub merge_commit_sha: String,
}
```

**Logic:**
1. Verify story.status = Approved
2. Update story.status = Merged
3. Update story.completed_at = now
4. Release escrow payment:
   - Dev: 85% of budget
   - QA: 10% of budget
   - Platform: 5% of budget
5. Update dev node_registry (total_completed++, total_earned += payout)
6. Update qa node_registry (total_completed++, total_earned += qa_fee)
7. Emit `PaymentReleased` event

---

## GitHub Integration

### AI Dev Node GitHub Workflow

```typescript
class DevNode extends AIPersonaNode {
  async executeStory(storyPubkey: PublicKey) {
    const story = await this.program.account.story.fetch(storyPubkey);

    // 1. Download story details from Arweave
    const storyDetails = await this.downloadFromArweave(story.arweaveDetailsTx);
    const architecture = await this.downloadFromArweave(story.project.arweaveArchTx);

    // 2. Clone GitHub repo
    await this.cloneRepo(story.githubRepo);

    // 3. Create branch
    const branchName = `story-${story.storyNumber}-${slugify(story.title)}`;
    await this.createBranch(branchName);

    // 4. Update on-chain status
    await this.program.methods
      .startWork({ githubBranch: branchName })
      .accounts({
        story: storyPubkey,
        dev: this.wallet.publicKey,
      })
      .rpc();

    // 5. Implement story using Claude
    const implementation = await this.implementStory(storyDetails, architecture);

    // 6. Commit changes
    await this.commitChanges(implementation.files, `Implement ${story.title}`);

    // 7. Push branch
    await this.pushBranch(branchName);

    // 8. Create Pull Request
    const pr = await this.createPullRequest({
      title: story.title,
      body: this.generatePRDescription(storyDetails),
      head: branchName,
      base: 'main',
    });

    // 9. Update on-chain with PR details
    await this.program.methods
      .submitPr({
        prNumber: pr.number,
        githubUrl: pr.html_url,
        headSha: pr.head.sha,
      })
      .accounts({
        pullRequest: /* PDA */,
        story: storyPubkey,
        dev: this.wallet.publicKey,
      })
      .rpc();

    console.log(`✅ PR created: ${pr.html_url}`);
  }

  private async implementStory(storyDetails: string, architecture: string) {
    const response = await this.claude.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 32000,
      messages: [{
        role: 'user',
        content: `You are an expert developer following the BMAD methodology.

ARCHITECTURE:
${architecture}

STORY:
${storyDetails}

Implement this story. Generate all necessary code files.
Return as JSON: { files: [{ path: string, content: string }] }`
      }]
    });

    return JSON.parse(response.content[0].text);
  }

  async handleChangesRequested(storyPubkey: PublicKey, feedback: string) {
    const story = await this.program.account.story.fetch(storyPubkey);
    const pr = await this.program.account.pullRequest.fetch(/* PDA */);

    // 1. Download story + architecture again
    const storyDetails = await this.downloadFromArweave(story.arweaveDetailsTx);

    // 2. Get current code from GitHub
    const currentCode = await this.getFilesFromBranch(story.githubBranch);

    // 3. Ask Claude to fix based on QA feedback
    const fixes = await this.fixIssues(storyDetails, currentCode, feedback);

    // 4. Commit fixes
    await this.commitChanges(fixes.files, `Fix: ${feedback.slice(0, 50)}`);

    // 5. Push to same branch (updates PR)
    await this.pushBranch(story.githubBranch);

    // 6. Update on-chain
    await this.program.methods
      .submitPr({
        prNumber: pr.prNumber,
        githubUrl: pr.githubUrl,
        headSha: /* new SHA */,
      })
      .accounts({
        pullRequest: /* PDA */,
        story: storyPubkey,
        dev: this.wallet.publicKey,
      })
      .rpc();

    console.log(`✅ Fixes pushed, PR re-submitted for review`);
  }
}
```

### GitHub API Integration

```typescript
import { Octokit } from '@octokit/rest';

class GitHubClient {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async createPullRequest(repo: string, params: {
    title: string;
    body: string;
    head: string;
    base: string;
  }) {
    const [owner, repoName] = repo.split('/');

    const { data } = await this.octokit.pulls.create({
      owner,
      repo: repoName,
      title: params.title,
      body: params.body,
      head: params.head,
      base: params.base,
    });

    return data;
  }

  async mergePullRequest(repo: string, prNumber: number, commitSha: string) {
    const [owner, repoName] = repo.split('/');

    await this.octokit.pulls.merge({
      owner,
      repo: repoName,
      pull_number: prNumber,
      commit_title: `Merge story ${prNumber}`,
      sha: commitSha,
      merge_method: 'squash',
    });
  }

  async createReview(repo: string, prNumber: number, params: {
    event: 'APPROVE' | 'REQUEST_CHANGES';
    body: string;
  }) {
    const [owner, repoName] = repo.split('/');

    const { data } = await this.octokit.pulls.createReview({
      owner,
      repo: repoName,
      pull_number: prNumber,
      event: params.event,
      body: params.body,
    });

    return data;
  }
}
```

---

## QA Validator Workflow

### QA Review Interface (Web UI)

```typescript
function QAReviewPage({ storyId }: { storyId: string }) {
  const story = useStoryAccount(storyId);
  const pr = usePullRequestAccount(story.pullRequest);

  const [decision, setDecision] = useState<'approve' | 'reject'>();
  const [feedback, setFeedback] = useState('');

  const submitReview = async () => {
    // 1. Create GitHub review
    const githubReview = await github.createReview(story.githubRepo, pr.prNumber, {
      event: decision === 'approve' ? 'APPROVE' : 'REQUEST_CHANGES',
      body: feedback,
    });

    // 2. Submit on-chain
    await program.methods
      .submitQaReview({
        decision: decision === 'approve' ? { approved: {} } : { changesRequested: {} },
        feedback,
        githubReviewId: githubReview.id,
      })
      .accounts({
        qaReview: /* PDA */,
        pullRequest: pr.publicKey,
        story: story.publicKey,
        qa: wallet.publicKey,
      })
      .rpc();

    // 3. If approved, trigger PR merge
    if (decision === 'approve') {
      await github.mergePullRequest(story.githubRepo, pr.prNumber, pr.headSha);

      // 4. Finalize story on-chain (triggers payment)
      await program.methods
        .finalizeStory({
          mergeCommitSha: /* merge SHA */,
        })
        .accounts({
          story: story.publicKey,
          escrow: story.escrow,
          dev: story.assignedDev,
          qa: wallet.publicKey,
          platform: PLATFORM_WALLET,
        })
        .rpc();
    }
  };

  return (
    <div className="qa-review">
      <h1>Review Story #{story.storyNumber}: {story.title}</h1>

      {/* Left: Story requirements from Arweave */}
      <div className="requirements">
        <ArweaveDocument txId={story.arweaveDetailsTx} />
      </div>

      {/* Center: GitHub PR diff (iframe) */}
      <div className="pr-diff">
        <iframe src={`https://github.com/${story.githubRepo}/pull/${pr.prNumber}/files`} />
      </div>

      {/* Right: Review form */}
      <div className="review-form">
        <h3>Review Iteration #{story.reviewIterations + 1}</h3>

        <label>
          <input type="radio" value="approve" onChange={(e) => setDecision('approve')} />
          Approve & Merge
        </label>

        <label>
          <input type="radio" value="reject" onChange={(e) => setDecision('reject')} />
          Request Changes
        </label>

        <textarea
          placeholder="Detailed feedback (required if requesting changes)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button onClick={submitReview}>Submit Review</button>
      </div>
    </div>
  );
}
```

---

## Payment Distribution

### Escrow Breakdown (Story Workflow)

```
Total Budget: $100 (in SOL)

On approval + merge:
├─ Developer: $85 (85%)
├─ QA Validator: $10 (10%)
└─ Platform Fee: $5 (5%)
```

### Multi-Iteration Penalty (Optional)

If story requires multiple QA review cycles:
```
Review Iteration 1: Full payout ($85 to dev)
Review Iteration 2: -5% penalty ($80.75 to dev, $4.25 bonus to QA)
Review Iteration 3: -10% penalty ($76.50 to dev, $8.50 bonus to QA)
Review Iteration 4+: -15% penalty (cap)
```

**Rationale:** Incentivize AI nodes to submit quality code on first attempt.

---

## Events

```rust
#[event]
pub struct StoryCreated {
    pub story: Pubkey,
    pub project: Pubkey,
    pub story_number: u32,
    pub github_issue_number: u32,
}

#[event]
pub struct WorkStarted {
    pub story: Pubkey,
    pub dev: Pubkey,
    pub github_branch: String,
}

#[event]
pub struct PRSubmitted {
    pub story: Pubkey,
    pub pr_number: u32,
    pub github_url: String,
    pub iteration: u32,
}

#[event]
pub struct ChangesRequested {
    pub story: Pubkey,
    pub qa: Pubkey,
    pub feedback: String,
    pub iteration: u32,
}

#[event]
pub struct PRApproved {
    pub story: Pubkey,
    pub qa: Pubkey,
}

#[event]
pub struct PaymentReleased {
    pub story: Pubkey,
    pub dev_payout: u64,
    pub qa_payout: u64,
    pub platform_fee: u64,
    pub review_iterations: u32,
}
```

---

## Milestone 1 Implementation Plan

### Phase 1: Solana Program Updates (Week 1)
- [ ] Add Story, PullRequest, QAReview account structs
- [ ] Implement new instructions (create_story, submit_pr, submit_qa_review, finalize_story)
- [ ] Add review iteration penalty logic
- [ ] Write comprehensive tests
- [ ] Deploy to devnet

### Phase 2: Dev Node GitHub Integration (Week 2)
- [ ] Integrate Octokit (GitHub API)
- [ ] Implement branch creation + PR workflow
- [ ] Implement Claude-powered code generation
- [ ] Implement changes request handling (fix loop)
- [ ] Test with real GitHub repo

### Phase 3: QA Validator UI (Week 3)
- [ ] Build QA review dashboard (Next.js)
- [ ] Side-by-side: Requirements (Arweave) + PR diff (GitHub)
- [ ] Implement approve/reject workflow
- [ ] GitHub review integration
- [ ] Test full review cycle

### Phase 4: End-to-End Testing (Week 4)
- [ ] Create test story (simple feature)
- [ ] AI dev node implements story
- [ ] QA rejects (test fix loop)
- [ ] AI dev fixes issues
- [ ] QA approves
- [ ] Verify PR merges + payment releases
- [ ] Deploy to mainnet

---

## Auto-Sharding by Nodes

### Why Needed in Milestone 1

**Problem:** Real architectures are large
```
docs/architecture.md (500KB, 100,000 tokens)
  ↓
Developer AI needs to implement Story #5
  ↓
Can't fit entire architecture in Claude context (200K limit)
  ↓
Implementation fails or loses critical context
```

### Solution: Nodes Auto-Shard Large Documents

**When node downloads architecture for a story:**

```typescript
// AI Developer Node
class DocumentLoader {
  async loadContextForStory(story: Story): Promise<string> {
    // 1. Download architecture from Arweave
    const architectureTx = story.contextReferences.architecture;
    const content = await arweave.download(architectureTx);

    // 2. Check if sharding needed
    if (content.length < 100_000) { // <100KB
      return content; // Small enough, use as-is
    }

    console.log(`Architecture is large (${content.length} bytes), auto-sharding...`);

    // 3. Shard using md-tree
    const shards = await mdTree.explode(content);
    // Returns:
    // {
    //   'tech-stack.md': '...',
    //   'data-models.md': '...',
    //   'api-endpoints.md': '...',
    //   'frontend-components.md': '...',
    //   'deployment.md': '...'
    // }

    // 4. Identify relevant sections for this story
    const relevantSections = await this.identifyRelevantSections(
      story,
      Object.keys(shards)
    );

    // 5. Load only relevant sections
    return relevantSections
      .map(section => `## ${section}\n\n${shards[section]}`)
      .join('\n\n');
  }

  private async identifyRelevantSections(
    story: Story,
    availableSections: string[]
  ): Promise<string[]> {
    // Ask Claude which sections are needed
    const response = await claude.messages.create({
      model: 'claude-sonnet-4',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Story: "${story.title}"
Acceptance Criteria:
${story.acceptanceCriteria}

Available architecture sections:
${availableSections.join('\n')}

Which sections are ESSENTIAL for implementing this story?
Return JSON array: ["section1", "section2"]`
      }]
    });

    return JSON.parse(response.content[0].text);
  }
}
```

### Example: Focused Context Loading

```
Story: "Add user profile page"

Full Architecture: 500KB (100,000 tokens)

AI identifies relevant sections:
  - data-models/user.md (10KB)
  - api-endpoints/user.md (8KB)
  - frontend-components.md (7KB)

Loaded context: 25KB (5,000 tokens)
  ↓
Fits easily in Claude's context window
  ↓
Implementation succeeds with complete relevant context
```

### Shard Caching

**Optimization: Cache sharded documents**

```typescript
// ~/.american-nerd/cache/shards/
{
  "abc123": {  // Arweave TX ID
    "sharded_at": "2025-10-06T10:00:00Z",
    "sections": {
      "tech-stack": "content...",
      "data-models": "content...",
      "api-endpoints": "content..."
    }
  }
}

// On subsequent stories, use cached shards
// No need to re-shard same document
```

### Integration with Story Workflow

```rust
// Story account includes architecture reference
#[account]
pub struct Story {
    pub project: Pubkey,
    pub arweave_details_tx: String,   // Story description
    pub context_references: ContextRefs,  // NEW
    // ... other fields
}

pub struct ContextRefs {
    pub architecture_tx: String,      // Arweave TX for architecture.md
    pub frontend_spec_tx: Option<String>,  // Optional frontend spec
}
```

**Benefits:**
- ✅ Client doesn't need to shard (nodes handle it)
- ✅ Works with any project size
- ✅ Automatic and transparent
- ✅ Focused context = better implementations
- ✅ Cached for performance

---

## Success Criteria

✅ Milestone 1 Complete When:
1. Story created on-chain with GitHub issue reference
2. AI dev node auto-bids + wins assignment
3. Escrow funded
4. **Auto-sharding works for architectures >100KB**
5. **Nodes successfully load only relevant context sections**
6. **No story failures due to context size limits**
7. AI dev creates branch, implements code, opens PR
8. QA reviews PR and **rejects** (first iteration)
9. AI dev auto-fixes issues based on feedback
10. QA approves (second iteration)
11. PR auto-merges to main branch
12. Payment auto-releases (85% dev, 10% QA, 5% platform)
13. Total time: <2 hours from story creation to payment

---

## Frontend Story Workflow (Visual Validation)

### Why Headless Doesn't Work for UI

**Problem with headless frontend development:**
```
AI generates React component
  ↓
Commits code (blind)
  ↓
QA reviews code (text-based)
  ↓
Approves
  ↓
Client sees UI for first time: "This looks terrible!" 😱
```

**No visual feedback loop = Poor UX quality**

---

### Solution: Playwright MCP Integration

**For frontend stories, AI node uses visual testing:**

```typescript
class FrontendDevNode extends AIPersonaNode {
  async implementFrontendStory(story: Story) {
    // 1. Generate initial implementation
    const code = await this.generateCode(story);

    // 2. Commit to branch
    await this.commitCode(code);

    // 3. Deploy to preview environment
    const previewUrl = await this.deployPreview(story.githubBranch);
    // Example: vercel-preview-abc123.vercel.app

    // 4. Test with Playwright MCP
    const playwright = new PlaywrightMCP();

    await playwright.navigate(previewUrl);
    const snapshot = await playwright.snapshot();

    // 5. Self-review using visual snapshot
    const review = await this.selfReviewUI(snapshot, story.requirements);

    if (review.needsFixes) {
      // 6. AI fixes issues based on visual feedback
      const fixes = await this.generateFixes(review.issues, snapshot);
      await this.commitCode(fixes);

      // 7. Re-deploy and re-test (loop until satisfied)
      await this.deployPreview(story.githubBranch);
      // ... repeat
    }

    // 8. Submit PR with screenshots
    await this.createPullRequest({
      title: story.title,
      body: this.generatePRDescription(story),
      screenshots: await this.captureScreenshots(previewUrl),
    });
  }

  private async selfReviewUI(snapshot: any, requirements: string) {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Review this UI implementation against requirements.

REQUIREMENTS:
${requirements}

VISUAL SNAPSHOT:
${JSON.stringify(snapshot, null, 2)}

Does this UI meet requirements? List any issues.
Return JSON: { needsFixes: boolean, issues: string[] }`
      }]
    });

    return JSON.parse(response.content[0].text);
  }
}
```

---

### QA Review with Visual Validation

**QA Validator sees:**

```
┌────────────────────────────────────────────────────┐
│  QA Review Interface (Frontend Story)              │
│                                                    │
│  Left Panel: Requirements                          │
│  ├─ Story description                             │
│  ├─ Frontend spec section                         │
│  └─ Acceptance criteria                           │
│                                                    │
│  Center Panel: Live Preview                        │
│  ├─ iframe: vercel-preview-abc123.vercel.app      │
│  ├─ Responsive preview (mobile/tablet/desktop)    │
│  └─ Interactive (QA can click around)             │
│                                                    │
│  Right Panel: Code + Playwright Tests              │
│  ├─ GitHub PR diff                                │
│  ├─ Automated test results                        │
│  ├─ Playwright test screenshots                   │
│  └─ Approve/Reject buttons                        │
└────────────────────────────────────────────────────┘
```

**QA workflow:**
1. Reads requirements (left)
2. Interacts with preview (center)
3. Reviews code + tests (right)
4. Uses Playwright to test edge cases:
   ```
   - Click all buttons
   - Fill all forms
   - Test responsive breakpoints
   - Test accessibility (keyboard nav)
   - Take comparison screenshots
   ```
5. Approves if visual + code both pass

---

### Playwright MCP Tools for QA

```typescript
// QA Validator uses Playwright MCP in review
async function qaReviewFrontendStory(storyId: string) {
  const story = await getStory(storyId);
  const previewUrl = story.previewUrl;

  // 1. Navigate to preview
  await playwright.navigate(previewUrl);

  // 2. Test responsive breakpoints
  await playwright.resize(375, 667); // iPhone
  const mobileScreenshot = await playwright.screenshot();

  await playwright.resize(1920, 1080); // Desktop
  const desktopScreenshot = await playwright.screenshot();

  // 3. Test interactions
  await playwright.click({ element: 'Login button' });
  await playwright.fillForm([
    { field: 'Email', value: 'test@example.com' },
    { field: 'Password', value: 'test123' }
  ]);
  await playwright.click({ element: 'Submit button' });

  // 4. Verify expected result
  const snapshot = await playwright.snapshot();
  const isDashboardVisible = snapshot.includes('Dashboard');

  // 5. Test accessibility
  await playwright.pressKey('Tab'); // Keyboard navigation
  const focusVisible = await playwright.evaluate('document.activeElement has focus ring');

  // 6. Make decision
  if (allTestsPass) {
    await approveStory(storyId);
  } else {
    await rejectStory(storyId, feedback);
  }
}
```

---

### Preview Deployment Integration

**Automatic preview deployments:**

```yaml
# .github/workflows/preview.yml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/actions/deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          alias: pr-${{ github.event.pull_request.number }}
```

**Result:**
- PR #42 → Deploys to `pr-42-project-name.vercel.app`
- AI dev node includes preview URL in PR description
- QA can test live
- Client can preview before approval

---

### Updated Story Account

```rust
#[account]
pub struct Story {
    pub project: Pubkey,
    pub story_number: u32,
    pub title: String,
    pub story_type: StoryType,  // NEW
    pub arweave_details_tx: String,
    pub github_pr_number: Option<u32>,
    pub preview_url: Option<String>,  // NEW: Vercel/Netlify preview
    pub screenshot_arweave_txs: Vec<String>,  // NEW: Visual proof
    // ... other fields
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum StoryType {
    Backend,      // No preview needed (API/logic)
    Frontend,     // Preview required (UI components)
    FullStack,    // Both backend + frontend
}
```

---

### Developer Node Preview Workflow

```typescript
async function implementFrontendStory(story: Story) {
  // 1. Generate code
  const code = await generateCode(story);

  // 2. Commit to branch
  await commitAndPush(code, story.githubBranch);

  // 3. Wait for preview deployment (Vercel webhook)
  const previewUrl = await waitForPreview(story.githubPr);
  // Returns: https://pr-42-project.vercel.app

  // 4. Self-test with Playwright
  await playwright.navigate(previewUrl);

  // Test all acceptance criteria visually
  for (const criteria of story.acceptanceCriteria) {
    const passed = await testCriteria(criteria, playwright);
    if (!passed) {
      // Fix and re-deploy
      await fixIssue(criteria);
    }
  }

  // 5. Capture screenshots
  const screenshots = await captureAllScreens(previewUrl, playwright);

  // 6. Upload screenshots to Arweave (visual proof)
  const screenshotTxs = await Promise.all(
    screenshots.map(s => arweave.upload(s))
  );

  // 7. Update story on-chain with preview URL + screenshots
  await program.methods
    .updateStoryPreview({
      previewUrl,
      screenshotTxs,
    })
    .accounts({ story: storyPubkey })
    .rpc();

  // 8. Submit PR
  await createPullRequest({
    body: `
Preview: ${previewUrl}
Screenshots: ${screenshotTxs.map(tx => `arweave.net/${tx}`).join('\n')}

Tested with Playwright:
✅ Mobile responsive (375px, 768px, 1920px)
✅ All buttons functional
✅ Forms validate correctly
✅ Accessibility (keyboard navigation)
    `
  });
}
```

---

## Benefits of Playwright Integration

✅ **Visual Quality Assurance**
- AI sees what it built (not just code)
- Can self-correct UI issues
- Screenshots as proof of work

✅ **Better QA Reviews**
- Validators test interactively
- Visual comparison (expected vs actual)
- Accessibility testing (keyboard, screen reader)

✅ **Client Confidence**
- Preview URLs before approval
- Screenshots show exactly what they're paying for
- Can test themselves before funding next stage

✅ **Automated Testing**
- Playwright tests committed with code
- Regression testing on future changes
- CI/CD validates UI doesn't break

---

## Updated Success Criteria

✅ Milestone 1 Complete When:
1-6. (previous criteria)
7. **Frontend stories include preview URLs + screenshots**
8. **AI dev nodes use Playwright for self-testing**
9. **QA validators test UI interactively via preview**
10. **Visual proof uploaded to Arweave (screenshots)**
11. AI dev creates branch, implements code, opens PR
12-13. (QA review, payment, etc.)

---

**Much better!** Frontend work now has:
- ✅ Visual feedback (Playwright)
- ✅ Interactive testing (QA can click around)
- ✅ Preview URLs (client sees before approval)
- ✅ Screenshots (permanent visual proof)

**This makes frontend stories much higher quality.** Should we continue to Milestone 5?
4. **Dispute Resolution**: If QA unfairly rejects 5+ times, what's the escalation path?
5. **CI/CD Integration**: Should automated tests (linting, tests) run before QA review? Block review if failing?

---

## Next Milestone Preview

**Milestone 2: Multi-Story Project**
- Sequential story dependencies (Story 2 can't start until Story 1 merged)
- Project completion (all stories done)
- Reputation scoring (dev + QA earn ratings)
- Social integration (Twitter bot announces completions)

**Ready to build Milestone 1?** 🚀
