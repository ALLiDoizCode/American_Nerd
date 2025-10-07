# Multi-Model SDK with MCP Support Research Task

**Command:** `/research-multi-model-sdk-mcp`
**Priority:** 🔴 CRITICAL - MVP Architecture Blocker
**Duration:** 1-2 days

---

## Objective

Identify and evaluate npm libraries/SDKs that can serve as a unified AI client interface for the American Nerd Marketplace, supporting multiple AI models (remote and local), MCP server integration, and BMAD agent workflows for marketplace automation.

## Context

**Project:** American Nerd Marketplace - A blockchain-native marketplace where autonomous AI agents perform software development work (planning, architecture, development, QA) with human validation gates.

**AI Node Architecture Requirements:**
- **Multi-Model Support**: Claude, GPT-4, local models (Llama, Mistral, etc.)
- **MCP Protocol Support**: Ability to connect to MCP servers for extended capabilities
- **BMAD Integration**: Must work within BMAD's task execution framework
- **Marketplace Automation**: Expert matching, task analysis, code generation, QA review

**Technical Constraints:**
- Node.js/TypeScript environment
- Must support both remote APIs and local model inference
- Streaming responses for better UX
- Tool/function calling capabilities (MCP tools)
- State management for multi-turn conversations

## Research Questions

### Primary Questions (Must Answer)

1. **Can mcp-use solve this requirement?**
   - Does mcp-use support MCP server integration?
   - What models does mcp-use support (remote: Claude, GPT-4, etc. and local: Ollama, llama.cpp)?
   - Can mcp-use integrate with BMAD agent workflows?
   - Does it support streaming responses and tool calling?
   - What are mcp-use's limitations and strengths?
   - Is it production-ready with active maintenance?

2. **What alternative SDKs exist that support both multi-model and MCP?**
   - **Anthropic SDK** + MCP features (official support?)
   - **LangChain.js** + MCP capabilities
   - **Vercel AI SDK** + MCP integration
   - **ModelFusion** or other multi-model frameworks
   - **LiteLLM** (Python-based, but Node.js wrappers?)
   - Custom MCP client implementations

3. **Which SDKs natively support local model execution?**
   - **Ollama** integration options (ollama-js, llamaindex)
   - **llama.cpp** Node.js bindings (node-llama-cpp)
   - **LocalAI** compatibility
   - **vLLM** or other inference engines
   - **Transformers.js** (browser/Node.js local inference)

4. **How do these SDKs handle MCP server connectivity?**
   - Native MCP protocol support (Model Context Protocol spec compliance)
   - Transport mechanisms (stdio, HTTP, WebSocket)
   - Tool/function calling through MCP
   - Resource access patterns (prompts, context)
   - Multi-server support (connect to multiple MCP servers)

5. **What is the integration path with BMAD agents?**
   - Can the SDK be wrapped as a BMAD task executor?
   - Streaming response handling (real-time progress updates)
   - State management and context persistence
   - Error handling and retry logic
   - Task cancellation and timeout handling

6. **Model switching and routing capabilities?**
   - Can we dynamically switch between models per task?
   - Fallback strategies (if Claude fails, try GPT-4, then local)
   - Cost optimization (use cheaper models for simple tasks)
   - Performance optimization (local for low-latency, cloud for complex)

### Secondary Questions (Nice to Have)

1. What is the developer experience and documentation quality for each option?
2. What are the performance characteristics (latency, throughput, resource usage)?
3. What is the maintenance status and community support?
4. Are there cost implications (licensing, API wrapper fees)?
5. What security and privacy features are available for local vs. remote execution?
6. Can these SDKs handle multi-turn conversations with context?
7. What observability and debugging tools are available?
8. How do they handle rate limiting for various APIs?
9. What prompt caching or optimization features exist?
10. Can we add custom model providers easily?

## Research Process

### Phase 1: Discovery & Documentation Review (3-4 hours)

#### Task 1: mcp-use Deep Dive

**Information Sources:**
- mcp-use GitHub repository (if exists)
- mcp-use npm package documentation
- Example implementations and starter templates
- Community discussions (issues, PRs)

