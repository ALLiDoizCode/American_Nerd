# Twitter/X MCP Server Research Task

**Command:** `/research-twitter-mcp`
**Priority:** 🟡 POST-MVP - Milestone 3
**Duration:** 4-6 hours

---

## Objective

Identify and evaluate existing Twitter/X MCP servers that AI agents can connect to as MCP clients (using Claude SDK) to determine whether to use existing, build custom wrapper, or integrate Twitter API directly for AI persona social presence.

## Context

AI agent personas need Twitter/X presence to:
- Post project updates and milestones
- Build social proof and followers
- Engage with community
- Demonstrate reputation and activity

Required operations:
- Post tweets (status updates)
- Read follower count and engagement metrics
- (Optional) Like/retweet for engagement
- (Optional) Reply to mentions

AI agents will act as **MCP clients** using Claude SDK to connect to external Twitter MCP servers.

## Research Questions

### Must Answer

1. **Discovery**: What Twitter/X MCP servers exist in awesome-mcp-servers and broader ecosystem?
2. **API Version**: Do they support Twitter API v2 (current standard)?
3. **Feature Coverage**: Post tweets, read metrics sufficient for MVP?
4. **Authentication**: Support API keys/bearer tokens for autonomous agents?
5. **Cost**: Twitter API pricing implications (Free tier vs. paid)?
6. **Recommendation**: Use existing MCP, build custom, or direct SDK integration?

### Should Answer

- Rate limit handling (300 tweets/3hr for Basic tier)?
- Error handling quality?
- Can we use for multiple agent personas?
- Self-hosting feasibility?
- Community adoption level?

## Research Process

### Phase 1: Discovery (1-2 hours)

1. **Review awesome-mcp-servers**:
   - Filter for Twitter/X, Social Media categories
   - Note maturity indicators (stars, updates, features)

2. **Expand search**:
   - GitHub search: "twitter mcp server", "x mcp server"
   - NPM search: MCP + Twitter packages
   - Check Twitter API v2 complexity (assess direct SDK option)

3. **Twitter API Assessment**:
   - Review Twitter API v2 pricing tiers
   - Identify required endpoints (POST /tweets, GET /users/:id)
   - Assess authentication complexity (OAuth 2.0, bearer token)

### Phase 2: Evaluation (1-2 hours)

**If MCP servers found**, create comparison:

| Feature              | Server A | Server B | Direct SDK | Required? |
|---------------------|----------|----------|------------|-----------|
| Post tweet          | ✅/❌    | ✅/❌    | ✅         | ✅        |
| Get user metrics    | ✅/❌    | ✅/❌    | ✅         | ✅        |
| Like/retweet        | ✅/❌    | ✅/❌    | ✅         | ⚪        |
| Reply to mentions   | ✅/❌    | ✅/❌    | ✅         | ⚪        |
| Media upload        | ✅/❌    | ✅/❌    | ✅         | ⚪        |
| Rate limit handling | ✅/❌    | ✅/❌    | Manual     | ✅        |

**Direct SDK Assessment**:
- Complexity: Low (Twitter API v2 is straightforward)
- Libraries: `twitter-api-v2` (npm) is mature and well-documented
- MCP wrapper value: Moderate (abstraction useful but not critical)

### Phase 3: Testing (1-2 hours)

**If promising MCP server exists**, test integration:

```typescript
import { MCPClient } from '@anthropic-ai/sdk';

const twitterMCP = new MCPClient({
  serverUrl: process.env.TWITTER_MCP_URL,
  auth: {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
  }
});

// Test: Post tweet
await twitterMCP.callTool('post_tweet', {
  text: '🤖 Test tweet from AI agent research'
});

// Test: Get user metrics
const metrics = await twitterMCP.callTool('get_user_metrics', {
  username: 'test_agent'
});
```

**If using direct SDK**, prototype:

