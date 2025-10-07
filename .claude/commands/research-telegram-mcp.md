# Telegram MCP Server Research Task

**Command:** `/research-telegram-mcp`
**Priority:** 🟢 OPTIONAL - Milestone 3 or Later
**Duration:** 3-4 hours

---

## Objective

Identify and evaluate existing Telegram MCP servers that AI agents can connect to as MCP clients (using Claude SDK) to determine whether to use existing, build custom wrapper, or integrate Telegram Bot API directly for multi-platform presence and international reach.

## Context

Telegram integration provides:
- Multi-platform presence (complement to Twitter/Discord)
- International audience reach (Telegram popular in crypto/international markets)
- Real-time project updates to community channels
- Alternative communication channel for stakeholders

Required operations:
- Send messages to channels/groups
- (Optional) Reply to messages
- (Optional) Handle commands (if interactive bot needed)

AI agents will act as **MCP clients** using Claude SDK to connect to external Telegram MCP servers.

**Priority Note**: Telegram is **lowest priority** social integration. Consider only after Twitter/X and Discord are functional.

## Research Questions

### Must Answer

1. **Discovery**: What Telegram MCP servers exist in awesome-mcp-servers and broader ecosystem?
2. **Feature Coverage**: Send messages to channels/groups sufficient for MVP?
3. **Bot Token Auth**: Support Telegram bot token authentication?
4. **Recommendation**: Use existing MCP, build custom, or direct Bot API / Telegraf?

### Should Answer

- Rate limit handling?
- Message formatting (Markdown, HTML)?
- Can one bot serve multiple channels?
- Self-hosting feasibility?
- Community adoption level?

## Research Process

### Phase 1: Discovery (1 hour)

1. **Review awesome-mcp-servers**:
   - Filter for Telegram, Messaging, Bot categories
   - Note maturity indicators

2. **Expand search**:
   - GitHub search: "telegram mcp server"
   - NPM search: MCP + Telegram packages
   - Assess Telegram Bot API / Telegraf complexity

3. **Telegram Bot API Assessment**:
   - Review bot token authentication (simple HTTP API)
   - Required methods (sendMessage to channels)
   - Telegraf framework evaluation (Node.js bot framework)

### Phase 2: Evaluation (1 hour)

**If MCP servers found**, create comparison:

| Feature                | Server A | Server B | Bot API | Telegraf | Required? |
|-----------------------|----------|----------|---------|----------|-----------|
| Send message to channel| ✅/❌    | ✅/❌    | ✅      | ✅       | ✅        |
| Markdown formatting    | ✅/❌    | ✅/❌    | ✅      | ✅       | ⚪        |
| Media attachments      | ✅/❌    | ✅/❌    | ✅      | ✅       | ⚪        |
| Reply to messages      | ✅/❌    | ✅/❌    | ✅      | ✅       | ⚪        |
| Handle commands        | ✅/❌    | ✅/❌    | ✅      | ✅       | ⚪        |

**Direct API Assessment**:
- Complexity: **Very Low** (Telegram Bot API is simple HTTP)
- Libraries: `node-telegram-bot-api` or `telegraf` (npm)
- MCP wrapper value: Low (API is already very simple)

**Quick Comparison**:
- **Telegram Bot API** (raw): Simplest, just HTTP POST
- **node-telegram-bot-api**: Thin wrapper, easy to use
- **Telegraf**: Full-featured framework (overkill for one-way messaging)

### Phase 3: Testing (1 hour)

**If promising MCP server exists**, test integration:

```typescript
import { MCPClient } from '@anthropic-ai/sdk';

const telegramMCP = new MCPClient({
  serverUrl: process.env.TELEGRAM_MCP_URL,
  auth: {
    botToken: process.env.TELEGRAM_BOT_TOKEN
  }
});

// Test: Send message to channel
await telegramMCP.callTool('send_message', {
  chatId: '@project_channel',
  text: '🤖 Architecture completed for Project XYZ!'
});
```

**If using direct Bot API** (simplest approach):

```typescript
// Raw HTTP approach (no library needed)
async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

await sendTelegramMessage(
  process.env.TELEGRAM_BOT_TOKEN,
  '@project_channel',
  '🤖 Architecture completed!'
);
```

**If using node-telegram-bot-api**:

```typescript
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Send message
await bot.sendMessage('@project_channel', '🤖 Architecture completed!', {
  parse_mode: 'Markdown'
});

// Send message with formatting
await bot.sendMessage('@project_channel',
  '✅ *Story #42 Merged*\n' +
  'User authentication implemented\n\n' +
  'Developer: AI Agent Alice\n' +
  'QA Score: 95/100',
  { parse_mode: 'Markdown' }
);
```

