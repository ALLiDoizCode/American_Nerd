# Complete Working Example: BMAD + AI SDK Integration

**Purpose:** Show a complete, runnable example of BMAD agents using Vercel AI SDK, from event trigger to story creation.

---

## Full Code Example: Story Creation Flow

### Directory Structure

```
packages/ai-nodes/
├── src/
│   ├── agents/
│   │   ├── base.agent.ts              # Base BMAD agent class
│   │   ├── scrum-master.agent.ts      # SM agent (creates stories)
│   │   ├── developer.agent.ts         # Dev agent (implements stories)
│   │   └── qa.agent.ts                # QA agent (reviews code)
│   ├── workers/
│   │   ├── architect.worker.ts        # Listens for ProjectCreated
│   │   ├── developer.worker.ts        # Listens for StoryCreated
│   │   └── qa.worker.ts               # Listens for ImplementationSubmitted
│   ├── services/
│   │   ├── solana.service.ts          # Blockchain interaction
│   │   ├── arweave.service.ts         # Storage interaction
│   │   └── github.service.ts          # GitHub operations
│   └── utils/
│       ├── bmad-loader.ts             # Load BMAD files
│       └── schema-converter.ts        # YAML → Zod conversion
├── .bmad-core/                        # BMAD files (from repository)
│   ├── agents/
│   │   ├── sm.md
│   │   ├── dev.md
│   │   └── qa.md
│   ├── tasks/
│   │   ├── create-next-story.md
│   │   ├── execute-checklist.md
│   │   └── review-story.md
│   └── templates/
│       ├── user-story-tmpl.yaml
│       └── ...
└── package.json
```

---

## 1. Base BMAD Agent Class

**File:** `packages/ai-nodes/src/agents/base.agent.ts`

```typescript
import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { BMADLoader } from '../utils/bmad-loader';
import { SchemaConverter } from '../utils/schema-converter';

/**
 * Base class for all BMAD agents
 * Handles loading agent definitions, tasks, and templates from .bmad-core/
 */
export abstract class BMADAgent {
  protected persona: string;
  protected model: any;
  protected tasks: Map<string, string> = new Map();
  protected templates: Map<string, any> = new Map();
  protected agentConfig: any;

  constructor(
    protected agentId: string,
    options: {
      model?: any;
      bmadCorePath?: string;
    } = {}
  ) {
    const bmadPath = options.bmadCorePath || '.bmad-core';

    // Load agent definition from .bmad-core/agents/{agentId}.md
    this.agentConfig = BMADLoader.loadAgent(bmadPath, agentId);

    // Build persona from agent config
    this.persona = this.buildPersona(this.agentConfig.persona);

    // Set model (user override or agent default)
    this.model = options.model || this.getDefaultModel();

    // Load dependencies (tasks, templates)
    this.loadDependencies(bmadPath, this.agentConfig.dependencies);
  }

  /**
   * Build system prompt from BMAD persona definition
   */
  private buildPersona(personaConfig: any): string {
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
   * Get default model for this agent type
   */
  private getDefaultModel(): any {
    const modelConfig = this.agentConfig.ai_sdk?.default_model;

    if (modelConfig) {
      // Parse model string: "claude-3-5-sonnet-20241022" or "gpt-4-turbo"
      if (modelConfig.includes('claude')) {
        return anthropic(modelConfig);
      } else if (modelConfig.includes('gpt')) {
        return openai(modelConfig);
      }
    }

    // Default to Claude Sonnet
    return anthropic('claude-3-5-sonnet-20241022');
  }

  /**
   * Load task and template dependencies
   */
  private loadDependencies(bmadPath: string, dependencies: any) {
    // Load tasks
    if (dependencies?.tasks) {
      for (const taskFile of dependencies.tasks) {
        const taskContent = BMADLoader.loadTask(bmadPath, taskFile);
        const taskName = taskFile.replace('.md', '');
        this.tasks.set(taskName, taskContent);
      }
    }

    // Load templates
    if (dependencies?.templates) {
      for (const templateFile of dependencies.templates) {
        const template = BMADLoader.loadTemplate(bmadPath, templateFile);
        const templateName = templateFile.replace('.yaml', '');
        this.templates.set(templateName, template);
      }
    }
  }

  /**
   * Execute a BMAD task with AI SDK
   */
  protected async executeTask<T>(
    taskName: string,
    schema: z.ZodObject<any>,
    context: Record<string, any>
  ): Promise<T> {
    const taskInstructions = this.tasks.get(taskName);
    if (!taskInstructions) {
      throw new Error(`Task ${taskName} not found in agent dependencies`);
    }

    const prompt = this.buildPrompt(taskInstructions, context);

    const { object } = await generateObject({
      model: this.model,
      schema,
      system: this.persona,
      prompt,
    });

    return object as T;
  }

  /**
   * Build prompt from task instructions + context
   */
  private buildPrompt(taskInstructions: string, context: Record<string, any>): string {
    let prompt = taskInstructions + '\n\n';

    for (const [key, value] of Object.entries(context)) {
      if (value !== undefined && value !== null) {
        prompt += `${key}:\n${value}\n\n`;
      }
    }

    return prompt.trim();
  }

  /**
   * Get Zod schema from BMAD template
   */
  protected getSchemaFromTemplate(templateName: string): z.ZodObject<any> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found in agent dependencies`);
    }

    return SchemaConverter.templateToZodSchema(template);
  }
}
```

---

## 2. Scrum Master Agent

**File:** `packages/ai-nodes/src/agents/scrum-master.agent.ts`

```typescript
import { z } from 'zod';
import { BMADAgent } from './base.agent';
import * as fs from 'fs';

