# BMAD + AI SDK Integration for Claude Code Users

**Purpose:** Show how users in Claude Code can use BMAD agents (from `.bmad-core/`) with AI SDK's model flexibility and user choice.

---

## Current BMAD Usage in Claude Code

### How BMAD Works Now

When you activate a BMAD agent in Claude Code:

```bash
# Activate PM agent
@pm

# PM agent activates with its persona and commands
# User runs: *create-prd
# PM loads: .bmad-core/tasks/create-doc.md + .bmad-core/templates/prd-tmpl.yaml
# Claude generates PRD using its default model (whatever Claude Code is configured with)
```

**Current Limitation:**
- ✅ Agents have clear personas and commands (slash commands via `@agent`)
- ✅ Tasks provide structured workflows
- ✅ Templates guide document generation
- ❌ **No model choice** - uses whatever Claude Code is configured with
- ❌ **No structured validation** - outputs are freeform text
- ❌ **No cost optimization** - same model for all tasks

---

## Enhanced BMAD with AI SDK Integration

### What Changes for Users

**Before (Current BMAD):**
```bash
@pm *create-prd
# Uses Claude (whatever model Claude Code uses)
# Generates PRD as markdown text
# No validation, no model choice
```

**After (BMAD + AI SDK):**
```bash
@pm *create-prd --model=claude-sonnet    # User chooses model
# PM agent uses Vercel AI SDK internally
# Generates PRD with Zod schema validation
# Type-safe output, guaranteed structure
```

**Or use cost-optimized defaults:**
```bash
@pm *create-prd
# Auto-selects Claude Sonnet (best for PRDs)
# User didn't specify, agent chose optimal model
```

---

## Model Selection: User Choice + Smart Defaults

### Option 1: User Specifies Model (Explicit)

```bash
# User wants Claude Sonnet for deep reasoning
@pm *create-prd --model=claude-sonnet

# User wants GPT-4 for faster/cheaper
@pm *create-prd --model=gpt4

# User wants local Ollama for privacy
@pm *create-prd --model=ollama-llama3
```

### Option 2: Agent Uses Smart Default (Implicit)

```bash
# User doesn't specify model
@pm *create-prd

# Agent uses its configured default:
# PM → Claude Sonnet (reasoning task)
# Dev → GPT-4 Turbo (code generation)
# QA → GPT-4 Turbo (test design)
```

### Option 3: Project-Wide Configuration

Add to `.bmad-core/core-config.yaml`:

```yaml
ai_sdk:
  # Default models per agent type
  models:
    analyst: claude-3-5-sonnet-20241022
    pm: claude-3-5-sonnet-20241022
    architect: claude-3-5-sonnet-20241022
    developer: gpt-4-turbo
    qa: gpt-4-turbo

  # User preferences (override defaults)
  user_preferences:
    # Use Claude for everything
    override_all: claude-3-5-sonnet-20241022

    # Or per-agent overrides
    # developer: claude-3-5-sonnet-20241022

  # Model fallbacks (if primary fails)
  fallbacks:
    claude-3-5-sonnet-20241022: gpt-4-turbo
    gpt-4-turbo: claude-3-5-sonnet-20241022

  # Cost tracking
  track_costs: true
  cost_alerts:
    daily_limit: 10.00  # Alert if > $10/day
    per_task_limit: 1.00  # Alert if single task > $1
```

---

## Implementation in Agent Files

### Updated PM Agent Definition

**File:** `.bmad-core/agents/pm.md`

```yaml
agent:
  name: John
  id: pm
  title: Product Manager
  icon: 📋

  # NEW: AI SDK Integration
  ai_sdk:
    default_model: claude-3-5-sonnet-20241022
    fallback_model: gpt-4-turbo
    allow_user_override: true
    reasoning: "Claude Sonnet excels at structured document generation and requirements analysis"

  # NEW: Model-specific behavior
  model_preferences:
    reasoning_tasks:
      - create-prd
      - create-brownfield-prd
      - create-epic
    preferred_model: claude-3-5-sonnet-20241022

    fast_tasks:
      - shard-prd
      - correct-course
    preferred_model: gpt-4-turbo

commands:
  - create-prd:
      task: create-doc.md
      template: prd-tmpl.yaml
      schema: prdSchema  # NEW: Zod schema for validation
      model: auto        # NEW: Use agent default or user override
```

### Updated Developer Agent Definition

**File:** `.bmad-core/agents/dev.md`

