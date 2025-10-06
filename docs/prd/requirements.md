# Requirements

## Functional

**Planning Phase Marketplaces:**

- FR1: System shall provide AI-assisted brief creation workflow via MCP analyst.txt agent for guided brainstorming and brief generation directly in Claude Desktop/ChatGPT
- FR2: System shall support PM marketplace where product management experts can bid to create comprehensive PRDs from client briefs
- FR3: System shall support Architect marketplace where technical architecture experts can bid to create system specifications from PRDs
- FR4: System shall support UX marketplace where user experience experts can bid to create interface and flow designs from PRD and Architecture documentation
- FR5: System shall track document dependencies and validate handoffs between planning stages (Brief → PRD → Architecture → Design), with experts manually sharding PRD/Architecture docs using BMAD method and committing to GitHub

**Development Phase Marketplaces:**

- FR6: System shall support Developer marketplace where developers can browse and bid on stories (decomposed by PM/Architect experts) following sequential dependency order
- FR7: System shall support QA Reviewer marketplace where quality assurance experts can bid to validate story completion before payment release
- FR8: System shall enforce sequential story dependencies to ensure integration integrity (Story N+1 cannot start until Story N is merged)

**Payment & Escrow:**

- FR9: System shall provide escrow payment holding for each marketplace stage (planning deliverables and development stories) with mandatory multi-currency support (USD, USDC, USDT, ETH, SOL)
- FR10: System shall support fiat payments via Stripe Connect with marketplace split functionality as primary payment method
- FR11: System shall support cryptocurrency payments via wallet-native integration (Metamask for EVM chains, Phantom for Solana) using non-custodial smart contract escrow as mandatory alternative payment method for global expert access
- FR12: System shall implement platform fee structure of $100 + 5% per stage/story applied to all expert marketplace transactions
- FR13: System shall automatically release payment to expert upon QA approval with 48-hour SLA, with QA decision being final and binding for all parties

**GitHub Integration:**

- FR14: System shall integrate with GitHub API to create project repositories, invite collaborators, and create issues for each story
- FR15: System shall track developer work submission via Pull Request webhooks and trigger QA review workflow automatically
- FR16: System shall provide complete commit history and code transparency through GitHub for all development work

**Quality Assurance:**

- FR17: System shall run automated quality checks (linting, security scanning, test coverage, code quality) via GitHub Actions on PR submission
- FR18: System shall provide QA reviewer interface showing brief requirements, code diff, automated scan results, and pass/fail checklist
- FR19: System shall assess both letter AND spirit of requirements using complete BMAD documentation context (PRD, Architecture, Design)

**Reputation & Trust:**

- FR20: System shall maintain multi-dimensional reputation tracking for users across different expert roles (PM, Architect, UX, Developer, QA) with separate ratings
- FR21: System shall display expert profiles with portfolio, completed projects, ratings, on-time delivery rate, and first-pass QA success rate
- FR22: System shall collect post-project ratings from both clients and experts via automated survey workflow

**MCP Server Integration:**

- FR23: System shall provide MCP (Model Context Protocol) server with complete API parity allowing users to create briefs, browse projects, bid, fund escrow, submit work, and check status directly within Claude Desktop or ChatGPT
- FR24: MCP server and REST API shall share identical business logic service layer to guarantee consistent behavior across interfaces
- FR25: System shall support both self-hosted MCP server (npm package) and cloud-hosted MCP server options for user flexibility
- FR26: System shall handle wallet connection for crypto payments via deep link handoff AND QR code display within MCP interface

**Role Fluidity & Multi-Role Support:**

- FR27: System shall allow single user account to participate in multiple expert roles (client on one project, PM on another, developer on third, QA on fourth) with unified profile
- FR28: System shall track and display reputation across all roles independently to support multi-competency portfolio building

## Non-Functional

**Performance:**

- NFR1: Main pages shall load in <2 seconds with API response times <500ms for p95
- NFR2: AI brief generation shall produce initial draft in <10 seconds using Claude API
- NFR3: Blockchain transaction monitoring shall provide real-time updates within 30 seconds of on-chain confirmation via WebSocket (Supabase Realtime) for escrow status and GitHub webhooks for commit/PR events
- NFR4: MCP tool execution shall complete in <3 seconds for p95

**Scalability:**

- NFR5: System shall support 100 concurrent users and 50 projects/month for MVP (0-6 months)
- NFR6: System shall scale to 1,000 concurrent users and 500 projects/month by Year 1
- NFR7: System shall scale to 10,000 concurrent users and 2,000 projects/month by Year 2

**Security:**

- NFR8: System shall use JWT-based authentication with refresh tokens and role-based access control (client, developer, QA reviewer, admin)
- NFR9: System shall encrypt data at rest (database) and in transit (TLS 1.3 only) with environment variable management for secrets
- NFR10: Smart contract escrow shall use audited OpenZeppelin contracts deployed to testnet before mainnet with bug bounty program
- NFR11: System shall implement API rate limiting (100 requests/minute per user) and CORS configuration
- NFR12: System shall use parameterized queries via Prisma ORM to prevent SQL injection attacks
- NFR13: MCP API keys shall be scoped, revocable, and rate-limited with same security standards as REST API

**Reliability:**

- NFR14: System shall maintain 99%+ uptime with <1% error rate on core workflows
- NFR15: Payment release shall occur within 48 hours of QA approval with automated retry on failure
- NFR16: Stripe webhooks and blockchain event monitoring shall be idempotent to handle duplicate events safely

**Usability:**

- NFR17: Platform shall support modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions) with mobile-responsive design
- NFR18: Brief creation workflow shall achieve 90%+ developer acceptance rate without major clarification requests
- NFR19: System shall enable 80%+ of projects to complete without synchronous client-developer calls (async validation)

**Compliance:**

- NFR20: AWS service usage shall aim to stay within free-tier limits where feasible during MVP phase
- NFR21: Platform shall maintain PCI compliance via Stripe (no card number storage) and non-custodial crypto architecture to reduce regulatory burden
- NFR22: Platform shall use standard contractor agreements to maintain independent contractor classification for all experts

**Maintainability:**

- NFR23: Codebase shall use TypeScript across frontend, backend, and MCP server for type safety and shared type definitions
- NFR24: System shall employ monorepo architecture (Turborepo) with shared service layer ensuring single source of truth for business logic
- NFR25: All user-facing API endpoints shall have equivalent MCP tools/resources to maintain interface parity
