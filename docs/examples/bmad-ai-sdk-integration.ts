/**
 * BMAD-METHOD + Vercel AI SDK Integration Proof of Concept
 *
 * This file demonstrates the recommended hybrid integration architecture
 * combining BMAD's agent orchestration with AI SDK's multi-model capabilities.
 */

import { generateText, generateObject, streamText, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// ============================================================================
// PATTERN 1: BMAD Template → Zod Schema Conversion
// ============================================================================

/**
 * Example: BMAD PRD Template converted to Zod Schema
 *
 * Original BMAD template structure (prd-tmpl.yaml):
 * - Goals and Context
 * - Requirements (Functional/Non-Functional)
 * - UI Design Goals
 * - Technical Assumptions
 * - Epic List with repeatable Epic Details
 *
 * This schema enables type-safe structured generation with generateObject.
 */
const prdSchema = z.object({
  productName: z.string().describe('Name of the product'),
  overview: z.string().describe('High-level product overview and vision'),

  goalsAndContext: z.object({
    primaryGoals: z.array(z.string()).describe('3-5 primary product goals'),
    targetAudience: z.string().describe('Who will use this product'),
    successMetrics: z.array(z.string()).describe('How success will be measured'),
  }),

  targetUsers: z.array(z.object({
    persona: z.string().describe('User persona name'),
    needs: z.string().describe('Core needs this persona has'),
    painPoints: z.string().describe('Problems they currently face'),
  })).describe('2-4 target user personas'),

  functionalRequirements: z.array(z.object({
    id: z.string().describe('Requirement ID (e.g., FR-001)'),
    requirement: z.string().describe('Clear functional requirement statement'),
    priority: z.enum(['P0', 'P1', 'P2', 'P3']).describe('Priority level'),
    rationale: z.string().describe('Why this requirement is important'),
  })).describe('Functional requirements list'),

  nonFunctionalRequirements: z.array(z.object({
    category: z.enum(['Performance', 'Security', 'Scalability', 'Usability', 'Reliability']),
    requirement: z.string().describe('Non-functional requirement statement'),
    targetMetric: z.string().optional().describe('Measurable target if applicable'),
  })).describe('Non-functional requirements'),

  uiDesignGoals: z.array(z.string()).describe('Key UI/UX design principles'),

  technicalAssumptions: z.array(z.object({
    assumption: z.string().describe('Technical assumption or constraint'),
    impact: z.string().describe('Impact if assumption proves false'),
  })).describe('Technical assumptions and constraints'),

  epics: z.array(z.object({
    id: z.string().describe('Epic ID (e.g., EPIC-001)'),
    title: z.string().describe('Epic title'),
    description: z.string().describe('Detailed epic description'),
    priority: z.enum(['P0', 'P1', 'P2', 'P3']),
    estimatedComplexity: z.enum(['Small', 'Medium', 'Large', 'X-Large']),
    dependencies: z.array(z.string()).describe('IDs of dependent epics'),
    userStories: z.array(z.string()).describe('High-level user stories for this epic'),
  })).describe('Product epics with detailed breakdown'),
});

type PRD = z.infer<typeof prdSchema>;

// ============================================================================
// PATTERN 2: BMAD Agent Implementation with AI SDK
// ============================================================================

/**
 * Base interface for all BMAD agents
 */
interface BMADAgent {
  name: string;
  role: string;
  persona: string;
  model: any; // AI SDK model instance
  dependencies: {
    tasks: string[];
    templates: string[];
    data: string[];
  };
  executeTask(taskName: string, context: any): Promise<any>;
}

/**
 * Product Manager Agent (Planning Agent - Can be heavy)
 *
 * Persona: Analytical, data-driven PM focused on user value
 * Model: Claude 3.5 Sonnet (excellent at structured reasoning and document creation)
 */
class PMAgent implements BMADAgent {
  name = 'John';
  role = 'Product Manager';
  persona = `You are John, an analytical and data-driven Product Manager.
Your core principles:
- Understand root user motivations and pain points
- Focus on delivering user value, not just features
- Make data-informed decisions while embracing calculated risks
- Think strategically about product positioning and market fit

Your style is methodical, thorough, and user-centric.`;

  model = anthropic('claude-3-5-sonnet-20241022');

  dependencies = {
    tasks: ['create-doc', 'create-brownfield-prd', 'shard-doc'],
    templates: ['prd-tmpl.yaml', 'project-brief-tmpl.yaml'],
    data: ['bmad-kb.md', 'technical-preferences.md'],
  };

  /**
   * Create a comprehensive PRD using structured generation
   */
  async createPRD(projectBrief: string): Promise<PRD> {
    const { object: prd } = await generateObject({
      model: this.model,
      schema: prdSchema,
      system: this.persona,
      prompt: `Create a comprehensive Product Requirements Document based on this project brief:\n\n${projectBrief}\n\nEnsure all requirements are specific, measurable, and actionable. Break down the product into clear epics with user stories.`,
    });

    return prd;
  }

  /**
   * Generic task execution following BMAD task pattern
   */
  async executeTask(taskName: string, context: any): Promise<any> {
    // Load task instructions from dependencies
    const taskInstructions = this.loadTaskInstructions(taskName);

    // Execute task with AI SDK
    const result = await generateText({
      model: this.model,
      system: this.persona,
      prompt: `Execute this task:\n\n${taskInstructions}\n\nContext: ${JSON.stringify(context)}`,
      maxSteps: 10, // Allow multi-step reasoning
    });

    return result.text;
  }

  private loadTaskInstructions(taskName: string): string {
    // In production: Load from bmad-core/tasks/{taskName}.md
    return `Task instructions for ${taskName}`;
  }
}

/**
 * Developer Agent (Implementation Agent - Must be lean)
 *
 * Persona: Pragmatic, solution-focused developer (James)
 * Model: GPT-4 Turbo (fast, cost-effective for code generation)
 */
class DeveloperAgent implements BMADAgent {
  name = 'James';
  role = 'Full-Stack Developer';
  persona = `You are James, a pragmatic and solution-focused full-stack developer.
Your approach:
- Implement exactly what's specified in the story
- Write clean, maintainable code
- Include tests for all functionality
- Follow existing patterns and conventions
- Halt if requirements are ambiguous

Your style is precise, efficient, and no-nonsense.`;

  model = openai('gpt-4-turbo'); // Faster and cheaper for code tasks

  dependencies = {
    tasks: ['execute-checklist'], // Minimal - only execution task
    templates: [], // No templates for dev agent
    data: ['technical-preferences.md'], // Only technical standards
  };

  /**
   * Execute a story implementation with checklist validation
   */
  async implementStory(story: string, architectureContext: string): Promise<string> {
    const result = await generateText({
      model: this.model,
      system: this.persona,
      prompt: `Implement this user story:\n\n${story}\n\nArchitecture context:\n${architectureContext}\n\nProvide complete implementation with tests.`,
      maxSteps: 5, // Limited steps - dev agent should be focused
    });

    return result.text;
  }

  async executeTask(taskName: string, context: any): Promise<any> {
    // Dev agent: minimal task set, focused execution
    const result = await generateText({
      model: this.model,
      system: this.persona,
      prompt: `Execute: ${taskName}\nContext: ${JSON.stringify(context)}`,
    });

    return result.text;
  }
}

/**
 * Analyst Agent (Research and Analysis)
 *
 * Persona: Market research and competitive analysis expert
 * Model: Claude 3.5 Sonnet (deep reasoning for research)
 */
class AnalystAgent implements BMADAgent {
  name = 'Sarah';
  role = 'Business Analyst';
  persona = `You are Sarah, a business analyst specializing in market research and competitive analysis.
Your expertise:
- Identify market opportunities and threats
- Analyze competitive landscapes
- Research user needs and pain points
- Provide data-driven recommendations

Your style is thorough, research-driven, and strategic.`;

  model = anthropic('claude-3-5-sonnet-20241022');

  dependencies = {
    tasks: ['create-doc', 'brainstorming-session', 'advanced-elicitation'],
    templates: ['project-brief-tmpl.yaml'],
    data: ['bmad-kb.md'],
  };

  /**
   * Create project brief using BMAD brainstorming task pattern
   */
  async createProjectBrief(projectIdea: string): Promise<string> {
    const briefSchema = z.object({
      projectName: z.string(),
      executiveSummary: z.string(),
      problemStatement: z.string(),
      proposedSolution: z.string(),
      targetMarket: z.object({
        primaryAudience: z.string(),
        marketSize: z.string(),
        competitors: z.array(z.string()),
      }),
      valueProposition: z.string(),
      keyFeatures: z.array(z.string()),
      successMetrics: z.array(z.string()),
      risks: z.array(z.object({
        risk: z.string(),
        mitigation: z.string(),
      })),
    });

    const { object: brief } = await generateObject({
      model: this.model,
      schema: briefSchema,
      system: this.persona,
      prompt: `Create a comprehensive project brief for this idea:\n\n${projectIdea}\n\nInclude thorough market research, competitive analysis, and strategic recommendations.`,
    });

    // Convert structured object to markdown
    return this.formatBriefAsMarkdown(brief);
  }

  async executeTask(taskName: string, context: any): Promise<any> {
    const result = await generateText({
      model: this.model,
      system: this.persona,
      prompt: `Task: ${taskName}\nContext: ${JSON.stringify(context)}`,
      maxSteps: 15, // Analyst may need deeper reasoning
    });

    return result.text;
  }

  private formatBriefAsMarkdown(brief: any): string {
    return `# ${brief.projectName}\n\n${brief.executiveSummary}\n\n...`;
  }
}

/**
 * Architect Agent (System Design)
 *
 * Persona: Senior technical architect
 * Model: Claude 3.5 Sonnet (strong technical reasoning)
 */
class ArchitectAgent implements BMADAgent {
  name = 'Alex';
  role = 'Solution Architect';
  persona = `You are Alex, a senior solution architect with expertise in system design.
Your focus:
- Design scalable, maintainable architectures
- Make pragmatic technology choices
- Balance ideal solutions with real-world constraints
- Document architectural decisions and rationale

Your style is thoughtful, pragmatic, and technically deep.`;

  model = anthropic('claude-3-5-sonnet-20241022');

  dependencies = {
    tasks: ['create-doc', 'document-project'],
    templates: ['architecture-tmpl.yaml', 'uiux-tmpl.yaml'],
    data: ['technical-preferences.md'],
  };

  /**
   * Design system architecture from PRD
   */
  async designArchitecture(prd: PRD): Promise<any> {
    const architectureSchema = z.object({
      systemOverview: z.string(),
      architecturePatterns: z.array(z.string()),
      technologyStack: z.object({
        frontend: z.array(z.string()),
        backend: z.array(z.string()),
        database: z.array(z.string()),
        infrastructure: z.array(z.string()),
      }),
      dataModel: z.array(z.object({
        entity: z.string(),
        attributes: z.array(z.string()),
        relationships: z.array(z.string()),
      })),
      apiDesign: z.array(z.object({
        endpoint: z.string(),
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
        purpose: z.string(),
        requestSchema: z.string(),
        responseSchema: z.string(),
      })),
      securityConsiderations: z.array(z.string()),
      scalabilityStrategy: z.string(),
      deploymentArchitecture: z.string(),
    });

    const { object: architecture } = await generateObject({
      model: this.model,
      schema: architectureSchema,
      system: this.persona,
      prompt: `Design a comprehensive system architecture for this product:\n\n${JSON.stringify(prd, null, 2)}\n\nEnsure the architecture is scalable, secure, and aligned with modern best practices.`,
    });

    return architecture;
  }

  async executeTask(taskName: string, context: any): Promise<any> {
    const result = await generateText({
      model: this.model,
      system: this.persona,
      prompt: `Task: ${taskName}\nContext: ${JSON.stringify(context)}`,
      maxSteps: 10,
    });

    return result.text;
  }
}

/**
 * QA Agent (Test Design and Review)
 *
 * Persona: Quality assurance expert
 * Model: GPT-4 Turbo (good at edge case identification)
 */
class QAAgent implements BMADAgent {
  name = 'Quinn';
  role = 'QA Engineer';
  persona = `You are Quinn, a quality assurance expert focused on comprehensive testing.
Your approach:
- Identify edge cases and failure scenarios
- Design thorough test plans
- Review implementations for quality issues
- Ensure requirements are met

Your style is detail-oriented, systematic, and thorough.`;

  model = openai('gpt-4-turbo');

  dependencies = {
    tasks: ['review-story', 'design-tests', 'risk-assessment'],
    templates: [],
    data: ['technical-preferences.md'],
  };

  /**
   * Review completed story implementation
   */
  async reviewStory(story: string, implementation: string): Promise<any> {
    const reviewSchema = z.object({
      overallQuality: z.enum(['Excellent', 'Good', 'Acceptable', 'Needs Improvement', 'Rejected']),
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
        adequacyCoverage: z.enum(['Comprehensive', 'Adequate', 'Insufficient', 'Missing']),
        missingTestScenarios: z.array(z.string()),
      }),
      edgeCasesIdentified: z.array(z.string()),
      recommendedChanges: z.array(z.string()),
      approvalStatus: z.enum(['Approved', 'Approved with Minor Changes', 'Requires Rework']),
    });

    const { object: review } = await generateObject({
      model: this.model,
      schema: reviewSchema,
      system: this.persona,
      prompt: `Review this implementation:\n\nStory:\n${story}\n\nImplementation:\n${implementation}\n\nProvide thorough quality assessment.`,
    });

    return review;
  }

  async executeTask(taskName: string, context: any): Promise<any> {
    const result = await generateText({
      model: this.model,
      system: this.persona,
      prompt: `Task: ${taskName}\nContext: ${JSON.stringify(context)}`,
    });

    return result.text;
  }
}

