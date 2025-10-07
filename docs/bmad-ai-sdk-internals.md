# BMAD + AI SDK: Inside the Black Box

**Purpose:** Show the exact code implementation of how Vercel AI SDK uses BMAD files (agents, tasks, templates) internally.

---

## The Black Box Revealed

### How `smAgent.createNextStory(3)` Works Internally

Let's trace through the **exact execution path** when an AI node calls `smAgent.createNextStory(3)`.

---

## Step-by-Step Implementation

### 1. Agent Class Implementation

**File:** `packages/ai-nodes/src/agents/scrum-master.agent.ts`

```typescript
import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

/**
 * BMAD Scrum Master Agent
 *
 * Loads persona and tasks from .bmad-core/agents/sm.md
 * Executes tasks using Vercel AI SDK
 */
export class BMADScrumMasterAgent {
  private persona: string;
  private model: any;
  private tasks: Map<string, string> = new Map();
  private templates: Map<string, any> = new Map();

  constructor(options: { model?: any } = {}) {
    // 1. Load BMAD agent definition
    this.loadAgentDefinition();

    // 2. Set model (default or user-specified)
    this.model = options.model || anthropic('claude-3-5-sonnet-20241022');
  }

  /**
   * Load agent persona and dependencies from .bmad-core/agents/sm.md
   */
  private loadAgentDefinition() {
    // Read the BMAD agent file
    const agentPath = path.join(process.cwd(), '.bmad-core/agents/sm.md');
    const agentContent = fs.readFileSync(agentPath, 'utf-8');

    // Extract YAML block (same format Claude Code uses)
    const yamlMatch = agentContent.match(/```yaml\n([\s\S]*?)\n```/);
    if (!yamlMatch) {
      throw new Error('No YAML block found in sm.md');
    }

    const agentConfig = yaml.parse(yamlMatch[1]);

    // Extract persona
    this.persona = this.buildPersonaPrompt(agentConfig.persona);

    // Load dependencies (tasks, templates)
    this.loadDependencies(agentConfig.dependencies);
  }

  /**
   * Build system prompt from BMAD persona definition
   */
  private buildPersonaPrompt(personaConfig: any): string {
    return `
You are ${personaConfig.identity}.

Role: ${personaConfig.role}
Style: ${personaConfig.style}
Focus: ${personaConfig.focus}

Core Principles:
${personaConfig.core_principles.map((p: string) => `- ${p}`).join('\n')}

