# 7. External APIs

## 7.1 GitHub API

- **Purpose:** Repository creation, PR management, OAuth authentication, webhook handling
- **Documentation:** https://docs.github.com/en/rest
- **Base URL:** `https://api.github.com`
- **Authentication:** GitHub App JWT + Installation tokens OR OAuth tokens
- **Rate Limits:** 5,000 requests/hour per authenticated user, 15,000 for GitHub App

**Key Endpoints Used:**
- `POST /orgs/{org}/repos` - Create repository in american-nerd-projects org
- `GET /repos/{owner}/{repo}/pulls/{number}` - Get PR details
- `POST /repos/{owner}/{repo}/pulls/{number}/merge` - Auto-merge PR
- `POST /repos/{owner}/{repo}/issues` - Create story issues
- `POST /repos/{owner}/{repo}/collaborators/{username}` - Add client as collaborator
- `GET /user` - Get authenticated user info (OAuth)

**Integration Notes:**
- Use Octokit SDK for type-safe API access
- Implement retry logic with exponential backoff (GitHub API can be flaky)
- Cache GitHub usernames to reduce API calls
- Webhook signature validation for security

## 7.2 Alchemy API (Polygon)

- **Purpose:** Ethereum/Polygon RPC node for smart contract deployment and interaction
- **Documentation:** https://docs.alchemy.com/
- **Base URL:** `https://polygon-mainnet.g.alchemy.com/v2/{API_KEY}`
- **Authentication:** API key in URL
- **Rate Limits:** 330 compute units/second on free tier, higher on paid plans

**Key Endpoints Used:**
- `eth_sendRawTransaction` - Deploy contract or send transaction
- `eth_call` - Read contract state (escrow status)
- `eth_getLogs` - Get contract events (Deposited, Released)
- WebSocket for real-time event subscriptions

**Integration Notes:**
- Use ethers.js for contract interaction
- Subscribe to Escrow events via WebSocket for real-time payment tracking
- Implement gas price estimation to avoid failed transactions
- Use Hardhat forking for local testing against mainnet state

## 7.4 Helius API (Solana)

- **Purpose:** Solana RPC node with enhanced APIs for program deployment, monitoring, and webhooks
- **Documentation:** https://docs.helius.dev/
- **Base URL:** `https://mainnet.helius-rpc.com/?api-key={API_KEY}`
- **Authentication:** API key in query parameter
- **Rate Limits:** Generous (varies by plan, >100 requests/second on paid tiers)

**Key Endpoints Used:**
- `sendTransaction` - Deploy program or send transaction
- `getAccountInfo` - Read escrow account state
- `getProgramAccounts` - Query all escrows for a program
- Enhanced `getTransaction` - Detailed transaction history with parsed data
- WebSocket + Webhooks for real-time transaction confirmations

**Integration Notes:**
- Use @solana/web3.js + Anchor client for program interaction
- Helius provides compression, priority fee suggestions, and webhook support
- Use commitment level "confirmed" for balance updates, "finalized" for escrow release
- Implement webhook handlers for escrow state changes (funding, release events)
- Helius enhanced APIs reduce need for manual parsing

## 7.5 Supabase Storage API

- **Purpose:** Store uploaded documents (briefs, PRDs, architecture docs, wireframes)
- **Documentation:** https://supabase.com/docs/guides/storage
- **Base URL:** `https://{project-ref}.supabase.co/storage/v1`
- **Authentication:** JWT token from Supabase Auth
- **Rate Limits:** Generous, throttled by database connections

**Key Operations:**
- `POST /object/{bucket}/{path}` - Upload file
- `GET /object/{bucket}/{path}` - Download file
- `DELETE /object/{bucket}/{path}` - Delete file
- `POST /object/sign/{bucket}/{path}` - Generate signed URL (expiring link)

**Integration Notes:**
- Bucket structure: `projects/{projectId}/{documentType}/{filename}`
- Set RLS (Row Level Security) policies to restrict access by project ownership
- Use signed URLs for temporary public access (e.g., sharing PRD with expert)
- Automatic image optimization for avatars and previews

## 7.5.1 Supabase Realtime API (WebSocket)

- **Purpose:** Real-time escrow status updates and GitHub activity notifications (NFR3)
- **Documentation:** https://supabase.com/docs/guides/realtime
- **Transport:** WebSocket
- **Authentication:** JWT token passed during connection handshake
- **Rate Limits:** 100 concurrent connections per project (free tier)

**Real-Time Channels:**

