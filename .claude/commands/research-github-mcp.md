# GitHub MCP Server Research Task

**Command:** `/research-github-mcp`
**Priority:** 🔴 CRITICAL - MVP Blocker
**Duration:** 1-2 days

---

## Objective

Identify and evaluate existing GitHub MCP servers that AI agents can connect to as MCP clients (using Claude SDK) to determine whether to use existing, fork & extend, or build custom for the American Nerd Marketplace.

## Context

AI agent nodes (Architect, Developer) need to perform GitHub operations:
- Create branches
- Commit files (architecture.md, code)
- Create pull requests
- Accept collaborator invites
- Merge PRs

These agents will act as **MCP clients** using Claude SDK to connect to external GitHub MCP servers.

## Research Questions

### Must Answer

1. **Discovery**: What GitHub MCP servers exist in awesome-mcp-servers and broader ecosystem?
2. **Feature Completeness**: Do they support all required operations (commits, PRs, branches, collaborator invites)?
3. **Protocol Compliance**: Are they compatible with Claude SDK's MCP client?
4. **Authentication**: Do they support Personal Access Token (PAT) for autonomous agents?
5. **Production Readiness**: Active maintenance, test coverage, production usage?
6. **Recommendation**: Use existing, fork & extend, or build custom?

### Should Answer

- Can we self-host for better control?
- How do they handle rate limiting (5000 req/hour)?
- What's the error handling quality?
- Are there TypeScript types available?
- What's the community adoption level?

## Research Process

### Phase 1: Discovery (2-3 hours)

**Key Resources**:
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Curated list of MCP servers
- [mcpservers.org](https://mcpservers.org/category/version-control) - Version control category
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) - Official reference servers

1. **Review awesome-mcp-servers**:
   - Filter for Git/GitHub/Version Control categories
   - Note: stars, last update, feature descriptions
   - Create shortlist (top 3-5 candidates)

2. **Expand search**:
   - GitHub search: "github mcp server"
   - Check for official GitHub MCP server
   - NPM search: "@modelcontextprotocol/server-github" or similar

3. **Initial filtering**:
   - Protocol compliance (MCP spec adherent)
   - Maintenance status (updated in last 3 months)
   - Language preference (TypeScript > Python > other)

### Phase 2: Evaluation (3-4 hours)

For **top 3 candidates**, create feature matrix:

```markdown
| Feature                    | Server A | Server B | Server C | Required? |
|---------------------------|----------|----------|----------|-----------|
| Create commit             | ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| Create branch             | ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| Create pull request       | ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| Accept collaborator invite| ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| Merge PR                  | ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| List PRs                  | ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| Get PR status             | ✅/❌    | ✅/❌    | ✅/❌    | ✅        |
| Create repository         | ✅/❌    | ✅/❌    | ✅/❌    | ⚪        |
| Manage webhooks           | ✅/❌    | ✅/❌    | ✅/❌    | ⚪        |
```

**Code Quality Assessment**:
- Review source code structure
- Check test coverage
- Examine error handling patterns
- Look for TypeScript types/documentation

**Authentication Review**:
- PAT support (required for agents)
- GitHub App support (future consideration)
- OAuth flows (likely not needed)

### Phase 3: Hands-On Testing (3-4 hours)

**Setup test environment**:
```bash
# Clone top candidate
git clone <repo-url>
cd <repo-name>
npm install  # or pip install

# Configure with test GitHub PAT
export GITHUB_TOKEN=<test-pat>

# Start MCP server
npm start  # or python -m server
```

**Test with Claude SDK MCP client**:
```typescript
import { MCPClient } from '@anthropic-ai/sdk';

const githubMCP = new MCPClient({
  serverUrl: 'http://localhost:3000',
  auth: { token: process.env.GITHUB_TOKEN }
});

// Test: Create branch
await githubMCP.callTool('create_branch', {
  repo: 'test-org/test-repo',
  branch: 'feature/test-branch',
  from: 'main'
});

// Test: Create commit
await githubMCP.callTool('create_commit', {
  repo: 'test-org/test-repo',
  branch: 'feature/test-branch',
  files: [{ path: 'test.txt', content: 'Hello' }],
  message: 'Test commit'
});

// Test: Create PR
await githubMCP.callTool('create_pull_request', {
  repo: 'test-org/test-repo',
  title: 'Test PR',
  head: 'feature/test-branch',
  base: 'main',
  body: 'Test PR description'
});
```

**Document results**:
- Which operations worked?
- Any errors or limitations?
- Performance observations
- Protocol compliance issues?