// ============================================================================
// PATTERN 3: BMAD Workflow Orchestration with AI SDK
// ============================================================================

/**
 * Workflow Orchestrator
 *
 * Coordinates BMAD workflow sequences (Analyst → PM → Architect → Dev → QA)
 * Each agent uses AI SDK internally for model flexibility
 */
class BMADWorkflowOrchestrator {
  private analyst: AnalystAgent;
  private pm: PMAgent;
  private architect: ArchitectAgent;
  private developer: DeveloperAgent;
  private qa: QAAgent;

  constructor() {
    this.analyst = new AnalystAgent();
    this.pm = new PMAgent();
    this.architect = new ArchitectAgent();
    this.developer = new DeveloperAgent();
    this.qa = new QAAgent();
  }

  /**
   * Execute greenfield workflow: Idea → Brief → PRD → Architecture → Implementation
   */
  async executeGreenfieldWorkflow(projectIdea: string) {
    console.log('🚀 Starting Greenfield Workflow');
    console.log('================================\n');

    // Step 1: Analyst creates project brief
    console.log('📊 Step 1: Analyst creating project brief...');
    const brief = await this.analyst.createProjectBrief(projectIdea);
    console.log('✅ Project brief created\n');

    // Step 2: PM creates PRD from brief
    console.log('📋 Step 2: PM creating Product Requirements Document...');
    const prd = await this.pm.createPRD(brief);
    console.log('✅ PRD created with', prd.epics.length, 'epics\n');

    // Step 3: Architect designs system
    console.log('🏗️  Step 3: Architect designing system architecture...');
    const architecture = await this.architect.designArchitecture(prd);
    console.log('✅ Architecture designed\n');

    // Step 4: Developer implements first epic's first story
    console.log('💻 Step 4: Developer implementing story...');
    const firstStory = prd.epics[0].userStories[0];
    const implementation = await this.developer.implementStory(
      firstStory,
      JSON.stringify(architecture)
    );
    console.log('✅ Story implemented\n');

    // Step 5: QA reviews implementation
    console.log('🔍 Step 5: QA reviewing implementation...');
    const qaReview = await this.qa.reviewStory(firstStory, implementation);
    console.log('✅ QA review completed:', qaReview.approvalStatus, '\n');

    return {
      brief,
      prd,
      architecture,
      implementation,
      qaReview,
    };
  }

