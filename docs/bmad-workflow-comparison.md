# BMAD Workflow: Claude Code vs. Vercel AI SDK Integration

**Purpose:** Show the exact parallel between current BMAD usage in Claude Code and how it maps to Vercel AI SDK integration for the marketplace.

---

## Current Workflow: BMAD in Claude Code

### Scenario: Create and Implement a User Story

#### Step 1: Create Story (Scrum Master)

**Claude Code:**
```bash
# User activates Scrum Master agent
/BMad:agents:sm

# SM agent loads and greets
# User runs task to create story #3
*create --story-number=3

# Behind the scenes:
# - SM loads: .bmad-core/tasks/create-next-story.md
# - SM reads: docs/prd.md, docs/architecture.md
# - SM generates: docs/stories/story-003.md
# - Status: "Draft" (needs review)
```

**Output:**
```markdown
✅ Story created: docs/stories/story-003.md
📝 Status: Draft
👀 Review story and approve before implementation
```

---

#### Step 2: Review and Approve Story

**Claude Code:**
```bash
# User reviews docs/stories/story-003.md manually
# User changes status from "Draft" to "Ready for Development"
# (Manual edit of story file)
```

---

#### Step 3: Implement Story (Developer)

**Claude Code:**
```bash
# User activates Developer agent
/BMad:agents:dev

# Dev agent loads and greets
# User tells dev to implement story #3
*develop-story --story=docs/stories/story-003.md

# Behind the scenes:
# - Dev loads: docs/stories/story-003.md
# - Dev loads: .bmad-core/tasks/execute-checklist.md
# - Dev loads: .bmad-core/checklists/story-dod-checklist.md
# - Dev reads story tasks, implements each one
# - Dev writes tests, runs validations
# - Dev updates story checkboxes as tasks complete
# - Dev sets status: "Ready for Review"
```

**Output:**
```markdown
✅ Story implemented
📄 Files modified: 5
✅ All tests passing
✅ Story status: Ready for Review
```

---

#### Step 4: QA Review

**Claude Code:**
```bash
# User activates QA agent
/BMad:agents:qa

# QA reviews the implementation
*review --story=docs/stories/story-003.md

# Behind the scenes:
# - QA loads: docs/stories/story-003.md
# - QA loads: .bmad-core/tasks/review-story.md
# - QA reviews code changes, tests, requirements
# - QA provides feedback
```

**Output:**
```markdown
✅ Review complete
📊 Score: 95/100
✅ Approved with minor suggestions
```

---

## Vercel AI SDK Integration: Same Workflow, Enhanced

### Key Differences:
1. **Same slash commands** - No change to user interface
2. **AI SDK runs underneath** - Agents use Vercel AI SDK internally
3. **Model selection** - User can choose models, agents use smart defaults
4. **Structured outputs** - Zod validation ensures valid story/code structure
5. **Autonomous agents** - Can run on marketplace backend, not just in Claude Code

---

### Scenario: Marketplace AI Node Executes Workflow Autonomously

#### Step 1: Client Creates Project (Human in Claude Desktop)

**User (Claude Desktop with MCP):**
```bash
# User uses Remote MCP server to create project
# This creates on-chain project + uploads PRD to Arweave

# MCP tool call (behind the scenes):
createProject({
  prd_arweave_tx: "abc123...",
  github_repo: "client/my-app",
  funding_type: "self-funded"
})

# On-chain event emitted: ProjectCreated
```

---

#### Step 2: AI Architect Node Sees Opportunity (Autonomous)

**AI Node (TypeScript worker, autonomous):**

```typescript
// AI Architect node polling blockchain for work
class ArchitectNode {
  async pollForWork() {
    // Subscribe to ProjectCreated events
    const events = await this.solana.getProgramEvents('ProjectCreated');

    for (const event of events) {
      // Check if this is a project I want to bid on
      const project = await this.solana.getProject(event.project_id);

      // Fetch PRD from Arweave
      const prd = await this.arweave.fetch(project.prd_arweave_tx);

      // BMAD Architect Agent (using Vercel AI SDK)
      const shouldBid = await this.decideIfBid(prd);

      if (shouldBid) {
        await this.submitBid(project.project_id, 5.0); // 5 SOL bid
      }
    }
  }

  async decideIfBid(prd: string): Promise<boolean> {
    // This is where BMAD + AI SDK integration happens
    const architectAgent = new BMADArchitectAgent({
      model: this.config.defaultModel, // claude-3-5-sonnet-20241022
    });

    // AI decides autonomously if PRD matches its expertise
    const decision = await architectAgent.evaluatePRD(prd);
    return decision.shouldBid;
  }
}
```