**Key Questions:**
- Architecture and design philosophy
- Supported models matrix (remote vs. local)
- MCP protocol implementation details
- Code examples for common use cases
- Known limitations or gotchas

#### Task 2: Alternative SDK Survey

**Primary Sources:**
- **Anthropic SDK**: Official Claude SDK with MCP support check
- **Vercel AI SDK**: Multi-provider support (OpenAI, Anthropic, etc.)
- **LangChain.js**: Chain-based framework with MCP integrations
- **ModelFusion**: TypeScript-first multi-model framework
- **LiteLLM**: Python-based unified interface (Node.js compatibility?)
- **ai-sdk/core**: Low-level abstraction for building on top

**Secondary Sources:**
- awesome-mcp-servers (for MCP ecosystem context)
- Model Context Protocol specification (modelcontextprotocol.io)
- npm package registries and download statistics
- Developer community discussions (Reddit, Discord, HN)

#### Task 3: Local Model Execution Research

**Options to Evaluate:**
- **Ollama** + ollama-js: Popular local model runner
- **llama.cpp** + node-llama-cpp: High-performance inference
- **Transformers.js**: In-process inference (Hugging Face)
- **LocalAI**: OpenAI-compatible local endpoint
- **vLLM**: Production-grade inference server

### Phase 2: Capability Analysis (3-4 hours)

#### Capability Comparison Matrix

| Feature | mcp-use | Anthropic SDK | Vercel AI SDK | LangChain.js | ModelFusion | Direct Impl |
|---------|---------|---------------|---------------|--------------|-------------|-------------|
| **MCP Protocol Support** | ? | ? | ? | ? | ? | Manual |
| **Claude (Anthropic)** | ? | ✅ | ✅ | ✅ | ✅ | ✅ |
| **GPT-4 (OpenAI)** | ? | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Local Models (Ollama)** | ? | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Streaming** | ? | ✅ | ✅ | ✅ | ✅ | Manual |
| **Tool Calling** | ? | ✅ | ✅ | ✅ | ✅ | Manual |
| **MCP Tool Integration** | ? | ? | ? | ? | ? | Manual |
| **Multi-Server MCP** | ? | ? | ? | ? | ? | Manual |
| **Context Management** | ? | Manual | ✅ | ✅ | Manual | Manual |
| **TypeScript Support** | ? | ✅ | ✅ | ✅ | ✅ | ✅ |
| **BMAD Compatible** | ? | ? | ? | ? | ? | ✅ |
| **Active Development** | ? | ✅ | ✅ | ✅ | ? | N/A |

#### Evaluation Criteria (Weighted)

1. **MCP Integration** (25%): Native support, protocol compliance, server connectivity
2. **Model Support** (25%): Range of supported models, local vs. remote flexibility
3. **BMAD Compatibility** (20%): Can be used within BMAD task execution
4. **Developer Experience** (10%): Documentation, examples, TypeScript support
5. **Production Readiness** (10%): Stability, error handling, observability
6. **Community & Maintenance** (5%): Active development, issue response, ecosystem
7. **Performance** (3%): Latency, resource usage, concurrency handling
8. **Licensing & Cost** (2%): Open source, commercial restrictions

### Phase 3: Hands-On Testing (4-6 hours)

#### Test Environment Setup

```bash
# Create test workspace
mkdir -p /tmp/mcp-sdk-research
cd /tmp/mcp-sdk-research
npm init -y
```

#### Test Case 1: mcp-use (if available)

```typescript
// test-mcp-use.ts
import { MCPClient } from 'mcp-use'; // hypothetical

const client = new MCPClient({
  model: 'claude-3-5-sonnet',
  mcpServers: [
    { name: 'github', url: 'http://localhost:3000' }
  ]
});

// Test: Multi-turn conversation with MCP tool use
const response = await client.chat([
  { role: 'user', content: 'Create a GitHub branch called feature/test' }
]);

console.log(response);

// Test: Switch to local model
client.setModel('ollama/llama3');
const localResponse = await client.chat([
  { role: 'user', content: 'Summarize this code' }
]);
```