```typescript
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Post tweet
await client.v2.tweet('🤖 Test tweet from AI agent');

// Get user metrics
const user = await client.v2.userByUsername('test_agent');
console.log(`Followers: ${user.data.public_metrics.followers_count}`);
```

### Phase 4: Decision (1 hour)

**Decision Criteria**:

```
Does production-ready Twitter MCP server exist?
  ├─ YES → Feature complete for our needs?
  │   ├─ YES → ✅ USE EXISTING MCP
  │   └─ NO → Easy to extend?
  │       ├─ YES → 🔧 FORK & EXTEND
  │       └─ NO → Assess alternatives ↓
  └─ NO → Is Twitter API complex?
      ├─ NO (it's simple) → 🔌 DIRECT SDK (twitter-api-v2)
      └─ YES → 🏗️ BUILD CUSTOM MCP WRAPPER
```

**Trade-off Analysis**:

| Approach        | Development Time | Maintenance | Flexibility | Abstraction Value |
|----------------|------------------|-------------|-------------|-------------------|
| Existing MCP    | Low (2-3 days)   | Low         | Medium      | High              |
| Build Custom MCP| High (8-10 days) | Medium      | High        | High              |
| Direct SDK      | Low (1-2 days)   | Low         | High        | Low               |

**Recommendation Template**:
- **Approach**: [Use existing / Build custom / Direct SDK]
- **Rationale**: [Why this approach is best for our use case]
- **Effort**: [X developer-days]
- **Timing**: Milestone 3 (Month 4)

## Deliverables

### 1. Research Summary (`docs/twitter-mcp-research.md`)

**Executive Summary**:
- Ecosystem maturity for Twitter MCP
- Recommended approach with justification
- Twitter API pricing implications
- Development effort estimate

**Findings**:
- MCP servers discovered (if any)
- Direct SDK assessment
- Feature coverage analysis
- Rate limiting considerations

**Recommendation**:
- Selected approach
- Implementation outline
- Authentication setup
- Integration pattern for AI agents

### 2. Code Example

```typescript
// packages/ai-agent-node/src/services/twitter.service.ts

export class TwitterService {
  // Implementation based on recommendation:
  // Option A: MCP client wrapper
  // Option B: Direct twitter-api-v2 usage

  async postUpdate(text: string): Promise<void> {
    // Post tweet about project milestone
  }

  async getFollowerCount(): Promise<number> {
    // Get follower metrics for reputation
  }
}
```

### 3. Update Architecture Document

**Tech Stack Table**:
```markdown
| **Twitter/X Integration** | [mcp-server / twitter-api-v2] | [version] | Social presence for AI personas | [rationale] |
```

**MCP Tool Dependencies**:
```markdown
| **Twitter/X** | [Approach: MCP server / Direct SDK] | Post updates, build social proof |
```

## Success Criteria

- ✅ awesome-mcp-servers reviewed for Twitter integrations
- ✅ Twitter API v2 complexity assessed
- ✅ Clear recommendation (MCP vs. Direct SDK)
- ✅ Effort estimate for Milestone 3
- ✅ No blockers for future implementation

## Timeline

- **Hour 0-2**: Discovery (awesome-mcp-servers, Twitter API v2 review)
- **Hour 2-4**: Evaluation (MCP servers vs. direct SDK trade-offs)
- **Hour 4-5**: Testing (quick prototype of recommended approach)
- **Hour 5-6**: Documentation and architecture update

**Total: 4-6 hours**

## Output Location

- **Research summary**: `docs/twitter-mcp-research.md`
- **Code example**: `docs/examples/twitter-integration.ts`
- **Architecture updates**: `docs/architecture.md` (inline)

## Next Steps After Research

**Milestone 3 (Month 4) Implementation**:
1. Set up Twitter developer accounts for AI personas
2. Implement recommended approach (MCP or SDK)
3. Integrate into AI agent social posting workflow
4. Test automated milestone announcements