**What's happening:**
- AI node is **autonomous** (no human in the loop)
- Uses **same BMAD Architect persona** (from `.bmad-core/agents/architect.md`)
- Uses **Vercel AI SDK** to call Claude Sonnet
- Reads PRD, decides to bid, submits on-chain transaction

---

#### Step 3: Bid Accepted, AI Creates Stories (Autonomous)

**AI Node (after bid accepted):**

```typescript
class ArchitectNode {
  async onBidAccepted(projectId: string) {
    // Bid was accepted on-chain, now create architecture + stories

    // 1. Fetch PRD from Arweave
    const prd = await this.arweave.fetch(project.prd_arweave_tx);

    // 2. Use BMAD Architect Agent with AI SDK
    const architectAgent = new BMADArchitectAgent({
      model: anthropic('claude-3-5-sonnet-20241022'),
    });

    // 3. Create architecture (same as Claude Code *create-architecture)
    const architecture = await architectAgent.createArchitecture(prd);

    // 4. Upload architecture to Arweave
    const archTxId = await this.arweave.upload(architecture);

    // 5. Submit architecture to blockchain
    await this.solana.submitArchitecture(projectId, archTxId);

    // 6. Now create stories (same as Claude Code *create-next-story)
    await this.createStories(projectId, prd, architecture);
  }

  async createStories(projectId: string, prd: string, architecture: string) {
    // Use BMAD SM Agent (Scrum Master) with AI SDK
    const smAgent = new BMADScrumMasterAgent({
      model: anthropic('claude-3-5-sonnet-20241022'),
    });

    // Task: create-next-story (from .bmad-core/tasks/create-next-story.md)
    // This is the SAME task you run in Claude Code with *create
    const stories = await smAgent.createStories({
      prd,
      architecture,
      epic: 'EPIC-001', // First epic
    });

    // Stories created, upload to Arweave + create on-chain
    for (let i = 0; i < stories.length; i++) {
      const storyTxId = await this.arweave.upload(stories[i]);

      await this.solana.createStory({
        project_id: projectId,
        story_arweave_tx: storyTxId,
        story_number: i + 1,
        status: 'Created', // Ready for developer bids
      });
    }
  }
}
```

**Behind the scenes (createStories):**

```typescript
class BMADScrumMasterAgent {
  async createStories({ prd, architecture, epic }: CreateStoriesInput) {
    // 1. Load BMAD task instructions
    const taskInstructions = this.loadTask('create-next-story.md');

    // 2. Load BMAD template (user story template)
    const storySchema = this.loadSchemaFromTemplate('user-story-tmpl.yaml');

    // 3. Use Vercel AI SDK to generate stories
    const { object: stories } = await generateObject({
      model: this.model, // Claude Sonnet
      schema: z.object({
        stories: z.array(storySchema),
      }),
      system: this.persona, // From .bmad-core/agents/sm.md
      prompt: `
        ${taskInstructions}

        PRD:
        ${prd}

        Architecture:
        ${architecture}

        Create stories for epic: ${epic}
      `,
    });

    // 4. Validate with Zod (ensures stories are well-formed)
    return stories.stories;
  }

  private loadTask(taskName: string): string {
    // Load from .bmad-core/tasks/create-next-story.md
    return fs.readFileSync(`.bmad-core/tasks/${taskName}`, 'utf-8');
  }

  private loadSchemaFromTemplate(templateName: string): z.ZodObject {
    // Convert BMAD YAML template to Zod schema
    const template = yaml.parse(
      fs.readFileSync(`.bmad-core/templates/${templateName}`, 'utf-8')
    );

    // Return Zod schema matching template structure
    return convertBMADTemplateToZodSchema(template);
  }
}
```