#### Test Case 2: Anthropic SDK + MCP

```typescript
// test-anthropic-mcp.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Check: Does Anthropic SDK support MCP natively?
// If not, how would we integrate MCP tools?
```

#### Test Case 3: Vercel AI SDK

```typescript
// test-vercel-ai-sdk.ts
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

// Test: Multi-model support
const claudeResponse = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  prompt: 'Hello'
});

const gptResponse = await generateText({
  model: openai('gpt-4'),
  prompt: 'Hello'
});

// Test: Local model support?
// Test: MCP integration?
```

#### Test Case 4: LangChain.js

```typescript
// test-langchain.ts
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';

const claude = new ChatAnthropic({
  model: 'claude-3-5-sonnet-20241022'
});

const gpt = new ChatOpenAI({
  model: 'gpt-4'
});

// Test: MCP tool integration?
// Test: Custom tool calling?
```

#### Test Case 5: Direct Implementation Baseline

```typescript
// test-direct-baseline.ts
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Baseline: What does direct implementation look like?
// - MCP client connection
// - Model routing logic
// - Tool calling
// - Streaming
```

### Phase 4: BMAD Integration Analysis (2-3 hours)

#### Integration Pattern Design

```typescript
// packages/ai-agent-node/src/services/ai-client.service.ts

export interface AIClientConfig {
  defaultModel: string;
  mcpServers: MCPServerConfig[];
  fallbackStrategy: 'sequential' | 'parallel';
}

export class AIClientService {
  constructor(private sdk: UnifiedSDK) {}

  async executeTask(task: BMADTask): Promise<TaskResult> {
    // 1. Determine appropriate model for task
    const model = this.selectModel(task);

    // 2. Load MCP tools relevant to task
    const tools = await this.loadMCPTools(task.requiredTools);

    // 3. Execute with streaming
    const stream = await this.sdk.chat({
      model,
      messages: task.messages,
      tools,
      stream: true
    });

    // 4. Handle tool calls to MCP servers
    for await (const chunk of stream) {
      if (chunk.type === 'tool_call') {
        const result = await this.executeMCPTool(chunk);
        // Continue conversation with tool result
      }
    }

    return result;
  }

  private selectModel(task: BMADTask): string {
    // Model routing logic
    if (task.complexity === 'high') return 'claude-3-5-sonnet';
    if (task.privacy === 'sensitive') return 'local/llama3';
    return 'gpt-4';
  }
}
```

### Phase 5: Decision & Documentation (2-3 hours)

#### Decision Framework

```
Start: What is the best SDK for multi-model + MCP?

├─ Does mcp-use exist and work well?
│  ├─ YES → Feature complete?
│  │  ├─ YES → ✅ USE MCP-USE
│  │  └─ NO → Can extend easily?
│  │     ├─ YES → 🔧 FORK MCP-USE
│  │     └─ NO → Continue evaluation ↓
│  └─ NO → Continue evaluation ↓
│
├─ Do existing SDKs support MCP natively?
│  ├─ Anthropic SDK has MCP → ✅ USE ANTHROPIC SDK
│  ├─ Vercel AI SDK has MCP → ✅ USE VERCEL AI SDK
│  ├─ LangChain has good MCP → ✅ USE LANGCHAIN
│  └─ NO native MCP → Continue ↓
│
├─ Can we build MCP adapter on top of existing SDK?
│  ├─ Vercel AI SDK + Custom MCP layer → 🔧 BUILD ADAPTER
│  ├─ Anthropic SDK + Custom multi-model → 🔧 BUILD ADAPTER
│  └─ Too complex → Continue ↓
│
└─ Build custom from scratch
   └─ 🏗️ BUILD CUSTOM (ModelFusion as base?)
```

## Deliverables

### 1. Research Report (`docs/multi-model-sdk-mcp-research.md`)

**Executive Summary** (2 pages):
- Can mcp-use solve the requirements? (Yes/No + caveats)
- Top 3 recommended SDK options ranked by fit
- Critical gaps or limitations identified
- Recommended approach (use existing vs. build adapter vs. build custom)
- Development effort estimate
- Cost and licensing implications

