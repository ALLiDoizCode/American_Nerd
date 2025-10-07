# Telegram MCP Server Research

**Date**: January 2025
**Priority**: 🟢 OPTIONAL - Milestone 3+ (Month 4+)
**Recommendation**: **Direct Bot API or node-telegram-bot-api**

---

## Executive Summary

**Finding**: Multiple Telegram MCP servers exist, but the Telegram Bot API is so simple that **direct integration is recommended** over MCP abstraction.

**Recommendation**: Use **Direct Bot API** (no dependencies) or **node-telegram-bot-api** (thin wrapper) for one-way messaging. MCP abstraction adds complexity without significant value for simple notification use cases.

**Development Effort**:
- Direct API: 4-6 hours (recommended)
- node-telegram-bot-api: 6-8 hours
- MCP Server: 1-2 days (unnecessary complexity)

**Priority**: Implement in **Milestone 3+ (Month 4+)** after Twitter/X and Discord are proven successful.

---

## Telegram MCP Ecosystem

### Discovered MCP Servers

| Server | Approach | Maturity | Features | Use Case |
|--------|----------|----------|----------|----------|
| **IQAIcom/mcp-telegram** | Bot API (Telegraf) | ⭐⭐⭐ (3 stars) | Send messages, photos, docs; Rate limiting | AI-powered messaging |
| **guangxiangdebizi/telegram-mcp** | Bot API | 🆕 Early stage (5 commits) | Send, forward, delete messages; Rich formatting | Bot API wrapper |
| **chaindead/telegram-mcp** | MTProto (Go) | 🏠 Local | User account access, dialogs, read status | Personal account automation |
| **chigwell/telegram-mcp** | MTProto (Python/Telethon) | 🏠 Local | Full user account control | Personal automation |
| **sparfenyuk/mcp-telegram** | MTProto | 🔒 Read-only | Personal account access | Read-only user data |

### Key Distinctions

**Bot API Servers** (IQAIcom, guangxiangdebizi):
- Use Telegram Bot API (official)
- Bot token authentication
- Send messages to channels/groups
- ✅ **Suitable for marketplace notifications**

**MTProto Servers** (chaindead, chigwell, sparfenyuk):
- Use MTProto (user account protocol)
- Personal account access
- Manage personal dialogs
- ❌ **Not suitable for marketplace** (requires user accounts, not bots)

---

## Telegram Bot API Analysis

### API Simplicity Assessment

**Complexity**: **Very Low** ⭐⭐⭐⭐⭐

The Telegram Bot API is remarkably simple:
- **Authentication**: Single bot token (from @BotFather)
- **HTTP Method**: Simple POST requests
- **No SDK Required**: Can use native `fetch()`
- **Well Documented**: Clear, comprehensive docs

### Required Operations for Marketplace

| Operation | Bot API Support | Complexity |
|-----------|-----------------|------------|
| Send message to channel | ✅ `sendMessage` | Very Low |
| Markdown formatting | ✅ `parse_mode: 'Markdown'` | Very Low |
| HTML formatting | ✅ `parse_mode: 'HTML'` | Very Low |
| Send photos | ✅ `sendPhoto` | Low |
| Rate limiting | ⚠️ Manual (60 msgs/min per chat) | Low |

**Verdict**: All MVP requirements met with **zero dependencies** using direct HTTP calls.

---

## Approach Comparison

### Trade-off Analysis

| Approach | Dev Time | Dependencies | Complexity | Maintenance | Value of MCP |
|----------|----------|--------------|------------|-------------|--------------|
| **Direct Bot API** | 4-6 hours | None | Very Low | Very Low | N/A |
| **node-telegram-bot-api** | 6-8 hours | 1 npm package | Low | Low | N/A |
| **Telegraf** | 1-2 days | 1 npm package | Medium | Low | N/A (overkill) |
| **Existing MCP** | 1-2 days | MCP server + setup | Medium | Medium | Low (API too simple) |
| **Build Custom MCP** | 6-8 days | MCP server + maintenance | High | High | Low (API too simple) |

### Recommendation: Direct Bot API (No Dependencies)