### Phase 4: Decision & Documentation (2-3 hours)

**Decision Matrix**:

| Criteria                  | Weight | Server A | Server B | Server C |
|--------------------------|--------|----------|----------|----------|
| Feature Completeness      | 30%    | ?/10     | ?/10     | ?/10     |
| Protocol Compliance       | 25%    | ?/10     | ?/10     | ?/10     |
| Production Readiness      | 20%    | ?/10     | ?/10     | ?/10     |
| AI Agent Suitability      | 15%    | ?/10     | ?/10     | ?/10     |
| Code Quality              | 10%    | ?/10     | ?/10     | ?/10     |
| **Total Score**           |        | ?/100    | ?/100    | ?/100    |

**Recommendation**:
- ✅ **USE EXISTING**: [Server Name] - [Justification]
- 🔧 **FORK & EXTEND**: [Server Name] needs [X, Y, Z] features added
- 🏗️ **BUILD CUSTOM**: No suitable server, estimate [X developer-days]

## Deliverables

### 1. Research Report (`docs/github-mcp-research.md`)

**Executive Summary**:
- Ecosystem maturity assessment
- Recommendation with confidence level
- Development effort estimate
- Critical risks identified

**Detailed Findings**:
- MCP server inventory (all discovered)
- Top 3 evaluation scorecards
- Feature completeness matrix
- Testing results and observations
- Code examples (working integrations)

**Recommendation Details**:
- Selected approach and rationale
- Implementation guide for AI agents
- Authentication setup instructions
- Known limitations and workarounds

**Fallback Plan** (if building custom):
- Architecture outline for custom MCP wrapper
- Priority endpoints for MVP
- Estimated development effort
- Technology stack (TypeScript, Octokit, fastmcp base)

### 2. Working Code Example

```typescript
// packages/ai-agent-node/src/services/github-mcp.service.ts

import { MCPClient } from '@anthropic-ai/sdk';

export class GitHubMCPService {
  private client: MCPClient;

  async initialize() {
    this.client = new MCPClient({
      serverUrl: process.env.GITHUB_MCP_URL || 'http://localhost:3000',
      auth: {
        token: process.env.GITHUB_PAT
      }
    });
  }

  async createBranch(repo: string, branch: string, from: string = 'main') {
    return await this.client.callTool('create_branch', {
      repo,
      branch,
      from
    });
  }

  async createPullRequest(params: {
    repo: string;
    title: string;
    head: string;
    base: string;
    body: string;
  }) {
    return await this.client.callTool('create_pull_request', params);
  }

  // ... additional methods
}
```

### 3. Update Architecture Document

Update `docs/architecture.md`:

**Tech Stack Table**:
```markdown
| **GitHub MCP** | [server-name] | [version] | GitHub operations for AI agents | [rationale] |
```

**MCP Tool Dependencies Table**:
```markdown
| **GitHub** | [server-name @ repo-url] | Commits, PRs, collaborator invites |
```

**Component Section** (AI Agent Node Runtime):
- Add GitHub MCP service to dependencies
- Document integration pattern

## Success Criteria

- ✅ Tested at least 3 GitHub MCP servers hands-on
- ✅ Clear recommendation with >80% confidence
- ✅ Working code example with real GitHub operations
- ✅ Effort estimate accurate to ±20%
- ✅ Architecture document updated with specifics
- ✅ No unknown blockers remaining

## Timeline

- **Hour 0-3**: Discovery (awesome-mcp-servers + broader search)
- **Hour 3-7**: Evaluation (feature matrix, code review)
- **Hour 7-11**: Hands-on testing (Claude SDK integration)
- **Hour 11-14**: Decision, documentation, architecture update

**Total: 12-16 hours (1.5-2 days)**

## Output Location

- **Research report**: `docs/github-mcp-research.md`
- **Code examples**: `docs/examples/github-mcp-integration.ts`
- **Architecture updates**: `docs/architecture.md` (inline)
- **Decision summary**: Add to architecture Next Steps section

## Next Steps After Research

1. **If using existing MCP**:
   - Week 1: Integrate into Architect node prototype
   - Test PRD → Architecture → GitHub PR workflow
   - Document deployment (self-hosted vs. cloud)

2. **If building custom**:
   - Week 1: Technical spike (basic GitHub operations)
   - Week 2-3: Full implementation (all required features)
   - Week 4: Integration testing with AI agents

3. **Update Milestone 0 plan** with realistic timeline
