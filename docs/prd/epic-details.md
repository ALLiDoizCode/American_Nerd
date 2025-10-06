# Epic Details

## Epic 1: Foundation & Core Infrastructure

**Expanded Goal:** Establish monorepo project infrastructure with Next.js frontend, Express backend, PostgreSQL database, authentication system, and basic platform landing page. Deploy to production hosting (Vercel + Railway) with CI/CD pipeline. Deliver a functioning "platform shell" where users can sign up, authenticate, and view a simple dashboard, demonstrating end-to-end deployment capability and establishing logging/monitoring foundation for all future epics.

### Story 1.1: Monorepo Setup & Project Scaffolding

**As a** developer,
**I want** a Turborepo monorepo with Next.js frontend, Express backend, and shared packages,
**so that** I have a unified codebase with type-safe shared logic for API/MCP parity.

**Acceptance Criteria:**
1. Turborepo initialized with workspace structure: `apps/web`, `apps/api`, `packages/services`, `packages/database`, `packages/types`, `packages/ui`
2. Next.js 14+ with App Router configured in `apps/web` with TypeScript strict mode
3. Express.js API configured in `apps/api` with TypeScript
4. Shared TypeScript types package (`packages/types`) importable by all apps
5. Package manager (pnpm or yarn workspaces) configured with proper dependency hoisting
6. Development scripts (`turbo dev`, `turbo build`, `turbo test`) working across all workspaces
7. ESLint and Prettier configured with shared rules across monorepo
8. Git repository initialized with `.gitignore` excluding `node_modules`, `.env`, build artifacts

### Story 1.2: Database Setup & Prisma ORM Integration

**As a** developer,
**I want** PostgreSQL database with Prisma ORM configured,
**so that** I have type-safe database access and migration management from the start.

**Acceptance Criteria:**
1. PostgreSQL 15+ database hosted on Railway or Supabase with connection established
2. Prisma ORM installed in `packages/database` with initial schema file
3. Database schema includes `User` model with fields: id, email, name, passwordHash, role (enum: CLIENT, PM, ARCHITECT, UX, DEVELOPER, QA, ADMIN), createdAt, updatedAt
4. Prisma Client generated and exportable from `packages/database`
5. Migration system working (`prisma migrate dev`, `prisma migrate deploy`)
6. Seed script created for development data (test users across all roles)
7. Database connection pooling configured for production
8. All apps (`apps/web`, `apps/api`) can import and use Prisma Client

### Story 1.3: Authentication System with NextAuth.js

**As a** user,
**I want** to sign up and log in securely,
**so that** I can access the platform with role-based permissions.

**Acceptance Criteria:**
1. NextAuth.js configured in `apps/web` with email/password provider
2. JWT-based session management with 15-minute access tokens and 7-day refresh tokens
3. User registration flow: email, password, name, select initial role (client or expert)
4. Login flow with email/password authentication
5. Password hashing using bcrypt with minimum 10 salt rounds
6. Protected routes redirect to login if unauthenticated
7. User session available in Next.js pages and API routes
8. Role-based access control (RBAC) helper functions created (e.g., `requireRole(['PM', 'ADMIN'])`)
9. Logout functionality clears session and redirects to landing page
10. Error handling for invalid credentials, duplicate email registration

### Story 1.4: Landing Page & Basic Dashboard UI

**As a** visitor,
**I want** to see a professional landing page explaining the platform,
**so that** I understand the value proposition and can sign up.

**Acceptance Criteria:**
1. Landing page (`/`) with hero section explaining multi-stage expert marketplace concept
2. "How It Works" section showing Planning Phase (Analyst → PM → Architect → UX) and Development Phase (Dev → QA) workflow
3. "Sign Up" and "Log In" call-to-action buttons in navigation
4. Footer with copyright, links to (placeholder) Terms of Service and Privacy Policy
5. Responsive design using Tailwind CSS working on desktop (1440px+), tablet (768px), mobile (375px)
6. shadcn/ui component library installed and basic components (Button, Card, Input) demonstrated
7. Authenticated users redirected to dashboard after login
8. Basic dashboard (`/dashboard`) showing "Welcome [User Name]" and user's current role
9. Navigation menu includes: Dashboard, Profile, Settings (all routes stubbed)
10. Professional indie maker aesthetic applied: clean typography (Inter or Geist font), trust-focused color palette (blue/teal primary)

### Story 1.5: CI/CD Pipeline & Production Deployment

**As a** developer,
**I want** automated testing and deployment on every push to main,
**so that** changes are validated and deployed to production safely.