**Rationale**:
1. **API Simplicity**: Telegram Bot API is already extremely simple (just HTTP POST)
2. **Zero Dependencies**: No npm packages needed (use native `fetch()`)
3. **MCP Adds Complexity**: MCP abstraction provides minimal value for simple one-way messaging
4. **Maintenance**: Fewer moving parts = less to maintain
5. **Performance**: Direct HTTP calls = lowest latency

**When MCP Might Make Sense**:
- Already using MCP for other integrations (consistent interface)
- Need advanced features (webhooks, inline queries, callback buttons)
- Multiple services need Telegram access (share MCP server)

**For American Nerd Marketplace**: None of these apply. ✅ Use Direct API.

---

## Library Comparison (If Not Using Direct API)

### node-telegram-bot-api

**Pros**:
- ✅ Thin wrapper around Bot API
- ✅ 100,000+ weekly downloads
- ✅ TypeScript types available (`@types/node-telegram-bot-api`)
- ✅ Simple API matches Telegram docs
- ✅ Good for programmatic message sending

**Cons**:
- ⚠️ Last updated 1 year ago (but API is stable)
- ⚠️ **Security Alert (April 2025)**: Malicious packages mimicking this library (use exact name: `node-telegram-bot-api`)

**Version**: 0.66.0
**Use Case**: If you want a thin wrapper with TypeScript types

### Telegraf

**Pros**:
- ✅ Modern, actively maintained
- ✅ Excellent TypeScript support (built-in)
- ✅ Full Bot API 7.1 support
- ✅ Middleware architecture
- ✅ Great for interactive bots

**Cons**:
- ❌ **Overkill** for one-way messaging
- ❌ More complex than needed
- ❌ Designed for handling incoming messages (not needed)

**Version**: 4.16.3
**Use Case**: If you need interactive bot with commands/callbacks

---

## Recommended Implementation

### Option 1: Direct Bot API (Recommended)

```typescript
export class TelegramService {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<void> {
    const url = `${this.baseUrl}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${error.description}`);
    }
  }

  async announceStoryCompletion(
    chatId: string,
    storyId: number,
    title: string,
    developerName: string,
    qaScore: number
  ): Promise<void> {
    const message =
      `✅ *Story #${storyId} Completed*\n\n` +
      `${title}\n\n` +
      `👨‍💻 Developer: ${developerName}\n` +
      `🎯 QA Score: ${qaScore}/100\n\n` +
      `🤖 Delivered via AI Agent`;

    await this.sendMessage(chatId, message);
  }
}
```

**Benefits**:
- Zero dependencies
- ~50 lines of code
- Direct, transparent, maintainable
- No abstraction overhead

### Option 2: node-telegram-bot-api (If You Want TypeScript Types)

```typescript
import TelegramBot from 'node-telegram-bot-api';

export class TelegramService {
  private bot: TelegramBot;