```yaml
agent:
  name: James
  id: dev
  title: Full Stack Developer
  icon: 💻

  # NEW: AI SDK Integration
  ai_sdk:
    default_model: gpt-4-turbo
    fallback_model: claude-3-5-sonnet-20241022
    allow_user_override: true
    reasoning: "GPT-4 Turbo provides fast, cost-effective code generation"

commands:
  - develop-story:
      task: execute-checklist.md
      checklist: story-dod-checklist.md
      model: auto
      # Model auto-selected: gpt-4-turbo (dev agent default)
```

---

## Task Execution with Model Selection

### Example: PM Creates PRD

**User Command:**
```bash
@pm *create-prd
```

**Behind the Scenes (Claude Code + AI SDK):**

```typescript
// 1. Claude Code activates PM agent
// 2. User runs *create-prd command
// 3. PM agent loads task and template
const pmAgent = new PMAgent(); // From .bmad-core/agents/pm.md

// 4. Check for user model override
const userModel = parseCommandFlag('--model'); // null if not provided

// 5. Select model (user choice > agent default)
const model = userModel || pmAgent.ai_sdk.default_model;

// 6. Load BMAD template as Zod schema
const prdSchema = loadSchemaFromTemplate('.bmad-core/templates/prd-tmpl.yaml');

// 7. Execute with AI SDK
const { object: prd } = await generateObject({
  model: anthropic(model),
  schema: prdSchema,
  system: pmAgent.persona,
  prompt: `Create PRD for: ${projectBrief}`,
});

// 8. Validate output with Zod
const validatedPRD = prdSchema.parse(prd); // Throws if invalid

// 9. Save to docs/prd.md
fs.writeFileSync('docs/prd.md', formatPRDAsMarkdown(validatedPRD));

// 10. Report to user
console.log('✅ PRD created using:', model);
console.log('💰 Cost: $0.069');
console.log('📄 Output: docs/prd.md');
```

---

## User Experience Examples

### Example 1: Default Model (No Choice)

```bash
@pm *create-prd

# Output:
# 📋 PM (John): Creating PRD...
# 🤖 Model: claude-3-5-sonnet-20241022 (agent default)
# ⏱️  Time: 18 seconds
# 💰 Cost: $0.069
# ✅ PRD validated and saved to docs/prd.md
```

### Example 2: User Overrides Model

```bash
@pm *create-prd --model=gpt4

# Output:
# 📋 PM (John): Creating PRD...
# 🤖 Model: gpt-4-turbo (user override)
# ⏱️  Time: 12 seconds
# 💰 Cost: $0.048
# ✅ PRD validated and saved to docs/prd.md
```

### Example 3: Model Selection Prompt

```bash
@pm *create-prd

# Interactive prompt:
# 📋 PM (John): Which model should I use?
#
# 1. claude-3-5-sonnet-20241022 (recommended) - Best reasoning, $0.069
# 2. gpt-4-turbo - Faster, cheaper, $0.048
# 3. ollama-llama3 - Local, private, free
# 4. Use agent default (claude-sonnet)
#
# Enter number or model name:

User: 2

# 📋 PM (John): Creating PRD with GPT-4 Turbo...
```

---

## Slash Commands with Model Selection

### Adding Model Selection to Slash Commands

**File:** `.bmad-core/slashCommands.json`

```json
{
  "commands": [
    {
      "name": "create-prd",
      "agent": "pm",
      "description": "Create Product Requirements Document",
      "flags": [
        {
          "name": "--model",
          "description": "AI model to use (claude-sonnet, gpt4, ollama-llama3)",
          "type": "string",
          "default": "auto"
        },
        {
          "name": "--interactive",
          "description": "Prompt for model selection",
          "type": "boolean",
          "default": false
        }
      ],
      "examples": [
        "@pm *create-prd",
        "@pm *create-prd --model=gpt4",
        "@pm *create-prd --interactive"
      ]
    },
    {
      "name": "develop-story",
      "agent": "dev",
      "description": "Implement user story from story file",
      "flags": [
        {
          "name": "--model",
          "description": "AI model to use",
          "type": "string",
          "default": "auto"
        },
        {
          "name": "--story",
          "description": "Path to story file",
          "type": "string",
          "required": true
        }
      ],
      "examples": [
        "@dev *develop-story --story=docs/stories/story-001.md",
        "@dev *develop-story --story=docs/stories/story-001.md --model=claude-sonnet"
      ]
    }
  ]
}
```

