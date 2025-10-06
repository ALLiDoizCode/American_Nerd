# Next Steps

## For UX Expert

**Objective**: Create comprehensive design documentation for American Nerd marketplace covering all 6 expert roles (Analyst, PM, Architect, UX, Developer, QA) plus client journey with focus on trust, transparency, and multi-role fluidity.

**Context Documents**:
- Read: `docs/brief.md` - Original project vision and problem statement
- Read: `docs/prd.md` - This PRD with complete requirements and epic breakdown
- Focus on: "User Interface Design Goals" section for design direction

**Key Design Challenges to Address**:
1. **Multi-Stage Workflow Visualization**: Design clear visual progression showing Planning Phase (Analyst → PM → Architect → UX) and Development Phase (Stories → QA) that doesn't overwhelm first-time users
2. **Trust & Credibility Signals**: Design expert profile cards, bid comparison interfaces, and reputation displays that communicate credibility at a glance
3. **Escrow & Payment Transparency**: Design real-time escrow status widgets showing fiat/crypto funding states, blockchain confirmations, and payment release timing
4. **GitHub Integration UX**: Design how GitHub PR delivery feels native to platform (embedded PR diffs, automated check results display, approval flows)
5. **Multi-Role Context Switching**: Design role switcher UI allowing same user to view platform as Client/PM/Developer/QA with appropriate dashboard variations
6. **Cryptocurrency Wallet Connection**: Design wallet integration flows for Metamask/Phantom that feel professional (not bolted-on), including QR codes for mobile
7. **MCP Parity Indication**: Design web platform to acknowledge MCP server exists without alienating web-only users

**Deliverables Required**:
1. **UX Vision Statement** (500 words): Overall design philosophy, mood board references, key differentiators vs Upwork/Toptal
2. **User Flows (diagrams)**:
   - Client end-to-end: Brief creation → PM selection → Architect selection → UX selection → Developer story assignment → QA approval → Project completion
   - Expert journey: Marketplace browse → Bid submission → Work delivery (GitHub PR) → Payment receipt
   - Multi-role user: Role switching flow
3. **Core Screen Wireframes** (mid-fidelity):
   - Landing page with value prop
   - Brief creation wizard (4-step flow)
   - Marketplace browse (PM/Architect/UX/Developer/QA variations)
   - Bid comparison interface
   - Expert profile (multi-role tabs)
   - Project dashboard (Kanban story board)
   - Escrow funding modal (fiat + crypto options)
   - GitHub PR review interface (embedded diff + approval)
   - Earnings dashboard (multi-currency, crypto wallet integration)
4. **Component Library Specifications**:
   - Expert card (marketplace listings)
   - Bid card (comparison view)
   - Reputation display (stars + metrics)
   - Escrow status widget
   - Workflow progress indicator
   - Role switcher dropdown
   - Wallet connection button states
5. **Interaction Patterns**:
   - Bidding flow (submit → edit → withdraw states)
   - Deliverable approval (approve → request revisions → reject decision tree)
   - Notification system (in-app + email coordination)
6. **Accessibility Specifications**:
   - WCAG AA compliance checklist per screen type
   - Keyboard navigation patterns
   - Screen reader considerations for wallet/payment flows
7. **Responsive Design Breakpoints**:
   - Desktop (1440px+) - primary experience
   - Tablet (768px-1439px) - adapted layouts
   - Mobile (320px-767px) - core workflows only, gentle desktop prompts for complex tasks
8. **Design Assets** (committed to `docs/design/`):
   - Wireframes (PNG/PDF or Figma export)
   - Component specs (markdown tables with props)
   - Color palette (primary, accent, success, warning, neutral swatches)
   - Typography scale (headings, body, captions with font families)
   - Icon needs list (marketplace icons, role icons, status icons)

**Design Constraints from PRD**:
- Desktop-first approach (complex workflows not mobile-optimized)
- Professional indie maker aesthetic (not enterprise, not amateur)
- Trust-focused color palette (blue/teal primary suggested)
- Modern sans-serif typography (Inter, Geist recommended)
- GitHub commits = source of truth for all deliverables