  constructor(botToken: string) {
    this.bot = new TelegramBot(botToken, { polling: false });
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<void> {
    await this.bot.sendMessage(chatId, text, {
      parse_mode: parseMode
    });
  }
}
```

**Benefits**:
- TypeScript types
- Slightly cleaner API
- Still very simple

---

## Bot Setup Guide

### Step 1: Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow prompts to name your bot
4. **Save the bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Create Project Channel

1. Create a new Telegram channel (public or private)
2. Add your bot as an administrator
3. Get channel username (e.g., `@american_nerd_project`) or chat ID

### Step 3: Get Chat ID (If Using Private Channel)

For public channels: Use `@channel_name`
For private channels: Get numeric chat ID:

```bash
# Send a message to the channel manually, then:
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Look for `"chat":{"id":-1001234567890}` in the response.

### Step 4: Configure Environment Variables

```bash
# .env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_PROJECT_CHANNEL=@american_nerd_project
# OR
TELEGRAM_PROJECT_CHANNEL=-1001234567890
```

### Step 5: Test Integration

```typescript
const service = new TelegramService(process.env.TELEGRAM_BOT_TOKEN!);
await service.sendMessage(
  process.env.TELEGRAM_PROJECT_CHANNEL!,
  '🤖 Bot connected successfully!'
);
```

---

## Rate Limits

**Telegram Bot API Limits**:
- 30 messages/second globally
- 20 messages/minute per group/channel
- Automatic retry-after headers

**Recommendation**: Implement simple rate limiting in application:

```typescript
class TelegramService {
  private lastMessageTime: Record<string, number> = {};
  private minInterval = 3000; // 3 seconds between messages to same chat

  async sendMessage(chatId: string, text: string): Promise<void> {
    const now = Date.now();
    const lastTime = this.lastMessageTime[chatId] || 0;
    const timeSinceLastMessage = now - lastTime;

    if (timeSinceLastMessage < this.minInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minInterval - timeSinceLastMessage)
      );
    }

    // Send message...
    this.lastMessageTime[chatId] = Date.now();
  }
}
```

---

## Integration Points

### AI Agent Notifications

**When to send Telegram messages**:

1. **Story Completion**: AI agent completes development story
   ```
   ✅ Story #42 Completed
   User Authentication System
   👨‍💻 Developer: AI Agent Alice
   🎯 QA Score: 95/100
   ```

2. **Milestone Progress**: X% of milestone completed
   ```
   📊 Milestone Update: Sprint 3
   Progress: 8/12 stories
   67% complete
   ```

3. **QA Review**: Human QA completes review
   ```
   ✅ QA Review Completed
   Story #42: User Authentication
   Score: 95/100
   Status: Approved for Merge
   ```

4. **Milestone Completion**: All stories merged
   ```
   🎉 Milestone Completed: Sprint 3
   Stories Delivered: 12
   Average QA Score: 93/100
   ```

---

## Implementation Timeline

**When**: Milestone 3+ (Month 4+) or later
**After**: Twitter/X and Discord integrations proven successful

**Rationale**:
- Telegram is lowest priority social integration
- Focus on core marketplace features first
- Validate Twitter/X and Discord patterns before adding third platform

**Implementation Effort**:
- Direct API integration: **4-6 hours**
- Testing: **2-3 hours**
- Documentation: **1-2 hours**
- **Total: ~1 developer-day**

---

## Decision Matrix

```
Does production-ready Telegram MCP server exist?
  ├─ YES (IQAIcom, guangxiangdebizi)
  │   └─ BUT: Bot API is too simple to justify MCP
  │       └─ ✅ USE DIRECT API (simpler, faster, fewer dependencies)
  └─ NO custom MCP needed
      └─ ✅ USE DIRECT API
```

---

## Final Recommendation

### ✅ Recommended Approach: **Direct Bot API**

**Implementation**:
1. Use native `fetch()` for HTTP requests
2. ~50 lines of TypeScript code
3. Zero dependencies
4. Store in: `packages/ai-agent-node/src/services/telegram.service.ts`

**Rationale**:
- Telegram Bot API is already extremely simple
- MCP abstraction adds complexity without value
- Faster development, easier maintenance
- No dependencies to manage

**Alternative**: If TypeScript types are critical, use `node-telegram-bot-api` (thin wrapper, 1 dependency)

**Do NOT Use**:
- ❌ Telegraf (overkill for one-way messaging)
- ❌ Custom MCP server (unnecessary development effort)
- ❌ MTProto-based MCP servers (wrong use case)

---

## Next Steps

**When ready to implement** (Milestone 3+):

1. ✅ Create bot via @BotFather
2. ✅ Create test channel for development
3. ✅ Implement `TelegramService` class (Direct API)
4. ✅ Add environment variables
5. ✅ Integrate into AI agent notification workflow
6. ✅ Test story completion announcements
7. ✅ Deploy to staging environment

**Documentation**:
- ✅ Bot setup guide: Complete (see above)
- ✅ Code examples: `docs/examples/telegram-integration.ts`
- ✅ Architecture update: Pending

---

## Appendix: Full Code Examples

See `docs/examples/telegram-integration.ts` for complete implementations of:

1. ✅ Direct Bot API (recommended)
2. ✅ node-telegram-bot-api wrapper
3. ✅ Telegraf framework (for reference)
4. ✅ MCP server approach (for comparison)

All examples include:
- Story completion announcements
- Milestone progress updates
- Error handling
- TypeScript types
