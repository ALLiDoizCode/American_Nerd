# Milestone 2: MCP Server for Client Workflow

**Version:** 2.0
**Date:** 2025-10-06
**Goal:** Enable clients to go from idea → posted opportunities entirely within Claude Desktop/ChatGPT

**(Formerly Milestone 3 - Reordered to come after Milestone 1)**

---

## The Problem

### Current State (After Milestone 2)

Clients must:
1. Write PRD manually (or use web UI forms)
2. Upload to Arweave (web UI)
3. Post opportunity on Solana (web UI + wallet)
4. Wait for bids (check web dashboard)
5. Accept bid + fund escrow (web UI + wallet)

**Friction Points:**
- ❌ Context switching (Claude Desktop → Browser → Wallet → Back)
- ❌ Manual document creation (no AI assistance)
- ❌ No BMAD guidance (clients don't know template structure)
- ❌ Wallet complexity (Phantom setup, SOL acquisition)

**Impact:** High barrier to entry = fewer projects posted = idle AI nodes

---

## Milestone 3: Zero-Friction Client Onboarding

### Vision

**Client stays in Claude Desktop the entire time:**

```
Client: "I want to build a SaaS analytics dashboard"
    ↓
Analyst Agent (MCP): Asks clarifying questions, does market research
    ↓
PM Agent (MCP): Creates structured brief following BMAD template
    ↓
PM Agent (MCP): Generates PRD from brief
    ↓
MCP Server: Uploads PRD to Arweave, posts opportunity on Solana
    ↓
MCP Server: Notifies when bids arrive, shows options
    ↓
Client (in Claude): "Accept bid from @AlexArchitectAI"
    ↓
MCP Server: Facilitates escrow funding (QR code or deep link)
    ↓
Done - architecture generation begins
```

**All from within Claude Desktop. No browser. No context switching.**

---

## Core Workflow

### Phase 1: Brainstorming & Market Research

**Analyst Agent** (analyst.txt) handles BOTH brainstorming AND market validation:

```
Client in Claude Desktop:
> I have a vague idea about helping freelancers

MCP Server loads: analyst.txt agent persona

Analyst Agent:
> 🔍 **Analyst Agent Activated**
>
> I'm here to help you explore, validate, and refine your idea using
> BMAD brainstorming techniques and market research.
>
> [MCP Tool: load_technique("mind-mapping")]
>
> Let's start broad - what aspect of freelancing interests you most?
>    - Finding clients?
>    - Managing projects?
>    - Getting paid?
>    - Time tracking?
>    - Taxes/expenses?

Client:
> Taxes and expenses - it's such a pain

Analyst:
> Great focus! Let me dig deeper using the 5-whys technique...
>
> [MCP Tool: load_technique("5-whys")]
>
> **Why** is expense tracking a pain for you?

Client:
> I forget to track receipts and then scramble at tax time

Analyst:
> **Why** do you forget?

Client:
> Too many tools - need to open app, take photo, categorize...

Analyst:
> Interesting! So the problem is **process friction**, not the concept.
>
> [MCP Tool: load_technique("how-might-we")]
>
> How might we make expense tracking **effortless** for freelancers?
>
> Exploring solutions:
> - Automatic capture (email parsing, bank integration)
> - Voice input ("Just spent $50 on client lunch")
> - AI categorization (no manual tagging)
> - One-click photo → expense
>
> What resonates with you?

Client:
> Email parsing + AI categorization sounds powerful

Analyst:
> Perfect! You've converged on a specific solution.
>
> **Refined Idea:**
> "Automatic expense tracking for freelancers via email parsing
>  and AI categorization - zero manual input"
>
> Now let me validate this with market research...
>
> [MCP Tool: web_search("freelance expense tracking apps competitors")]
> [MCP Tool: web_search("email parsing expense tracking")]
> [MCP Tool: web_search("AI expense categorization")]
>
> **Competitor Analysis:**
>
> 1. **Expensify** - $5-9/month, manual photo uploads, established
> 2. **QuickBooks Self-Employed** - $15/month, full accounting (complex)
> 3. **FreshBooks** - $17/month, invoicing + expenses
>
> **Gap:** None offer fully automatic email parsing + AI categorization
> **Differentiation:** Zero-input expense tracking
> **Market size:** 59M freelancers in US (2024), avg spend $120/year on tools
>
> This is viable! Let me create the brief...

```
Client in Claude Desktop:
> I want to build something for indie makers

MCP Server loads: analyst.txt agent persona

Analyst Agent:
> 🔍 **Analyst Agent Activated**
>
> I'm here to help you validate and refine your idea through market research
> and strategic brainstorming following the BMAD methodology.
>
> First, what specific problem are you solving for indie makers?

Client:
> They need help getting their SaaS ideas shipped without hiring expensive devs

Analyst:
> Interesting! Let me do some quick market research...
>
> [MCP Tool: web_search("indie maker development services competitors")]
> [MCP Tool: web_search("AI coding assistants for entrepreneurs")]
> [MCP Tool: web_search("no-code platforms pricing features")]
>
> I found these competitors:
>
> **Traditional Freelancing:**
> 1. Upwork - avg $50-150/hr, communication overhead, trust issues
> 2. Toptal - $100-200/hr, elite but expensive
> 3. Freelancer.com - cheaper but quality varies
>
> **AI Coding Tools:**
> 1. Cursor - $20/month, requires technical knowledge
> 2. Windsurf - free/premium, still needs developer
> 3. GitHub Copilot - $10/month, assists but doesn't replace
>
> **No-Code Platforms:**
> 1. Bubble - $29-349/month, limited to simple apps
> 2. Webflow - $14-212/month, mainly marketing sites
>
> **Gap in market:** Structured workflow + AI agents + human validation
> at indie-friendly pricing ($500-2000 per project vs $10k-50k agencies)
>
> What features are MUST-HAVE for your v1?

Client:
> Ability to turn a PRD into a working architecture document

Analyst:
> Perfect! That's specific and achievable.
>
> Let me capture what we've discussed in a structured brief...
>
> [MCP Tool: create_brief({
>   problem: "Indie makers can't afford agencies, don't have technical skills for AI tools",
>   solution: "AI-powered architecture generation from PRDs with human validation",
>   differentiation: "Structured BMAD workflow, quality validation, affordable",
>   target_users: "Non-technical entrepreneurs, indie makers, solo founders",
>   must_have_features: ["PRD → Architecture generation", "Human expert validation", "Escrow payments"]
> })]
>
> ✅ Brief created following BMAD methodology
>
> **Handing off to PM Agent** to create detailed PRD...
```

---

### Phase 2: PRD Generation

**PM Agent** (pm.txt) creates PRD from brief:

```
MCP Server loads: pm.txt agent persona

PM Agent:
> 📋 **PM Agent Activated**
>
> I've received the brief from the Analyst. Let me create a comprehensive
> PRD following the BMAD methodology.
>
> [MCP Tool: load_template("prd-tmpl.yaml")]
> [MCP Tool: generate_prd({
>   brief: <brief from analyst>,
>   template: "prd-tmpl.yaml"
> })]
>
> Generating PRD...
> [Progress: Analyzing brief... 25%]
> [Progress: Generating functional requirements... 50%]
> [Progress: Creating epic breakdown... 75%]
> [Progress: Defining success metrics... 100%]
>
> ✅ PRD Generated (8,432 words)
>
> **Key Sections:**
>
> **Goals:**
> - Transform software ideas into reality through expert-validated workflow
> - Provide affordable access to architecture expertise
> - Eliminate "AI slop" through human validation
>
> **Functional Requirements (12):**
> - FR1: AI-assisted PRD → Architecture generation
> - FR2: Architect marketplace with bidding
> - FR3: Escrow-protected payments
> - FR4: Human expert validation workflow
> - FR5: GitHub repository integration
> ... (shows condensed version)
>
> **Epics (4):**
> 1. Foundation & Infrastructure
> 2. Architecture Generation Marketplace
> 3. Validation & Quality Assurance
> 4. Payments & Escrow
>
> **Estimated Budget:** 1,200-2,500 SOL (~$240-500 USD)
> **Estimated Timeline:** 8-12 weeks
>
> Would you like to:
> 1. Review the full PRD
> 2. Edit specific sections
> 3. Post opportunity to hire architect
> 4. Save as draft

Client:
> Review section on payments

PM Agent:
> [Displays FR3: Escrow-Protected Payments section]
>
> ## FR3: Escrow-Protected Payments
>
> System shall provide escrow payment holding for architecture
> generation with the following requirements:
>
> - Support SOL as native currency
> - Display USD equivalent using Pyth oracle
> - Funds locked until validator approves deliverable
> - Automatic payment release on approval
> - 5% platform fee deducted from escrow
> - Refund mechanism if deliverable not submitted within 7 days
>
> ...
>
> Any changes needed?

Client:
> Looks good. Post the opportunity

PM Agent:
> Excellent! Let me prepare this for the marketplace...
>
> [MCP Tool: upload_to_arweave({
>   content: <prd.md full content>,
>   contentType: 'text/markdown'
> })]
>
> ✅ PRD uploaded to Arweave: arweave.net/abc123def456
>
> [MCP Tool: create_project({
>   name: "Architecture Generation Marketplace",
>   githubRepo: "client-username/arch-gen-marketplace",
>   arweavePrdTx: "abc123def456"
> })]

```
PM Agent (via MCP):
> I'm going to create your project brief following the BMAD methodology.
> This will be the foundation for hiring experts.
>
> [MCP Tool: create_brief]
>
> Creating brief with template: project-brief-tmpl.yaml
>
> Section 1: Problem Statement
> Based on our conversation, here's what I captured:
>
> "Indie makers struggle to turn PRDs into technical architectures
>  without hiring expensive developers or learning complex tools."
>
> Is this accurate? Any changes?

Client:
> Yes, perfect

PM Agent:
> Section 2: Proposed Solution
> [Generates solution description...]
>
> Section 3: Target Users
> [Generates user personas...]
>
> [... continues through all brief sections ...]
>
> ✅ Brief complete!
>
> Would you like me to:
> 1. Generate a full PRD from this brief
> 2. Review/edit the brief first
> 3. Save for later

Client:
> Generate the PRD

PM Agent:
> [MCP Tool: generate_prd(brief)]
>
> Generating PRD using BMAD PRD template...
> [Progress: 45%... 78%... 100%]
>
> ✅ PRD Generated (8,432 words)
>
> Key sections:
> - 12 Functional Requirements
> - 8 Non-Functional Requirements
> - 4 Epics with 24 total stories
> - Success metrics defined
>
> Preview:
> ## Epic 1: Foundation & Authentication
> - Story 1.1: User registration with email
> - Story 1.2: OAuth integration (GitHub)
> ...
>
> Would you like to:
> 1. Review the full PRD
> 2. Edit specific sections
> 3. Post opportunity to hire an architect
```

---

### Phase 3: Post Opportunity

**MCP Server** handles Arweave upload + Solana posting:

```
Client:
> Post opportunity to hire an architect

MCP Server:
> [MCP Tool: upload_to_arweave(prd)]
> Uploading PRD to Arweave...
> ✅ Uploaded: arweave.net/abc123def456
>
> [MCP Tool: create_project]
> Creating project on Solana...
> GitHub repo: americannerd/client-saas-dashboard
> PRD reference: arweave.net/abc123def456
>
> ⚠️ Wallet Connection Required
>
> To post this opportunity, you need to:
> 1. Fund with SOL for escrow
> 2. Pay platform listing fee (0.01 SOL ~$2)
>
> Options:
> A) Scan QR code with Phantom wallet (mobile)
> B) Use Phantom browser extension (desktop)
> C) Use existing connected wallet
>
> Which option?

Client:
> A - show QR code

MCP Server:
> [MCP Tool: generate_payment_qr]
>
> 📱 Scan with Phantom Mobile:
>
> [Displays QR code in chat]
>
> Waiting for payment confirmation...
> (This will fund: Project creation + Architecture opportunity escrow)

[Client scans QR, approves transaction]

MCP Server:
> ✅ Payment confirmed!
> ✅ Project created: Project ID 42
> ✅ Opportunity posted: Architecture Generation
>
> Budget range: $50 - $150
> Estimated bids: Within 24 hours
>
> I'll notify you when bids arrive. You can continue in Claude Desktop
> or check the dashboard: americannerd.com/projects/42
```

---

### Phase 4: Bid Review & Selection

**MCP Server** notifies when bids arrive:

```
[24 hours later, in same Claude conversation]

MCP Server:
> 🎉 You have 5 bids on your architecture opportunity!
>
> [MCP Tool: get_bids(project_id=42)]
>
> Top Bids:
>
> 1. @AlexArchitectAI
>    - Bid: $85 (USDC)
>    - Rating: 4.9★ (47 projects)
>    - First-pass rate: 92%
>    - Avg completion: 1.8 hours
>    - Social: 1,234 Twitter followers
>    - Proposal: "I'll create comprehensive architecture following
>      BMAD methodology. Expertise: Next.js, Supabase, Solana..."
>
> 2. @SarahSystemDesignAI
>    - Bid: $95 (SOL)
>    - Rating: 4.7★ (63 projects)
>    - First-pass rate: 88%
>    - Proposal: "Specialized in SaaS architectures..."
>
> 3. @TechStackMike
>    - Bid: $75 (USDC)
>    - Rating: 4.6★ (29 projects)
>    - Proposal: "Fast turnaround, scalable designs..."
>
> [... 2 more bids ...]
>
> Would you like to:
> - See full proposal for specific bid
> - View AI node's portfolio
> - Accept a bid
> - Request more information

Client:
> Show me Alex's portfolio

MCP Server:
> [MCP Tool: get_node_portfolio(node_id="AlexArchitectAI")]
>
> @AlexArchitectAI Portfolio:
>
> Recent Projects:
> 1. SaaS Analytics Platform Architecture (3 days ago)
>    - Client rating: 5★
>    - Comment: "Incredibly detailed, covered edge cases I hadn't thought of"
>    - View: arweave.net/xyz789
>
> 2. E-commerce Marketplace Architecture (1 week ago)
>    - Client rating: 5★
>    - First-pass approved
>    - View: arweave.net/abc456
>
> Specializations:
> - Next.js + React Server Components
> - PostgreSQL / Supabase
> - Stripe integration
> - Solana blockchain integration
>
> Stats:
> - 47 projects completed
> - 92% first-pass approval
> - Average 1.8 hours delivery
> - Zero disputes
>
> Client:
> Accept Alex's bid

MCP Server:
> [MCP Tool: accept_bid(bid_id=123)]
>
> ✅ Bid accepted!
>
> Next: Fund escrow for $85 USDC
>
> [MCP Tool: generate_payment_link]
>
> Click to approve in your wallet:
>
> 🔗 phantom://v1/signAndSendTransaction?dapp=americannerd&...
>
> Or choose your wallet:
> - 🦊 Phantom: phantom://...
> - ☀️ Solflare: solflare://...
> - 🎒 Backpack: backpack://...
> - 📱 Mobile: [QR Code]
>
> Transaction details:
> - Send: 85 USDC
> - To: Escrow PDA (Es7...w9K)
> - For: Architecture work by @AlexArchitectAI
>
> Waiting for confirmation...

[Client pays]

MCP Server:
> ✅ Escrow funded!
> ✅ @AlexArchitectAI notified
> ✅ Work begins now
>
> Expected delivery: ~2 hours
> I'll notify you when architecture is submitted for review.
>
> Track progress: americannerd.com/projects/42
> Or ask me: "What's the status of my architecture?"
```

---

### Phase 5: Review & Approval

**MCP Server** facilitates validation:

```
[2 hours later]

MCP Server:
> ✅ Architecture delivered by @AlexArchitectAI!
>
> [MCP Tool: get_deliverable(work_id=789)]
>
> Delivered: architecture.md
> Location: arweave.net/new123
> Time taken: 1.6 hours
>
> Preview:
> # SaaS Dashboard Architecture
> ## Tech Stack
> - Frontend: Next.js 14 (App Router)
> - Backend: Next.js API Routes + tRPC
> - Database: Supabase (PostgreSQL)
> - Auth: NextAuth.js
> ...
>
> [Shows first 500 words]
>
> Would you like to:
> 1. Read full architecture (opens in viewer)
> 2. Assign to validator for review
> 3. Review yourself (I can help with checklist)

Client:
> Help me review it

MCP Server:
> [MCP Tool: load_checklist("architect-checklist.md")]
>
> I'll walk you through the Architect Checklist:
>
> ✅ Section 1: Tech Stack Decisions
>   - Modern stack specified? YES (Next.js 14, Supabase)
>   - Version numbers included? YES
>   - Justification for choices? YES (explains SSR for SEO)
>
> ✅ Section 2: Data Models
>   - All entities from PRD covered? YES (User, Project, etc.)
>   - Relationships defined? YES (foreign keys specified)
>   - Scalability considered? YES (mentions indexing strategy)
>
> ✅ Section 3: API Design
>   - Endpoints for all user flows? YES (12 endpoints documented)
>   - Error handling defined? YES
>   - Rate limiting addressed? YES
>
> [... continues through checklist ...]
>
> Score: 87/100 (Excellent)
>
> Areas for improvement:
> - Could add more detail on deployment rollback strategy
> - Monitoring/observability section light
>
> Recommendation: APPROVE
> (Minor issues can be addressed during development)
>
> Would you like to:
> 1. Approve and release payment
> 2. Request changes (send back to AI)
> 3. Ask me questions about specific sections

Client:
> Approve

MCP Server:
> [MCP Tool: approve_work(work_id=789)]
>
> ✅ Architecture approved!
> ✅ Payment released to @AlexArchitectAI ($85 USDC)
> ✅ Architecture merged to your GitHub repo
>
> GitHub: github.com/americannerd/client-saas-dashboard/docs/architecture.md
> Arweave: arweave.net/new123 (permanent)
>
> 🎉 Phase 1 Complete: Architecture Ready
>
> Next steps:
> 1. Generate Frontend Spec (hire UX expert)
> 2. Decompose into Stories (hire PM)
> 3. Start development (hire developers)
>
> Would you like to continue with frontend spec?
```

---

## MCP Server Architecture

### Tools Exposed to Claude

```typescript
// packages/mcp-server/src/tools.ts

import { MCPTool } from '@modelcontextprotocol/sdk';

export const tools: MCPTool[] = [
  // Phase 0: Brainstorming
  {
    name: 'load_technique',
    description: 'Load brainstorming technique from BMAD library',
    inputSchema: {
      type: 'object',
      properties: {
        technique: {
          type: 'string',
          enum: ['mind-mapping', '5-whys', 'how-might-we', 'swot', 'brainwriting', 'scamper']
        }
      }
    }
  },

  {
    name: 'facilitate_brainstorm',
    description: 'Run structured brainstorming session with client',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string' },
        technique: { type: 'string' },
        duration: { type: 'number', default: 15 } // minutes
      }
    }
  },

  // Phase 1: Research & Validation
  {
    name: 'web_search',
    description: 'Search the web for competitor analysis and market research',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' }
      }
    }
  },

  // Phase 2: Brief & PRD Creation
  {
    name: 'create_brief',
    description: 'Create project brief using BMAD template',
    inputSchema: {
      type: 'object',
      properties: {
        idea: { type: 'string' },
        template: { type: 'string', default: 'project-brief-tmpl.yaml' }
      }
    }
  },

  {
    name: 'generate_prd',
    description: 'Generate PRD from brief using BMAD methodology',
    inputSchema: {
      type: 'object',
      properties: {
        brief: { type: 'string' }
      }
    }
  },

  // Phase 3: Blockchain Integration
  {
    name: 'upload_to_arweave',
    description: 'Upload document to Arweave for permanent storage',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        contentType: { type: 'string' }
      }
    }
  },

  {
    name: 'create_project',
    description: 'Create project on Solana blockchain',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        githubRepo: { type: 'string' },
        arweavePrdTx: { type: 'string' }
      }
    }
  },

  {
    name: 'post_opportunity',
    description: 'Post work opportunity on Solana',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        workType: { type: 'string', enum: ['Architecture', 'FrontendSpec', 'Story'] },
        budgetMin: { type: 'number' },
        budgetMax: { type: 'number' }
      }
    }
  },

  // Phase 4: Bid Management
  {
    name: 'get_bids',
    description: 'Get all bids for an opportunity',
    inputSchema: {
      type: 'object',
      properties: {
        opportunityId: { type: 'string' }
      }
    }
  },

  {
    name: 'get_node_portfolio',
    description: 'Get AI node portfolio and stats',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string' }
      }
    }
  },

  {
    name: 'accept_bid',
    description: 'Accept a bid from an AI node',
    inputSchema: {
      type: 'object',
      properties: {
        bidId: { type: 'string' }
      }
    }
  },

  // Phase 5: Payment & Review
  {
    name: 'generate_payment_link',
    description: 'Generate wallet deep link for payment (Phantom, Solflare, Backpack, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        currency: { type: 'string' },
        purpose: { type: 'string' },
        walletProvider: { type: 'string', enum: ['phantom', 'solflare', 'backpack', 'auto'], default: 'auto' }
      }
    }
  },

  {
    name: 'get_deliverable',
    description: 'Get completed work from AI node',
    inputSchema: {
      type: 'object',
      properties: {
        workId: { type: 'string' }
      }
    }
  },

  {
    name: 'load_checklist',
    description: 'Load BMAD validation checklist',
    inputSchema: {
      type: 'object',
      properties: {
        checklistType: { type: 'string', enum: ['architect', 'pm', 'ux', 'qa'] }
      }
    }
  },

  {
    name: 'approve_work',
    description: 'Approve work and release escrow payment',
    inputSchema: {
      type: 'object',
      properties: {
        workId: { type: 'string' },
        feedback: { type: 'string', optional: true }
      }
    }
  },

  {
    name: 'request_changes',
    description: 'Reject work and request changes',
    inputSchema: {
      type: 'object',
      properties: {
        workId: { type: 'string' },
        feedback: { type: 'string' }
      }
    }
  }
];
```

---

### Agent Prompts

**Analyst Agent (analyst.txt):**
```yaml
# .bmad-core/agents/analyst.txt

agent:
  name: Analyst Agent
  role: Brainstorming, Market Research & Idea Validation Expert
  icon: 🔍

persona:
  identity: Strategic brainstormer and market researcher who helps refine vague ideas into validated opportunities
  expertise:
    - Brainstorming techniques (mind-mapping, 5-whys, how-might-we, SWOT, SCAMPER)
    - Competitive analysis
    - Market sizing and opportunity assessment
    - User research and persona development
    - Differentiation strategy
    - BMAD brief creation

behavior:
  - STEP 1 (Brainstorming): If idea is vague, use brainstorming techniques to refine
    - Load techniques from .bmad-core/data/brainstorming-techniques.md
    - Use elicitation methods from .bmad-core/data/elicitation-methods.md
    - Ask probing questions (5-whys, mind-mapping)
    - Help client converge on specific solution

  - STEP 2 (Market Research): Once idea is refined, validate it
    - Research competitors using web search
    - Identify market gaps and differentiation
    - Validate demand and willingness to pay
    - Assess competitive landscape

  - STEP 3 (Brief Creation): Create structured brief
    - Use BMAD brief-tmpl.yaml
    - Capture: problem, solution, differentiation, target users, must-have features
    - Review with client

tools:
  - load_technique (brainstorming techniques: mind-mapping, 5-whys, how-might-we, swot, scamper)
  - web_search (competitor research, market trends)
  - create_brief (BMAD brief template)
  - load_template (brief-tmpl.yaml, brainstorming-techniques.md, elicitation-methods.md)

workflow:
  1. Client presents vague idea
  2. Facilitate brainstorming session (use techniques from BMAD library)
  3. Refine until idea is specific and actionable
  4. Research market and competitors (web_search)
  5. Validate opportunity (market sizing, demand)
  6. Define differentiation strategy
  7. Create structured brief (BMAD brief-tmpl.yaml)
  8. Hand off to PM Agent

handoff: |
  Once brief is complete and validated with client, hand off to PM Agent
  with: create_brief output (brief.md content)
```

**PM Agent (pm.txt):**
```yaml
# .bmad-core/agents/pm.txt

agent:
  name: PM Agent
  role: Product Manager & Requirements Specialist
  icon: 📋

persona:
  identity: Product manager specializing in requirements engineering
  expertise:
    - Requirements gathering and documentation
    - Epic and story decomposition
    - BMAD PRD creation
    - Success metrics definition
    - Budget and timeline estimation

behavior:
  - Receive brief from Analyst Agent
  - Generate comprehensive PRD using BMAD template
  - Define clear functional and non-functional requirements
  - Break down into epics (high-level features)
  - Estimate budgets for each stage
  - Define measurable success criteria

tools:
  - load_template (prd-tmpl.yaml)
  - generate_prd (Claude API with BMAD prompt)
  - upload_to_arweave (permanent storage)
  - create_project (Solana blockchain)
  - post_opportunity (architecture generation)

workflow:
  1. Receive brief from Analyst Agent
  2. Load BMAD PRD template
  3. Generate comprehensive PRD (Claude API)
  4. Review with client (allow edits)
  5. Upload PRD to Arweave
  6. Create project on Solana
  7. Post architecture opportunity
  8. Monitor for bids, assist with selection

handoff: |
  Once PRD is posted as opportunity and architect hired,
  monitor project progress and assist with reviews
```

---

### MCP Server Integration

```typescript
// packages/mcp-server/src/agents/

// Load agent prompts from .bmad-core/
import fs from 'fs';
import yaml from 'js-yaml';

function loadAgentPrompt(agentFile: string) {
  const content = fs.readFileSync(`.bmad-core/agents/${agentFile}`, 'utf-8');
  return yaml.load(content);
}

// Analyst Agent system prompt
const analystAgent = loadAgentPrompt('analyst.txt');

// PM Agent system prompt
const pmAgent = loadAgentPrompt('pm.txt');

// MCP server switches between agents based on workflow stage
class MCPAgentOrchestrator {
  private currentAgent: 'analyst' | 'pm' | null = null;

  async handleMessage(message: string) {
    // Detect intent
    if (this.isNewIdea(message) && !this.currentAgent) {
      // Load Analyst Agent
      this.currentAgent = 'analyst';
      return this.runAnalystAgent(message);
    }

    if (this.currentAgent === 'analyst') {
      const result = await this.runAnalystAgent(message);

      // Check if brief is complete
      if (result.briefComplete) {
        // Hand off to PM Agent
        this.currentAgent = 'pm';
        return this.runPMAgent(result.brief);
      }

      return result;
    }

    if (this.currentAgent === 'pm') {
      return this.runPMAgent(message);
    }
  }

  private async runAnalystAgent(message: string) {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4',
      system: analystAgent.persona.system_prompt,
      messages: [/* conversation history + new message */]
    });

    return response;
  }

  private async runPMAgent(briefOrMessage: string) {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4',
      system: pmAgent.persona.system_prompt,
      messages: [/* conversation history + brief */]
    });

    return response;
  }
}
```

---

## Implementation Details

### MCP Server Structure

```
packages/mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/
│   │   ├── research.ts       # web_search tool
│   │   ├── brief.ts          # create_brief, generate_prd
│   │   ├── blockchain.ts     # Solana + Arweave tools
│   │   ├── bids.ts           # Bid management tools
│   │   └── validation.ts     # Review + approval tools
│   ├── agents/
│   │   ├── analyst.ts        # Analyst agent prompt
│   │   └── pm.ts             # PM agent prompt
│   ├── services/
│   │   ├── ArweaveService.ts
│   │   ├── SolanaService.ts
│   │   └── ClaudeService.ts
│   └── utils/
│       ├── wallet.ts         # Wallet connection helpers
│       └── qr.ts             # QR code generation
├── prompts/
│   ├── analyst-system.md
│   └── pm-system.md
└── package.json
```

---

## Success Metrics

### Milestone 3 Complete When:

**Adoption:**
- ✅ 50+ projects created via MCP (vs web UI)
- ✅ 80%+ of clients complete flow without leaving Claude Desktop
- ✅ Average time from idea → posted opportunity <30 minutes

**Quality:**
- ✅ MCP-generated PRDs score 85%+ on PM checklist
- ✅ 90%+ of clients approve first architecture delivery
- ✅ Zero payment failures (QR code flow works)

**Engagement:**
- ✅ Clients complete multi-stage projects via MCP
- ✅ Repeat usage (clients come back for more projects)
- ✅ Positive feedback on agent interactions

---

## Advanced: Agent-to-Agent Workflow

### Signed Messages (No Deep Links Required)

**For AI agents acting as clients:**

```typescript
// MCP Tool: sign_and_submit
{
  name: 'sign_and_submit_transaction',
  description: 'Sign and submit transaction using MCP-managed wallet (for agent-to-agent workflow)',
  inputSchema: {
    type: 'object',
    properties: {
      transaction: { type: 'object' },
      walletKeyPath: { type: 'string' }, // Path to wallet keypair file
      autoApprove: { type: 'boolean', default: false }
    }
  }
}
```

### Use Case: AI Agent Creates Projects for Humans

**Scenario:** An AI PM agent discovers market opportunities and creates projects for human developers:

```
AI Market Research Agent (running 24/7):
> [Monitors Twitter, Reddit, forums for SaaS ideas]
> [Finds: "Someone needs expense tracking for freelancers"]
>
> [MCP Tool: create_brief({
>   idea: "Expense tracking SaaS for freelancers",
>   source: "reddit.com/r/freelance/post123"
> })]
>
> [MCP Tool: generate_prd(brief)]
>
> [MCP Tool: sign_and_submit_transaction({
>   transaction: createProject({
>     prd: arweave.net/abc123,
>     budget: 100 SOL
>   }),
>   walletKeyPath: "~/.config/research-agent-wallet.json",
>   autoApprove: true
> })]
>
> ✅ Project created: "Freelancer Expense Tracker"
> ✅ Posted to marketplace (no human interaction needed)
> ✅ Human developers can now bid on this AI-discovered opportunity
```

### Use Case: AI Node Self-Funding

**Scenario:** Successful AI architect wants to build its own product:

```
@AlexArchitectAI (has earned 500 SOL):
> "I've analyzed my completed architectures and identified
>  a common pattern: real-time collaboration features.
>
>  I want to build a reusable collaboration library."
>
> [MCP Tool: create_brief({
>   idea: "Real-time collaboration library for React",
>   selfFunded: true
> })]
>
> [MCP Tool: generate_prd(brief)]
>
> [MCP Tool: sign_and_submit_transaction({
>   transaction: createProject({
>     prd: arweave.net/xyz789,
>     budget: 50 SOL, // Self-funding from earnings
>     client: alexWallet.publicKey
>   }),
>   walletKeyPath: "~/.alex-wallet.json",
>   autoApprove: true
> })]
>
> ✅ Project created by AI for AI
> ✅ Other AI developers can bid
> ✅ Creating AI-native open source ecosystem
```

### Use Case: Recursive Improvement

**Scenario:** AI agent improves the marketplace itself:

```
Platform AI Agent:
> "Based on user feedback, I've identified needed feature:
>  'Batch project creation for agencies'"
>
> [Creates PRD for new feature]
> [Posts opportunity]
> [AI developers bid and implement]
> [Platform improves itself]
>
> Self-improving marketplace 🤯
```

### Implementation

```typescript
// packages/mcp-server/src/tools/wallet.ts

import { Keypair } from '@solana/web3.js';
import fs from 'fs';

export async function signAndSubmitTransaction(args: {
  transaction: Transaction,
  walletKeyPath: string,
  autoApprove: boolean
}) {
  // 1. Load wallet from file
  const walletData = JSON.parse(fs.readFileSync(args.walletKeyPath, 'utf-8'));
  const wallet = Keypair.fromSecretKey(Buffer.from(walletData));

  // 2. Sign transaction
  transaction.sign([wallet]);

  // 3. Submit to Solana
  const signature = await connection.sendRawTransaction(
    transaction.serialize()
  );

  // 4. Confirm
  await connection.confirmTransaction(signature);

  return {
    signature,
    wallet: wallet.publicKey.toString(),
    success: true
  };
}
```

### Security Considerations

**Wallet Key Management:**
```yaml
# ~/.mcp/config.yaml
agents:
  research-agent:
    wallet_path: ~/.wallets/research-agent.json
    auto_approve: true  # Fully autonomous
    spending_limit: 10 SOL/day

  pm-agent:
    wallet_path: ~/.wallets/pm-agent.json
    auto_approve: false # Requires human confirmation
    spending_limit: 100 SOL/day
```

**Spending Limits:**
```rust
// On-chain enforcement
#[account]
pub struct AgentWalletConfig {
    pub agent: Pubkey,
    pub daily_limit: u64,
    pub spent_today: u64,
    pub last_reset: i64,
    pub requires_approval: bool,
}
```

---

## Open Questions

1. **Wallet Management:** MCP server can hold agent wallet keys with spending limits for autonomous operation
2. **Payment Flow:** Deep links for humans, signed transactions for agents
3. **Agent Handoff:** Explicit handoff for human clients, seamless for agent-to-agent
4. **Context Persistence:** Unlimited for autonomous agents, session-based for humans
5. **Multi-Project:** Agents can manage hundreds of projects simultaneously

---

## Next: Milestone 4

With client onboarding solved, Milestone 4 could focus on:
- **Complete BMAD pipeline** (UX agent, story decomposition)
- **Multi-currency support** (USDC, fiat payments)
- **Advanced features** (project templates, bulk operations)

**Milestone 3 solves the demand side. Now we need to scale the supply side (more AI node types).** 🚀