### Phase 4: Decision (1 hour)

**Decision Criteria**:

```
Does production-ready Telegram MCP server exist?
  ├─ YES → Feature complete?
  │   ├─ YES → ✅ USE EXISTING MCP
  │   └─ NO → Worth extending?
  │       ├─ YES → 🔧 FORK & EXTEND
  │       └─ NO → Use simpler approach ↓
  └─ NO → Telegram API is VERY simple
      └─ 🔌 DIRECT API (raw fetch or node-telegram-bot-api)
```

**Recommendation (Likely)**:
Given Telegram Bot API simplicity, **direct integration** is probably best unless a well-maintained MCP server already exists.

**Trade-off Analysis**:

| Approach        | Development Time | Maintenance | Value of Abstraction |
|----------------|------------------|-------------|----------------------|
| Existing MCP    | Low (1-2 days)   | Low         | Medium               |
| Build Custom MCP| Medium (6-8 days)| Medium      | Low (API too simple) |
| Direct API      | Very Low (4 hours)| Very Low    | N/A (no abstraction) |

**Recommendation Template**:
- **Approach**: [Use existing / Direct Bot API / node-telegram-bot-api]
- **Rationale**: [Telegram API simplicity makes MCP wrapper unnecessary]
- **Effort**: [X developer-days]
- **Timing**: Milestone 3+ (Month 4+) or deferred

## Deliverables

### 1. Research Summary (`docs/telegram-mcp-research.md`)

**Executive Summary**:
- Telegram MCP ecosystem (likely minimal)
- Recommended approach (likely direct API)
- Bot API simplicity assessment
- Development effort estimate (likely <1 day)

**Findings**:
- MCP servers discovered (if any)
- Bot API evaluation (simplicity)
- Library comparison (raw API vs. node-telegram-bot-api vs. telegraf)

**Recommendation**:
- Selected approach
- Implementation outline (probably very simple)
- Bot setup instructions
- Integration pattern

### 2. Code Example

```typescript
// packages/ai-agent-node/src/services/telegram.service.ts

export class TelegramService {
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  }

  async announceStoryCompletion(
    chatId: string,
    storyId: number,
    details: string
  ): Promise<void> {
    const message =
      `✅ *Story #${storyId} Merged*\n\n` +
      `${details}\n\n` +
      `🤖 Completed by AI Agent`;

    await this.sendMessage(chatId, message);
  }
}
```

### 3. Telegram Bot Setup Guide

Document:
- Create bot via @BotFather on Telegram
- Get bot token
- Add bot to channels/groups
- Get channel chat ID (e.g., `@project_channel` or numeric ID)
- Environment variables configuration

### 4. Update Architecture Document

**Tech Stack Table**:
```markdown
| **Telegram Integration** | [mcp-server / node-telegram-bot-api / direct API] | [version] | Multi-platform presence | [rationale] |
```

**MCP Tool Dependencies**:
```markdown
| **Telegram** | [Approach: Direct Bot API / node-telegram-bot-api] | Multi-platform presence |
```

## Success Criteria

- ✅ awesome-mcp-servers reviewed for Telegram integrations
- ✅ Telegram Bot API simplicity confirmed
- ✅ Clear recommendation (likely direct API due to simplicity)
- ✅ Effort estimate (likely <1 day)
- ✅ Decision on priority (implement now vs. defer)

## Timeline

- **Hour 0-1**: Discovery (awesome-mcp-servers, Bot API review)
- **Hour 1-2**: Evaluation (MCP vs. direct API trade-offs)
- **Hour 2-3**: Testing (quick prototype, probably direct API)
- **Hour 3-4**: Documentation and architecture update

**Total: 3-4 hours**

## Output Location

- **Research summary**: `docs/telegram-mcp-research.md`
- **Code example**: `docs/examples/telegram-integration.ts`
- **Bot setup guide**: `docs/guides/telegram-bot-setup.md`
- **Architecture updates**: `docs/architecture.md` (inline)

## Next Steps After Research

**Milestone 3+ (Month 4+) Implementation** (if prioritized):
1. Create Telegram bot via @BotFather
2. Set up test channel for development
3. Implement recommended approach (likely direct API)
4. Integrate into AI agent notification workflow
5. Test automated milestone announcements

**Alternative**: Defer Telegram integration until after Twitter/X and Discord are proven successful.
