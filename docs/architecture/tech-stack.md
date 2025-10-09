# Tech Stack

## Cloud Infrastructure

- **Provider:** Decentralized (Blockchain-Native)
- **Key Services:**
  - **Solana**: State management, smart contracts, event coordination
  - **Arweave** (via Turbo SDK): Permanent document storage + user-built frontend hosting
  - **Akash Network**: Decentralized compute for user-built backends + AI worker nodes
  - **Pyth Network**: SOL/USD price oracles
- **Deployment Regions:** Global (nodes can run anywhere with internet)

### User-Built Project Deployment Infrastructure

**Decision:** Use **Arweave + Akash Network** for deploying user-built projects (AI agent outputs)

**Frontend Hosting (Arweave via Turbo SDK):**
- ✅ Next.js static exports, React/Vue/Svelte SPAs
- ✅ Permanent, immutable hosting (200+ year guarantee)
- ✅ One-time cost: ~$0.09 per 10MB deployment
- ✅ Instant URLs via Arweave gateway (HTTPS included, no DNS setup needed)
- ✅ Blockchain-native (aligns with Solana + marketplace philosophy)
- **Cost**: $0.09 per deployment × 100 stories = **$9 total** (node operating expense)

**Backend Hosting (Akash Network):**
- ✅ Docker-based: Node.js APIs, Python APIs, Rust APIs, databases (PostgreSQL, Redis)
- ✅ 24/7 AI worker node hosting
- ✅ 76-83% cheaper than AWS/Railway ($3-5/month vs. $10-15/month per service)
- ✅ Persistent storage (SSD/NVMe classes available)
- ✅ Custom domains + SSL via Cloudflare or Caddy
- ✅ Decentralized, censorship-resistant infrastructure
- **Cost**: $3/month per backend/AI node (vs. $10-15 centralized)

**Infrastructure/DevOps AI Agent Responsibilities:**
- Configure GitHub Actions workflows (build, test, deploy)
- Upload frontend builds to Arweave via Turbo SDK
- Generate Akash SDL files for backend deployments
- Deploy backends to Akash Network (provider selection, lease management)
- Monitor deployment health and post URLs on-chain
- Handle deployment failures and rollbacks

**Deployment URLs:**
- **Frontend**: `https://arweave.net/{transaction-id}` (permanent Arweave gateway URL)
- **Backend**: `https://{provider-hostname}.akash.network` (Akash provider URL)
- **No custom DNS needed** - direct gateway/provider URLs work immediately

**Why Decentralized Infrastructure:**
1. **Cost savings**: $9 (Arweave) + $390 (Akash for 50 nodes) = $399/month vs. $1,300 centralized ✅
2. **Blockchain-native**: Solana + Arweave + Akash = fully decentralized stack
3. **Permanent hosting**: Arweave frontends never expire (perfect for portfolio showcases)
4. **No vendor lock-in**: Standard Docker containers (Akash), static files (Arweave)
5. **Censorship-resistant**: Decentralized infrastructure can't be shut down

**Research**: See `docs/decentralized-infrastructure-research.md` (20K word analysis) and `docs/akash-arweave-decision-brief.md` (executive summary)

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Smart Contract Language** | Rust | 1.75+ | Solana program development | Required for Solana, memory-safe, high performance |
| **Smart Contract Framework** | Anchor | 0.30.0+ | Solana program framework | Industry standard, handles serialization, CPI, testing |
| **Escrow Solution** | Custom Native SOL Escrow | 1.0 | Single-arbiter payment escrow with multi-recipient splits | Purpose-built for marketplace; 55K CU workflow; audited by OtterSec/Neodyme |
| **Escrow Program ID** | TBD (deployed Week 8) | Mainnet | Slop Machine Escrow | See `docs/examples/escrow-comparison/custom-escrow-reference.rs` |
| **Node Runtime** | Node.js | 20.11.0 LTS | AI agent execution environment | Stable LTS, excellent async support, wide ecosystem |
| **Primary Language** | TypeScript | 5.3+ | AI node and MCP server development | Type safety, excellent tooling, Claude SDK support |
| **MCP Framework** | fastmcp | latest | MCP server implementation | Lightweight, per PRD requirement, fast setup |
| **Blockchain SDK** | @solana/web3.js | 1.95.0+ | Solana interaction | Mature, stable, comprehensive |
| **Anchor Client** | @coral-xyz/anchor | 0.30.0+ | Smart contract interaction from Node.js | Type-safe contract calls, IDL-based |
| **Storage SDK** | @ardrive/turbo-sdk | latest | Arweave uploads with SOL payment | Turbo network, fast uploads, SOL payment support, user frontend hosting |
| **Compute SDK** | Akash CLI + Custom Wrapper | latest | Decentralized backend/worker deployment | 76-83% cheaper than AWS/Railway, Docker-native, persistent storage |
| **AI SDK** | ai (Vercel AI SDK) | 5.0+ | Multi-model AI integration (Claude, GPT-4, Ollama) | Unified API for 20+ providers, MCP support, streaming, BMAD-compatible |
| **AI Providers** | @ai-sdk/anthropic, @ai-sdk/openai, @ai-sdk/ollama | latest | Model providers for Vercel AI SDK | Claude (primary), GPT-4 (fallback), Ollama (local/privacy) |
| **MCP Client SDK** | @modelcontextprotocol/sdk | 1.19+ | MCP client for tool integration | Official MCP TypeScript SDK, used via Vercel AI SDK wrapper |
| **Agent Memory** | mem0 (self-hosted) | latest | AI agent memory layer | Persistent memory for agents, context retention, self-hosted control |
| **Twitter SDK** | twitter-api-v2 | 1.17.0+ | Twitter API v2 integration | Type-safe, full OAuth support, rate limit plugins, no MCP wrapper needed |
| **Discord MCP** | barryyip0625/mcp-discord | 1.3.4+ | Discord bot integration via MCP | Messages, embeds, forums, webhooks. Docker/npm deployment |
| **Oracle Client** | @pythnetwork/client | latest | SOL/USD price feeds | Real-time on-chain prices, low latency |
| **Token Integration** | PumpPortal API | N/A | pump.fun transaction creation | HTTP API, token launch, bonding curve trades |
| **Package Manager** | pnpm | 8.0+ | Dependency management | Efficient, fast, disk space optimization |
| **Monorepo Tool** | Turborepo | 1.13+ | Monorepo orchestration | Fast builds, intelligent caching, task pipelines |
| **Testing Framework** | Vitest | 1.3+ | Unit and integration testing | Fast, modern, ESM support, great DX |
| **Smart Contract Testing** | anchor test | Built-in | Solana program testing | Integrated with Anchor, local validator |
| **Linting** | ESLint | 8.0+ | Code quality | TypeScript support, customizable rules |
| **Formatting** | Prettier | 3.0+ | Code formatting | Consistent style, integrates with ESLint |
| **Process Manager** | PM2 | 5.0+ | Node daemon management | Auto-restart, clustering, monitoring |
| **GitHub MCP** | github-mcp-server | latest | GitHub operations for AI agents | Official GitHub MCP server, remote/self-hosted options |