  /**
   * Execute brownfield workflow: Existing project → Document → Enhance
   */
  async executeBrownfieldWorkflow(existingCodeContext: string, featureRequest: string) {
    console.log('🏗️  Starting Brownfield Workflow');
    console.log('=================================\n');

    // Step 1: Architect documents existing project
    console.log('📝 Step 1: Architect documenting existing project...');
    const documentation = await this.architect.executeTask('document-project', {
      codeContext: existingCodeContext,
    });
    console.log('✅ Project documented\n');

    // Step 2: PM creates brownfield PRD for new feature
    console.log('📋 Step 2: PM creating feature PRD...');
    const featurePRD = await this.pm.executeTask('create-brownfield-prd', {
      documentation,
      featureRequest,
    });
    console.log('✅ Feature PRD created\n');

    // Step 3: Developer implements feature
    console.log('💻 Step 3: Developer implementing feature...');
    const implementation = await this.developer.implementStory(
      featureRequest,
      documentation
    );
    console.log('✅ Feature implemented\n');

    // Step 4: QA reviews with extra brownfield considerations
    console.log('🔍 Step 4: QA reviewing for regressions...');
    const qaReview = await this.qa.reviewStory(featureRequest, implementation);
    console.log('✅ QA review completed:', qaReview.approvalStatus, '\n');

    return {
      documentation,
      featurePRD,
      implementation,
      qaReview,
    };
  }
}