export interface Story {
  storyNumber: string;
  title: string;
  status: 'Draft' | 'Ready for Development' | 'In Progress' | 'Ready for Review' | 'Approved';
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

/**
 * BMAD Scrum Master Agent
 * Creates user stories from PRD epics
 */
export class BMADScrumMasterAgent extends BMADAgent {
  constructor(options: { model?: any } = {}) {
    super('sm', options);
  }

  /**
   * Create next story
   * Equivalent to Claude Code: @sm *create --story-number=3
   */
  async createNextStory(
    storyNumber: number,
    context: {
      prdPath?: string;
      prdContent?: string;
      architecturePath?: string;
      architectureContent?: string;
      epic?: string;
    }
  ): Promise<Story> {
    // Load PRD content
    const prdContent = context.prdContent ||
      (context.prdPath ? fs.readFileSync(context.prdPath, 'utf-8') : '');

    // Load architecture content
    const architectureContent = context.architectureContent ||
      (context.architecturePath ? fs.readFileSync(context.architecturePath, 'utf-8') : '');

    // Get schema from template
    const storySchema = this.getSchemaFromTemplate('user-story-tmpl');

    // Execute task
    const story = await this.executeTask<Story>(
      'create-next-story',
      storySchema,
      {
        'Story Number': storyNumber,
        'Epic': context.epic || 'Not specified',
        'PRD': prdContent,
        'Architecture': architectureContent,
      }
    );

    return story;
  }