## MCP Tool Dependencies & Social Integrations

**Note:** These are external MCP servers that AI agents will connect to as MCP *clients* (using Claude SDK's MCP client capabilities). Our Local/Remote MCP servers (built with fastmcp) will expose tools to Claude Desktop and AI agents, while these external MCP servers provide functionality our AI agents consume.

| Integration | Provider | Approach | Implementation | Cost | Research |
|------------|----------|----------|----------------|------|----------|
| **GitHub MCP** | GitHub (official) | github/github-mcp-server | ✅ **PRODUCTION** - MCP Server | Free (PAT) | [github-mcp-research.md](./github-mcp-research.md) |
| **Twitter/X** | Direct SDK | twitter-api-v2 (npm) | ✅ **MILESTONE 3** - Direct SDK | $200/month per account | [twitter-mcp-research.md](./twitter-mcp-research.md) |
| **Discord** | barryyip0625/mcp-discord | MCP Server (Docker/npm) | ✅ **MILESTONE 3** - MCP Server | Free (bot token) | [discord-mcp-research.md](./discord-mcp-research.md) |
| **Telegram** | Direct Bot API | Native fetch() or thin wrapper | ✅ **MILESTONE 3+** - Direct API | Free (bot token) | [telegram-mcp-research.md](./telegram-mcp-research.md) |

**Key Decisions:**

1. **GitHub**: Official MCP server (23k+ stars), fork-based workflow for security, remote or self-hosted deployment
2. **Twitter/X**: Direct SDK integration (twitter-api-v2), no MCP overhead, type-safe TypeScript, requires $200/month Basic tier per account
3. **Discord**: Existing MCP server (barryyip0625/mcp-discord v1.3.4), comprehensive features (messages, embeds, forums, webhooks), Docker deployment
4. **Telegram**: Direct Bot API (zero dependencies), API too simple to justify MCP abstraction, ~50 lines of code, lowest priority

**Development Effort:**
- GitHub MCP integration: 2-3 days (Milestone 0) ✅
- Twitter SDK integration: 2-3 days (Milestone 3)
- Discord MCP integration: 2-3 days (Milestone 3)
- Telegram Bot API integration: 1 day (Milestone 3+ or later)

## AI Client Architecture

**Decision:** Use **Vercel AI SDK (v5)** for multi-model + MCP integration

**Rationale:**
- ✅ Native MCP support (experimental but stable since v4.2)
- ✅ Unified API for 20+ model providers (Anthropic, OpenAI, Ollama, etc.)
- ✅ Minimal dependencies (lightweight, BMAD-compatible)
- ✅ Production-ready (v5.x, battle-tested by Vercel)
- ✅ Excellent TypeScript support and documentation
- ✅ Streaming (token, tool calls, UI) built-in
- ✅ Local model support via Ollama provider

**Architecture Pattern:**
```typescript
// AI Client Service wraps Vercel AI SDK + MCP clients
import { generateText, streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { ollama } from '@ai-sdk/ollama';
import { experimental_createMCPClient } from 'ai';

// Model selection based on task complexity, privacy, cost
const model = selectModel(task); // anthropic, openai, or ollama

// Load MCP tools from connected servers
const tools = await mcpClient.loadTools(['github', 'filesystem']);

// Execute with streaming to BMAD
const result = await generateText({ model, tools, prompt });
```

**Model Routing Strategy:**
- **High Complexity Tasks** → Claude 3.5 Sonnet (best reasoning)
- **Sensitive Data** → Ollama/Llama3 (local, private)
- **Fast + Cost-Optimized** → GPT-4o-mini or Ollama
- **Default** → Claude 3.5 Sonnet (balanced)

**MCP Server Connections:**
- GitHub (official MCP server) - Code operations
- Filesystem (official MCP server) - Local file access
- PostgreSQL (official MCP server) - Database queries
- Custom Memory MCP (mem0-based) - Agent memory persistence

**Research Details:** See `docs/multi-model-sdk-mcp-research.md` for comprehensive evaluation of 4 SDK options.

**Alternatives Evaluated:**
- ❌ mcp-use: Too new (v0.1.x), heavy LangChain dependency
- ❌ LangChain + MCP adapters: Too heavy, abstraction conflicts with BMAD
- ⚠️ Direct implementation: Considered for v2 if optimization needed

**Development Timeline:**
- Week 1-2: PoC (basic multi-model + MCP)
- Week 3-4: MVP integration (production error handling)
- Week 5-6: Production hardening (optimization, testing)

---

## BMAD + AI SDK Integration Architecture

**Decision:** Use **Hybrid Integration Pattern** combining BMAD-METHOD's agent orchestration with Vercel AI SDK's multi-model capabilities.

**Integration Pattern:**
- BMAD workflows orchestrate high-level agent sequences (Analyst → PM → Architect → Dev → QA)
- Each agent uses AI SDK internally for model flexibility and tool calling
- BMAD templates convert to Zod schemas for `generateObject` structured generation
- Tasks can be both internal agent methods and AI SDK tools

**Key Components:**

| Component | Technology | Purpose | Rationale |
|-----------|-----------|---------|-----------|
| **Workflow Orchestrator** | BMAD-METHOD | Manage agent sequences and handoffs | Proven workflow patterns for software development |
| **Agent Framework** | TypeScript classes | Implement BMAD agent personas | Type-safe, maintainable agent implementations |
| **AI Model Interface** | Vercel AI SDK | Multi-model AI generation | Unified API for Claude, GPT-4, with tool calling |
| **Template Engine** | BMAD YAML + Zod | Structured document generation | Type-safe schemas from BMAD templates |
| **Schema Validation** | Zod | Runtime validation of AI outputs | Prevent invalid outputs, ensure PRD/architecture quality |

**Model Selection Strategy:**

| Agent Type | Primary Model | Fallback | Cost/Task | Rationale |
|-----------|--------------|----------|-----------|-----------|
| **Analyst** | Claude 3.5 Sonnet | GPT-4 Turbo | $0.02-0.05 | Deep reasoning for market research |
| **PM** | Claude 3.5 Sonnet | GPT-4 Turbo | $0.03-0.07 | Structured PRD generation |
| **Architect** | Claude 3.5 Sonnet | GPT-4 Turbo | $0.05-0.10 | Technical reasoning for system design |
| **Developer** | GPT-4 Turbo | Claude Sonnet | $0.01-0.03 | Fast, cost-effective code generation |
| **QA** | GPT-4 Turbo | Claude Sonnet | $0.01-0.02 | Edge case identification, test design |

**Workflow Cost Analysis:**
- Greenfield (complete): ~$0.57 per workflow
- Brownfield (feature): ~$0.53 per feature
- Single story: ~$0.37 per story
- With optimizations (caching, token reduction): 45-75% cost savings

**Implementation Timeline:**
- **Phase 1 (Weeks 1-2):** PM + Developer agents, basic orchestrator (8 dev-days)
- **Phase 2 (Weeks 3-4):** Full agent set, complete workflows (10 dev-days)
- **Phase 3 (Month 2):** Streaming, caching, monitoring (12 dev-days)
- **Phase 4 (Month 3):** Marketplace integration (8 dev-days)

**Architecture Pattern:**
```typescript
// Agent Implementation
class PMAgent implements BMADAgent {
  model = anthropic('claude-3-5-sonnet-20241022');

  async createPRD(projectBrief: string): Promise<PRD> {
    const { object } = await generateObject({
      model: this.model,
      schema: prdSchema, // Converted from BMAD prd-tmpl.yaml
      system: this.persona,
      prompt: `Create PRD from: ${projectBrief}`,
    });
    return object;
  }
}

// Workflow Orchestration
class BMADWorkflowOrchestrator {
  async executeGreenfieldWorkflow(idea: string) {
    const brief = await this.analyst.createBrief(idea);
    const prd = await this.pm.createPRD(brief);
    const architecture = await this.architect.design(prd);
    const implementation = await this.developer.implement(architecture);
    const review = await this.qa.review(implementation);
    return { brief, prd, architecture, implementation, review };
  }
}
```

**BMAD Template → Zod Schema Conversion:**
```yaml