// ============================================================================
// PATTERN 4: BMAD Tasks as AI SDK Tools
// ============================================================================

/**
 * Convert BMAD tasks into AI SDK tools for flexible orchestration
 */
const bmadTaskTools = {
  createProjectBrief: tool({
    description: 'Create a comprehensive project brief using BMAD analyst workflow',
    parameters: z.object({
      projectIdea: z.string().describe('The project idea to analyze and document'),
    }),
    execute: async ({ projectIdea }) => {
      const analyst = new AnalystAgent();
      return await analyst.createProjectBrief(projectIdea);
    },
  }),

  createPRD: tool({
    description: 'Generate Product Requirements Document from project brief',
    parameters: z.object({
      projectBrief: z.string().describe('The project brief to expand into a PRD'),
    }),
    execute: async ({ projectBrief }) => {
      const pm = new PMAgent();
      return await pm.createPRD(projectBrief);
    },
  }),

  designArchitecture: tool({
    description: 'Design system architecture from PRD',
    parameters: z.object({
      prd: z.string().describe('JSON string of the PRD object'),
    }),
    execute: async ({ prd }) => {
      const architect = new ArchitectAgent();
      const prdObject = JSON.parse(prd);
      return await architect.designArchitecture(prdObject);
    },
  }),

  implementStory: tool({
    description: 'Implement a user story with tests',
    parameters: z.object({
      story: z.string().describe('The user story to implement'),
      architectureContext: z.string().describe('Relevant architecture context'),
    }),
    execute: async ({ story, architectureContext }) => {
      const developer = new DeveloperAgent();
      return await developer.implementStory(story, architectureContext);
    },
  }),

  reviewImplementation: tool({
    description: 'QA review of a story implementation',
    parameters: z.object({
      story: z.string().describe('The original user story'),
      implementation: z.string().describe('The implementation code to review'),
    }),
    execute: async ({ story, implementation }) => {
      const qa = new QAAgent();
      return await qa.reviewStory(story, implementation);
    },
  }),
};