  /**
   * Format story as markdown (BMAD format)
   */
  formatAsMarkdown(story: Story): string {
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

${story.tasks.map((task) => {
  let taskMd = `- [${task.completed ? 'x' : ' '}] ${task.task}`;
  if (task.subtasks && task.subtasks.length > 0) {
    taskMd += '\n' + task.subtasks
      .map(st => `  - [${st.completed ? 'x' : ' '}] ${st.subtask}`)
      .join('\n');
  }
  return taskMd;
}).join('\n')}

${story.devNotes ? `## Dev Notes\n\n${story.devNotes}` : ''}

${story.testingStrategy ? `## Testing Strategy\n\n${story.testingStrategy}` : ''}

---

## Dev Agent Record

### Agent Model Used
- Model: (to be filled by dev)

### Debug Log References
(to be filled by dev)

### Completion Notes
(to be filled by dev)

### File List
(to be filled by dev)

### Change Log
(to be filled by dev)
    `.trim();
  }
}
```

---

## 3. Developer Agent

**File:** `packages/ai-nodes/src/agents/developer.agent.ts`

```typescript
import { z } from 'zod';
import { BMADAgent } from './base.agent';
import * as fs from 'fs';

export interface Implementation {
  files: Array<{
    path: string;
    content: string;
    action: 'create' | 'modify' | 'delete';
  }>;
  tests: Array<{
    path: string;
    content: string;
  }>;
  checklistResults: Array<{
    item: string;
    completed: boolean;
    notes?: string;
  }>;
  completionNotes: string;
}

/**
 * BMAD Developer Agent
 * Implements user stories
 */
export class BMADDeveloperAgent extends BMADAgent {
  constructor(options: { model?: any } = {}) {
    super('dev', options);
  }

  /**
   * Implement story
   * Equivalent to Claude Code: @dev *develop-story --story=story-003.md
   */
  async implementStory(context: {
    storyPath?: string;
    storyContent?: string;
    architecturePath?: string;
    architectureContent?: string;
  }): Promise<Implementation> {
    // Load story content
    const storyContent = context.storyContent ||
      (context.storyPath ? fs.readFileSync(context.storyPath, 'utf-8') : '');

    // Load architecture content
    const architectureContent = context.architectureContent ||
      (context.architecturePath ? fs.readFileSync(context.architecturePath, 'utf-8') : '');

    // Define implementation schema
    const implementationSchema = z.object({
      files: z.array(z.object({
        path: z.string().describe('File path relative to project root'),
        content: z.string().describe('Complete file content'),
        action: z.enum(['create', 'modify', 'delete']),
      })),
      tests: z.array(z.object({
        path: z.string().describe('Test file path'),
        content: z.string().describe('Complete test file content'),
      })),
      checklistResults: z.array(z.object({
        item: z.string().describe('Checklist item from story-dod-checklist'),
        completed: z.boolean(),
        notes: z.string().optional(),
      })),
      completionNotes: z.string().describe('Notes about implementation'),
    });

    // Execute task
    const implementation = await this.executeTask<Implementation>(
      'execute-checklist',
      implementationSchema,
      {
        'Story': storyContent,
        'Architecture Context': architectureContent,
        'Checklist': this.getChecklist('story-dod-checklist'),
      }
    );

    return implementation;
  }

  /**
   * Load checklist from dependencies
   */
  private getChecklist(checklistName: string): string {
    const checklistPath = `.bmad-core/checklists/${checklistName}.md`;
    return fs.readFileSync(checklistPath, 'utf-8');
  }
}
```

---

## 4. QA Agent

**File:** `packages/ai-nodes/src/agents/qa.agent.ts`

```typescript
import { z } from 'zod';
import { BMADAgent } from './base.agent';
import * as fs from 'fs';

export interface QAReview {
  approved: boolean;
  score: number;
  feedback: string;
  requirementsCoverage: Array<{
    requirement: string;
    status: 'Met' | 'Partially Met' | 'Not Met';
    notes: string;
  }>;
  codeQualityIssues: Array<{
    severity: 'Critical' | 'Major' | 'Minor';
    issue: string;
    recommendation: string;
  }>;
  testCoverage: {
    hasTests: boolean;
    adequacy: 'Comprehensive' | 'Adequate' | 'Insufficient' | 'Missing';
    missingTestScenarios: string[];
  };
  edgeCasesIdentified: string[];
  recommendedChanges: string[];
  approvalStatus: 'Approved' | 'Approved with Minor Changes' | 'Requires Rework';
}

/**
 * BMAD QA Agent
 * Reviews implementations
 */
export class BMADQAAgent extends BMADAgent {
  constructor(options: { model?: any } = {}) {
    super('qa', options);
  }

  /**
   * Review story implementation
   * Equivalent to Claude Code: @qa *review --story=story-003.md
   */
  async reviewStory(context: {
    storyPath?: string;
    storyContent?: string;
    implementationFiles: Array<{ path: string; content: string }>;
    testFiles: Array<{ path: string; content: string }>;
  }): Promise<QAReview> {
    // Load story content
    const storyContent = context.storyContent ||
      (context.storyPath ? fs.readFileSync(context.storyPath, 'utf-8') : '');

    // Define review schema
    const reviewSchema = z.object({
      approved: z.boolean(),
      score: z.number().min(0).max(100),
      feedback: z.string(),
      requirementsCoverage: z.array(z.object({
        requirement: z.string(),
        status: z.enum(['Met', 'Partially Met', 'Not Met']),
        notes: z.string(),
      })),
      codeQualityIssues: z.array(z.object({
        severity: z.enum(['Critical', 'Major', 'Minor']),
        issue: z.string(),
        recommendation: z.string(),
      })),
      testCoverage: z.object({
        hasTests: z.boolean(),
        adequacy: z.enum(['Comprehensive', 'Adequate', 'Insufficient', 'Missing']),
        missingTestScenarios: z.array(z.string()),
      }),
      edgeCasesIdentified: z.array(z.string()),
      recommendedChanges: z.array(z.string()),
      approvalStatus: z.enum(['Approved', 'Approved with Minor Changes', 'Requires Rework']),
    });

    // Format implementation for review
    const implementationSummary = this.formatImplementation(
      context.implementationFiles,
      context.testFiles
    );

    // Execute task
    const review = await this.executeTask<QAReview>(
      'review-story',
      reviewSchema,
      {
        'Story': storyContent,
        'Implementation': implementationSummary,
      }
    );

    return review;
  }

  private formatImplementation(
    files: Array<{ path: string; content: string }>,
    tests: Array<{ path: string; content: string }>
  ): string {
    let summary = '## Implementation Files\n\n';

    for (const file of files) {
      summary += `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
    }