---

#### Step 4: Developer Node Bids on Story (Autonomous)

**Developer AI Node:**

```typescript
class DeveloperNode {
  async pollForStories() {
    // Subscribe to StoryCreated events
    const stories = await this.solana.getProgramEvents('StoryCreated');

    for (const story of stories) {
      // Fetch story from Arweave
      const storyContent = await this.arweave.fetch(story.story_arweave_tx);

      // Decide if I can implement this story
      const canImplement = await this.evaluateStory(storyContent);

      if (canImplement) {
        await this.solana.submitBid({
          story_id: story.story_id,
          amount_sol: 0.5, // 0.5 SOL bid
        });
      }
    }
  }

  async evaluateStory(story: string): Promise<boolean> {
    // Use BMAD Dev Agent to evaluate if story is implementable
    const devAgent = new BMADDeveloperAgent({
      model: openai('gpt-4-turbo'), // Dev uses GPT-4 for code
    });

    return await devAgent.canImplement(story);
  }
}
```

---

#### Step 5: Developer Implements Story (Autonomous)

**Developer AI Node (after bid accepted):**

```typescript
class DeveloperNode {
  async onBidAccepted(storyId: string) {
    // Bid accepted, implement the story

    // 1. Fetch story from Arweave
    const story = await this.arweave.fetch(storyData.story_arweave_tx);

    // 2. Fetch architecture context
    const architecture = await this.arweave.fetch(project.architecture_arweave_tx);

    // 3. Use BMAD Developer Agent (same as Claude Code *develop-story)
    const devAgent = new BMADDeveloperAgent({
      model: openai('gpt-4-turbo'),
    });

    // 4. Execute story (same workflow as Claude Code)
    const implementation = await devAgent.implementStory({
      story,
      architecture,
      githubRepo: project.github_repo,
    });

    // 5. Commit code to GitHub via MCP
    await this.github.createPullRequest({
      repo: project.github_repo,
      branch: `story-${storyId}`,
      title: story.title,
      body: story.description,
      files: implementation.files,
    });

    // 6. Upload implementation proof to Arweave
    const implTxId = await this.arweave.upload({
      story_id: storyId,
      github_pr: implementation.prNumber,
      test_results: implementation.testResults,
    });

    // 7. Submit for review on-chain
    await this.solana.submitImplementation({
      story_id: storyId,
      github_pr_number: implementation.prNumber,
      arweave_tx: implTxId,
    });
  }
}
```

**Behind the scenes (implementStory):**

```typescript
class BMADDeveloperAgent {
  async implementStory({ story, architecture, githubRepo }: ImplementStoryInput) {
    // 1. Load BMAD task: execute-checklist.md
    const taskInstructions = this.loadTask('execute-checklist.md');

    // 2. Load BMAD checklist: story-dod-checklist.md
    const checklist = this.loadChecklist('story-dod-checklist.md');

    // 3. Use Vercel AI SDK to implement
    const { object: implementation } = await generateObject({
      model: this.model, // GPT-4 Turbo
      schema: z.object({
        files: z.array(z.object({
          path: z.string(),
          content: z.string(),
        })),
        tests: z.array(z.object({
          path: z.string(),
          content: z.string(),
        })),
        checklistResults: z.array(z.object({
          item: z.string(),
          completed: z.boolean(),
        })),
      }),
      system: this.persona, // From .bmad-core/agents/dev.md
      prompt: `
        ${taskInstructions}

        Story:
        ${story}

        Architecture:
        ${architecture}

        Checklist:
        ${checklist}

        Implement the story, write tests, complete checklist.
      `,
    });

    // 4. Run tests to validate
    const testResults = await this.runTests(implementation.tests);

    if (!testResults.allPassed) {
      throw new Error('Tests failed, cannot submit');
    }

    // 5. Return implementation
    return {
      files: implementation.files,
      testResults,
      checklistCompleted: implementation.checklistResults,
    };
  }
}
```

---

#### Step 6: QA Node Reviews (Autonomous)

**QA AI Node:**

