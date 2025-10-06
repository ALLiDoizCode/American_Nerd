# 3. Tech Stack

This is the **definitive technology selection** for the entire project. All development must use these exact versions.

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3.x | Type-safe frontend development | Prevents runtime errors, excellent IDE support, industry standard |
| **Frontend Framework** | Next.js | 14.2.x | React framework with App Router | Server Components, streaming, best-in-class DX, Vercel integration |
| **UI Component Library** | shadcn-ui | Latest | Accessible, customizable components | Built on Radix UI, Tailwind-based, copy-paste approach (no npm bloat) |
| **State Management** | React Context + Zustand | 4.5.x | Client state management | Context for auth/theme, Zustand for complex state (lighter than Redux) |
| **Backend Language** | TypeScript | 5.3.x | Type-safe backend development | Shared types with frontend, easier monorepo management |
| **Backend Framework** | Express.js | 4.19.x | REST API server | Mature, flexible, extensive middleware ecosystem |
| **API Style** | REST | OpenAPI 3.0 | HTTP API design | Simpler than GraphQL for MVP, OpenAPI enables auto-generated clients |
| **Database** | PostgreSQL | 15.x | Primary data store | JSONB support, full-text search, robust ACID compliance |
| **ORM** | Prisma | 5.20.x | Type-safe database client | Auto-generated types, migrations, excellent DX |
| **Cache** | Redis (Upstash) | 7.x | Rate limiting, session storage | Serverless-friendly, low latency, pub/sub support |
| **File Storage** | Supabase Storage | Latest | Document uploads | Integrated with Supabase auth, S3-compatible |
| **Authentication** | Supabase Auth + GitHub OAuth | Latest | User authentication | Built-in GitHub OAuth, JWT tokens, API key management |
| **Frontend Testing** | Vitest | 1.6.x | Component and unit tests | Faster than Jest, Vite-native, Jest-compatible API |
| **Backend Testing** | Jest | 29.x | Service and API tests | Industry standard, extensive matchers, snapshot testing |
| **E2E Testing** | Playwright | 1.47.x | End-to-end browser tests | Fast, reliable, multi-browser, deferred to post-MVP per PRD |
| **Build Tool** | Turborepo | 2.1.x | Monorepo orchestration | Caching, parallel builds, task dependencies |
| **Bundler** | Vite (via Next.js/Vitest) | 5.x | Fast development builds | HMR, native ESM, optimized for development |
| **Smart Contract (EVM)** | Solidity | 0.8.20 | Polygon escrow contracts | Industry standard, OpenZeppelin compatibility |
| **Smart Contract (Solana)** | Rust + Anchor | 0.30.x | Solana escrow programs | Best-in-class Solana framework |
| **Smart Contract Testing (EVM)** | Hardhat | 2.22.x | Solidity testing and deployment | Mature tooling, TypeScript support, forking for tests |
| **Smart Contract Testing (Solana)** | Anchor Test + Solana Test Validator | 1.18.x | Solana program testing | Official Solana testing framework |
| **Blockchain RPC (Polygon)** | Alchemy | Latest | Ethereum/Polygon RPC node | Reliable, enhanced APIs, event subscriptions |
| **Blockchain RPC (Solana)** | Helius | Latest | Solana RPC node | High performance, WebSocket support, compression |
| **Wallet Integration (EVM)** | Metamask SDK + WalletConnect | Latest | EVM wallet connections | Non-custodial, multi-wallet support |
| **Wallet Integration (Solana)** | Phantom Wallet Adapter | Latest | Solana wallet connections | Official Phantom integration |
| **IaC Tool** | GitHub Actions + Vercel CLI | Latest | Infrastructure as code | Native GitHub integration, simple YAML configs |
| **CI/CD** | GitHub Actions | Latest | Automated testing and deployment | Free for public repos, extensive marketplace |
| **Monitoring** | Datadog | Latest | APM, logs, traces, RUM | Unified observability, distributed tracing |
| **Logging** | Winston | 3.14.x | Structured logging | JSON logs, multiple transports, Datadog integration |
| **Error Tracking** | Sentry | Latest | Frontend error tracking | Source maps, session replay, user context |
| **CSS Framework** | Tailwind CSS | 3.4.x | Utility-first styling | Rapid development, small bundle, excellent DX |
| **Form Validation** | Zod | 3.23.x | Runtime schema validation | Type inference, composable, works with react-hook-form |
| **HTTP Client (Frontend)** | ky | 1.7.x | Fetch wrapper | Simpler than axios, modern, retry logic built-in |
| **HTTP Client (Backend)** | node-fetch + Octokit | Latest | External API calls | Standard fetch for REST, Octokit for GitHub API |
| **MCP Framework** | FastMCP | Latest | Model Context Protocol server | Exposes tools, prompts, resources for AI assistants |
| **GitHub Integration** | Octokit | 3.x | GitHub API client | Official GitHub SDK, TypeScript support |
| **Analytics Service** | Datadog Metrics | Latest | Custom business metrics | Track opportunities, bids, escrow volume |
| **Search Service** | PostgreSQL Full-Text Search | 15.x | Search opportunities, experts | Built-in, no external service needed for MVP |

**Additional Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `ethers` | 6.13.x | Ethereum contract interaction |
| `@solana/web3.js` | 1.95.x | Solana contract interaction |
| `@coral-xyz/anchor` | 0.30.x | Anchor client for Solana |
| `react-hook-form` | 7.53.x | Form state management |
| `@radix-ui/*` | Latest | Headless UI primitives (via shadcn-ui) |
| `lucide-react` | Latest | Icon library |
| `sonner` | Latest | Toast notifications |
| `hot-shots` | Latest | StatsD client for metrics |
| `dd-trace` | Latest | Datadog APM tracer |

---