**Success Criteria**:
- All 13 epic workflows have corresponding user flows
- Critical screens (marketplace browse, bid comparison, PR review, payment) wireframed at mid-fidelity
- Component library enables architect to understand UI implementation complexity
- Design handoff enables frontend developers to implement without additional clarification

**Timeline Expectation**: 5-7 days for complete design documentation

---

## For Architect

**Objective**: Create technical architecture document specifying system design, data models, API contracts, infrastructure, security, and implementation roadmap for 13-epic marketplace platform with phased payment rollout (Stripe fiat → Polygon EVM → Solana) and MCP server integration.

**Context Documents**:
- Read: `docs/brief.md` - Business requirements and MVP goals
- Read: `docs/prd.md` - This PRD with all functional/non-functional requirements
- Read: `docs/design.md` - UX Expert's design documentation (once available)
- Focus on: "Technical Assumptions" section for stack decisions and constraints

**Key Architecture Challenges to Address**:
1. **Monorepo Structure & Service Layer**: Design packages/services abstraction ensuring identical business logic for REST API and MCP server (FR26 API parity requirement)
2. **Database Schema Evolution**: Design Prisma schema supporting 6 marketplace types (Analyst, PM, Architect, UX, Developer, QA) with shared opportunity/bid/deliverable patterns - optimize for multi-role reputation queries
3. **GitHub Integration Architecture**: Design webhook processing, PR monitoring, automatic merges, and GitHub Issue creation for stories - handle rate limits and reliability
4. **Crypto Escrow Architecture**: Design non-custodial smart contract escrow for Polygon (Solidity) and Solana (Anchor), transaction monitoring via Alchemy/Helius, gas fee handling
5. **Real-Time Updates**: Design approach for escrow status, blockchain confirmations, QA review notifications - WebSocket vs polling trade-offs
6. **Sequential Story Dependencies**: Design enforcement of Story N+1 blocked until Story N completed - database constraints and marketplace filtering logic
7. **Multi-Currency Payment Orchestration**: Design payment release workflow supporting USD (Stripe), USDC/USDT (Polygon), USDC (Solana) with platform fee ($100 + 5%) calculation
8. **MCP Server Integration**: Design FastMCP tool/resource implementation with shared service layer, API key authentication, stdio vs SSE transport