```typescript
class QANode {
  async pollForReviews() {
    // Subscribe to ImplementationSubmitted events
    const submissions = await this.solana.getProgramEvents('ImplementationSubmitted');

    for (const submission of submissions) {
      // Fetch story and implementation
      const story = await this.arweave.fetch(submission.story_arweave_tx);
      const implementation = await this.arweave.fetch(submission.implementation_arweave_tx);

      // Review (same as Claude Code *review)
      const review = await this.reviewImplementation(story, implementation);

      // Submit review on-chain
      await this.solana.submitReview({
        story_id: submission.story_id,
        decision: review.approved ? 'Approve' : 'RequestChanges',
        feedback: review.feedback,
        checklist_score: review.score,
      });
    }
  }

  async reviewImplementation(story: string, implementation: any) {
    // Use BMAD QA Agent (same as Claude Code *review)
    const qaAgent = new BMADQAAgent({
      model: openai('gpt-4-turbo'),
    });

    // Task: review-story (from .bmad-core/tasks/review-story.md)
    const review = await qaAgent.reviewStory({
      story,
      implementation,
    });

    return review;
  }
}
```

**Behind the scenes (reviewStory):**

```typescript
class BMADQAAgent {
  async reviewStory({ story, implementation }: ReviewStoryInput) {
    // 1. Load BMAD task: review-story.md
    const taskInstructions = this.loadTask('review-story.md');

    // 2. Use Vercel AI SDK to review
    const { object: review } = await generateObject({
      model: this.model, // GPT-4 Turbo
      schema: z.object({
        approved: z.boolean(),
        score: z.number().min(0).max(100),
        feedback: z.string(),
        requirementsCoverage: z.array(z.object({
          requirement: z.string(),
          status: z.enum(['Met', 'Partially Met', 'Not Met']),
        })),
        codeQualityIssues: z.array(z.object({
          severity: z.enum(['Critical', 'Major', 'Minor']),
          issue: z.string(),
        })),
      }),
      system: this.persona, // From .bmad-core/agents/qa.md
      prompt: `
        ${taskInstructions}

        Story:
        ${story}

        Implementation:
        ${JSON.stringify(implementation)}

        Review the implementation against story requirements.
      `,
    });

    return review;
  }
}
```

---

## Side-by-Side Comparison

### Claude Code (Manual, Interactive)

| Step | User Action | BMAD Agent | Location |
|------|-------------|------------|----------|
| 1 | `/BMad:agents:sm` | Scrum Master activates | Claude Code |
| 2 | `*create --story-number=3` | SM creates story | Claude Code |
| 3 | User reviews story file | - | Manual |
| 4 | User changes status to "Ready" | - | Manual |
| 5 | `/BMad:agents:dev` | Developer activates | Claude Code |
| 6 | `*develop-story --story=docs/stories/story-003.md` | Dev implements | Claude Code |
| 7 | `/BMad:agents:qa` | QA activates | Claude Code |
| 8 | `*review --story=docs/stories/story-003.md` | QA reviews | Claude Code |

### Vercel AI SDK (Autonomous, Blockchain-Driven)

| Step | Trigger | BMAD Agent | Location |
|------|---------|------------|----------|
| 1 | `ProjectCreated` event | Architect polls blockchain | AI Node (server) |
| 2 | Architect bids | Architect evaluates PRD | AI Node |
| 3 | `BidAccepted` event | Architect creates stories | AI Node |
| 4 | `StoryCreated` event | Developer polls blockchain | AI Node |
| 5 | Developer bids | Developer evaluates story | AI Node |
| 6 | `BidAccepted` event | Developer implements | AI Node |
| 7 | `ImplementationSubmitted` event | QA polls blockchain | AI Node |
| 8 | QA reviews | QA reviews code | AI Node |

---

## Key Differences

### 1. **Execution Environment**

**Claude Code:**
- Human-in-the-loop, interactive
- User runs slash commands manually
- Agent responses appear in chat
- Files saved to local disk

**Vercel AI SDK:**
- Autonomous, event-driven
- AI nodes poll blockchain for work
- Agents execute without human intervention
- Files uploaded to Arweave + GitHub

---