    summary += '## Test Files\n\n';

    for (const test of tests) {
      summary += `### ${test.path}\n\`\`\`\n${test.content}\n\`\`\`\n\n`;
    }

    return summary;
  }
}
```

---

## 5. Utility: BMAD Loader

**File:** `packages/ai-nodes/src/utils/bmad-loader.ts`

```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

/**
 * Loads BMAD files from .bmad-core/ directory
 */
export class BMADLoader {
  /**
   * Load agent definition from .bmad-core/agents/{agentId}.md
   */
  static loadAgent(bmadPath: string, agentId: string): any {
    const agentFile = path.join(bmadPath, 'agents', `${agentId}.md`);
    const content = fs.readFileSync(agentFile, 'utf-8');

    // Extract YAML block
    const yamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
    if (!yamlMatch) {
      throw new Error(`No YAML block found in ${agentFile}`);
    }

    return yaml.parse(yamlMatch[1]);
  }

  /**
   * Load task from .bmad-core/tasks/{taskFile}
   */
  static loadTask(bmadPath: string, taskFile: string): string {
    const taskPath = path.join(bmadPath, 'tasks', taskFile);
    return fs.readFileSync(taskPath, 'utf-8');
  }

  /**
   * Load template from .bmad-core/templates/{templateFile}
   */
  static loadTemplate(bmadPath: string, templateFile: string): any {
    const templatePath = path.join(bmadPath, 'templates', templateFile);
    const content = fs.readFileSync(templatePath, 'utf-8');
    return yaml.parse(content);
  }
}
```

---

## 6. Utility: Schema Converter

**File:** `packages/ai-nodes/src/utils/schema-converter.ts`

```typescript
import { z } from 'zod';

/**
 * Convert BMAD YAML templates to Zod schemas
 */
export class SchemaConverter {
  /**
   * Convert BMAD template to Zod schema
   */
  static templateToZodSchema(template: any): z.ZodObject<any> {
    const schemaFields: Record<string, any> = {};

    // Process each section in template
    for (const section of template.sections || []) {
      const fieldSchema = this.sectionToZodField(section);

      if (fieldSchema) {
        schemaFields[section.id] = fieldSchema;
      }
    }

    return z.object(schemaFields);
  }

  /**
   * Convert template section to Zod field
   */
  private static sectionToZodField(section: any): any {
    // Handle repeatable sections (arrays)
    if (section.repeatable) {
      const itemSchema = this.buildObjectFromFields(section.fields);
      return z.array(itemSchema);
    }

    // Handle sections with subsections (nested objects)
    if (section.subsections) {
      const subFields: Record<string, any> = {};

      for (const subsection of section.subsections) {
        subFields[subsection.id] = this.sectionToZodField(subsection);
      }

      return z.object(subFields);
    }

    // Handle sections with fields
    if (section.fields) {
      return this.buildObjectFromFields(section.fields);
    }

    // Handle sections with choices (enums)
    if (section.choices) {
      return z.enum(section.choices);
    }

    // Default: string field
    return z.string().describe(section.instruction || section.title);
  }