/**
 * Flexible orchestrator using BMAD tasks as tools
 *
 * This pattern allows the AI to dynamically choose which BMAD tasks to execute
 */
async function flexibleWorkflowOrchestration(userRequest: string) {
  const result = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    prompt: `User request: ${userRequest}\n\nUse the available BMAD workflow tools to fulfill this request. Execute tasks in the appropriate order.`,
    tools: bmadTaskTools,
    maxSteps: 20, // Allow multi-step workflow
  });

  return result;
}

// ============================================================================
// PATTERN 5: Cost Tracking and Model Fallback
// ============================================================================

/**
 * Model selection strategy with cost tracking
 */
class ModelSelector {
  private usage: { [agentName: string]: { tokens: number; cost: number } } = {};

  /**
   * Get optimal model for agent type with fallback
   */
  getModelForAgent(agentType: 'analyst' | 'pm' | 'architect' | 'developer' | 'qa') {
    const modelConfig = {
      analyst: {
        primary: anthropic('claude-3-5-sonnet-20241022'),
        fallback: openai('gpt-4-turbo'),
        costPerToken: { input: 0.003 / 1000, output: 0.015 / 1000 },
      },
      pm: {
        primary: anthropic('claude-3-5-sonnet-20241022'),
        fallback: openai('gpt-4-turbo'),
        costPerToken: { input: 0.003 / 1000, output: 0.015 / 1000 },
      },
      architect: {
        primary: anthropic('claude-3-5-sonnet-20241022'),
        fallback: openai('gpt-4-turbo'),
        costPerToken: { input: 0.003 / 1000, output: 0.015 / 1000 },
      },
      developer: {
        primary: openai('gpt-4-turbo'),
        fallback: anthropic('claude-3-5-sonnet-20241022'),
        costPerToken: { input: 0.01 / 1000, output: 0.03 / 1000 },
      },
      qa: {
        primary: openai('gpt-4-turbo'),
        fallback: anthropic('claude-3-5-sonnet-20241022'),
        costPerToken: { input: 0.01 / 1000, output: 0.03 / 1000 },
      },
    };

    return modelConfig[agentType];
  }

  /**
   * Track usage and calculate cost
   */
  trackUsage(agentName: string, inputTokens: number, outputTokens: number, costPerToken: any) {
    const cost =
      inputTokens * costPerToken.input + outputTokens * costPerToken.output;

    if (!this.usage[agentName]) {
      this.usage[agentName] = { tokens: 0, cost: 0 };
    }

    this.usage[agentName].tokens += inputTokens + outputTokens;
    this.usage[agentName].cost += cost;
  }