1. **Escrow Status Channel**
```typescript
// Frontend subscription
const channel = supabase
  .channel(`escrow:${escrowId}`)
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'escrows',
      filter: `id=eq.${escrowId}`
    },
    (payload) => {
      // payload.new contains updated escrow record
      updateEscrowUI(payload.new)
    }
  )
  .subscribe()

// Event structure
{
  type: 'postgres_changes',
  event: 'UPDATE',
  schema: 'public',
  table: 'escrows',
  new: {
    id: 'esc_123',
    status: 'FUNDED' | 'RELEASED' | 'REFUNDED',
    amount: '1000',
    currency: 'USDC',
    txHash: '0x...',
    updatedAt: '2025-10-06T...'
  },
  old: { status: 'PENDING' }
}
```

2. **GitHub Activity Channel**
```typescript
// Frontend subscription for project activity
const channel = supabase
  .channel(`project:${projectId}:activity`)
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'project_events',
      filter: `projectId=eq.${projectId}`
    },
    (payload) => {
      // payload.new contains new activity event
      addActivityToFeed(payload.new)
    }
  )
  .subscribe()

// Event structure
{
  type: 'postgres_changes',
  event: 'INSERT',
  schema: 'public',
  table: 'project_events',
  new: {
    id: 'evt_456',
    projectId: 'proj_123',
    type: 'PR_OPENED' | 'COMMIT_PUSHED' | 'STORY_STATUS_CHANGED',
    payload: {
      prNumber: 42,
      prUrl: 'https://github.com/...',
      author: 'dev_username',
      title: 'Implement user authentication'
    },
    createdAt: '2025-10-06T...'
  }
}
```

**Implementation Notes:**
- Frontend subscribes to channels on page mount, unsubscribes on unmount
- Backend publishes events by updating Postgres records (Supabase automatically broadcasts via WebSocket)
- Fallback: If WebSocket connection drops, frontend polls every 30s until reconnected
- Use Supabase presence for "user is viewing this project" indicators (future enhancement)
- Real-time updates ensure <30s latency for escrow status changes (NFR3 requirement)

## 7.6 BMAD GitHub Workflow Integration

**Purpose:** Synchronize BMAD story lifecycle status from GitHub repository to platform database via webhooks

**BMAD Story Lifecycle:**
```
/BMad:tasks:create-next-story → Status: Draft
    ↓
/BMad:tasks:validate-next-story → Status: Approved (validation score ≥ 8)
    ↓
/BMad:agents:dev (James) → Status: InProgress → Ready for Review
    ↓
/BMad:agents:qa (Quinn) → Creates gate file in docs/qa/gates/
    ├─→ Gate: FAIL/CONCERNS → Back to InProgress (/BMad:tasks:apply-qa-fixes)
    └─→ Gate: PASS → Status: Done (auto-merge, payment release)
```

**GitHub Webhook Events Monitored:**
- `push` - Detects story file modifications in `docs/stories/` folder
- `pull_request.opened` - Developer submits PR for story implementation
- `pull_request.synchronized` - Developer pushes fixes after QA review
- `pull_request.closed` (merged) - Confirms story merge to main

**Story Status Parsing:**
- Platform reads story file from GitHub: `docs/stories/{epic}.{story}.{title}.md`
- Extracts status from markdown: `**Status:** Ready for Review`
- Maps GitHub status to enum:
  - `Draft` → `DRAFT`
  - `Approved` → `APPROVED`
  - `InProgress` → `IN_PROGRESS`
  - `Ready for Review` or `Review` → `READY_FOR_REVIEW`
  - `Done` → `DONE`
  - `Blocked` → `BLOCKED`

**QA Gate File Monitoring:**
- Platform monitors `docs/qa/gates/{epic}.{story}-{slug}.yml` for QA decisions
- Gate schema:
  ```yaml
  schema: 1
  story: '{epic}.{story}'
  gate: PASS|FAIL|CONCERNS|WAIVED
  status_reason: 'Explanation'
  top_issues: []  # Array of { id, severity, finding, suggested_action }
  ```
- Gate status synced to `Story.qaGateStatus` field

**Marketplace Automation:**
- `Status: Approved` → Create Developer marketplace opportunity
- `Status: Ready for Review` → Create QA marketplace opportunity
- `Status: Done` → Release escrow, revoke GitHub access, close opportunities

**Authentication:**
- Webhook signature validation using `GITHUB_WEBHOOK_SECRET`
- Webhook requests verified via HMAC-SHA256 signature in `X-Hub-Signature-256` header

**Idempotency:**
- Webhook handler checks `X-GitHub-Delivery` header for duplicate prevention
- Status updates only applied if different from current database value

**Error Handling:**
- Invalid story file format → Log error, do not update status
- Missing story in database → Create story record from file
- Webhook signature mismatch → Return 403 Forbidden

---