**Detailed Findings**:

**Section 1: mcp-use Deep Dive**
- Architecture and capabilities
- MCP server integration approach
- Supported models (remote and local)
- Code examples for marketplace use cases
- Limitations and workarounds
- Community and maintenance status
- **VERDICT**: Recommended / Not recommended / Needs extension

**Section 2: Alternative SDK Comparison**
For each viable alternative:
- Overview and architecture
- MCP support (native or via extension)
- Model support matrix
- Integration complexity
- Code example
- Pros and cons vs. mcp-use
- **SCORE**: /100 based on evaluation criteria

**Section 3: Local Model Support**
- Options for running local models (Ollama, llama.cpp, etc.)
- Performance characteristics (latency, resource usage)
- Resource requirements (RAM, GPU)
- Integration with each SDK
- Recommended approach for local inference

**Section 4: MCP Integration Strategy**
- Recommended MCP client pattern
- Multi-server connectivity approach
- Tool calling workflow
- Resource and context management
- Error handling for MCP failures

**Section 5: BMAD Integration Architecture**
- Task executor wrapper design
- Model selection strategy (routing logic)
- State management approach
- Streaming response handling
- Error handling and observability
- Fallback and retry strategies

**Section 6: Implementation Roadmap**
- **Phase 1**: Proof of concept (Week 1-2)
  - Basic multi-model switching
  - Single MCP server connection
  - Simple BMAD task execution
- **Phase 2**: MVP integration (Week 3-4)
  - Multiple MCP servers
  - Full model routing logic
  - Production error handling
- **Phase 3**: Production hardening (Week 5-6)
  - Observability and monitoring
  - Performance optimization
  - Comprehensive testing

### 2. Supporting Materials

**Data Tables:**

**Full Feature Comparison Matrix** (all SDKs evaluated)

**Performance Benchmarks** (if tested):
| Operation | mcp-use | Vercel AI | LangChain | Direct |
|-----------|---------|-----------|-----------|--------|
| Simple prompt (no tools) | ?ms | ?ms | ?ms | ?ms |
| With MCP tool call | ?ms | ?ms | ?ms | ?ms |
| Streaming (time to first token) | ?ms | ?ms | ?ms | ?ms |

**Model Support Grid**:
| Model | mcp-use | Anthropic SDK | Vercel AI | LangChain |
|-------|---------|---------------|-----------|-----------|
| Claude 3.5 Sonnet | ✅/❌ | ✅ | ✅ | ✅ |
| GPT-4 | ✅/❌ | ❌ | ✅ | ✅ |
| Ollama (Llama 3) | ✅/❌ | ❌ | ✅ | ✅ |
| Local llama.cpp | ✅/❌ | ❌ | ? | ? |

**Code Samples:**

```typescript
// Example 1: mcp-use basic usage (if applicable)
// Example 2: Alternative SDK usage patterns
// Example 3: BMAD integration pseudo-code
// Example 4: MCP server connection examples
// Example 5: Model switching and fallback
```

**Source Documentation:**
- Links to all referenced documentation
- GitHub repositories
- Community resources (Discord, forums)
- Relevant discussions or issues
- npm packages evaluated

### 3. Proof of Concept Code (Optional but Recommended)

**Location**: `/tmp/mcp-sdk-research/` or `packages/ai-client-poc/`

**Structure**:
```
poc/
├── test-mcp-use.ts
├── test-vercel-ai-sdk.ts
├── test-langchain.ts
├── test-direct-impl.ts
├── bmad-integration-example.ts
└── package.json
```

**Must Demonstrate**:
- Basic model invocation (Claude, GPT-4, local)
- MCP server connection (if supported)
- Tool calling workflow
- Streaming responses
- Error handling

### 4. Update Architecture Document

Update `docs/architecture.md`:

**Tech Stack Table**:
```markdown
| **AI Client SDK** | [Recommended SDK] | [version] | Multi-model + MCP support | [rationale] |
```