  /**
   * Get usage report
   */
  getUsageReport() {
    return this.usage;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Execute complete greenfield workflow
 */
async function exampleGreenfieldWorkflow() {
  const orchestrator = new BMADWorkflowOrchestrator();

  const result = await orchestrator.executeGreenfieldWorkflow(
    'Marketplace connecting software project owners with expert developers, ' +
      'using AI agents to manage workflow and Solana blockchain for escrow payments'
  );

  console.log('🎉 Workflow completed!');
  console.log('Brief:', result.brief.substring(0, 100) + '...');
  console.log('PRD Epics:', result.prd.epics.length);
  console.log('QA Status:', result.qaReview.approvalStatus);
}

/**
 * Example 2: Flexible workflow with tools
 */
async function exampleFlexibleWorkflow() {
  const result = await flexibleWorkflowOrchestration(
    'I have an idea for a task management app with AI prioritization. ' +
      'Create a brief, PRD, and architecture for it.'
  );

  console.log('Flexible workflow result:', result.text);
}

/**
 * Example 3: Single agent usage with structured output
 */
async function exampleSingleAgent() {
  const pm = new PMAgent();

  const prd = await pm.createPRD(
    'Project Brief: Build a SaaS platform for freelance project management...'
  );

  console.log('Generated PRD:', prd.productName);
  console.log('Functional Requirements:', prd.functionalRequirements.length);
  console.log('Epics:', prd.epics.length);
}

/**
 * Example 4: Cost tracking
 */
async function exampleCostTracking() {
  const selector = new ModelSelector();

  // Simulate workflow execution with cost tracking
  const analystModel = selector.getModelForAgent('analyst');
  selector.trackUsage('analyst', 5000, 2000, analystModel.costPerToken);

  const devModel = selector.getModelForAgent('developer');
  selector.trackUsage('developer', 3000, 8000, devModel.costPerToken);

  console.log('Usage Report:', selector.getUsageReport());
  // Expected output:
  // {
  //   analyst: { tokens: 7000, cost: ~0.045 },
  //   developer: { tokens: 11000, cost: ~0.27 }
  // }
}

// ============================================================================
// INTEGRATION BEST PRACTICES
// ============================================================================

/**
 * Best Practices Summary:
 *
 * 1. BMAD Agent Structure
 *    - Planning agents (Analyst, PM, Architect): Heavy context, Claude Sonnet
 *    - Dev agents (Developer, QA): Lean context, GPT-4 Turbo
 *    - All agents have clear personas matching BMAD style
 *
 * 2. Template → Schema Conversion
 *    - BMAD YAML templates convert cleanly to Zod schemas
 *    - Use generateObject for structured document creation
 *    - Maintain BMAD template structure in schema design
 *
 * 3. Workflow Orchestration
 *    - High-level: BMADWorkflowOrchestrator manages agent sequence
 *    - Low-level: Each agent uses AI SDK internally
 *    - Support both prescribed workflows and flexible tool-based flows
 *
 * 4. Model Selection Strategy
 *    - Analyst/PM/Architect: Claude Sonnet (deep reasoning, structured output)
 *    - Developer/QA: GPT-4 Turbo (fast, cost-effective code generation)
 *    - Always configure fallback models
 *    - Track costs per agent type
 *
 * 5. Task Execution
 *    - BMAD tasks can be AI SDK tools OR internal agent methods
 *    - Hybrid approach: prescribed sequence + flexible tool calling
 *    - Maintain BMAD's lean dev agent philosophy
 *
 * 6. Error Handling
 *    - Validate structured outputs with Zod
 *    - Implement retry logic with fallback models
 *    - Gracefully handle partial completions
 *
 * 7. Performance Optimization
 *    - Use streaming (streamText, streamObject) for better UX
 *    - Cache common prompts and templates
 *    - Monitor token usage per agent
 *    - Batch independent operations
 */

export {
  // Agents
  AnalystAgent,
  PMAgent,
  ArchitectAgent,
  DeveloperAgent,
  QAAgent,

  // Orchestration
  BMADWorkflowOrchestrator,
  flexibleWorkflowOrchestration,

  // Tools
  bmadTaskTools,

  // Utilities
  ModelSelector,

  // Schemas
  prdSchema,

  // Types
  type PRD,
  type BMADAgent,
};