**Deliverables Required** (follow BMAD Architecture template):
1. **System Architecture Overview**:
   - High-level architecture diagram (Frontend → API → Database → External Services)
   - Monorepo package structure (apps/web, apps/api, apps/mcp-server, packages/*)
   - Service boundaries and responsibilities
   - Data flow diagrams (brief creation, marketplace bidding, payment release workflows)
2. **Technology Stack Decisions**:
   - Frontend: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, RainbowKit, @solana/wallet-adapter
   - Backend: Node 20, Express/Fastify (decide with rationale), TypeScript, Prisma ORM
   - Database: PostgreSQL 15+ (Supabase/Railway), Redis (optional for MVP)
   - Infrastructure: Vercel (frontend), Railway/Render (backend), Alchemy (Polygon RPC), Helius (Solana RPC)
   - Payments: Stripe Connect, Solidity (Hardhat), Anchor (Solana programs)
   - CI/CD: GitHub Actions, Sentry, PostHog
3. **Database Architecture**:
   - Complete Prisma schema for all models (User, Brief, 6×Opportunity types, 6×Bid types, 6×Deliverable types, Story, Escrow, Payment, Reputation, Rating, Badge)
   - Schema migration strategy (one migration per epic vs continuous evolution)
   - Indexing strategy for performance (marketplace queries, reputation aggregation)
   - JSONB usage for flexible fields (brief content, PRD structure, cryptoWallets array)
4. **API Architecture**:
   - REST API endpoint design (route structure, naming conventions)
   - Service layer contracts (BriefService, MarketplaceService interfaces)
   - Authentication/authorization (NextAuth JWT, role-based access control)
   - Error handling patterns (consistent error responses, retry logic)
   - Rate limiting (100 req/min per user per NFR11)
5. **External Integrations**:
   - **GitHub**: OAuth flow, repository creation, PR webhooks, Issue management, automatic merges
   - **Claude API**: Prompt templates, structured output parsing, cost tracking
   - **Stripe Connect**: Onboarding flow, escrow via Payment Intents, marketplace splits
   - **Blockchain**: Smart contract interfaces, transaction monitoring, event listeners, gas strategies
   - **Email**: Resend/SendGrid template system for notifications
6. **Smart Contract Architecture**:
   - Solidity EscrowContract.sol (Polygon): createEscrow, fundEscrow, releasePayment, refund methods
   - Solana escrow_program (Anchor): Instructions and account structures
   - Platform fee collection mechanisms
   - Security considerations (reentrancy guards, access control, auditing needs)
7. **Security Architecture**:
   - Authentication: NextAuth with JWT (15min access, 7-day refresh)
   - Authorization: RBAC helpers, role checks on API routes
   - Data encryption: At-rest (database) and in-transit (TLS 1.3)
   - Smart contract security: OpenZeppelin templates, testnet deployment, audit checklist
   - Secret management: Environment variables, no hardcoded secrets
   - XSS/CSRF protection: React defaults, CSP headers
8. **Scalability & Performance**:
   - Caching strategy (Redis for sessions/rate limiting - optional for MVP)
   - Database connection pooling (Prisma configuration)
   - CDN usage (Vercel edge for static assets)
   - Performance targets: <2s page load (NFR1), <500ms API p95 (NFR1), <10s AI generation (NFR2)
   - Scaling milestones: 100 users (MVP), 1K users (Year 1), 10K users (Year 2)
9. **Testing Strategy**:
   - Unit tests: Jest for service layer (80% coverage target)
   - Integration tests: Supertest for API, MCP SDK for MCP tools
   - Smart contract tests: Hardhat/Anchor (100% coverage for security)
   - E2E tests: Playwright (defer to post-MVP)
   - Manual QA: Founder testing + beta users
10. **Deployment Architecture**:
    - Environments: Development (local), Staging (Railway), Production (Vercel + Railway)
    - CI/CD pipeline: GitHub Actions (lint → typecheck → test → deploy)
    - Database migrations: Automatic on deploy (Prisma migrate deploy)
    - Monitoring: Sentry (errors), PostHog (analytics), Railway logs
    - Health checks: /api/health endpoint
11. **Implementation Roadmap**:
    - Epic 1 dependencies: Turborepo setup, Next.js scaffold, Express API, Prisma + PostgreSQL, NextAuth, GitHub Actions CI/CD
    - Epic-by-epic technical milestones
    - Third-party service setup timing (Stripe account, Alchemy project, smart contract deployment)
    - Risk mitigation for Epic 8 (crypto contracts) - recommend testnet validation before Epic 8 starts
12. **Open Questions for PM**:
    - Express vs Fastify preference? (Express = familiarity, Fastify = performance)
    - Redis required for MVP or defer? (In-memory rate limiting acceptable initially?)
    - Smart contract audit budget/timeline? (Recommend external audit before mainnet)
    - MCP server deployment: Self-hosted npm package only or also cloud-hosted option?

**Architecture Constraints from PRD**:
- Monorepo with shared service layer (packages/services) is mandatory for API/MCP parity
- All expert work delivered via GitHub PRs (no upload flows)
- QA decision is final (FR15) - no dispute resolution beyond QA
- Payment stubbed in Epics 3-7, activated in Epic 8 (design for future activation)
- Sequential story dependencies enforced (Story N+1 blocked until N complete)
- Cryptocurrency support is mandatory (FR13) - not optional

**Success Criteria**:
- Architecture document enables developers to implement Epic 1-2 without clarification
- Database schema supports all 13 epics (no major schema refactor needed mid-project)
- Payment architecture supports phased rollout: Stripe (Epic 9) → Polygon (Epic 10) → Solana (Epic 11)
- Smart contract architecture is audit-ready (security best practices followed)
- Performance targets (NFR1-4) are achievable with proposed stack
- Architect identifies any PRD requirements that are technically infeasible (surface early)

**Timeline Expectation**: 7-10 days for complete architecture documentation

---

**These Next Steps prompts are ready to be used by UX Expert and Architect agents to continue the BMAD workflow.**