**MCP Tool Dependencies Table**:
```markdown
| **GitHub** | [MCP server] | Via [SDK] |
| **[Other]** | [MCP server] | Via [SDK] |
```

**AI Node Runtime Dependencies**:
- Add AI Client SDK to dependencies
- Document MCP server connectivity
- Explain model selection strategy

## Success Criteria

This research will be successful if it provides:

1. ✅ **Clear Decision**: Can confidently choose an SDK or decide to build custom
2. ✅ **mcp-use Verdict**: Definitive answer on whether mcp-use solves the problem
3. ✅ **Implementation Confidence**: Have enough detail to start integration work immediately
4. ✅ **Risk Awareness**: Understand limitations and potential blockers
5. ✅ **Actionable Next Steps**: Know exactly what to do next (POC, testing, integration)
6. ✅ **Cost Understanding**: Know API costs and licensing implications
7. ✅ **Performance Expectations**: Understand latency and resource requirements

**Confidence Indicators:**
- Tested at least 3 SDK options hands-on
- mcp-use evaluated thoroughly (code review + testing if available)
- Working code example with real model invocations
- MCP integration pattern validated (or gaps documented)
- BMAD integration path designed and feasible

## Timeline

**Target Completion:** 1-2 days (12-16 hours)

**Priority:** 🔴 **CRITICAL** - This decision blocks AI node implementation in the marketplace. All AI automation depends on this research.

**Hour-by-Hour Breakdown:**

| Hours | Focus | Deliverables |
|-------|-------|--------------|
| **0-2** | mcp-use discovery and documentation review | mcp-use assessment |
| **2-4** | Alternative SDK survey (Anthropic, Vercel AI, LangChain) | Capability matrix |
| **4-6** | Local model research (Ollama, llama.cpp) | Local inference options |
| **6-10** | Hands-on testing (at least 3 SDK options) | Working code examples |
| **10-12** | BMAD integration analysis | Integration architecture |
| **12-14** | Decision framework and recommendation | Final recommendation |
| **14-16** | Documentation and architecture updates | Research report |

**Dependencies:**
- ✅ No blockers (can start immediately)
- ✅ Node.js environment available
- ✅ API keys for testing (Anthropic, OpenAI)
- ✅ Local model runner installed (Ollama recommended)

**What This Research Blocks:**
- AI agent node implementation (Milestone 0)
- BMAD task execution with AI
- Expert matching algorithm
- Code generation workflows
- QA review automation
- All AI-powered marketplace features

## Output Location

- **Research report**: `docs/multi-model-sdk-mcp-research.md`
- **Code examples**: `docs/examples/ai-sdk-integration.ts`
- **PoC code**: `/tmp/mcp-sdk-research/` or `packages/ai-client-poc/`
- **Architecture updates**: `docs/architecture.md` (inline)

## Next Steps After Research Completion

1. **Review Session**: Present findings to architect + AI engineer (1 hour)
2. **Implementation Decision**: Approve SDK approach or identify alternatives (30 min)
3. **Sprint Planning**: Break down implementation into specific tasks (1 hour)
4. **Begin Development**: Start AI client service implementation

**If Clear Winner SDK:**
- Week 1: Integrate SDK into AI agent node runtime
- Week 2: Implement BMAD task executor wrapper
- Week 3: Connect MCP servers and test workflows
- Week 4: Production hardening and testing

**If Build Custom/Adapter:**
- Week 1: Technical spike (basic multi-model + MCP)
- Week 2-3: Full implementation (all features)
- Week 4: Integration testing with BMAD
- Week 5-6: Production hardening

**If No Clear Solution:**
- Research alternative approaches
- Consider simplifying requirements (MCP optional?)
- Reassess timeline and architecture implications

---

## Notes

- This is a **Technology & Innovation Research** focused task
- Prioritize mcp-use evaluation first (1/4 of research time)
- Focus on answering the 6 primary questions with certainty
- Hands-on testing is critical - don't rely only on documentation
- BMAD integration is a hard requirement - validate compatibility
- If no solution works perfectly, document trade-offs clearly