You follow BMAD methodology and execute tasks with precision.
    `.trim();
  }

  /**
   * Load task and template files specified in agent dependencies
   */
  private loadDependencies(dependencies: any) {
    // Load tasks
    if (dependencies.tasks) {
      for (const taskFile of dependencies.tasks) {
        const taskPath = path.join(process.cwd(), '.bmad-core/tasks', taskFile);
        const taskContent = fs.readFileSync(taskPath, 'utf-8');

        // Store task instructions (same content Claude Code reads)
        const taskName = taskFile.replace('.md', '');
        this.tasks.set(taskName, taskContent);
      }
    }

    // Load templates
    if (dependencies.templates) {
      for (const templateFile of dependencies.templates) {
        const templatePath = path.join(process.cwd(), '.bmad-core/templates', templateFile);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        // Parse YAML template
        const template = yaml.parse(templateContent);
        const templateName = templateFile.replace('.yaml', '');
        this.templates.set(templateName, template);
      }
    }
  }

  /**
   * Create next story (equivalent to Claude Code: *create --story-number=3)
   *
   * This is the PUBLIC API called by AI nodes
   */
  async createNextStory(storyNumber: number, context: {
    prdPath?: string;
    architecturePath?: string;
    epic?: string;
  } = {}): Promise<Story> {
    // 1. Load the BMAD task: create-next-story.md
    const taskInstructions = this.tasks.get('create-next-story');
    if (!taskInstructions) {
      throw new Error('Task create-next-story not found in dependencies');
    }

    // 2. Load context documents (PRD, architecture)
    const prd = context.prdPath
      ? fs.readFileSync(context.prdPath, 'utf-8')
      : '';

    const architecture = context.architecturePath
      ? fs.readFileSync(context.architecturePath, 'utf-8')
      : '';

    // 3. Load BMAD template and convert to Zod schema
    const storySchema = this.getStorySchema();

    // 4. Build prompt from BMAD task instructions
    const prompt = this.buildTaskPrompt({
      taskInstructions,
      storyNumber,
      prd,
      architecture,
      epic: context.epic,
    });

    // 5. Execute with Vercel AI SDK
    const { object: story } = await generateObject({
      model: this.model,
      schema: storySchema,
      system: this.persona, // BMAD persona from sm.md
      prompt: prompt,       // BMAD task from create-next-story.md
    });

    // 6. Return structured story
    return story;
  }

  /**
   * Convert BMAD user-story-tmpl.yaml to Zod schema
   */
  private getStorySchema(): z.ZodObject<any> {
    const template = this.templates.get('user-story-tmpl');

    // BMAD template structure → Zod schema
    return z.object({
      storyNumber: z.string(),
      title: z.string(),
      status: z.enum(['Draft', 'Ready for Development', 'In Progress', 'Ready for Review', 'Approved', 'Rejected']),
      epic: z.string(),

      story: z.object({
        asA: z.string().describe('User role'),
        iWant: z.string().describe('Goal'),
        soThat: z.string().describe('Benefit'),
      }),

      description: z.string(),

      acceptanceCriteria: z.array(z.string()).min(1),

      tasks: z.array(z.object({
        task: z.string(),
        completed: z.boolean().default(false),
        subtasks: z.array(z.object({
          subtask: z.string(),
          completed: z.boolean().default(false),
        })).optional(),
      })),

      estimatedComplexity: z.enum(['Small', 'Medium', 'Large', 'X-Large']),

      devNotes: z.string().optional(),
      testingStrategy: z.string().optional(),
    });
  }

  /**
   * Build AI prompt from BMAD task instructions + context
   */
  private buildTaskPrompt(params: {
    taskInstructions: string;
    storyNumber: number;
    prd: string;
    architecture: string;
    epic?: string;
  }): string {
    // This is the prompt sent to Claude/GPT-4
    return `
${params.taskInstructions}

Story Number: ${params.storyNumber}
${params.epic ? `Epic: ${params.epic}` : ''}

PRD:
${params.prd}

Architecture:
${params.architecture}

Create the next user story following the task instructions above.
    `.trim();
  }
}

/**
 * TypeScript type matching Zod schema
 */
export interface Story {
  storyNumber: string;
  title: string;
  status: 'Draft' | 'Ready for Development' | 'In Progress' | 'Ready for Review' | 'Approved' | 'Rejected';
  epic: string;
  story: {
    asA: string;
    iWant: string;
    soThat: string;
  };
  description: string;
  acceptanceCriteria: string[];
  tasks: Array<{
    task: string;
    completed: boolean;
    subtasks?: Array<{
      subtask: string;
      completed: boolean;
    }>;
  }>;
  estimatedComplexity: 'Small' | 'Medium' | 'Large' | 'X-Large';
  devNotes?: string;
  testingStrategy?: string;
}
```

---

### 2. AI Node Usage

**File:** `packages/ai-nodes/src/workers/architect.worker.ts`

