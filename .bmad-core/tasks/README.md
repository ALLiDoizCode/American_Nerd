# MCP Server Research Tasks

This directory contains focused research tasks for evaluating MCP (Model Context Protocol) servers that AI agents will connect to as MCP clients using the Claude SDK.

## Available Slash Commands

### `/research-github-mcp` 🔴 CRITICAL
**Priority:** MVP Blocker
**Duration:** 1-2 days
**Blocks:** Milestone 0 development

Research GitHub MCP servers for AI agent operations (commits, PRs, branches, collaborator invites).

**Key Questions:**
- What GitHub MCP servers exist in awesome-mcp-servers?
- Are they compatible with Claude SDK MCP client?
- Should we use existing, fork & extend, or build custom?

**Output:** `docs/github-mcp-research.md` + architecture updates

---

### `/research-twitter-mcp` 🟡 POST-MVP
**Priority:** Milestone 3 (Month 4)
**Duration:** 4-6 hours

Research Twitter/X MCP servers for AI persona social presence and reputation building.

**Key Questions:**
- Do Twitter MCP servers exist?
- Is direct SDK (twitter-api-v2) simpler than MCP abstraction?
- What's the Twitter API v2 pricing impact?

**Output:** `docs/twitter-mcp-research.md` + architecture updates

---

### `/research-discord-mcp` 🟡 POST-MVP
**Priority:** Milestone 3 (Month 4)
**Duration:** 4-6 hours

Research Discord MCP servers for project notifications and community engagement.

**Key Questions:**
- Do Discord MCP servers exist?
- Is direct SDK (discord.js) or webhook approach simpler?
- Bot vs. webhook trade-offs?

**Output:** `docs/discord-mcp-research.md` + architecture updates + bot setup guide

---

### `/research-telegram-mcp` 🟢 OPTIONAL
**Priority:** Milestone 3+ or deferred
**Duration:** 3-4 hours

Research Telegram MCP servers for multi-platform presence.

**Key Questions:**
- Do Telegram MCP servers exist?
- Is direct Bot API (very simple HTTP) sufficient?
- Is Telegram integration worth the effort vs. Twitter/Discord?

**Output:** `docs/telegram-mcp-research.md` + architecture updates

---

## Research Context

### Architecture Overview

```
AI Agent Node (e.g., Developer)
  │
  ├─ Built with Node.js + TypeScript
  ├─ Uses Claude SDK for AI generation
  │
  └─ Acts as MCP CLIENT (connects to external MCP servers)
       │
       ├─ GitHub MCP Client ──→ External GitHub MCP Server ──→ GitHub API
       ├─ Twitter MCP Client ──→ External Twitter MCP Server ──→ Twitter API
       ├─ Discord MCP Client ──→ External Discord MCP Server ──→ Discord API
       └─ Telegram MCP Client ──→ External Telegram MCP Server ──→ Telegram API
```

**Important Distinctions:**
- **Our MCP Servers** (Remote + Local): Built with `fastmcp`, expose tools to Claude Desktop and AI agents
- **External MCP Servers** (Research Target): AI agents connect to these as MCP clients using Claude SDK

### Research Methodology

All research tasks follow a similar structure:

1. **Discovery** (awesome-mcp-servers first)
   - Review https://github.com/punkpeye/awesome-mcp-servers
   - Expand to GitHub/NPM searches
   - Assess direct SDK complexity

2. **Evaluation**
   - Feature completeness matrix
   - Protocol compliance (MCP spec)
   - Authentication model assessment
   - Code quality review

3. **Testing**
   - Hands-on testing with Claude SDK MCP client
   - Validate required operations
   - Document limitations and issues

4. **Decision**
   - Use existing MCP server
   - Fork & extend existing server
   - Build custom MCP wrapper
   - Use direct SDK (skip MCP abstraction)

### Common Resources

**Primary Sources:**
- awesome-mcp-servers: https://github.com/punkpeye/awesome-mcp-servers
- MCP Documentation: https://modelcontextprotocol.io/
- Claude SDK: https://docs.anthropic.com/
- MCP Specification: https://spec.modelcontextprotocol.io/

**API Documentation:**
- GitHub API: https://docs.github.com/en/rest
- Twitter API v2: https://developer.twitter.com/en/docs/twitter-api
- Discord API: https://discord.com/developers/docs
- Telegram Bot API: https://core.telegram.org/bots/api

## Usage

### Running a Research Task

```bash
# In Claude Code, invoke the slash command
/research-github-mcp

# This will:
1. Load the task markdown file
2. Provide structured research guidance
3. Prompt for deliverables at each phase
4. Update architecture.md when complete
```

### Recommended Order

1. **Week 1 (Critical Path):**
   - `/research-github-mcp` ← START HERE (blocks development)

2. **Month 4 (Milestone 3):**
   - `/research-twitter-mcp` (AI persona social presence)
   - `/research-discord-mcp` (project notifications)
   - `/research-telegram-mcp` (optional, evaluate priority)

### Output Deliverables

Each research task produces:

1. **Research Report**: `docs/{platform}-mcp-research.md`
   - Executive summary with recommendation
   - Detailed findings and evaluation
   - Code examples and integration patterns
   - Effort estimates for implementation

2. **Architecture Updates**: `docs/architecture.md`
   - Tech Stack table entries
   - MCP Tool Dependencies table entries
   - Component integration details

3. **Code Examples**: `docs/examples/{platform}-integration.ts`
   - Working MCP client code
   - Integration patterns for AI agents

4. **Setup Guides** (if needed): `docs/guides/{platform}-setup.md`
   - Bot setup instructions
   - Authentication configuration
   - Deployment guidance

## Success Criteria

Research is complete when:

- ✅ awesome-mcp-servers thoroughly reviewed
- ✅ Top 3 candidates evaluated (if MCP servers exist)
- ✅ Hands-on testing completed with Claude SDK
- ✅ Clear recommendation with >80% confidence
- ✅ Working code examples provided
- ✅ Architecture document updated
- ✅ Effort estimates provided (±20% accuracy)
- ✅ No unknown blockers remaining

## Integration with Architecture

After completing research, the architecture document will be updated:

**Before Research:**
```markdown
### MCP Tool Dependencies (Research Required)

| Integration | Approach | Notes |
|------------|----------|-------|
| **GitHub** | External MCP server (existing or custom) | Research pending |
```

**After Research:**
```markdown
### MCP Tool Dependencies

| Integration | Approach | Notes |
|------------|----------|-------|
| **GitHub** | github-mcp-server v1.2.0 | Commits, PRs, branches; Self-hosted |
| **Twitter/X** | Direct SDK (twitter-api-v2) | Simple API, MCP abstraction unnecessary |
| **Discord** | discord-mcp-server v0.8.0 | Rich embeds, multi-guild support |
| **Telegram** | Direct Bot API (fetch) | API too simple for MCP wrapper |
```

## Questions?

If you encounter issues during research:
1. Check the MCP specification for protocol details
2. Consult awesome-mcp-servers community discussions
3. Review Claude SDK MCP client examples
4. Document any ambiguities in the research report

---

**Remember:** GitHub MCP research is **CRITICAL PATH** - all other research can be deferred until post-MVP.