**Acceptance Criteria:**
1. GitHub Actions workflow created for CI: runs on every push and pull request
2. CI workflow steps: install dependencies (turbo), run linting (ESLint), run type checking (tsc), run unit tests (Jest - even if no tests yet, setup verified)
3. Frontend (`apps/web`) deployed to Vercel with automatic deployments on main branch push
4. Backend (`apps/api`) deployed to Railway or Render with automatic deployments on main branch push
5. Environment variables configured in Vercel and Railway (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
6. Production database migrations run automatically on deploy (Railway/Render deploy script)
7. Custom domain configured (e.g., `app.americannerd.dev`) pointing to Vercel frontend
8. Health check endpoint `/api/health` returns 200 OK with API version and database connection status
9. Deployment status badges added to README.md
10. Production environment verified: can sign up, log in, and access dashboard

### Story 1.6: Logging, Monitoring & Error Tracking

**As a** developer,
**I want** centralized logging and error tracking from day one,
**so that** I can debug issues and monitor platform health across all future epics.

**Acceptance Criteria:**
1. Sentry integrated for error tracking in both frontend (`apps/web`) and backend (`apps/api`)
2. Sentry configured to capture unhandled errors, API errors, and database errors
3. Source maps uploaded to Sentry for readable stack traces in production
4. PostHog or Mixpanel integrated for product analytics (user signups, logins, page views tracked)
5. Structured logging library (Winston or Pino) configured in backend with log levels (error, warn, info, debug)
6. Logs include request IDs for tracing requests across services
7. Production logs viewable in Railway/Render dashboard
8. Alert configured in Sentry for error rate spikes (>10 errors/minute)
9. Dashboard showing basic metrics: total users, daily active users, API error rate
10. No secrets (API keys, database credentials) logged in any environment

## Epic 2: Brief Creation & AI-Assisted Planning (MCP-Only)

**Expanded Goal:** Enable clients to create comprehensive project briefs using MCP analyst.txt agent workflow for guided brainstorming and brief generation directly in Claude Desktop/ChatGPT. Deliver MCP server with analyst agent integration that generates structured project documentation (problem statement, target users, MVP scope, success metrics) validated to achieve 90%+ expert acceptance rate. This epic validates the core platform value proposition: quality AI-generated briefs via conversational elicitation that eliminate communication overhead. **No web-based brief creation wizard** - brief creation is exclusively via MCP to drive MCP adoption and provide superior guided experience.

### Story 2.1: Brief Data Model & GitHub Integration

**As a** developer,
**I want** database schema for briefs and GitHub repository management,
**so that** briefs can be stored, versioned, and delivered via GitHub.

**Acceptance Criteria:**
1. Prisma schema extended with `Brief` model: id, userId, projectName, problemStatement, targetUsers, goals, mvpScope, constraints, status (DRAFT, PUBLISHED, FUNDED), createdAt, updatedAt
2. Prisma schema includes `GitHubRepo` model: id, briefId, repoUrl, repoName, ownerGithubUsername, platformHasAccess (boolean), createdAt
3. Brief sections stored as JSONB fields for flexibility (problemStatement, targetUsers, goals as structured JSON)
4. Database migrations created and tested
5. Service layer (`packages/services/BriefService.ts`) created with methods: createBrief(), updateBrief(), publishBrief(), getBrief()
6. GitHub OAuth app registered with repo creation permissions
7. GitHub API integration utility (`packages/services/GitHubService.ts`) with methods: createRepository(), inviteCollaborator(), createIssue()
8. Test coverage: BriefService unit tests (create, update, publish workflows)

### Story 2.2: MCP Server Setup & Analyst Agent Integration

**As a** client,
**I want** to create project briefs using the analyst agent directly in Claude Desktop,
**so that** I get guided brainstorming and brief generation without switching to a web UI.

**Acceptance Criteria:**
1. MCP server package created: `apps/mcp-server` using FastMCP framework
2. Analyst agent (`analyst.txt`) integrated as MCP prompt resource
3. MCP tools exposed:
   - `create_project` - Creates new project and GitHub repo
   - `create_brief` - Saves brief content to database and GitHub
   - `get_project_brief` - Retrieves existing brief
   - `update_brief` - Updates brief sections
   - `publish_brief` - Marks brief as PUBLISHED and creates PM opportunity
4. MCP resources exposed:
   - `prompt://analyst` - Loads analyst.txt agent persona
   - `project://{id}/brief` - Retrieves brief content for given project
5. MCP server authenticates users via API key stored in database (`User.mcpApiKey`)
6. All MCP tools call shared service layer (`packages/services/BriefService`, `GitHubService`)
7. MCP server deployed as both npm package (`@american-nerd/mcp-server`) and cloud-hosted endpoint
8. Test coverage: MCP tool integration tests using FastMCP test utilities
9. Documentation: README with MCP server installation instructions for Claude Desktop

### Story 2.3: Analyst Agent Brief Creation Workflow

**As a** client using Claude Desktop,
**I want** the analyst agent to guide me through creating a comprehensive brief,
**so that** I have a structured, high-quality project brief without manual formatting.

**Acceptance Criteria:**
1. User loads analyst agent via MCP: Claude Desktop automatically loads `prompt://analyst`
2. User types: `*create-project-brief` (analyst command)
3. Analyst (Mary) begins interactive elicitation:
   - "What problem are you solving?"
   - "Who are your target users?"
   - "What's your MVP scope?"
   - "What constraints do you have (budget, timeline, technical)?"
   - "What defines success?"
4. Analyst generates structured brief following BMAD project-brief-tmpl.yaml format
5. Brief saved via MCP tool: `create_brief({ projectName, sections: {...} })`
6. Backend creates GitHub repo via GitHubService
7. Backend commits `docs/brief.md` to repo
8. Analyst responds: "Brief created! View on GitHub: [repo URL]. Type `*doc-out` to see full brief."
9. User can iterate: `*elicit` for advanced requirement gathering, edit sections manually in GitHub
10. User publishes: Type `*publish` or analyst auto-publishes after confirmation

### Story 2.4: Brief Storage & GitHub Delivery (MCP Backend)

**As a** client,
**I want** my brief automatically saved and committed to GitHub via MCP,
**so that** I have version control and can share it with experts.

**Acceptance Criteria:**
1. MCP `create_brief` tool triggers GitHub repository creation via GitHubService
2. Repository naming convention: `{userId}-{projectName-slugified}` (e.g., `user123-marketplace-mvp`)
3. Repository created as private, client's GitHub account added as admin collaborator
4. Brief content formatted as markdown and committed to `docs/brief.md`
5. Initial commit message: "Add project brief created via MCP analyst agent"
6. Brief status updated to DRAFT in database (user must explicitly publish)
7. GitHub repository URL stored in `GitHubRepo` table linked to brief
8. Error handling: If GitHub API fails, brief saved as DRAFT with MCP response: "Brief saved locally. GitHub integration failed - please reconnect GitHub account via web dashboard."
9. MCP response includes: brief ID, GitHub repo URL, next steps ("Use `*publish` to make available to PM marketplace")
10. Subsequent edits via `update_brief` tool create new commits to GitHub

### Story 2.5: Brief Listing & Management (Web Dashboard - View Only)

**As a** client,
**I want** to view my created briefs on the web dashboard,
**so that** I can see project status and GitHub links without returning to Claude Desktop.

**Acceptance Criteria:**
1. Route `/briefs` shows list of user's briefs (DRAFT, PUBLISHED, FUNDED status)
2. Brief card displays: projectName, status badge, createdAt, "View on GitHub" button
3. Filter by status: All, Draft, Published, Funded (client-side filtering)
4. "Create New Brief" button shows instructions: "Open Claude Desktop and load analyst agent via MCP"
5. Brief detail page `/briefs/[id]` shows:
   - Complete brief content with markdown rendering (read-only)
   - GitHub repository link
   - "Edit on GitHub" button (opens GitHub repo)
   - "Continue to PM Marketplace" button (only for PUBLISHED status)
6. No edit functionality in web UI - all edits happen via MCP or GitHub directly
7. "Delete Brief" button (only for DRAFT status) with confirmation dialog
8. Empty state: If no briefs exist, show "Create your first project brief via Claude Desktop" with MCP setup instructions
9. Responsive design: Brief listing works on all device sizes
10. Prominently display: "Briefs are created via MCP analyst agent in Claude Desktop. This dashboard is for viewing only."

### Story 2.6: MCP Brief Quality Metrics & Validation

**As a** platform,
**I want** to track MCP brief creation metrics,
**so that** I can validate 90%+ expert acceptance rate goal and measure MCP adoption.

**Acceptance Criteria:**
1. Database schema extended: `BriefMetrics` model with fields: briefId, createdViaMcp (boolean), mcpSessionDurationMinutes, userIterationCount, expertAccepted (nullable boolean), expertFeedback (text)
2. Metrics captured during MCP brief creation: session duration (analyst agent active time), iteration count (how many times user edited/refined)
3. Analytics event tracked: "brief_created_mcp" with properties (sessionDuration, iterationCount, sectionCount, wordCount)
4. Admin dashboard route `/admin/metrics` showing: total briefs created, % created via MCP, avg session duration
5. Quality validation placeholder: `expertAccepted` field will be populated in Epic 3 when PM experts review briefs
6. Brief quality score algorithm: Calculated based on completeness (all sections filled), length (min 500 words), structure (proper markdown formatting)
7. MCP adoption tracking: Track % of users who install MCP server vs web-only users
8. Test coverage: Metrics calculation functions unit tested
9. PostHog dashboard configured to track brief funnel: MCP Installed → Brief Started → Brief Published

## Epic 3: Analyst Marketplace

**Expanded Goal:** Implement optional Analyst marketplace where brainstorming and market research experts bid on pre-PM engagements to help clients validate ideas. Enable marketplace listing, expert bidding, client selection, GitHub-based deliverable submission, and escrow-protected payments. This marketplace validates the multi-stage expert workflow pattern that will be replicated for PM, Architect, and UX marketplaces.

### Story 3.1: Analyst Marketplace Data Models

**As a** developer,
**I want** database schema for Analyst marketplace opportunities and bids,
**so that** clients can post requests and analysts can bid.

**Acceptance Criteria:**
1. Prisma schema extended with `AnalystOpportunity` model: id, briefId, clientId, title, description, budget, currency (USD|USDC|USDT|ETH|SOL), status (OPEN, ASSIGNED, IN_PROGRESS, DELIVERED, COMPLETED), createdAt, updatedAt
2. Prisma schema includes `AnalystBid` model: id, opportunityId, analystId (User.id), proposedPrice, currency, estimatedDays, coverLetter, status (PENDING, ACCEPTED, REJECTED), submittedAt
3. Prisma schema includes `AnalystDeliverable` model: id, opportunityId, analystId, githubPrUrl, submittedAt, approvedAt, rejectedAt, feedback
4. Foreign key constraints: opportunityId → AnalystOpportunity.id, analystId → User.id (where User.role includes ANALYST)
5. Database migrations created and applied
6. Service layer created: `packages/services/AnalystMarketplaceService.ts` with methods: createOpportunity(), submitBid(), acceptBid(), submitDeliverable(), approveDeliverable()
7. Test coverage: Service layer unit tests for all methods

### Story 3.2: Post Analyst Opportunity (Client Flow)

**As a** client,
**I want** to post my brief to the Analyst marketplace and describe what research help I need,
**so that** analysts can bid on helping me validate my idea.

**Acceptance Criteria:**
1. Route `/briefs/[id]/request-analyst` accessible to brief owner with PUBLISHED status
2. Form fields: title (auto-populated from brief.projectName), description (what research/analysis needed), budget (number input), currency selection (dropdown: USD, USDC, USDT, ETH, SOL)
3. Default description template: "Help me validate this idea through market research, competitive analysis, and opportunity assessment."
4. "Post to Analyst Marketplace" button creates AnalystOpportunity with status OPEN
5. Brief status remains PUBLISHED (Analyst stage is optional)
6. Success message: "Posted to Analyst marketplace! Analysts will submit bids within 24-48 hours."
7. Client redirected to `/opportunities/analyst/[id]` to view posted opportunity
8. Opportunity visible in client's dashboard under "Active Requests"
9. Email notification sent to client confirming opportunity posted (using Resend/SendGrid)
10. Validation: Budget must be ≥ $100 (minimum viable analyst engagement)

### Story 3.3: Analyst Marketplace Browse & Filter

**As an** analyst,
**I want** to browse available opportunities and filter by criteria,
**so that** I can find projects matching my expertise.

**Acceptance Criteria:**
1. Route `/marketplace/analyst` accessible to users with ANALYST role
2. Opportunity cards display: title, client name (anonymized as "Client #123" until bid accepted), budget, currency, brief excerpt (first 200 chars), postedAt, "View Details" button
3. Filter controls: Budget range (slider), Currency (checkboxes), Posted date (Last 24h, Last week, All time)
4. Sort options: Newest first, Highest budget, Lowest budget
5. Pagination: 20 opportunities per page
6. Empty state: "No opportunities match your filters. Try adjusting criteria."
7. "View Details" navigates to `/marketplace/analyst/[id]` showing full opportunity description and brief link
8. Opportunity detail page includes: Full brief content (GitHub embed or markdown render), client's description of research needs, "Submit Bid" button
9. Opportunities with status IN_PROGRESS or COMPLETED hidden from browse (show only OPEN)
10. Analytics tracked: "analyst_marketplace_view", "analyst_opportunity_click"

### Story 3.4: Submit Analyst Bid

**As an** analyst,
**I want** to submit a bid with my proposed price and approach,
**so that** clients can evaluate my offer.

**Acceptance Criteria:**
1. "Submit Bid" button on opportunity detail page opens bid form modal
2. Form fields: proposedPrice (number), currency (pre-filled from opportunity, editable), estimatedDays (number 1-14), coverLetter (textarea, max 1000 chars)
3. Cover letter placeholder text: "Explain your approach to this research, relevant experience, and what the client will receive."
4. Validation: proposedPrice must be ≤ opportunity.budget × 1.5 (prevent absurd overbidding), estimatedDays must be 1-14
5. "Submit Bid" creates AnalystBid with status PENDING
6. Success message: "Bid submitted! The client will review and may contact you."
7. Analyst redirected to `/my-bids` showing all submitted bids with statuses
8. Email notification sent to client: "New bid received on your Analyst opportunity"
9. Analysts cannot submit multiple bids on same opportunity (validation: unique constraint on opportunityId + analystId)
10. Platform fee preview shown: "$100 + 5% platform fee will be deducted upon completion"

### Story 3.5: Review & Accept Bids (Client Flow)

**As a** client,
**I want** to review analyst bids and select the best one,
**so that** I can proceed with research assistance.

**Acceptance Criteria:**
1. Route `/opportunities/analyst/[id]/bids` shows all bids for client's opportunity
2. Bid cards display: Analyst name, analyst profile link, proposedPrice, currency, estimatedDays, coverLetter, "View Profile" and "Accept Bid" buttons
3. Analyst profile page shows: name, bio, portfolio links, past Analyst projects completed, average rating, skills/expertise tags
4. "Accept Bid" button triggers confirmation modal: "You will create an escrow payment of {proposedPrice} {currency}. Proceed?"
5. Upon confirmation, AnalystBid status updated to ACCEPTED, all other bids updated to REJECTED
6. AnalystOpportunity status updated to ASSIGNED
7. Analyst invited as collaborator to GitHub repository
8. Email notifications sent: Accepted analyst receives "Your bid was accepted!", Rejected analysts receive "Client selected another analyst"
9. Opportunity removed from `/marketplace/analyst` browse (no longer OPEN)
10. Client dashboard shows opportunity status as "Assigned to [Analyst Name]" with "View Progress" link

### Story 3.6: Analyst Work Delivery via GitHub PR

**As an** analyst,
**I want** to submit my research deliverables via GitHub Pull Request,
**so that** work is versioned and transparent.

**Acceptance Criteria:**
1. Analyst has GitHub collaborator access to project repository (granted in Story 3.5)
2. Analyst creates branch (e.g., `analyst-research-{analystId}`) and commits deliverables to `docs/analyst-report.md`
3. Analyst creates Pull Request with title: "Analyst Research Deliverables - {AnalystName}"
4. PR description template includes: Summary of research, Key findings, Competitive analysis, Market opportunity assessment, Recommendations
5. Platform webhook receives PR creation event (GitHub webhook configured)
6. `AnalystDeliverable` record created automatically: opportunityId, analystId, githubPrUrl, submittedAt
7. Client receives email notification: "Analyst has submitted deliverables - Review on GitHub"
8. Client views PR at `/opportunities/analyst/[id]/review` showing embedded GitHub PR diff
9. Platform UI shows "Approve Deliverables" and "Request Revisions" buttons
10. "Request Revisions" adds comment to GitHub PR and sends notification to analyst

### Story 3.7: Client Approval & Payment Release (Stubbed Escrow)

**As a** client,
**I want** to approve analyst deliverables and release payment,
**so that** the analyst is compensated for their work.

**Acceptance Criteria:**
1. "Approve Deliverables" button on `/opportunities/analyst/[id]/review` triggers approval flow
2. Confirmation modal: "This will merge the PR and release payment of {amount} {currency} to {analystName}. This action is final."
3. Upon confirmation: GitHub PR merged automatically via GitHub API, AnalystDeliverable.approvedAt timestamp set, AnalystOpportunity status updated to COMPLETED
4. Payment release stubbed for now: Database record created in `PaymentRelease` table (id, opportunityType: 'ANALYST', opportunityId, recipientId, amount, currency, status: 'PENDING_ESCROW', releasedAt: null)
5. Note added to UI: "Payment processing will be implemented in Epic 8. For MVP, manual payment coordination via platform."
6. Success message: "Deliverables approved! Payment will be released once escrow system is active."
7. Analyst dashboard shows opportunity status: "Completed - Payment pending escrow implementation"
8. Client brief status updated: Brief can now proceed to PM marketplace (Story 3.8)
9. Post-project rating prompt sent to both client and analyst (rating system implemented in Epic 9)
10. Analytics tracked: "analyst_deliverable_approved", "analyst_opportunity_completed"

### Story 3.8: Navigate to PM Marketplace After Analyst Stage

**As a** client,
**I want** to proceed from Analyst research to PM marketplace,
**so that** I can continue the BMAD workflow.

**Acceptance Criteria:**
1. After analyst deliverables approved, client brief detail page shows "Next Step: Create PRD with PM Expert" button
2. Button navigates to `/briefs/[id]/request-pm` (will be implemented in Epic 4)
3. Button disabled if analyst opportunity still IN_PROGRESS with tooltip: "Complete analyst research first"
4. If client skipped Analyst stage, "Request PM" button available immediately on published brief
5. Brief detail page shows workflow progress: Brief Created ✓ → Analyst Research ✓ → PM (next) → Architect → UX → Development
6. Navigation breadcrumbs reflect current stage
7. Client can access all completed deliverables: `/briefs/[id]/deliverables` shows links to analyst report, PRD (future), architecture (future), design (future)

### Story 3.9: Analyst Earnings Dashboard

**As an** analyst,
**I want** to track my completed projects and earnings,
**so that** I can monitor my income from the platform.

**Acceptance Criteria:**
1. Route `/earnings/analyst` accessible to users with ANALYST role
2. Summary cards: Total earnings (all time), Pending payments, Completed projects, Average rating
3. Earnings table: Project name, Client, Deliverable date, Amount, Currency, Status (Pending/Released), "View Project" link
4. Filter by: Date range, Currency, Status
5. Export to CSV functionality for accounting purposes
6. Each row links to project detail showing brief, deliverables, client feedback
7. Pending payments show estimated release date: "Payment pending escrow system (Epic 8 implementation)"
8. Earnings displayed in user's preferred currency (currency preference setting)
9. Analytics tracked: "analyst_earnings_view"
10. Empty state: "No completed projects yet. Browse opportunities to get started!"

## Epic 4: PM Marketplace

**Expanded Goal:** Implement Product Manager marketplace where PM experts bid to create comprehensive PRDs from client briefs. Enable marketplace listing, PM bidding, client selection, GitHub-based PRD delivery via Pull Request, and escrow-protected payments. PRDs must include goals, requirements (functional/non-functional), epic breakdown, and stories with acceptance criteria following BMAD methodology.

### Story 4.1: PM Marketplace Data Models

**As a** developer,
**I want** database schema for PM marketplace opportunities and bids,
**so that** clients can request PRDs and PMs can bid.

**Acceptance Criteria:**
1. Prisma schema extended with `PMOpportunity` model: id, briefId, clientId, title, description, budget, currency, status (OPEN, ASSIGNED, IN_PROGRESS, DELIVERED, COMPLETED), createdAt, updatedAt
2. Prisma schema includes `PMBid` model: id, opportunityId, pmId (User.id where role=PM), proposedPrice, currency, estimatedDays, coverLetter, status (PENDING, ACCEPTED, REJECTED), submittedAt
3. Prisma schema includes `PMDeliverable` model: id, opportunityId, pmId, githubPrUrl, prdFilePath (e.g., docs/prd.md), submittedAt, approvedAt, rejectedAt, feedback
4. Foreign key constraints and indexes on opportunityId, pmId for query performance
5. Database migrations created and applied
6. Service layer: `packages/services/PMMarketplaceService.ts` with methods mirroring AnalystMarketplaceService pattern
7. Test coverage: Unit tests for all service methods

### Story 4.2: Post PM Opportunity (Client Flow)

**As a** client,
**I want** to request a PM expert to create my PRD,
**so that** I get a professional product requirements document.

**Acceptance Criteria:**
1. Route `/briefs/[id]/request-pm` accessible after brief published (and optionally after analyst stage completed)
2. Form auto-populates: title from brief.projectName, default description: "Create comprehensive PRD following BMAD methodology including goals, functional/non-functional requirements, epic breakdown, and user stories."
3. Budget field with suggestion: "$800-$1500 typical range for PM engagement"
4. Multi-currency support: USD, USDC, USDT, ETH, SOL dropdown
5. "Post to PM Marketplace" creates PMOpportunity with status OPEN
6. Client dashboard shows PM request under "Planning Phase Progress"
7. Email notification to client + in-app notification
8. Validation: Brief must be PUBLISHED status, cannot have active PM opportunity already
9. Analytics: "pm_opportunity_created" event tracked
10. Success redirect to `/opportunities/pm/[id]` showing posted opportunity

### Story 4.3: PM Marketplace Browse & Bid Submission

**As a** PM expert,
**I want** to browse PM opportunities and submit bids,
**so that** I can earn by creating PRDs.

**Acceptance Criteria:**
1. Route `/marketplace/pm` accessible to users with PM role
2. Opportunity cards: title, brief excerpt, budget range, currency, client industry/domain (if available), postedAt
3. Filters: Budget range, Currency, Posted date, Brief complexity (inferred from brief word count: Simple <1000 words, Medium 1000-3000, Complex >3000)
4. PM can view full brief on GitHub before bidding (read-only access)
5. Bid form fields: proposedPrice, currency, estimatedDays (3-14 typical), coverLetter (max 1500 chars)
6. Cover letter should explain: PRD approach, relevant experience, what sections will be included, timeline breakdown
7. Platform fee preview: "$100 + 5% = ${calculateFee(proposedPrice)}"
8. Bid submission creates PMBid record, sends email to client
9. PM cannot bid on same opportunity twice (unique constraint)
10. PMs can withdraw bids before acceptance with "Withdraw Bid" button (sets status to WITHDRAWN)

### Story 4.4: Client Reviews Bids & Selects PM

**As a** client,
**I want** to compare PM bids and select the best expert,
**so that** I get quality PRD creation.

**Acceptance Criteria:**
1. Route `/opportunities/pm/[id]/bids` shows all submitted bids
2. Bid comparison table: PM name, Price, Est. days, Rating, Past PRDs created, Cover letter preview, "View Full Bid" button
3. PM profile pages show: bio, PM-specific portfolio (past PRDs if public), rating, testimonials, skills (SaaS, B2B, Consumer, etc.)
4. "Accept Bid" triggers escrow funding flow (stubbed in this epic, functional in Epic 8)
5. Confirmation modal: "Accepting this bid will create escrow for {amount} {currency}. The PM will create your PRD and deliver via GitHub."
6. Upon acceptance: PMBid status → ACCEPTED, other bids → REJECTED, PMOpportunity status → ASSIGNED
7. PM invited as GitHub collaborator with write access
8. Email notifications: Accepted PM gets detailed brief + GitHub access, Rejected PMs notified
9. Client can request clarification before accepting: "Ask Question" button sends message to specific PM
10. If no bids received within 48 hours, client gets notification: "No bids yet. Consider adjusting budget or brief clarity."

### Story 4.5: PM Creates PRD Using BMAD Methodology

**As a** PM expert,
**I want** guidance on creating BMAD-compliant PRDs,
**so that** my deliverables meet platform quality standards.

**Acceptance Criteria:**
1. PM dashboard shows accepted opportunity with "Start PRD" button
2. "Start PRD" provides PRD template following BMAD structure: Goals, Background Context, Requirements (FR/NFR), UI Design Goals, Technical Assumptions, Epic List, Epic Details (Stories + Acceptance Criteria)
3. PRD template available as downloadable markdown file or in-browser editor
4. Platform provides PRD creation checklist: ✓ Goals defined, ✓ FRs listed, ✓ NFRs listed, ✓ Epics identified, ✓ Stories written, ✓ Acceptance criteria per story
5. PM can use Claude AI assistance (same Claude API integration as brief creation) to help draft PRD sections - optional, PM's choice
6. PRD quality validation: Automated check for minimum sections (Goals, Requirements, Epics), minimum word count (1500 words), proper markdown formatting
7. In-progress PRDs saved as drafts with auto-save every 2 minutes
8. PM can preview PRD rendering before submission
9. Platform documentation `/docs/pm-guidelines` explains BMAD PRD standards with examples
10. PM receives in-app tips: "Good PRDs include 5-10 functional requirements" when FR section is focused

### Story 4.6: PM Submits PRD via GitHub Pull Request

**As a** PM expert,
**I want** to submit my completed PRD via GitHub,
**so that** the client can review and approve.

**Acceptance Criteria:**
1. PM commits PRD to branch `pm-prd-{pmId}` at path `docs/prd.md`
2. PRD includes front matter metadata: author (PM name), version (1.0), created date, brief link
3. PM creates Pull Request with title: "PRD: {ProjectName} - Created by {PMName}"
4. PR description auto-populated with checklist: Goals ✓, Requirements ✓, Epics ✓, Stories ✓
5. Platform webhook captures PR creation, creates PMDeliverable record
6. Automated quality checks run via GitHub Actions: markdown linting, spell check, section completeness validation
7. Quality check results posted as PR comment: "✓ All sections present, ✓ 45 functional requirements, ✓ 8 epics, ✓ 32 stories"
8. Client notified via email + in-app: "PM has delivered your PRD - Review now"
9. Client views PRD at `/opportunities/pm/[id]/review` with embedded GitHub PR viewer
10. Platform UI shows "Approve PRD", "Request Revisions", "Reject & Select Another PM" buttons

### Story 4.7: Client Approves PRD & Payment Release (Stubbed)

**As a** client,
**I want** to approve the PRD and release payment to the PM,
**so that** I can proceed to architecture phase.

**Acceptance Criteria:**
1. "Approve PRD" button merges GitHub PR and updates PMDeliverable.approvedAt
2. PMOpportunity status → COMPLETED
3. Payment release stubbed: PaymentRelease record created with status PENDING_ESCROW (actual payment in Epic 8)
4. Success message: "PRD approved! Payment will be released via escrow. Proceed to Architect marketplace."
5. Brief workflow status updates: PM stage marked complete ✓
6. "Request Revisions" adds GitHub PR comment with client feedback, notifies PM, sets PMDeliverable status to REVISION_REQUESTED
7. PM can submit revised PRD by pushing new commits to same PR branch
8. "Reject & Select Another PM" returns opportunity to OPEN status, current PM bid → REJECTED, client can select different PM from existing bids
9. Post-approval, client sees "Next Step: Find Architect" button navigating to `/briefs/[id]/request-architect`
10. Analytics: "pm_prd_approved", "pm_opportunity_completed" events tracked

### Story 4.8: PM Earnings & Portfolio Building

**As a** PM expert,
**I want** my completed PRDs to build my portfolio and earnings history,
**so that** I can attract more clients.

**Acceptance Criteria:**
1. Route `/earnings/pm` shows PM-specific earnings dashboard
2. Completed PRDs appear in PM profile under "Portfolio" with project names, client ratings, PRD complexity
3. PM can toggle PRD visibility: Public (visible to potential clients), Private (hidden)
4. Public PRDs show sanitized version: Project name (client approval required), PRD excerpt, epic count, story count, client testimonial
5. Earnings table: Project, Client, Delivered date, Amount, Currency, Rating received, Status
6. PM profile shows statistics: Total PRDs created, Average rating, Typical turnaround time, Success rate (approved on first submission %)
7. Badges earned: "5 PRDs Created", "10 PRDs Created", "5-Star PM (10+ ratings)", "Fast Delivery (avg <7 days)"
8. CSV export for earnings tracking
9. Empty state: "Complete your first PM engagement to start building your portfolio!"
10. Analytics: "pm_earnings_view", "pm_portfolio_view" tracked

### Story 4.9: PRD Quality Feedback Loop

**As a** platform,
**I want** to track PRD quality metrics,
**so that** I can validate 90%+ acceptance rate goal and improve PM guidance.

**Acceptance Criteria:**
1. Database schema: `PRDMetrics` model with fields: prdId (PMDeliverable.id), wordCount, sectionCount, functionalReqCount, nonFunctionalReqCount, epicCount, storyCount, acceptedOnFirstSubmission (boolean), revisionsRequested, clientRating, createdAt
2. Metrics automatically calculated when PRD submitted via GitHub PR webhook
3. Admin dashboard `/admin/prd-quality` showing: Avg acceptance rate, Avg revisions requested, Avg client rating, Common missing sections
4. PM-specific quality scores visible to platform admins for vetting/training purposes
5. If PRD acceptance rate <70% for a PM after 3+ projects, platform sends coaching email with improvement suggestions
6. Quality metrics feed into PM search ranking: Higher quality PMs surface first in `/marketplace/pm` browse
7. Client satisfaction survey sent 24 hours after PRD approval: "Rate PRD quality 1-5 stars", "What could be improved?"
8. PRD templates updated based on common feedback themes (quarterly review)
9. Top-performing PMs featured on landing page: "Featured PM Experts"
10. Analytics dashboard tracks: PRD acceptance rate trend over time, correlation between PM experience and quality

## Epic 5: Architect Marketplace

**Expanded Goal:** Implement Architect marketplace where technical architecture experts bid to create system specifications from approved PRDs. Enable architecture document delivery covering tech stack, data models, API design, security, scalability, and deployment architecture via GitHub Pull Requests with escrow-protected payments.

### Story 5.1: Architect Marketplace Data Models & Service Layer

**As a** developer,
**I want** Architect marketplace schema and services,
**so that** architects can bid on creating technical architecture documents.

**Acceptance Criteria:**
1. Prisma schema: `ArchitectOpportunity`, `ArchitectBid`, `ArchitectDeliverable` models (pattern matching PM/Analyst marketplaces)
2. ArchitectDeliverable includes: githubPrUrl, archFilePath (docs/architecture.md), techStack (JSONB array), submittedAt, approvedAt
3. Service layer: `packages/services/ArchitectMarketplaceService.ts`
4. Foreign keys: opportunityId → ArchitectOpportunity, architectId → User (role=ARCHITECT), prdId → PMDeliverable (architecture built from PRD)
5. Database migrations and test coverage

### Story 5.2-5.9: Architect Marketplace Complete Workflow

**Summary of Stories** (following exact pattern from Epic 4 PM Marketplace):
- **Story 5.2**: Post Architect Opportunity - Client requests architecture from `/briefs/[id]/request-architect` after PRD approved, budget suggestion $500-$1200
- **Story 5.3**: Architect Browse & Bid - Route `/marketplace/architect`, filters by tech stack preference (React, Node, Python, etc.), bid submission with tech approach
- **Story 5.4**: Client Reviews Architect Bids - Compare architects by tech expertise, past projects, ratings
- **Story 5.5**: Architect Creates Architecture Doc - BMAD architecture template: Tech stack, System architecture, Data models, API design, Security, Scalability, Infrastructure/deployment, Testing strategy
- **Story 5.6**: Architect Submits via GitHub PR - Commits to `docs/architecture.md`, includes diagrams (Mermaid/PlantUML), automated validation checks tech stack completeness
- **Story 5.7**: Client Approves Architecture - Merge PR, stubbed payment release, proceed to UX marketplace button
- **Story 5.8**: Architect Earnings & Portfolio - Portfolio shows tech stacks used, system complexity, client ratings
- **Story 5.9**: Architecture Quality Metrics - Track completeness (all BMAD sections present), diagram quality, tech stack appropriateness for project

**Acceptance Criteria** (applies to all 5.2-5.9 stories combined):
1. Complete architecture workflow from posting → bidding → selection → delivery → approval functional
2. Architecture documents must include: Repository structure, Service architecture, Database schema, API endpoints, Authentication/authorization, Infrastructure diagram
3. Tech stack validation: Architect's proposed stack must align with PRD's technical assumptions section
4. Automated checks validate: Mermaid diagrams render correctly, All BMAD architecture sections present, No placeholder content ("TBD", "TODO")
5. Client can request specific tech stack in opportunity posting (e.g., "Must use Next.js + PostgreSQL")
6. Architect profile shows specializations: Frontend, Backend, Full-stack, DevOps, Mobile, with tech stack tags
7. Post-approval, workflow shows: Brief ✓ → PM ✓ → Architect ✓ → UX (next) → Development
8. Architecture doc versioning supported: Architects can submit v2 if requirements change
9. Payment stubbed with note: "Architecture payment pending Epic 9 escrow"
10. Analytics: "architect_opportunity_completed", "architecture_approved" tracked

## Epic 6: UX Marketplace

**Expanded Goal:** Implement UX marketplace where user experience experts bid to create design documentation from PRD + Architecture. Enable UX deliverables including user flows, wireframes, component specifications, interaction patterns, and accessibility requirements via GitHub Pull Requests with escrow-protected payments.

### Story 6.1: UX Marketplace Data Models & Service Layer

**As a** developer,
**I want** UX marketplace schema and services,
**so that** UX experts can bid on creating design documentation.

**Acceptance Criteria:**
1. Prisma schema: `UXOpportunity`, `UXBid`, `UXDeliverable` models
2. UXDeliverable includes: githubPrUrl, designFilePath (docs/design.md), figmaLink (optional), wireframesPath, submittedAt, approvedAt
3. Service layer: `packages/services/UXMarketplaceService.ts`
4. Foreign keys: prdId → PMDeliverable, archId → ArchitectDeliverable (UX builds on both PRD and Architecture)
5. Database migrations and test coverage

### Story 6.2-6.9: UX Marketplace Complete Workflow

**Summary of Stories** (following PM/Architect marketplace pattern):
- **Story 6.2**: Post UX Opportunity - Client requests UX design from `/briefs/[id]/request-ux` after Architecture approved, budget suggestion $800-$1500
- **Story 6.3**: UX Expert Browse & Bid - Route `/marketplace/ux`, filters by design specialization (Web, Mobile, SaaS, Consumer), bid includes design approach
- **Story 6.4**: Client Reviews UX Bids - Compare UX experts by portfolio (Figma/Dribbble links), design style, ratings
- **Story 6.5**: UX Expert Creates Design Docs - BMAD design template: UX vision, User flows, Wireframes/mockups, Component library, Interaction patterns, Accessibility specs, Responsive breakpoints
- **Story 6.6**: UX Expert Submits via GitHub PR - Commits `docs/design.md` + wireframes (PNG/PDF) to `docs/design/`, optional Figma link in PR description
- **Story 6.7**: Client Approves Design - Merge PR, stubbed payment, proceed to Development marketplace button
- **Story 6.8**: UX Expert Earnings & Portfolio - Portfolio showcases design work (with client permission), design complexity, ratings
- **Story 6.9**: Design Quality Metrics - Track completeness, wireframe coverage (all core screens), accessibility compliance

**Acceptance Criteria** (applies to all 6.2-6.9 stories combined):
1. Complete UX workflow functional from posting to approval
2. UX documents must include: Overall UX vision, Key user flows (diagrams), Core screen wireframes, Component specifications, Interaction patterns, Accessibility requirements (WCAG level), Responsive design breakpoints
3. Wireframes can be: Hand-drawn scans, Figma exports (PNG), Interactive Figma prototypes (link), Balsamiq/Sketch files
4. Automated validation: All core screens from PRD's "Core Screens" section have corresponding wireframes
5. UX experts can optionally include Figma/Sketch files in GitHub repo or share view-only links
6. Client can specify design fidelity in opportunity: Low-fidelity (sketches OK), Mid-fidelity (wireframes), High-fidelity (mockups with colors/typography)
7. UX profile shows design specializations: Web responsive, Mobile native, SaaS dashboards, Consumer apps, Accessibility-first
8. Post-approval, workflow complete for planning phase: Brief ✓ → PM ✓ → Architect ✓ → UX ✓ → Development (ready)
9. Platform provides design asset guidelines: Max file size 10MB per image, Supported formats PNG/JPG/PDF/Figma
10. Analytics: "ux_opportunity_completed", "design_approved", "planning_phase_complete" tracked

## Epic 7: Developer Marketplace & Story Implementation

**Expanded Goal:** Implement AI-assisted story decomposition from approved PRDs into GitHub Issues, Developer marketplace for browsing and bidding on stories, client story assignment workflow, and GitHub PR-based code delivery with automated quality checks. Enable developers to find appropriate work, implement functionality following acceptance criteria, and submit work for QA review.

### Story 7.1: Story Decomposition & GitHub Issue Creation

**As a** platform,
**I want** to decompose approved PRDs into individual stories as GitHub issues,
**so that** developers can bid on and implement specific functionality.

**Acceptance Criteria:**
1. After UX design approved (or if UX skipped, after Architecture approved), client sees "Decompose PRD into Stories" button
2. AI-assisted story extraction: Parse approved `docs/prd.md` Epic Details section, extract each story with acceptance criteria
3. Database schema: `Story` model with fields: id, prdId, epicNumber, storyNumber, title, userStory (As a/I want/So that), acceptanceCriteria (JSONB array), estimatedPoints, status (AVAILABLE, ASSIGNED, IN_PROGRESS, IN_QA, COMPLETED), dependsOnStoryId (nullable), createdAt
4. For each story, create GitHub Issue with labels: `story`, `epic-{N}`, `story-{N}.{M}`
5. Issue title format: `Story {epicNum}.{storyNum}: {title}`
6. Issue body includes: User story, Acceptance criteria (checklist format), Links to PRD/Architecture/Design docs, Estimated story points
7. Sequential dependencies tracked: Story 2.3 cannot start until Story 2.2 completed (dependsOnStoryId foreign key)
8. Client dashboard shows story board: Kanban view with columns (Available, Assigned, In Progress, In QA, Completed)
9. Story status synced with GitHub Issue status via webhooks
10. Total project value calculated: Sum of all story budgets, displayed to client before posting to marketplace

### Story 7.2: Developer Marketplace Browse & Story Bidding

**As a** developer,
**I want** to browse available stories and bid on specific ones,
**so that** I can work on focused, independent tasks.

**Acceptance Criteria:**
1. Route `/marketplace/developer` shows all AVAILABLE stories from projects with completed planning phase
2. Story cards display: Project name, Story title, Epic context, Tech stack (from Architecture), Estimated points, Budget range (client-set or platform-suggested), "View Details" button
3. Filters: Tech stack (React, Node, Python, etc.), Story points (Small 1-3, Medium 4-7, Large 8-13), Budget range, Project domain
4. Story detail page `/marketplace/developer/stories/[id]` shows: Full user story, Acceptance criteria, Links to PRD/Architecture/Design docs, GitHub repo URL (read access), Dependencies (if any), "Submit Bid" button
5. Bid form fields: proposedPrice, currency, estimatedDays (1-14), technicalApproach (textarea 500 chars explaining implementation plan)
6. Platform fee preview: "$100 + 5% of {proposedPrice}"
7. Developers can bid on multiple stories from same project (if no dependencies preventing parallel work)
8. Sequential dependency enforcement: Story 2.3 hidden from marketplace until Story 2.2 status = COMPLETED
9. Bid submission creates `DeveloperBid` record, notifies client
10. Developers can withdraw bids before acceptance

### Story 7.3: Client Reviews Developer Bids & Assigns Stories

**As a** client,
**I want** to review developer bids and assign stories,
**so that** development work can begin.

**Acceptance Criteria:**
1. Route `/projects/[id]/stories/[storyId]/bids` shows all developer bids for a story
2. Bid comparison table: Developer name, Price, Est. days, Past stories completed, Tech stack match %, Rating, GitHub profile link, Technical approach preview
3. Developer profile shows: bio, GitHub stats (repos, contributions), past platform stories (with tech stacks), average rating, specializations
4. "Accept Bid" triggers confirmation: "Assign Story {num} to {devName} for {amount} {currency}? Escrow will be created."
5. Upon acceptance: DeveloperBid status → ACCEPTED, Story status → ASSIGNED, Developer invited as GitHub collaborator
6. GitHub Issue assigned to developer automatically
7. Email notification to developer: "Story assigned! Begin work. Deliverable due in {estimatedDays} days."
8. Rejected bids get status REJECTED, developers notified
9. Client can assign multiple stories to different developers simultaneously (if no dependencies)
10. Story assignment creates `StoryAssignment` record: storyId, developerId, assignedAt, expectedCompletionAt

### Story 7.4: Developer Implements Story & Submits Pull Request

**As a** developer,
**I want** to implement the story following acceptance criteria and submit via PR,
**so that** my work can be reviewed and merged.

**Acceptance Criteria:**
1. Developer clones GitHub repo, creates feature branch: `story-{epicNum}-{storyNum}-{description-slug}`
2. Developer implements functionality following Architecture doc's coding standards and Design doc's UX specs
3. Developer writes tests (unit/integration as specified in Architecture testing requirements)
4. Developer updates documentation if applicable (README, API docs)
5. Developer creates Pull Request with title: `Story {epicNum}.{storyNum}: {title}`
6. PR description auto-populated with: User story, Acceptance criteria checklist (✓/✗), Testing notes, Screenshots (if UI changes)
7. PR labels automatically added: `story-{epicNum}.{storyNum}`, `ready-for-qa`
8. Platform webhook receives PR creation, updates Story status → IN_QA
9. Automated checks run via GitHub Actions: Linting (ESLint/Prettier), Type checking (TypeScript), Unit tests, Build verification
10. Developer receives notification: "PR submitted. Automated checks running. QA reviewer will be assigned."

## Epic 8: QA Marketplace & Project Completion

**Expanded Goal:** Implement QA Reviewer marketplace for code validation, comprehensive quality review workflows combining automated checks with human expertise, payment release upon QA approval, sequential story dependency enforcement, and project completion tracking. This epic completes the BMAD workflow by ensuring quality gates before payment release and enabling end-to-end project delivery.

### Story 11.1: QA Marketplace & Reviewer Assignment

**As a** platform,
**I want** QA reviewers to bid on reviewing story PRs,
**so that** code quality is validated before payment release.

**Acceptance Criteria:**
1. When Story status → IN_QA (from Epic 7 Story 7.4), QA opportunity created automatically
2. Route `/marketplace/qa` shows available QA review opportunities for QA role users
3. QA opportunity cards: Project name, Story title, Tech stack, PR complexity (lines changed), Review budget ($100-200 typical), "View PR & Bid" button
4. QA bid form: proposedFee, estimatedReviewHours (1-8), reviewApproach (what will be checked: code quality, security, spec alignment, etc.)
5. Client (or platform auto-assignment for first MVP) accepts QA bid, QA reviewer assigned
6. QA reviewer gets GitHub repo read access + PR comment permissions
7. Database: `QAReview` model with fields: storyId, reviewerId, prUrl, status (IN_REVIEW, APPROVED, CHANGES_REQUESTED, REJECTED), automatedChecksPassed (boolean), reviewNotes, completedAt
8. QA reviewer sees route `/qa/reviews/[id]` with embedded GitHub PR diff, automated check results, acceptance criteria checklist
9. Platform provides QA review checklist template: Code quality, Security best practices, Brief alignment, Architecture adherence, Design implementation, Test coverage, Documentation updated
10. QA review SLA: 24-48 hours from assignment

### Story 11.2: QA Review Process & Decision

**As a** QA reviewer,
**I want** to review code against requirements and provide feedback,
**so that** only quality code is approved for payment release.

**Acceptance Criteria:**
1. QA reviewer interface shows side-by-side: Brief/PRD/Architecture/Design docs (left) + GitHub PR diff (right)
2. Automated check results displayed: ✓ Linting passed, ✓ Tests passed (12/12), ✓ Build successful, ✓ Type checking passed
3. QA reviewer manually checks: Letter AND spirit of acceptance criteria met, Code quality (readability, maintainability, no code smells), Security (no SQL injection, XSS vulnerabilities, secrets exposed), Architecture compliance (follows patterns from docs), Design implementation (matches wireframes/specs), Edge cases handled, Error handling present
4. QA reviewer submits decision: **Approve**, **Request Changes**, **Reject**
5. **Approve**: QA decision is final per FR15 - Story status → COMPLETED, GitHub PR auto-merged, Payment release triggered (Epic 9), Developer + Client notified, QA reviewer fee marked for payment
6. **Request Changes**: QA adds detailed feedback as GitHub PR comments, Story status → IN_PROGRESS, Developer notified to fix issues and resubmit
7. **Reject**: Rare - only if developer grossly misunderstood requirements. Story status → AVAILABLE, developer bid rejected, client can select different developer
8. QA review notes stored in database for quality tracking and dispute resolution
9. QA reviewer cannot approve their own code (validation: reviewerId ≠ developerId)
10. Analytics: "qa_review_completed", "qa_approved", "qa_changes_requested", "qa_rejected" tracked

### Story 11.3: Payment Release on QA Approval (Stubbed for Epic 9)

**As a** developer,
**I want** payment automatically released when QA approves my work,
**so that** I'm compensated promptly.

**Acceptance Criteria:**
1. On QA approval (Story 8.2 Approve decision), `PaymentRelease` record created for developer payment
2. Payment amount = developer's accepted bid proposedPrice - platform fee ($100 + 5%)
3. Platform fee broken down: $100 base + 5% × proposedPrice, portion allocated to QA reviewer fee
4. Database records: developerPayment (amount, currency, status: PENDING_ESCROW), qaPayment (amount, currency, status: PENDING_ESCROW)
5. UI shows: "Payment pending Epic 9 escrow implementation. Manual coordination for MVP."
6. Developer dashboard shows story as "Completed - Payment pending escrow"
7. 48-hour SLA tracked: Time from QA approval to payment release (will be enforced in Epic 9)
8. QA reviewer also gets payment record created (their bid fee)
9. Success notification to developer: "Story {num} approved! Payment of {amount} {currency} will be released once escrow system is live."
10. Client notified: "Story {num} completed and merged. Payment released to developer."

### Story 11.4: Sequential Story Workflow & Dependencies

**As a** client,
**I want** stories to be completed sequentially with proper handoffs,
**so that** the codebase remains integrated and functional.

**Acceptance Criteria:**
1. Story dependencies enforced: Story N+1 not available in marketplace until Story N status = COMPLETED
2. Client dashboard shows story progress: Kanban board with swim lanes per epic, sequential story order visible
3. Dependency visualization: Story cards show "Blocked by Story X.Y" or "Ready for development"
4. When epic completes (all stories COMPLETED), epic marked complete, client notification sent
5. Parallel work allowed: Stories from different epics with no dependencies can be worked simultaneously by different developers
6. Dependency violations prevented: Developer cannot submit PR for Story 2.3 until Story 2.2 is merged
7. Client override: Client can manually mark stories as "Can start in parallel" if they understand integration risks
8. Story board filters: "Available now", "Blocked by dependencies", "In progress", "Completed"
9. Progress metrics: X/Y stories completed, Z stories blocked, estimated completion date based on velocity
10. Analytics: "story_dependency_enforced", "parallel_stories_active" tracked

### Story 11.5: Project Completion & Celebration

**As a** client,
**I want** a clear signal when my project is complete,
**so that** I know I have a deployable product.

**Acceptance Criteria:**
1. When all epics complete (all stories COMPLETED), project status → COMPLETE
2. Client sees "Project Complete! 🎉" celebration UI with confetti animation
3. Completion email sent: "Your project {name} is complete! View your GitHub repository and deploy."
4. Final deliverable package: Complete GitHub repository with all planning docs (Brief, PRD, Architecture, Design in docs/) + working code
5. Deployment readiness check: README includes deployment instructions from Architecture doc, environment variables documented
6. Post-completion survey sent to client: Project satisfaction (1-5 stars), Quality rating, Likelihood to recommend platform, What could be improved, testimonial request
7. Developer portfolio entries: All developers who worked on project receive portfolio entry with tech stack, stories completed, client rating
8. Platform calculates total project metrics: Total time (brief creation to final story completion), Total cost (sum of all expert payments), Expert count (# of people involved), Success indicators (0 disputes, high client rating)
9. Success badge awarded: "Completed Project" badge for client, "Shipped Product" badge for all contributing experts
10. Analytics: "project_completed", "end_to_end_workflow_success", "client_satisfaction_score" tracked

### Story 11.6: Developer & QA Earnings Dashboards

**As a** developer or QA reviewer,
**I want** to track my story completions and earnings,
**so that** I can manage my income from the platform.

**Acceptance Criteria:**
1. Route `/earnings/developer` for developers, `/earnings/qa` for QA reviewers
2. Summary cards: Total earnings, Pending payments, Stories completed (devs) / Reviews completed (QA), Average rating, Success rate
3. Earnings table: Project, Story/Review, Completion date, Amount, Currency, Status, Client rating
4. Filters: Date range, Currency, Project, Status (Pending/Released)
5. Developer-specific stats: Avg story completion time, Tech stacks used, Story point velocity (points completed per week)
6. QA-specific stats: Avg review turnaround time, Approval rate (% approved on first review), Review thoroughness score (from developer feedback)
7. CSV export for tax purposes
8. Badges: "10 Stories", "50 Stories", "100 Stories", "5-Star Developer", "Fast Delivery", "Zero Revisions"
9. Portfolio building: Developers can showcase completed stories (with client permission) on profile
10. Empty state: "Complete your first story to start earning!"

## Epic 9: Fiat Payment Infrastructure (Stripe Connect)

**Expanded Goal:** Implement complete fiat escrow system using Stripe Connect for USD payments. Enable credit card and ACH funding by clients, automatic payout transfers to expert Stripe accounts, platform fee collection and accounting, refund capability, and 48-hour payment release SLA. This epic activates all stubbed fiat payments from Epics 3-8.

### Story 9.1: Stripe Connect Integration & Escrow Setup

**As a** platform,
**I want** Stripe Connect for fiat escrow and marketplace splits,
**so that** clients can fund opportunities and experts receive payments in USD.

**Acceptance Criteria:**
1. Stripe Connect account created for platform as payment facilitator
2. Service layer: `packages/services/StripeEscrowService.ts` with methods: createEscrow(), fundEscrow(), releasePayment(), refund()
3. Database schema: `FiatEscrow` model with fields: id, opportunityType (ANALYST|PM|ARCHITECT|UX|DEVELOPER|QA), opportunityId, clientId, expertId, amount, currency (USD only for MVP), stripePaymentIntentId, stripTransferId, status (PENDING, FUNDED, RELEASED, REFUNDED), fundedAt, releasedAt
4. Client escrow funding flow: "Fund Escrow" button → Stripe Checkout session → Payment captured with `capture_method: manual`
5. Funds held in platform Stripe account until QA approval
6. On QA approval (Story 7.6), payment released: Stripe Transfer API to expert's connected account
7. Platform fee calculated: $100 + 5% × amount, retained during transfer
8. Expert Stripe Connect onboarding: Route `/settings/payments/stripe` for experts to connect Stripe account for payouts
9. Error handling: Failed payments retry 3 times with exponential backoff, notify platform admin if all retries fail
10. Compliance: Platform registered as payment facilitator, Terms of Service include payment terms

### Story 9.2: Escrow Funding UI for Fiat Payments

**As a** platform,
**I want** non-custodial smart contract escrow for crypto payments,
**so that** clients can fund with USDC/USDT and experts receive trustless payments.

**Acceptance Criteria:**
1. Solidity smart contract: `EscrowContract.sol` based on OpenZeppelin templates with methods: createEscrow(), fundEscrow(), releasePayment(), refund()
2. Contract deployed to Polygon mainnet (after testnet verification)
3. Contract features: Multi-currency support (USDC, USDT, MATIC), Platform fee deduction on release, Refund capability for disputes, Event emissions for payment tracking
4. RPC integration: Alchemy WebSocket connection for real-time transaction monitoring
5. Service layer: `packages/services/PolygonEscrowService.ts` with methods wrapping contract calls
6. Database schema: `CryptoEscrow` model with fields: id, opportunityType, opportunityId, clientWallet, expertWallet, amount, currency (USDC|USDT|MATIC), network (POLYGON), contractAddress, fundingTxHash, releaseTxHash, status, fundedAt, releasedAt
7. Transaction monitoring: Listen for `EscrowFunded` events, update database status to FUNDED after 12 confirmations
8. Gas fee strategy: Client pays gas for funding, expert pays gas for claiming (platform can subsidize on Polygon ~$0.01-0.05)
9. Test coverage: Smart contract tests using Hardhat with 100% coverage (security-critical code)
10. Security audit: Contract reviewed by experienced Solidity developer before mainnet deployment

### Story 11.3: Solana Smart Contract Escrow

**As a** platform,
**I want** Solana escrow for ultra-low fee crypto payments,
**so that** global experts can receive payments with minimal cost.

**Acceptance Criteria:**
1. Solana program written in Rust using Anchor framework: `escrow_program` with instructions: initialize_escrow, fund_escrow, release_payment, refund
2. Program deployed to Solana mainnet (after devnet verification)
3. Program features: USDC-SPL token support, Platform fee account, Multi-signature release (future: requires both platform and QA approval)
4. RPC integration: Helius WebSocket for transaction monitoring
5. Service layer: `packages/services/SolanaEscrowService.ts`
6. Database: CryptoEscrow model extended with network=SOLANA, solana-specific fields (programId, escrowAccountPubkey)
7. Transaction monitoring: Listen for program events, update status after 32 confirmations
8. Gas fees: ~$0.0001 per transaction (negligible, platform can subsidize)
9. Test coverage: Anchor tests with 100% coverage
10. Security: Program reviewed, no authority escalation vulnerabilities

### Story 11.4: Wallet Integration (Metamask & Phantom)

**As a** client or expert,
**I want** to connect my crypto wallet for payments,
**so that** I can fund escrows or receive payouts in cryptocurrency.

**Acceptance Criteria:**
1. Frontend: RainbowKit integration for EVM wallets (Metamask, WalletConnect, Coinbase Wallet)
2. Frontend: @solana/wallet-adapter-react for Solana wallets (Phantom, Solflare)
3. Route `/settings/payments/crypto` for wallet connection
4. Wallet connection flow: "Connect Wallet" button → Modal shows wallet options → User selects network (Polygon or Solana) → Wallet popup for approval → Wallet address stored in User.cryptoWallets (JSONB: [{network, address}])
5. Network selection: Dropdown for Polygon mainnet (ChainId 137) or Solana mainnet
6. Multiple wallet support: Users can connect both Polygon and Solana wallets
7. Wallet disconnect: "Disconnect" button removes wallet from database
8. Payment currency selection: When funding escrow, if crypto selected, show "Choose Network: Polygon (USDC/USDT) or Solana (USDC)" → Wallet connection prompt
9. QR code generation: For mobile wallet users, display QR code with wallet connect deep link
10. Error handling: "Wrong network" detection, prompt user to switch to Polygon/Solana mainnet

### Story 11.5: Escrow Funding UI & Multi-Currency Support

**As a** client,
**I want** to fund escrows with my preferred currency (fiat or crypto),
**so that** I can pay for expert services flexibly.

**Acceptance Criteria:**
1. "Fund Escrow" button appears when: Analyst/PM/Architect/UX/Developer bid accepted, Story assigned
2. Funding modal shows: Amount (from accepted bid), Currency selector (USD, USDC, USDT, MATIC, SOL), Payment method: Fiat (Stripe) or Crypto (Wallet), Platform fee preview: "$100 + 5% = ${totalFee}"
3. Fiat flow: Stripe Checkout session, redirect to Stripe payment page, webhook captures payment confirmation
4. Crypto flow (Polygon): RainbowKit wallet connection → User approves token transfer transaction → Platform monitors blockchain → FUNDED after 12 confirmations
5. Crypto flow (Solana): Phantom wallet connection → User approves SOL/USDC transfer → Platform monitors → FUNDED after 32 confirmations
6. Real-time status updates: "Waiting for blockchain confirmations... (3/12)" with progress bar
7. Success notification: "Escrow funded! Expert can begin work."
8. Escrow status widget on opportunity page: Shows amount, currency, status (Pending/Funded/Released), transaction hash link (for crypto)
9. Multiple escrows per project: Client can have separate escrows for PM, Architect, UX, each Developer story - all tracked independently
10. Edge case handling: Transaction fails → Show error, allow retry, refund if double-funded

### Story 11.6: Automated Payment Release on QA Approval

**As a** platform,
**I want** payments automatically released when QA approves work,
**so that** experts are paid within 48-hour SLA.

**Acceptance Criteria:**
1. QA approval trigger (Story 7.6 Approve): Calls PaymentReleaseService.releasePayment(opportunityId, opportunityType)
2. PaymentReleaseService checks escrow status, validates FUNDED, calculates platform fee
3. Fiat release: Stripe Transfer API call to expert's connected account, transfer amount = escrowAmount - platformFee
4. Crypto release (Polygon): Smart contract releasePayment() called via platform's signer wallet, expert can claim funds
5. Crypto release (Solana): Program release_payment instruction executed, funds transferred to expert wallet
6. Platform fee collection: Fiat retained in Stripe, Crypto transferred to platform fee wallet
7. Database updates: Escrow status → RELEASED, releasedAt timestamp, expert Payment record created
8. Email notifications: Expert receives "Payment released! {amount} {currency} sent to your {Stripe account | wallet}.", Client receives "Payment released to expert for {opportunityType}."
9. 48-hour SLA tracking: Alert if release delayed >48 hours from QA approval, escalate to platform admin
10. QA reviewer payment: Separate escrow released to QA reviewer (their bid fee) simultaneously with developer payment

### Story 11.7: Expert Payout Dashboard & Withdrawal

**As an** expert,
**I want** to view my payouts and withdraw crypto funds,
**so that** I can access my earnings.

**Acceptance Criteria:**
1. Route `/earnings/payouts` shows all released payments
2. Payout cards: Project, Opportunity type, Amount, Currency, Released date, Status (Available for withdrawal | Withdrawn), Transaction hash (crypto only)
3. Fiat payouts: "Stripe transfers are automatic. Funds arrive in 2-5 business days." (Stripe handles this)
4. Crypto payouts (Polygon): "Claim Payment" button → Metamask transaction to claim funds from escrow contract
5. Crypto payouts (Solana): "Claim Payment" button → Phantom transaction to claim from program account
6. Withdrawal history: Table showing claimed payments with transaction hashes
7. Tax reporting: CSV export of all payouts for tax purposes (includes currency conversions to USD)
8. Multi-currency display: Show payouts in original currency + USD equivalent (using exchange rate at release time)
9. Unclaimed crypto funds reminder: Email sent if funds unclaimed for 30 days: "You have {amount} {currency} ready to claim!"
10. Analytics: "expert_payout_claimed", "payout_claim_time" (time from release to claim) tracked

### Story 11.8: Platform Fee Collection & Accounting

**As a** platform,
**I want** to track platform fee revenue across all currencies,
**so that** I can monitor business metrics.

**Acceptance Criteria:**
1. Database: `PlatformFee` model with fields: id, opportunityType, opportunityId, feeAmount, currency, collectedAt, payoutType (FIAT|CRYPTO_POLYGON|CRYPTO_SOLANA)
2. Fee calculation: $100 + 5% × opportunityAmount, applied at payment release time
3. Fiat fees: Retained automatically during Stripe Transfer (platform keeps fee, expert gets net)
4. Crypto fees (Polygon): Transferred to platform fee wallet address (multi-sig wallet for security)
5. Crypto fees (Solana): Transferred to platform fee account (program-owned account)
6. Admin dashboard `/admin/revenue`: Total fees collected (all-time), Fees by currency, Fees by opportunity type (Analyst, PM, Architect, UX, Developer, QA), Monthly revenue chart
7. Revenue projections: Based on active escrows (not yet released), project estimated monthly revenue
8. Fee wallet balances: Display current balance in platform wallets (Stripe, Polygon fee wallet, Solana fee account)
9. Crypto to fiat conversion tracking: Platform can periodically convert crypto fees to USD via exchange (manual process for MVP)
10. Analytics: "platform_fee_collected" event with amount, currency, type

### Story 11.9: Refunds & Dispute Resolution

**As a** platform,
**I want** escrow refund capability for disputes,
**so that** clients can get refunds if deliverables are rejected.

**Acceptance Criteria:**
1. Refund trigger: QA rejects work (Story 7.6 Reject decision) + Client requests refund
2. Refund approval flow: Client submits refund request → Platform admin reviews (manual for MVP) → Approves or denies
3. Fiat refund: Stripe Refund API, full amount returned to client's payment method
4. Crypto refund (Polygon): Smart contract refund() method, returns funds to client wallet (minus gas fees)
5. Crypto refund (Solana): Program refund instruction, returns funds to client wallet
6. Partial refunds: Platform can approve partial refunds (e.g., 50% if work partially completed)
7. Refund deadline: Clients must request within 30 days of escrow funding, otherwise forfeited
8. Dispute log: Database table `DisputeLog` tracking all refund requests, admin decisions, resolution notes
9. Email notifications: Client and expert both notified of refund decision
10. Analytics: "refund_requested", "refund_approved", "refund_denied" tracked

## Epic 10: Reputation, Trust & Multi-Role Support

**Expanded Goal:** Implement multi-dimensional reputation tracking across all expert roles (Analyst, PM, Architect, UX, Developer, QA), post-project rating system, public expert profiles with portfolios, and role fluidity features enabling users to participate in multiple capacities with independent reputation scores.

### Story 11.1: Multi-Dimensional Reputation Data Models

**As a** platform,
**I want** separate reputation tracking per expert role,
**so that** users build credibility in multiple skill areas independently.

**Acceptance Criteria:**
1. Database: `ExpertReputation` model with fields: userId, role (ANALYST|PM|ARCHITECT|UX|DEVELOPER|QA), totalProjects, avgRating (1-5 stars), onTimeDeliveryRate (%), firstPassApprovalRate (%), totalEarnings, createdAt, updatedAt
2. Each user can have up to 6 ExpertReputation records (one per role)
3. Ratings calculated from `ProjectRating` model: id, projectId, opportunityType, fromUserId (rater), toUserId (rated), rating (1-5), reviewText (500 chars), ratedAt
4. Reputation metrics auto-updated when ProjectRating created: Recalculate avgRating, increment totalProjects, update deliveryRates
5. Role-specific badges: Database `Badge` model with types: "5 Analyst Projects", "5-Star PM (10+ ratings)", "100 Stories Completed", "QA Expert (50+ reviews)"
6. Badge achievement triggers: Automated checks after each project completion, badges awarded via `UserBadge` join table
7. Leaderboards: Route `/leaderboards/{role}` showing top experts per role by avgRating, totalProjects, totalEarnings
8. Test coverage: Reputation calculation algorithms unit tested

### Story 11.2: Post-Project Rating System

**As a** client or expert,
**I want** to rate my project counterpart after completion,
**so that** reputation reflects actual experience.

**Acceptance Criteria:**
1. Rating trigger: Sent 24 hours after opportunity status → COMPLETED (gives time for final checks)
2. Email + in-app notification: "Rate your experience with {ExpertName} on {ProjectName}"
3. Rating form: Star rating (1-5), Review text (optional, 500 chars), Specific feedback checkboxes (Communication, Quality, Timeliness, Would hire again)
4. Client rates: Analyst, PM, Architect, UX expert, each Developer, each QA reviewer (separate ratings per opportunity)
5. Expert rates: Client on single rating (communication, clarity of requirements, payment promptness)
6. Mutual ratings: Both sides must rate before ratings become public (prevents retaliatory ratings)
7. Rating moderation: Platform admin can hide abusive/spam reviews flagged by users
8. Anonymized ratings for privacy: Client identity hidden on expert profile if <5 total ratings (prevent doxxing)
9. Reminder emails: Sent 3 days, 7 days after initial request if not completed
10. Incentive: $10 platform credit for completing rating (encourages participation)

### Story 11.3: Expert Profile Pages with Multi-Role Portfolios

**As an** expert,
**I want** a comprehensive profile showcasing all my roles and projects,
**so that** clients can evaluate my full expertise.

**Acceptance Criteria:**
1. Route `/experts/[username]` is public profile page
2. Profile header: Name, Bio (500 chars), Avatar, Location, Member since, Total earnings (optional, can hide)
3. Multi-role tabs: Analyst, PM, Architect, UX, Developer, QA (only shows roles with >0 projects)
4. Per-role section displays: Avg rating (stars), Total projects, On-time delivery rate, First-pass approval rate, Specializations (tags), Portfolio showcase (3-5 featured projects)
5. Portfolio items: Project name (with client permission), Brief description, Tech stack used, Role performed, Client testimonial, Deliverable links (GitHub, Figma, etc.)
6. Skills/tags: Expert can add skills (React, Node, SaaS, B2B, etc.), endorsed by clients post-project
7. Reviews section: Paginated list of client reviews (most recent first), filter by role
8. Badges displayed: Visual badges for achievements, hover shows badge description
9. Availability status: "Available for work" toggle, "Typical response time: 24 hours"
10. Contact CTA: "Invite to bid" button sends notification to expert about client's project

### Story 11.4: Role Fluidity & Account Management

**As a** user,
**I want** to participate as client on one project, PM on another, developer on a third,
**so that** I maximize my platform value and earning opportunities.

**Acceptance Criteria:**
1. User.role field changed to User.roles (array): Can include CLIENT, ANALYST, PM, ARCHITECT, UX, DEVELOPER, QA, ADMIN
2. Role selection during signup: Checkboxes for all roles, required to select at least one (CLIENT or any expert role)
3. Route `/settings/roles`: Manage enabled roles, add new roles (requires profile completion per role)
4. Role activation requirements: Expert roles require: Bio filled, Skills added (min 3), Portfolio link or GitHub profile, Payment method connected (Stripe or Crypto wallet)
5. Role switching: Dashboard header dropdown "Current Role: {role}" allows switching active context (Client view vs PM view vs Developer view)
6. Marketplace filtering: When browsing as client, see expert marketplaces. When browsing as PM, see PM opportunities
7. Conflict prevention: Cannot bid on your own client projects (validation: clientId ≠ expertId)
8. Reputation independence: PM reputation doesn't affect Developer reputation, tracked separately
9. Unified earnings dashboard: Route `/earnings/all` shows combined earnings across all expert roles
10. Profile completeness indicator: "Your PM profile is 80% complete - Add 2 more portfolio items!"

### Story 11.5: Trust Signals & Verification

**As a** client,
**I want** trust signals to identify reputable experts,
**so that** I can confidently select service providers.

**Acceptance Criteria:**
1. Verification badges: "Email Verified", "Payment Method Verified", "GitHub Connected", "Identity Verified (future: Stripe Identity)"
2. Top performer badges: "Top Rated" (4.8+ avg, 10+ projects), "Rising Star" (5.0 avg, 3-5 projects), "Veteran" (100+ projects)
3. Expert spotlight: Route `/experts/featured` shows platform-curated top experts per role
4. Response time tracking: Display avg response time to bid requests on profile
5. Completion rate: % of accepted bids that resulted in completed projects (vs withdrawn/cancelled)
6. Repeat client rate: % of clients who hired expert for 2+ projects (indicates satisfaction)
7. Quality score algorithm: Combines avgRating, firstPassApprovalRate, onTimeDelivery, repeatClientRate into single 0-100 score
8. Search ranking: Experts sorted by quality score in marketplace browse (higher quality surfaces first)
9. Trust indicators in bid cards: Show badges, ratings, completion rate next to bid for easy comparison
10. Background checks (future): Integration with third-party verification service for identity/credential verification

### Story 11.6: Client Reputation & Expert Protection

**As an** expert,
**I want** to see client reputation before accepting bids,
**so that** I avoid difficult or non-paying clients.

**Acceptance Criteria:**
1. Client reputation tracked: `ClientReputation` model with fields: userId, totalProjectsPosted, avgExpertRating (how experts rate this client), promptPaymentRate (%), briefQualityScore
2. Expert rates client after project: Communication quality, Requirement clarity, Payment promptness, Would work with again
3. Client profile (private, only visible to bidding experts): Shows avgExpertRating, totalProjects, promptPaymentRate
4. Red flags: Display warnings if client has: <3.0 expert rating, Payment disputes, Late payments, Brief quality issues
5. Expert can decline bid after client acceptance: "Withdraw from project" with reason (penalty: Reputation hit unless valid reason)
6. Blocklist feature: Experts can block specific clients (won't see their opportunities)
7. Platform protection: Clients with <2.5 expert rating after 5+ projects get warning, <2.0 rating = account review/suspension
8. Payment history transparency: Show client's payment track record (all escrows funded on time, any refunds/disputes)
9. Brief quality feedback: After PM/Architect/UX bid, experts can rate brief quality (helps identify clients needing brief improvement)
10. Fair treatment: Client and expert protections balanced - both sides build reputation

## Epic 11: MCP Server Integration

**Expanded Goal:** Implement Model Context Protocol server with complete API parity, enabling users to create briefs, browse marketplaces, bid on opportunities, fund escrow, submit work, and check project status directly within Claude Desktop or ChatGPT. Ensure identical functionality between web platform and MCP interface using shared service layer.

### Story 11.1: MCP Server Foundation & Service Layer Refactoring

**As a** developer,
**I want** shared business logic between REST API and MCP server,
**so that** both interfaces have identical functionality.

**Acceptance Criteria:**
1. Service layer refactoring: All business logic moved from API routes to `packages/services` (if not already done in Epics 1-9)
2. Services include: BriefService, AnalystMarketplaceService, PMMarketplaceService, ArchitectMarketplaceService, UXMarketplaceService, DeveloperMarketplaceService, QAMarketplaceService, PaymentService, ReputationService
3. MCP server scaffolding: `apps/mcp-server` created using FastMCP framework
4. MCP server entry point: `src/index.ts` exports MCP server instance
5. Authentication: API key-based (users generate API key at `/settings/api-keys`, stored hashed in database)
6. Configuration: Environment variables for database connection, Claude API key, shared with main API
7. Testing infrastructure: MCP server test utilities configured, can mock tool calls
8. Deployment: NPM package published as `@american-nerd/mcp-server`, users install locally: `npx @american-nerd/mcp-server`

### Story 11.2: MCP Tools for Brief Creation & Planning Marketplaces

**As a** user in Claude Desktop,
**I want** to create briefs and interact with planning marketplaces,
**so that** I can manage projects without leaving my AI interface.

**Acceptance Criteria:**
1. MCP tool `create_brief`: Accepts projectName, problemStatement, targetUsers, goals, mvpScope → Calls BriefService.createBrief() → Returns brief ID and GitHub repo URL
2. MCP tool `post_to_analyst_marketplace`: Accepts briefId, budget, currency → Creates AnalystOpportunity → Returns opportunity ID
3. MCP tool `post_to_pm_marketplace`: Similar for PM opportunities
4. MCP tool `post_to_architect_marketplace`: Similar for Architect
5. MCP tool `post_to_ux_marketplace`: Similar for UX
6. MCP tool `list_marketplace_opportunities`: Accepts role (ANALYST|PM|ARCHITECT|UX) + filters → Returns paginated opportunities with details
7. MCP tool `submit_bid`: Accepts opportunityId, proposedPrice, currency, coverLetter → Creates bid record → Returns bid ID
8. MCP tool `get_my_bids`: Returns user's submitted bids with statuses
9. MCP tool `approve_deliverable`: Accepts opportunityId, opportunityType → Approves deliverable, triggers payment release → Returns success
10. All tools return markdown-formatted responses with clickable links to web platform for complex UIs (e.g., "View bids: https://platform.com/opportunities/pm/123/bids")

### Story 11.3: MCP Tools for Development Marketplace & QA

**As a** developer in Claude Desktop,
**I want** to browse stories and manage development work,
**so that** I can find and complete tasks via MCP.

**Acceptance Criteria:**
1. MCP tool `list_developer_stories`: Accepts filters (tech stack, story points, budget) → Returns available stories with acceptance criteria
2. MCP tool `bid_on_story`: Accepts storyId, proposedPrice, technicalApproach → Submits developer bid
3. MCP tool `get_assigned_stories`: Returns user's assigned stories with GitHub PR links, deadlines
4. MCP tool `submit_story_pr`: Accepts storyId, prUrl → Records PR submission, updates story status to IN_QA
5. MCP tool `list_qa_reviews`: For QA reviewers, shows available QA opportunities
6. MCP tool `submit_qa_review`: Accepts storyId, decision (APPROVE|CHANGES_REQUESTED|REJECT), reviewNotes → Processes QA decision
7. MCP tool `get_project_status`: Accepts projectId → Returns project summary (workflow stage, completed/pending stages, story progress)
8. All development tools include links to GitHub for actual code work (MCP handles coordination, GitHub handles code)

### Story 11.4: MCP Tools for Payments & Wallet Integration

**As a** user in Claude Desktop,
**I want** to fund escrows and manage payments,
**so that** I can complete financial transactions.

**Acceptance Criteria:**
1. MCP tool `fund_escrow_fiat`: Accepts opportunityId, currency (USD) → Returns Stripe Checkout URL (user clicks to complete payment in browser)
2. MCP tool `fund_escrow_crypto`: Accepts opportunityId, currency (USDC|USDT|MATIC|SOL), network (POLYGON|SOLANA) → Returns wallet connection deep link + QR code (ASCII art or image URL)
3. QR code handling: MCP response includes: "Scan QR code with mobile wallet: [QR code image URL]" OR "Click to connect wallet: metamask://... or phantom://..."
4. MCP tool `get_escrow_status`: Accepts opportunityId → Returns escrow funding status, blockchain confirmations if crypto
5. MCP tool `claim_crypto_payment`: Accepts paymentId → Returns wallet transaction link to claim funds
6. MCP tool `get_earnings_summary`: Returns total earnings across all roles, pending/released breakdown, by currency
7. MCP tool `export_earnings_csv`: Generates CSV file, returns download link
8. Payment tools include disclaimers: "Complete payment in browser" for Stripe, "Confirm transaction in wallet" for crypto
9. Real-time status updates: MCP can poll payment status, notify user when escrow funded or payment released
10. Error handling: Clear messages for failed transactions, retry instructions

### Story 11.5: MCP Resources for Project Documentation

**As a** user in Claude Desktop,
**I want** to read project documentation,
**so that** I can understand briefs, PRDs, architecture, and designs without leaving Claude.

**Acceptance Criteria:**
1. MCP resource `brief://[briefId]`: Returns brief content as markdown (problem statement, goals, MVP scope, etc.)
2. MCP resource `prd://[prdId]`: Returns PRD content from GitHub `docs/prd.md` (goals, requirements, epics, stories)
3. MCP resource `architecture://[archId]`: Returns architecture doc (tech stack, system design, data models, APIs)
4. MCP resource `design://[designId]`: Returns design doc (UX vision, user flows, wireframes, component specs)
5. MCP resource `story://[storyId]`: Returns story details (user story, acceptance criteria, dependencies, GitHub issue link)
6. Resources support content updates: If doc changes on GitHub, MCP resource reflects latest version
7. Markdown rendering: All docs returned as clean markdown with proper formatting for readability in Claude
8. Embedded links: Resources include links to GitHub for full context, Figma for designs
9. Resource metadata: Include author, created date, last updated, version
10. Resource discovery: MCP tool `list_project_docs` → Returns all available docs for a project

### Story 11.6: MCP Prompts for Common Workflows

**As a** user in Claude Desktop,
**I want** guided workflows for common tasks,
**so that** I can accomplish goals efficiently via prompts.

**Acceptance Criteria:**
1. MCP prompt `Create a new project brief`: Guides user through brief creation with questions, calls create_brief tool
2. MCP prompt `Find PM opportunities matching my skills`: Asks for skills, calls list_marketplace_opportunities with filters
3. MCP prompt `Check my active projects`: Calls get_project_status for all user's projects, summarizes
4. MCP prompt `Fund my next project stage`: Identifies unfunded escrows, guides through fund_escrow flow
5. MCP prompt `Review this story's code`: For QA reviewers, pulls story docs + PR, helps review against criteria
6. Prompts use conversational flow: Multi-turn interactions, Claude asks clarifying questions, user responds naturally
7. Prompt results: Execute tools, format results as helpful summaries (not raw JSON)
8. Context awareness: Prompts remember user's role(s), suggest relevant actions
9. Proactive suggestions: "You have 3 new bids on your PM opportunity - review them?"
10. Prompt library documented: `/docs/mcp-prompts` explains available prompts

### Story 11.7: MCP Server Deployment & Distribution

**As a** user,
**I want** to easily install and configure the MCP server,
**so that** I can use American Nerd platform via Claude Desktop.

**Acceptance Criteria:**
1. NPM package published: `@american-nerd/mcp-server` on npm registry
2. Installation: Users run `npx @american-nerd/mcp-server` or install globally `npm install -g @american-nerd/mcp-server`
3. Configuration: MCP server reads config from `~/.american-nerd/config.json` with fields: apiKey, apiUrl (defaults to production platform)
4. API key generation: Web platform route `/settings/api-keys` → "Generate MCP API Key" button → Shows key once, user copies to config
5. Claude Desktop configuration: Documentation shows how to add MCP server to `claude_desktop_config.json`
6. Self-hosted option: Users can run `american-nerd-mcp` as persistent process, configure in Claude Desktop as stdio server
7. Cloud-hosted option: Platform hosts MCP server at `mcp.americannerd.com`, users configure as SSE server
8. Health check: MCP server includes `health` tool returning status, version, API connectivity
9. Logging: MCP server logs to `~/.american-nerd/logs/mcp.log` for debugging
10. Updates: Users notified of new MCP server versions, can upgrade via `npm update`

### Story 11.8: MCP Server Monitoring & Analytics

**As a** platform,
**I want** to track MCP server usage,
**so that** I can optimize the MCP experience and measure adoption.

**Acceptance Criteria:**
1. MCP tool calls logged: Database table `MCPToolCall` with fields: userId, toolName, requestParams (sanitized), responseStatus, executionTimeMs, calledAt
2. Analytics dashboard `/admin/mcp-usage`: Total MCP users, Daily active MCP users, Most used tools, Avg tool execution time, Error rate by tool
3. Performance monitoring: Track tool execution times, alert if p95 >3 seconds (NFR4)
4. Error tracking: MCP server errors sent to Sentry with context (tool name, user ID, params)
5. Adoption metrics: % of active users who've used MCP server, MCP vs web platform usage ratio
6. Feature requests: MCP server includes feedback tool: Users can submit feature requests directly via Claude
7. A/B testing capability: Platform can enable/disable specific MCP tools for user cohorts
8. User satisfaction: Periodic in-MCP survey: "Rate your MCP experience 1-5 stars"
9. Tool deprecation: Platform can deprecate old tool versions, MCP server shows warnings
10. Analytics: "mcp_tool_called", "mcp_server_installed", "mcp_error" events tracked

### Story 11.9: MCP Server Documentation & Support

**As a** user,
**I want** comprehensive MCP server documentation,
**so that** I can troubleshoot issues and learn all features.

**Acceptance Criteria:**
1. Documentation site: `/docs/mcp` with sections: Installation, Configuration, Available Tools, Available Resources, Available Prompts, Troubleshooting, FAQ
2. Tool reference: Each MCP tool documented with: Description, Parameters (required/optional), Return format, Example usage
3. Video tutorial: Screen recording showing: Install MCP server, Generate API key, Configure Claude Desktop, Create brief via Claude
4. Common workflows guide: "How to create a project end-to-end using MCP", "How to bid on PM opportunities via Claude"
5. Troubleshooting section: "API key invalid" → Check config.json, "Can't connect to server" → Verify apiUrl, "Tool errors" → Check logs
6. Claude prompt examples: Copy-paste prompts users can try: "Show me PM opportunities for SaaS projects under $1000"
7. Support channel: Discord #mcp-support channel for community help
8. Changelog: Document MCP server version history, breaking changes, new tools/features
9. Comparison table: MCP vs Web platform feature parity (what's available where)
10. GitHub repo: `american-nerd/mcp-server` public repo with README, issues for bug reports/feature requests