```typescript
import { BMADScrumMasterAgent, Story } from '../agents/scrum-master.agent';
import { SolanaService } from '../services/solana.service';
import { ArweaveService } from '../services/arweave.service';

/**
 * Architect AI Node Worker
 *
 * Polls blockchain for ProjectCreated events
 * Uses BMAD agents to create architecture and stories
 */
export class ArchitectWorker {
  private solana: SolanaService;
  private arweave: ArweaveService;

  // BMAD agent instance (loads from .bmad-core/)
  private smAgent: BMADScrumMasterAgent;

  constructor() {
    this.solana = new SolanaService();
    this.arweave = new ArweaveService();

    // Initialize BMAD Scrum Master agent
    // This loads .bmad-core/agents/sm.md automatically
    this.smAgent = new BMADScrumMasterAgent({
      model: anthropic('claude-3-5-sonnet-20241022'),
    });
  }

  /**
   * Main polling loop
   */
  async start() {
    console.log('🏗️  Architect node starting...');

    while (true) {
      await this.pollForWork();
      await this.sleep(5000); // Poll every 5 seconds
    }
  }

  /**
   * Poll blockchain for ProjectCreated events
   */
  async pollForWork() {
    // Get recent ProjectCreated events from Solana
    const events = await this.solana.getEvents('ProjectCreated', {
      since: Date.now() - 60000, // Last minute
    });

    for (const event of events) {
      try {
        await this.handleProjectCreated(event);
      } catch (error) {
        console.error('Error handling project:', error);
      }
    }
  }

  /**
   * Handle ProjectCreated event
   *
   * THIS IS WHERE THE MAGIC HAPPENS
   */
  async handleProjectCreated(event: any) {
    const projectId = event.project_id;

    console.log(`📋 New project: ${projectId}`);

    // 1. Fetch PRD from Arweave
    const project = await this.solana.getProject(projectId);
    const prdContent = await this.arweave.fetch(project.prd_arweave_tx);

    // Save PRD temporarily (BMAD agents expect file paths)
    const prdPath = `/tmp/prd-${projectId}.md`;
    fs.writeFileSync(prdPath, prdContent);

    // 2. Decide if I should bid on architecture work
    const shouldBid = await this.evaluatePRD(prdContent);

    if (!shouldBid) {
      console.log('❌ PRD not a good fit, skipping');
      return;
    }

    // 3. Submit architecture bid on-chain
    console.log('💰 Submitting architecture bid...');
    await this.solana.submitBid({
      project_id: projectId,
      opportunity_type: 'Architecture',
      amount_sol: 5.0,
    });

    console.log('✅ Bid submitted, waiting for acceptance...');
  }

  /**
   * Called when architecture bid is accepted
   */
  async onArchitectureBidAccepted(projectId: string) {
    console.log(`🎉 Architecture bid accepted for ${projectId}`);

    // 1. Fetch PRD from Arweave
    const project = await this.solana.getProject(projectId);
    const prdContent = await this.arweave.fetch(project.prd_arweave_tx);

    const prdPath = `/tmp/prd-${projectId}.md`;
    fs.writeFileSync(prdPath, prdContent);

    // 2. Create architecture (separate agent, not shown here)
    const architecture = await this.createArchitecture(prdPath);

    const architecturePath = `/tmp/architecture-${projectId}.md`;
    fs.writeFileSync(architecturePath, architecture);

    // 3. Upload architecture to Arweave
    const archTxId = await this.arweave.upload(architecture);

    // 4. Submit architecture to blockchain
    await this.solana.submitArchitecture({
      project_id: projectId,
      arweave_tx: archTxId,
    });

    // 5. NOW CREATE STORIES USING BMAD
    await this.createStoriesForProject(projectId, prdPath, architecturePath);
  }

  /**
   * Create stories using BMAD Scrum Master agent
   *
   * THIS SHOWS HOW smAgent.createNextStory() IS CALLED
   */
  async createStoriesForProject(
    projectId: string,
    prdPath: string,
    architecturePath: string
  ) {
    console.log('📝 Creating user stories with BMAD...');

    // Read PRD to get epic list
    const prdContent = fs.readFileSync(prdPath, 'utf-8');
    const epics = this.extractEpicsFromPRD(prdContent);

    let storyNumber = 1;

    // For each epic, create stories
    for (const epic of epics) {
      console.log(`📦 Creating stories for epic: ${epic.id}`);

      // Create 3-5 stories per epic
      const numStories = Math.floor(Math.random() * 3) + 3; // 3-5 stories

      for (let i = 0; i < numStories; i++) {
        // THIS IS THE KEY CALL - uses BMAD agent
        const story = await this.smAgent.createNextStory(storyNumber, {
          prdPath,
          architecturePath,
          epic: epic.id,
        });

        console.log(`✅ Story ${storyNumber} created: ${story.title}`);

        // Upload story to Arweave
        const storyMarkdown = this.formatStoryAsMarkdown(story);
        const storyTxId = await this.arweave.upload(storyMarkdown);

        // Create story on blockchain
        await this.solana.createStory({
          project_id: projectId,
          story_number: storyNumber,
          story_arweave_tx: storyTxId,
          epic_id: epic.id,
          estimated_complexity: story.estimatedComplexity,
          status: 'Created', // Ready for developer bids
        });

        storyNumber++;
      }
    }

    console.log(`✅ Created ${storyNumber - 1} stories for project ${projectId}`);
  }

  /**
   * Extract epic list from PRD markdown
   */
  private extractEpicsFromPRD(prdContent: string): Array<{ id: string; title: string }> {
    // Simple regex to find epic sections in PRD
    const epicRegex = /^### (EPIC-\d+): (.+)$/gm;
    const epics: Array<{ id: string; title: string }> = [];

    let match;
    while ((match = epicRegex.exec(prdContent)) !== null) {
      epics.push({
        id: match[1],      // e.g., "EPIC-001"
        title: match[2],   // e.g., "User Authentication"
      });
    }

    return epics;
  }

  /**
   * Format Story object as markdown (BMAD format)
   */
  private formatStoryAsMarkdown(story: Story): string {
    return `