### 2. **Same BMAD Components, Different Runtime**

**Both use:**
- ✅ Same agent personas (`.bmad-core/agents/sm.md`, etc.)
- ✅ Same tasks (`.bmad-core/tasks/create-next-story.md`, etc.)
- ✅ Same templates (`.bmad-core/templates/user-story-tmpl.yaml`, etc.)
- ✅ Same checklists (`.bmad-core/checklists/story-dod-checklist.md`, etc.)

**Difference:**
- ❌ **Claude Code:** User invokes via slash commands
- ✅ **AI SDK:** Agents invoke programmatically via Vercel AI SDK

---

### 3. **Model Selection**

**Claude Code:**
```bash
# User can choose model (future feature)
/BMad:agents:dev
*develop-story --story=docs/stories/story-003.md --model=gpt4
```

**Vercel AI SDK:**
```typescript
// Agent chooses model in code
const devAgent = new BMADDeveloperAgent({
  model: openai('gpt-4-turbo'), // Or user config
});
```

---

### 4. **Task Execution Pattern**

**Claude Code (Interactive):**
```
User → Slash Command → Agent Loads → Task Executes → Output to Chat
```

**Vercel AI SDK (Autonomous):**
```
Blockchain Event → Agent Polls → Task Executes → Upload to Arweave → On-Chain Transaction
```

---

## Implementation: Reusing BMAD Tasks in AI SDK

### Example: `create-next-story` Task

**BMAD Task File:** `.bmad-core/tasks/create-next-story.md`

```markdown
# Create Next Story

## Objective
Generate the next user story from the PRD epic list.

## Instructions
1. Read PRD to identify next epic
2. Break epic into user stories
3. For each story:
   - Title (As a [user], I want [goal] so that [benefit])
   - Description
   - Acceptance criteria
   - Tasks checklist
   - Estimated complexity

## Output
Save to: docs/stories/story-{number}.md
```

**How Claude Code Uses It:**
```bash
/BMad:agents:sm
*create --story-number=3

# SM agent:
# 1. Reads .bmad-core/tasks/create-next-story.md
# 2. Follows instructions
# 3. Generates story-003.md
# 4. Saves to docs/stories/
```

**How AI SDK Uses It:**
```typescript
class BMADScrumMasterAgent {
  async createNextStory(storyNumber: number) {
    // 1. Load same task file
    const taskInstructions = fs.readFileSync(
      '.bmad-core/tasks/create-next-story.md',
      'utf-8'
    );

    // 2. Load PRD
    const prd = fs.readFileSync('docs/prd.md', 'utf-8');

    // 3. Execute with AI SDK (same instructions!)
    const { object: story } = await generateObject({
      model: this.model,
      schema: storySchema,
      system: this.persona,
      prompt: `${taskInstructions}\n\nPRD:\n${prd}\n\nCreate story #${storyNumber}`,
    });

    // 4. Save story (same output!)
    fs.writeFileSync(
      `docs/stories/story-${String(storyNumber).padStart(3, '0')}.md`,
      formatStoryAsMarkdown(story)
    );

    return story;
  }
}
```

**Same task, same output, different runtime!**

---

## Summary: The Bridge

### Claude Code (Current)
```
User → /BMad:agents:sm → *create → Task executes → Story created
User → /BMad:agents:dev → *develop-story → Task executes → Code written
```

### Vercel AI SDK (Marketplace)
```
Event → AI Node → BMADScrumMasterAgent.createNextStory() → Task executes → Story created
Event → AI Node → BMADDeveloperAgent.implementStory() → Task executes → Code written
```

### The Magic
**Same BMAD files (`.bmad-core/`), different execution:**
- Claude Code: **Human triggers** via slash commands
- AI SDK: **Blockchain events trigger** via autonomous nodes

Both use:
- Same agent personas
- Same task instructions
- Same templates
- Same checklists

**Result:** BMAD workflows proven in Claude Code become autonomous marketplace AI agents with zero rewriting of agent logic.

---

**Next:** See `docs/examples/bmad-ai-sdk-integration.ts` for complete TypeScript implementation of BMAD agents using Vercel AI SDK.
