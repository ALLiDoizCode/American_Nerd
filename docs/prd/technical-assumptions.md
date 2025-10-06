# Technical Assumptions

## Repository Structure

**Monorepo** - Using Turborepo for unified codebase management with the following structure:

```
apps/
  web/          - Next.js frontend
  api/          - Express REST API backend
  mcp-server/   - MCP server (Model Context Protocol)
packages/
  services/     - Shared business logic (CRITICAL: ensures API/MCP parity)
  database/     - Prisma schema and client
  types/        - Shared TypeScript types
  ui/           - Shared component library
  contracts/    - Smart contracts (Solidity for EVM, Anchor for Solana)
```

**Rationale:** Monorepo enables single source of truth for business logic (packages/services), type safety across all interfaces, and atomic commits updating both REST API and MCP server simultaneously. This architecture is essential for maintaining complete API parity between web platform and MCP server as specified in FR26.

## Service Architecture

**Monolithic backend** for MVP - Single Express application containing all business logic

**Post-MVP microservices candidates:**
- Brief generation service (Claude API integration with rate limiting)
- Payment/escrow service (Stripe + blockchain monitoring requiring high reliability)
- QA automation service (GitHub Actions integration and webhook processing)

**Rationale:** Start monolithic to maximize development speed (12-16 weeks solo founder timeline). Split into microservices when scaling pain emerges (likely around Year 1 at 500 projects/month per NFR6). Shared service layer (packages/services) makes future extraction straightforward.

## Testing Requirements

**Multi-layer testing strategy:**

**Unit testing** (Required for MVP):
- Business logic in packages/services (Jest)
- Target: 80%+ code coverage for service layer
- Run on every commit via GitHub Actions

**Integration testing** (Required for MVP):
- API endpoints (Supertest)
- MCP server tools (using MCP SDK test utilities)
- Database operations (Prisma with test database)
- Target: All critical paths covered (brief creation, escrow funding, payment release)

**Smart contract testing** (Required for MVP):
- Solidity contracts (Hardhat test framework)
- Solana programs (Anchor test framework)
- Target: 100% coverage - security-critical code
- Deploy to testnets (Goerli/Sepolia for Ethereum, Devnet for Solana) before mainnet

**End-to-end testing** (Post-MVP):
- Playwright for web platform
- Defer until post-MVP to maintain development velocity

**Manual QA** (Required for MVP):
- Founder testing of complete workflows
- Beta tester validation (recruited experts and clients)
- Focus on multi-stage workflow handoffs and crypto payment flows

**Rationale:** Testing investments prioritized by risk - smart contracts get 100% coverage due to financial risk, service layer gets 80% for reliability, E2E deferred as lower ROI for MVP timeline.

## Additional Technical Assumptions and Requests

**Frontend Stack:**
- Framework: Next.js 14+ with App Router (React 18+)
- Language: TypeScript (strict mode enabled)
- Styling: Tailwind CSS + shadcn/ui component library
- State management: React Context + Zustand for global state
- Forms: React Hook Form + Zod validation
- Web3 wallet integration: RainbowKit (EVM chains), @solana/wallet-adapter-react (Solana)

**Backend Stack:**
- Runtime: Node.js 20 LTS
- Framework: Express.js (familiarity) or Fastify (performance - decide during arch phase)
- Language: TypeScript
- ORM: Prisma (TypeScript-native, migration management, JSONB support for flexible brief storage)
- API style: REST (GraphQL deferred - adds complexity without clear MVP benefit)

**Database:**
- Primary: PostgreSQL 15+ hosted on Supabase or Railway
- JSONB columns for flexible brief/PRD storage (evolving schema)
- Full-text search using PostgreSQL built-in (ElasticSearch deferred)
- Redis for session management and rate limiting (optional for MVP - can use in-memory initially)

**Infrastructure & Hosting:**
- Frontend: Vercel (Next.js optimization, edge network, zero-config deploys)
- Backend + Database: Railway or Render (Heroku-like DX, better pricing than Heroku)
- File storage: Cloudflare R2 (S3-compatible, no egress fees) for project assets/screenshots
- CDN: Vercel edge network (included with frontend hosting)
- CI/CD: GitHub Actions (free for public repos, affordable for private)
- Monitoring: Sentry (error tracking), PostHog or Mixpanel (analytics)

**Blockchain Infrastructure:**
- **EVM chains (Ethereum/Polygon)**:
  - RPC provider: Alchemy (generous free tier, reliable WebSockets for transaction monitoring)
  - Smart contracts: Solidity, Hardhat for development, OpenZeppelin audited escrow templates
  - Wallet libraries: RainbowKit (handles Metamask, WalletConnect, Coinbase Wallet)
  - Primary network: Polygon (lower gas fees ~$0.01-0.05 vs Ethereum L1 $5-50)
- **Solana**:
  - RPC provider: Helius or QuickNode
  - Programs: Anchor framework for Solana program development
  - Wallet library: @solana/wallet-adapter (handles Phantom, Solflare, etc.)
  - Gas fees: ~$0.0001 per transaction (negligible, platform can subsidize if needed)

**Third-Party Services:**
- **Payments**: Stripe Connect (fiat escrow, marketplace splits)
- **AI**: Claude API (Anthropic) for brief generation, PRD creation assistance
- **Email**: Resend (modern API, good deliverability) or SendGrid
- **Authentication**: NextAuth.js (supports OAuth, magic links, handles GitHub OAuth for repo access)
- **Analytics**: PostHog (self-hostable option, good free tier) or Mixpanel
- **Error tracking**: Sentry

**MCP Server Specific:**
- **Framework**: FastMCP (decorator-based API, faster development than official SDK)
- **Abstraction layer**: Custom adapter pattern to enable framework swapping if needed
- **Transport**: stdio for Claude Desktop, SSE for web clients
- **Deployment**: Published as npm package (@american-nerd/mcp-server) for self-hosting + cloud-hosted option at mcp.platform.com
- **API parity enforcement**: Shared service layer (packages/services) ensures identical behavior with REST API

**Security Practices:**
- Environment variables for all secrets (never committed), managed via Vercel/Railway
- JWT tokens with short expiry (15min access, 7-day refresh)
- API rate limiting: 100 requests/minute per user (prevent abuse)
- Smart contract security: Use audited OpenZeppelin templates, deploy to testnets first, consider bug bounty post-MVP
- SQL injection prevention: Parameterized queries via Prisma (ORM handles this)
- XSS prevention: React escapes by default, Content Security Policy headers configured
- Crypto key management: Non-custodial architecture (users control wallets, platform never holds private keys)

**Cost Management:**
- MVP infrastructure target: $200-500/month total
- Free tier maximization: Vercel, Railway/Supabase, Alchemy, Helius have generous free tiers
- Claude API budget: ~$100-200/month (monitor usage during beta, optimize prompts if needed)
- Gas fee strategy: Users pay gas for funding escrow (client) and claiming payment (developer) - platform doesn't subsidize except Solana (<$0.01)

**Development Timeline Assumption:**
- Solo founder full-time: 14-18 weeks
- Shared service layer + MCP server adds 3-4 weeks vs web-only platform, but essential for zero-friction goal