# ${story.storyNumber}: ${story.title}

**Status:** ${story.status}
**Epic:** ${story.epic}
**Complexity:** ${story.estimatedComplexity}

## Story

As a ${story.story.asA}, I want ${story.story.iWant} so that ${story.story.soThat}.

## Description

${story.description}

## Acceptance Criteria

${story.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n')}

## Tasks

${story.tasks.map((task, i) => {
  let taskMd = `- [ ] ${task.task}`;
  if (task.subtasks && task.subtasks.length > 0) {
    taskMd += '\n' + task.subtasks.map(st => `  - [ ] ${st.subtask}`).join('\n');
  }
  return taskMd;
}).join('\n')}

${story.devNotes ? `## Dev Notes\n\n${story.devNotes}` : ''}

${story.testingStrategy ? `## Testing Strategy\n\n${story.testingStrategy}` : ''}
    `.trim();
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

### 3. What Actually Happens When Event Fires

Let's trace the **exact execution** when `ProjectCreated` event fires:

```typescript
// Event fires on Solana blockchain
// Event data: { project_id: "ABC123", prd_arweave_tx: "xyz789", ... }

// 1. Architect worker polls and sees event
await this.pollForWork();
// → Calls this.handleProjectCreated(event)

// 2. Fetch PRD from Arweave
const prdContent = await this.arweave.fetch('xyz789');
// prdContent is markdown text of the PRD

// 3. Save to temp file (BMAD agents expect file paths)
fs.writeFileSync('/tmp/prd-ABC123.md', prdContent);

// 4. Bid gets accepted (separate flow)
// ...

// 5. onArchitectureBidAccepted() is called
await this.onArchitectureBidAccepted('ABC123');

// 6. Create stories
await this.createStoriesForProject(
  'ABC123',
  '/tmp/prd-ABC123.md',
  '/tmp/architecture-ABC123.md'
);

// 7. For each epic in PRD:
for (const epic of epics) {
  // 8. Call BMAD agent
  const story = await this.smAgent.createNextStory(storyNumber, {
    prdPath: '/tmp/prd-ABC123.md',
    architecturePath: '/tmp/architecture-ABC123.md',
    epic: 'EPIC-001',
  });

  // Inside createNextStory():
  // 9. Load task: .bmad-core/tasks/create-next-story.md
  const taskInstructions = this.tasks.get('create-next-story');

  // 10. Load template: .bmad-core/templates/user-story-tmpl.yaml
  const storySchema = this.getStorySchema();

  // 11. Build prompt
  const prompt = `
    ${taskInstructions}

    Story Number: 1
    Epic: EPIC-001

    PRD:
    ${prdContent}

    Architecture:
    ${architectureContent}
  `;

  // 12. Call Vercel AI SDK
  const { object: story } = await generateObject({
    model: anthropic('claude-3-5-sonnet-20241022'),
    schema: storySchema, // Zod schema from template
    system: this.persona, // From .bmad-core/agents/sm.md
    prompt: prompt,       // Task instructions + context
  });

  // 13. Story is returned (validated by Zod)
  // story = {
  //   storyNumber: "001",
  //   title: "User can create account with email",
  //   status: "Draft",
  //   epic: "EPIC-001",
  //   story: {
  //     asA: "new user",
  //     iWant: "create an account with my email",
  //     soThat: "I can access the marketplace"
  //   },
  //   description: "...",
  //   acceptanceCriteria: ["...", "..."],
  //   tasks: [
  //     { task: "Create user registration form", completed: false },
  //     { task: "Implement email validation", completed: false },
  //   ],
  //   estimatedComplexity: "Medium"
  // }

  // 14. Upload to Arweave
  const storyTxId = await this.arweave.upload(formatAsMarkdown(story));

  // 15. Create on-chain
  await this.solana.createStory({
    project_id: 'ABC123',
    story_number: 1,
    story_arweave_tx: storyTxId,
  });
}
```

---

## The Key Files Being Read

When `smAgent.createNextStory(3)` executes:

### 1. `.bmad-core/agents/sm.md` (Loaded in Constructor)

```markdown
```yaml
agent:
  name: Sam
  id: sm
  title: Scrum Master

persona:
  role: Agile Scrum Master & Story Creation Expert
  style: Structured, detail-oriented, user-focused
  identity: Expert at breaking epics into implementable user stories
  focus: Creating clear, testable, complete user stories
  core_principles:
    - Stories must be independently deliverable
    - Clear acceptance criteria are mandatory
    - Tasks must be granular and testable
    - Complexity estimates guide sprint planning
```
```

**How it's used:**
```typescript
// Extracted in loadAgentDefinition()
this.persona = `
You are Expert at breaking epics into implementable user stories.

Role: Agile Scrum Master & Story Creation Expert
Style: Structured, detail-oriented, user-focused
Focus: Creating clear, testable, complete user stories

Core Principles:
- Stories must be independently deliverable
- Clear acceptance criteria are mandatory
...
`;

// Used in generateObject() call
await generateObject({
  system: this.persona, // ← Persona goes here
  ...
});
```

---

### 2. `.bmad-core/tasks/create-next-story.md` (Loaded in Constructor)

```markdown
# Create Next Story

## Objective
Generate the next user story from the PRD epic list.

## Prerequisites
- PRD document with epic breakdown
- Architecture document (if available)
- Current story number

## Instructions

1. **Identify Epic**
   - Read PRD to find the next epic needing stories
   - Understand epic scope and goals

2. **Story Structure**
   - Title: Clear, action-oriented
   - As a [user type], I want [goal] so that [benefit]
   - Description: 2-3 paragraphs explaining the feature

3. **Acceptance Criteria**
   - Minimum 3 criteria
   - Testable and specific
   - Use "Given/When/Then" format where appropriate

4. **Task Breakdown**
   - Break story into 3-7 implementable tasks
   - Each task should take < 4 hours
   - Include subtasks if needed

5. **Complexity Estimation**
   - Small: < 1 day
   - Medium: 1-2 days
   - Large: 3-4 days
   - X-Large: > 4 days (consider splitting)

## Output Format
Create a structured story document following the user story template.
```

**How it's used:**
```typescript
// Loaded in loadDependencies()
const taskContent = fs.readFileSync(
  '.bmad-core/tasks/create-next-story.md',
  'utf-8'
);
this.tasks.set('create-next-story', taskContent);

// Used in createNextStory()
const taskInstructions = this.tasks.get('create-next-story');

const prompt = `
${taskInstructions}  // ← Task instructions become part of prompt

Story Number: 3
Epic: EPIC-001

PRD:
${prdContent}
`;

await generateObject({
  prompt: prompt, // ← Task instructions guide AI
  ...
});
```

---

### 3. `.bmad-core/templates/user-story-tmpl.yaml` (Loaded in Constructor)

```yaml
template:
  id: user-story-template
  name: User Story
  version: 1.0
  output:
    format: markdown
    filename: docs/stories/story-{number}.md

sections:
  - id: header
    title: Story Header
    fields:
      - storyNumber: Story number (e.g., "001")
      - title: Story title
      - status: Story status
      - epic: Epic ID

  - id: story
    title: User Story
    instruction: As a [user], I want [goal] so that [benefit]
    fields:
      - asA: User role
      - iWant: Goal/action
      - soThat: Benefit/value

  - id: description
    title: Description
    instruction: 2-3 paragraphs explaining the feature

  - id: acceptance_criteria
    title: Acceptance Criteria
    instruction: List 3-7 testable criteria
    repeatable: true

  - id: tasks
    title: Tasks
    instruction: Break down into implementable tasks
    repeatable: true
    subsections:
      - subtasks:
          repeatable: true

  - id: complexity
    title: Estimated Complexity
    choices:
      - Small
      - Medium
      - Large
      - X-Large
```

**How it's used:**
```typescript
// Loaded in loadDependencies()
const templateContent = fs.readFileSync(
  '.bmad-core/templates/user-story-tmpl.yaml',
  'utf-8'
);
const template = yaml.parse(templateContent);
this.templates.set('user-story-tmpl', template);

// Converted to Zod schema in getStorySchema()
private getStorySchema(): z.ZodObject<any> {
  const template = this.templates.get('user-story-tmpl');

  // Template structure → Zod schema
  return z.object({
    storyNumber: z.string(),
    title: z.string(),
    status: z.enum(['Draft', 'Ready for Development', ...]),
    epic: z.string(),

    story: z.object({
      asA: z.string(),    // From template: asA field
      iWant: z.string(),  // From template: iWant field
      soThat: z.string(), // From template: soThat field
    }),

    description: z.string(),

    acceptanceCriteria: z.array(z.string()).min(1), // From template: repeatable

    tasks: z.array(z.object({
      task: z.string(),
      completed: z.boolean().default(false),
      subtasks: z.array(z.object({  // From template: subsections
        subtask: z.string(),
        completed: z.boolean().default(false),
      })).optional(),
    })),

    estimatedComplexity: z.enum(['Small', 'Medium', 'Large', 'X-Large']),
  });
}

// Used in generateObject()
const storySchema = this.getStorySchema();

await generateObject({
  schema: storySchema, // ← Validates AI output matches template
  ...
});
```

---

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Solana Blockchain Event                                         │
│ ProjectCreated { project_id: "ABC", prd_tx: "xyz" }           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Architect Worker (architect.worker.ts)                         │
│  - Polls blockchain every 5 seconds                             │
│  - Sees ProjectCreated event                                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ handleProjectCreated()                                          │
│  1. Fetch PRD from Arweave (tx: "xyz")                         │
│  2. Save to /tmp/prd-ABC.md                                    │
│  3. Submit architecture bid on-chain                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ onArchitectureBidAccepted()                                    │
│  1. Create architecture (separate agent)                        │
│  2. Upload architecture to Arweave                              │
│  3. Call createStoriesForProject()                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ createStoriesForProject()                                      │
│  1. Extract epics from PRD                                     │
│  2. For each epic:                                              │
│     → smAgent.createNextStory(storyNumber, context)           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ BMADScrumMasterAgent.createNextStory()                         │
│  (scrum-master.agent.ts)                                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Load BMAD Files  │    │ Build Prompt     │
│                  │    │                  │
│ 1. Agent persona │    │ taskInstructions │
│    sm.md         │    │ + PRD content    │
│                  │    │ + Architecture   │
│ 2. Task          │    │ + Story number   │
│    create-next-  │    │ + Epic           │
│    story.md      │    │                  │
│                  │    │                  │
│ 3. Template      │    │                  │
│    user-story-   │    │                  │
│    tmpl.yaml     │    │                  │
│    → Zod schema  │    │                  │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Vercel AI SDK: generateObject()                                │
│                                                                 │
│  model: anthropic('claude-3-5-sonnet-20241022')               │
│  schema: storySchema (from template)                           │
│  system: persona (from sm.md)                                  │
│  prompt: taskInstructions + context                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Claude API Call                                                │
│                                                                 │
│  POST https://api.anthropic.com/v1/messages                    │
│  {                                                             │
│    model: "claude-3-5-sonnet-20241022",                       │
│    system: "You are Expert at breaking epics...",             │
│    messages: [{                                                │
│      role: "user",                                             │
│      content: "# Create Next Story\n\nStory Number: 1..."     │
│    }]                                                          │
│  }                                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Claude Response (JSON)                                         │
│                                                                 │
│  {                                                             │
│    storyNumber: "001",                                         │
│    title: "User can create account with email",               │
│    status: "Draft",                                            │
│    epic: "EPIC-001",                                           │
│    story: {                                                    │
│      asA: "new user",                                          │
│      iWant: "create an account",                               │
│      soThat: "I can access the marketplace"                    │
│    },                                                          │
│    acceptanceCriteria: [...],                                  │
│    tasks: [...],                                               │
│    estimatedComplexity: "Medium"                               │
│  }                                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Zod Validation                                                 │
│  - Validates response matches schema                            │
│  - Throws error if invalid                                      │
│  - Returns typed Story object                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Format as Markdown                                             │
│  formatStoryAsMarkdown(story)                                  │
│                                                                 │
│  Output:                                                        │
│  # 001: User can create account with email                     │
│  **Status:** Draft                                             │
│  **Epic:** EPIC-001                                            │
│  ...                                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Upload to        │    │ Create on-chain  │
│ Arweave          │    │                  │
│                  │    │ solana.          │
│ arweave.upload() │    │ createStory()    │
│ → tx: "abc123"   │    │                  │
└──────────────────┘    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Solana Blockchain                                              │
│  StoryCreated event emitted                                    │
│  { story_id: "001", story_arweave_tx: "abc123" }              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Developer Nodes See Event                                     │
│  → Start bidding on implementation                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary: The Black Box Internals

### What `smAgent.createNextStory(3)` Actually Does:

1. **Load BMAD files** (constructor, one-time):
   ```typescript
   - Read .bmad-core/agents/sm.md → extract persona
   - Read .bmad-core/tasks/create-next-story.md → store instructions
   - Read .bmad-core/templates/user-story-tmpl.yaml → convert to Zod schema
   ```

2. **Build prompt** (every call):
   ```typescript
   prompt = taskInstructions + PRD + architecture + storyNumber + epic
   ```

3. **Call Vercel AI SDK**:
   ```typescript
   generateObject({
     model: claude-sonnet,
     schema: storySchema,  // From template
     system: persona,      // From agent
     prompt: prompt,       // From task + context
   })
   ```

4. **Validate with Zod**:
   ```typescript
   Zod ensures response matches template structure
   ```

5. **Return structured Story**:
   ```typescript
   return { storyNumber: "001", title: "...", ... }
   ```

### Key Insight:

**BMAD files are the "brains"** (persona, instructions, structure)
**Vercel AI SDK is the "executor"** (calls Claude/GPT-4, validates output)
**Zod is the "enforcer"** (ensures output matches template)

The AI node just orchestrates: load BMAD → call AI SDK → upload results.