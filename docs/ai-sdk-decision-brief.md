# AI SDK Decision Brief

**Date:** October 7, 2025
**Status:** ✅ APPROVED
**Priority:** 🔴 CRITICAL - MVP Blocker

---

## Decision

**Use Vercel AI SDK (v5)** as the multi-model AI client with MCP support for the American Nerd Marketplace.

## Rationale

| Criterion | Why Vercel AI SDK |
|-----------|-------------------|
| **MCP Support** | Native support (experimental but stable since v4.2) |
| **Multi-Model** | Unified API for 20+ providers (Anthropic, OpenAI, Ollama) |
| **Dependencies** | Minimal, lightweight (~10MB vs. 100MB+ for LangChain) |
| **BMAD Integration** | Easy to wrap, no abstraction conflicts |
| **Production Ready** | v5.x, battle-tested by Vercel |
| **Maintenance** | Very active (weekly releases) |
| **Developer Experience** | Excellent docs, TypeScript-first |
| **Performance** | Near-optimal (minimal overhead) |
| **Cost** | MIT license, free |

**Score:** 92/100 (highest among 4 alternatives evaluated)

## Quick Start

### Installation

```bash
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/ollama @modelcontextprotocol/sdk
```

### Basic Usage

```typescript
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  prompt: 'Hello, world!'
});

console.log(result.text);
```

### With MCP Tools

```typescript
import { experimental_createMCPClient } from 'ai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client';

// Connect to MCP server
const mcpClient = experimental_createMCPClient({
  transport: new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github']
  })
});

// Load tools
const tools = await mcpClient.tools();

// Use with AI model
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools,
  prompt: 'Create a GitHub branch called feature/test'
});
```

## Model Routing Strategy

| Task Type | Model | Rationale |
|-----------|-------|-----------|
| **Expert Matching** | GPT-4o-mini | Fast, cost-optimized |
| **Code Generation** | Claude 3.5 Sonnet | Best code quality |
| **Code Review** | Claude 3.5 Sonnet | Best reasoning |
| **QA Analysis** | GPT-4o-mini | Fast, sufficient |
| **PM Planning** | Claude 3.5 Sonnet | Best planning |
| **Sensitive Data** | Ollama/Llama3 | Local, private |

## MCP Servers

| Server | Purpose | Command |
|--------|---------|---------|
| **GitHub** | Code operations | `npx -y @modelcontextprotocol/server-github` |
| **Filesystem** | File access | `npx -y @modelcontextprotocol/server-filesystem /workspace` |
| **PostgreSQL** | Database queries | `npx -y @modelcontextprotocol/server-postgres $DB_URL` |
| **Memory** | Agent memory | Custom (mem0-based) |

## Implementation Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **PoC** | Week 1-2 | Basic multi-model + MCP |
| **MVP** | Week 3-4 | Production error handling |
| **Production** | Week 5-6 | Optimization + testing |

**Total:** 3-4 weeks (30-40 hours)

## Cost Estimate

**Estimated Monthly Cost (10,000 tasks):**
- Simple tasks (70%): GPT-4o-mini @ $0.375/1M tokens = **$5.25**
- Complex tasks (25%): Claude Sonnet @ $9/1M tokens = **$90**
- Most complex (5%): GPT-4 @ $45/1M tokens = **$180**
- **Total: ~$275/month**

**Local models (Ollama) = $0** (for sensitive data)

## Alternatives Rejected

| Option | Score | Reason for Rejection |
|--------|-------|----------------------|
| **mcp-use** | 68/100 | Too new (v0.1.x), heavy LangChain dependency |
| **LangChain + MCP** | 78/100 | Too heavy (100MB+), abstraction conflicts |
| **Direct Implementation** | 85/100 | Viable for v2, but higher dev effort |

## Next Steps

1. ✅ **Approved** - Vercel AI SDK selected
2. **Week 1:** Install dependencies, create AI Client Service
3. **Week 2:** Connect MCP servers, test tool calling
4. **Week 3:** Integrate with BMAD task executor
5. **Week 4:** Production error handling, observability
6. **Week 5-6:** Optimization, comprehensive testing

## Resources

- **Full Research Report:** `docs/multi-model-sdk-mcp-research.md` (54KB, comprehensive)
- **Code Example:** `docs/examples/ai-sdk-integration.ts` (complete reference implementation)
- **Architecture:** `docs/architecture.md` (updated with AI SDK decision)
- **Test Code:** `/tmp/mcp-sdk-research/` (hands-on validation tests)

## Key Contacts

- **Decision Owner:** Jonathan Green (Architect)
- **Implementation:** AI Agent Engineer
- **Review:** BMAD Integration Team

---

**Confidence Level:** ✅ HIGH (hands-on testing completed, 4 alternatives evaluated)