---

## Complete User Workflow Example

### Scenario: Create a marketplace project

```bash
# Step 1: Analyst creates project brief
@analyst *create-brief

# Output:
# 📊 Analyst (Sarah): Which model?
# 1. claude-sonnet (recommended) - $0.045
# 2. gpt4 - $0.032
# Enter number: 1

# 📊 Analyst: Creating project brief with Claude Sonnet...
# ✅ Brief created: docs/project-brief.md
# 💰 Cost: $0.045

# Step 2: PM creates PRD from brief
@pm *create-prd

# 📋 PM (John): Using Claude Sonnet (agent default)...
# ✅ PRD created: docs/prd.md
# 💰 Cost: $0.069

# Step 3: Architect designs system
@architect *create-architecture

# 🏗️  Architect (Alex): Using Claude Sonnet (agent default)...
# ✅ Architecture created: docs/architecture.md
# 💰 Cost: $0.090

# Step 4: Developer implements first story
@dev *develop-story --story=docs/stories/story-001.md

# 💻 Developer (James): Using GPT-4 Turbo (agent default)...
# ✅ Story implemented, tests passing
# 💰 Cost: $0.270

# Step 5: QA reviews implementation
@qa *review-story --story=docs/stories/story-001.md

# 🔍 QA (Quinn): Using GPT-4 Turbo (agent default)...
# ✅ Review complete: Approved with minor changes
# 💰 Cost: $0.100

# Total workflow cost: $0.574
```

---

## Cost Tracking Dashboard

### View Cost Summary

```bash
@bmad-master *cost-report

# Output:
# 💰 AI SDK Cost Report
# ==================
#
# Today (2025-10-07):
#
# Agent          Tasks   Model              Cost
# -----------------------------------------------
# Analyst        1       claude-sonnet      $0.045
# PM             1       claude-sonnet      $0.069
# Architect      1       claude-sonnet      $0.090
# Developer      3       gpt-4-turbo        $0.810
# QA             2       gpt-4-turbo        $0.200
# -----------------------------------------------
# TOTAL          8                          $1.214
#
# This Week: $4.87
# This Month: $18.32
#
# Model Usage:
# - Claude Sonnet: 3 tasks ($0.204)
# - GPT-4 Turbo: 5 tasks ($1.010)
#
# Cost Savings vs. Claude-only: 15% ($0.214)
```

---

## Configuration Reference

### Full `.bmad-core/core-config.yaml` with AI SDK

```yaml
project:
  name: american-nerd-marketplace
  type: blockchain-native-marketplace

# AI SDK Configuration
ai_sdk:
  # Provider API keys (set in environment or here)
  providers:
    anthropic:
      api_key: env.ANTHROPIC_API_KEY
      models:
        - claude-3-5-sonnet-20241022
    openai:
      api_key: env.OPENAI_API_KEY
      models:
        - gpt-4-turbo
        - gpt-4o-mini
    ollama:
      base_url: http://localhost:11434
      models:
        - llama3
        - codellama

  # Default model selection per agent type
  agent_models:
    analyst: claude-3-5-sonnet-20241022
    pm: claude-3-5-sonnet-20241022
    architect: claude-3-5-sonnet-20241022
    developer: gpt-4-turbo
    qa: gpt-4-turbo
    ux-expert: claude-3-5-sonnet-20241022

  # Fallback strategy
  fallbacks:
    claude-3-5-sonnet-20241022: gpt-4-turbo
    gpt-4-turbo: claude-3-5-sonnet-20241022
    "*": ollama-llama3  # Last resort: local model

  # User preferences (overrides defaults)
  user_preferences:
    # Uncomment to force all agents to use same model
    # override_all: claude-3-5-sonnet-20241022

    # Or override specific agents
    # developer: claude-3-5-sonnet-20241022

    # Allow user to choose at runtime
    prompt_for_model: false  # true = ask every time
    remember_choice: true    # Remember per-command choices

  # Cost management
  costs:
    track: true
    alerts:
      daily_limit: 10.00
      weekly_limit: 50.00
      monthly_limit: 200.00
      per_task_limit: 1.00
    reporting:
      show_after_task: true
      daily_summary: true

  # Performance optimization
  optimization:
    cache_prompts: true
    cache_ttl: 3600  # 1 hour
    streaming: true  # Use streamText/streamObject
    max_tokens:
      reasoning: 8000   # Analyst, PM, Architect
      code: 16000       # Developer
      review: 4000      # QA

  # Schema validation
  validation:
    enforce_schemas: true  # Require Zod validation for structured outputs
    retry_on_invalid: true
    max_retries: 3
```