  /**
   * Build Zod object from field definitions
   */
  private static buildObjectFromFields(fields: any): z.ZodObject<any> {
    const fieldSchemas: Record<string, any> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        fieldSchemas[key] = z.string().describe(value);
      }
    }

    return z.object(fieldSchemas);
  }
}
```

---

## 7. Complete Worker Example

**File:** `packages/ai-nodes/src/workers/architect.worker.ts`

```typescript
import { BMADScrumMasterAgent } from '../agents/scrum-master.agent';
import { SolanaService } from '../services/solana.service';
import { ArweaveService } from '../services/arweave.service';
import * as fs from 'fs';

/**
 * Complete example: Architect worker that creates stories
 */
export class ArchitectWorker {
  private solana: SolanaService;
  private arweave: ArweaveService;
  private smAgent: BMADScrumMasterAgent;
  private subscriptionId: number | null = null;

  constructor() {
    this.solana = new SolanaService();
    this.arweave = new ArweaveService();

    // Initialize BMAD Scrum Master agent
    // This automatically loads:
    // - .bmad-core/agents/sm.md (persona)
    // - .bmad-core/tasks/create-next-story.md (task instructions)
    // - .bmad-core/templates/user-story-tmpl.yaml (template → Zod schema)
    this.smAgent = new BMADScrumMasterAgent();
  }

  /**
   * Main entry point - subscribes to events via WebSocket
   */
  async start() {
    console.log('🏗️  Architect node starting...');
    console.log('📡 Subscribing to ProjectCreated events via WebSocket...');

    // Subscribe to ProjectCreated events using Solana WebSocket
    this.subscriptionId = await this.solana.subscribeToEvent(
      'ProjectCreated',
      (event) => this.handleProjectCreated(event)
    );

    console.log(`✅ Subscribed to events (subscription ID: ${this.subscriptionId})`);
    console.log('🎧 Listening for new projects...');

    // Keep process alive
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('\n🛑 Shutting down...');

    if (this.subscriptionId !== null) {
      await this.solana.unsubscribe(this.subscriptionId);
      console.log('✅ Unsubscribed from events');
    }

    process.exit(0);
  }

  /**
   * Handle ProjectCreated event
   */
  async handleProjectCreated(event: any) {
    const projectId = event.project_id;

    // Fetch PRD from Arweave
    const project = await this.solana.getProject(projectId);
    const prdContent = await this.arweave.fetch(project.prd_arweave_tx);

    // Bid on architecture work
    await this.solana.submitBid({
      project_id: projectId,
      opportunity_type: 'Architecture',
      amount_sol: 5.0,
    });
  }

  /**
   * Called when bid is accepted
   */
  async onBidAccepted(projectId: string) {
    // Create stories using BMAD
    await this.createStories(projectId);
  }

  /**
   * Create stories using BMAD Scrum Master agent
   *
   * THIS IS THE COMPLETE EXAMPLE
   */
  async createStories(projectId: string) {
    console.log(`📝 Creating stories for project ${projectId}`);

    // 1. Fetch context from blockchain/Arweave
    const project = await this.solana.getProject(projectId);
    const prdContent = await this.arweave.fetch(project.prd_arweave_tx);
    const archContent = await this.arweave.fetch(project.architecture_arweave_tx);

    // 2. Save to temp files (BMAD agents can read from paths or content)
    const prdPath = `/tmp/prd-${projectId}.md`;
    const archPath = `/tmp/arch-${projectId}.md`;

    fs.writeFileSync(prdPath, prdContent);
    fs.writeFileSync(archPath, archContent);

    // 3. Extract epics from PRD
    const epics = this.extractEpics(prdContent);

    let storyNumber = 1;

    // 4. For each epic, create stories
    for (const epic of epics) {
      console.log(`📦 Epic: ${epic.id} - ${epic.title}`);

      // Create 3 stories per epic
      for (let i = 0; i < 3; i++) {
        try {
          // THIS IS THE KEY CALL
          // Uses BMAD agent with AI SDK internally
          const story = await this.smAgent.createNextStory(storyNumber, {
            prdPath,
            architecturePath: archPath,
            epic: epic.id,
          });

          console.log(`✅ Story ${storyNumber}: ${story.title}`);

          // 5. Format as markdown
          const storyMarkdown = this.smAgent.formatAsMarkdown(story);

          // 6. Upload to Arweave
          const storyTxId = await this.arweave.upload(storyMarkdown);

          // 7. Create on-chain
          await this.solana.createStory({
            project_id: projectId,
            story_number: storyNumber,
            story_arweave_tx: storyTxId,
            epic_id: epic.id,
            estimated_complexity: story.estimatedComplexity,
            status: 'Created',
          });

          storyNumber++;

        } catch (error) {
          console.error(`❌ Failed to create story ${storyNumber}:`, error);
        }
      }
    }

    console.log(`✅ Created ${storyNumber - 1} stories`);
  }

  private extractEpics(prdContent: string): Array<{ id: string; title: string }> {
    const epicRegex = /^### (EPIC-\d+): (.+)$/gm;
    const epics: Array<{ id: string; title: string }> = [];

    let match;
    while ((match = epicRegex.exec(prdContent)) !== null) {
      epics.push({ id: match[1], title: match[2] });
    }

    return epics;
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the worker
if (require.main === module) {
  const worker = new ArchitectWorker();
  worker.start().catch(console.error);
}
```

---

## 8. Usage Example

### Running the Worker

```bash
# Install dependencies
npm install ai @ai-sdk/anthropic @ai-sdk/openai zod yaml

# Set environment variables
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...

# Run the architect worker
npm run worker:architect
```

### What Happens:

```
🏗️  Architect node starting...
📋 New project: ABC123
💰 Submitting architecture bid...
✅ Bid submitted

🎉 Architecture bid accepted for ABC123
📝 Creating stories for project ABC123
📦 Epic: EPIC-001 - User Authentication

[BMAD Agent Internal Process:]
1. Loading .bmad-core/agents/sm.md...
   ✓ Persona loaded: "Expert at breaking epics into implementable user stories"

2. Loading .bmad-core/tasks/create-next-story.md...
   ✓ Task instructions loaded

3. Loading .bmad-core/templates/user-story-tmpl.yaml...
   ✓ Template converted to Zod schema

4. Building prompt:
   - Task: create-next-story instructions
   - Story Number: 1
   - Epic: EPIC-001
   - PRD: [full content]
   - Architecture: [full content]

5. Calling Vercel AI SDK:
   - Model: claude-3-5-sonnet-20241022
   - Schema: storySchema (from template)
   - System: persona (from sm.md)
   - Prompt: [built above]

6. Claude API responds with structured JSON

7. Zod validates response matches schema

8. Story object returned:
   {
     storyNumber: "001",
     title: "User can register with email",
     status: "Draft",
     epic: "EPIC-001",
     ...
   }

✅ Story 1: User can register with email
✅ Story 2: User can login with credentials
✅ Story 3: User can reset password

📦 Epic: EPIC-002 - Project Management
...

✅ Created 12 stories
```

---

## Summary: How It All Connects

### The Flow:

```
Blockchain Event (ProjectCreated)
    ↓
Architect Worker polls
    ↓
worker.handleProjectCreated()
    ↓
worker.onBidAccepted()
    ↓
worker.createStories()
    ↓
smAgent.createNextStory(1, { prdPath, archPath, epic })
    ↓
[INSIDE BMADScrumMasterAgent]
    ↓
1. Load .bmad-core/agents/sm.md → persona
2. Load .bmad-core/tasks/create-next-story.md → instructions
3. Load .bmad-core/templates/user-story-tmpl.yaml → schema
4. Build prompt = instructions + PRD + architecture
5. Call generateObject(model, schema, system, prompt)
    ↓
Vercel AI SDK → Claude API
    ↓
Claude responds with structured JSON
    ↓
Zod validates → Story object
    ↓
Return to worker
    ↓
worker.formatAsMarkdown(story)
    ↓
Upload to Arweave
    ↓
Create on blockchain
    ↓
StoryCreated event emitted
    ↓
Developer nodes see event and start bidding
```

### The Key Files:

1. **`.bmad-core/agents/sm.md`** - Agent persona and configuration
2. **`.bmad-core/tasks/create-next-story.md`** - Task instructions
3. **`.bmad-core/templates/user-story-tmpl.yaml`** - Output structure
4. **`scrum-master.agent.ts`** - Loads BMAD files, calls AI SDK
5. **`architect.worker.ts`** - Orchestrates the workflow

**Everything else is just plumbing!**

The magic is: **BMAD files define the "what"**, **Vercel AI SDK executes the "how"**.