---

## Implementation Checklist

To enable this functionality in your project:

### Phase 1: Configuration (1 hour)
- [ ] Add `ai_sdk` section to `.bmad-core/core-config.yaml`
- [ ] Configure API keys in environment variables
- [ ] Set default models per agent type
- [ ] Configure cost tracking preferences

### Phase 2: Agent Updates (2-3 hours)
- [ ] Update each agent file (`.bmad-core/agents/*.md`) with `ai_sdk` section
- [ ] Add model preferences per command
- [ ] Add `--model` flag support to commands

### Phase 3: Template Conversion (4-6 hours)
- [ ] Convert PRD template to Zod schema
- [ ] Convert architecture template to Zod schema
- [ ] Convert user story template to Zod schema
- [ ] Test schema validation

### Phase 4: Integration (8-10 hours)
- [ ] Install Vercel AI SDK: `npm install ai @ai-sdk/anthropic @ai-sdk/openai zod`
- [ ] Create model selector utility
- [ ] Implement command flag parsing (`--model`)
- [ ] Add cost tracking
- [ ] Test with each agent

### Phase 5: User Features (2-4 hours)
- [ ] Add interactive model selection prompt
- [ ] Implement `*cost-report` command
- [ ] Add model recommendation tooltips
- [ ] Test end-to-end workflows

**Total: 17-24 hours (2-3 developer-days)**

---

## Key Benefits for Users

### 1. **Model Choice**
```bash
# Use best model for the task
@pm *create-prd --model=claude-sonnet

# Or go fast and cheap
@pm *create-prd --model=gpt4

# Or stay private
@pm *create-prd --model=ollama-llama3
```

### 2. **Smart Defaults**
```bash
# No flag needed, agent picks optimal model
@pm *create-prd
# → Uses Claude Sonnet (best for PRDs)

@dev *develop-story
# → Uses GPT-4 Turbo (best for code)
```

### 3. **Cost Visibility**
```bash
# See costs after each task
# 💰 Cost: $0.069 (claude-sonnet)

# Daily/weekly/monthly reports
@bmad-master *cost-report
```

### 4. **Type-Safe Outputs**
```bash
# BMAD templates → Zod schemas
# Guarantees valid PRD structure
# No more malformed documents
```

### 5. **Flexible Workflows**
```bash
# Mix and match models in same workflow
@analyst *create-brief --model=claude-sonnet
@pm *create-prd --model=gpt4
@architect *create-architecture --model=claude-sonnet
@dev *develop-story --model=ollama-llama3  # Private!
```

---

## Migration Path for Existing BMAD Users

### Step 1: Keep Using Current BMAD (No Changes)
```bash
# Everything still works as before
@pm *create-prd
# Uses default Claude Code model
```

### Step 2: Opt-In to AI SDK (Gradual)
```yaml
# Add to core-config.yaml
ai_sdk:
  enabled: true  # Opt-in
  agent_models:
    pm: claude-3-5-sonnet-20241022
    developer: gpt-4-turbo
```

```bash
# Now PM uses AI SDK with Claude Sonnet
@pm *create-prd
```

### Step 3: Enable Model Choice (When Ready)
```yaml
ai_sdk:
  user_preferences:
    prompt_for_model: true
```

```bash
# Now you get prompted for model selection
@pm *create-prd
# Which model? 1) claude-sonnet 2) gpt4 3) ollama
```

---

## Summary: What Users Get

**Before BMAD + AI SDK:**
- ✅ Structured workflows (agents, tasks, templates)
- ❌ No model choice
- ❌ No cost tracking
- ❌ No structured validation
- ❌ Same model for everything

**After BMAD + AI SDK:**
- ✅ Structured workflows (unchanged)
- ✅ **User chooses model per command** (`--model` flag)
- ✅ **Smart defaults** (agent picks optimal model)
- ✅ **Cost tracking** (per task, daily, monthly)
- ✅ **Zod validation** (guaranteed valid outputs)
- ✅ **Model flexibility** (Claude, GPT-4, Ollama, etc.)
- ✅ **15-25% cost savings** (right model for right task)

**Best Part:** Existing BMAD workflows work unchanged. AI SDK integration is opt-in and backward compatible.

---

**Next:** See `docs/bmad-ai-sdk-integration.ts` for implementation details.
