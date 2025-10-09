# Epic 0: Infrastructure Bootstrap (MUST COMPLETE FIRST)

> **⚠️ TEMPLATE EPIC:** This epic is prepended to every client project PRD created on the Slop Machine platform. It will NOT be implemented in this PRD, as this document describes building the Slop Machine platform itself, not a client project.

**Duration:** 1 week

**Payment Model:** Simplified validation (Story 0.1 uses automated BMAD checklist, Stories 0.2-0.5 use simple on-chain checks)

**Epic Goal:** Establish the foundational infrastructure for every client project built on the Slop Machine platform. Infrastructure AI nodes create the Git repository, generate the project-specific architecture specification, set up testing and CI/CD automation, and configure deployment pipelines—all tailored to the client's project type (CLI tool, web app, API, etc.). This automated bootstrap enables all subsequent development stories to be autonomously validated and deployed by AI developer nodes.

**Critical Dependency:** This epic creates the automated validation infrastructure that ALL subsequent stories for this client project depend on.

**Key Principle:** Story 0.0 (Git Setup) creates branching strategy. Story 0.1 (Architecture) defines complete tech stack. Both are foundational for all other stories.

---

## Story 0.0: Git Repository & Branch Setup

As a project creator,
I want an Infrastructure AI node to fork and configure my project's Git repository with a 3-tier branch strategy and protection rules,
so that all AI developer nodes working on my project have a secure, structured workflow for code integration and progressive deployment.

### Acceptance Criteria

1. Client's project repository forked successfully (if template provided) or new repository created
2. Three long-lived branches created: `main` (production), `staging` (epic integration), and `development` (story integration)
3. Branch protection rules configured on all three branches:
   - `main`: Requires PR from `staging`, requires status checks, no direct pushes allowed
   - `staging`: Requires PR from `development`, requires status checks
   - `development`: Requires PR from feature branches, requires status checks
4. `.gitignore` file created appropriate for the client's project type (determined from PRD)
5. README.md initialized with client's project information from PRD
6. Default branch set to `development`
7. Branch Strategy documentation added explaining the 3-tier deployment flow (development → staging → main)
8. Repository URL and branch configuration posted to Solana smart contract
9. Payment trigger: Repository accessible, all branches created, protection rules verified on-chain

---

## Story 0.1: Architecture Generation

As a project creator,
I want an Architect AI node to analyze my PRD and generate a complete `architecture.md` with project-specific tech stack and validation strategy,
so that Infrastructure and Developer AI nodes know exactly what to build and how to validate my project.

### Acceptance Criteria

1. Client's PRD downloaded from Arweave and analyzed by Architect AI node
2. Project type determined from PRD requirements (cli_tool, web_app, api_backend, mobile_app, or library)
3. Optimal tech stack selected based on client's requirements, constraints, and technical preferences
4. Complete `architecture.md` generated with ALL mandatory YAML sections:
   - `project_metadata`: type and language for this client project
   - `tech_stack`: runtime, framework, testing frameworks, CI platform, deployment method, linting tools
   - `validation_strategy`: specific commands for unit tests, integration tests, linting, build verification
   - `has_frontend`, `has_backend`, `is_library` classification flags
5. Testing strategy specifies concrete frameworks matching project type (e.g., "cargo_test" for Rust CLI, "vitest" + "playwright" for Next.js web app)
6. Deployment strategy appropriate for project type (e.g., "github_releases" for CLI, "arweave" for web apps, "akash" for APIs)
7. All validation commands are executable for the chosen tech stack
8. Architecture.md uploaded to Arweave with permanent transaction ID
9. Automated BMAD architecture checklist validation passes with score >80%
10. Architecture Arweave transaction ID posted to Solana smart contract for this project
11. Payment trigger: Architecture.md uploaded to Arweave, BMAD checklist score >80%, transaction ID recorded on-chain

---

## Story 0.2: Test Infrastructure Setup

As a project creator,
I want an Infrastructure AI node to install the testing frameworks specified in my project's architecture.md and prove they catch failures,
so that all AI developer nodes working on my project have a reliable test infrastructure for validation.

### Acceptance Criteria

1. Architecture.md downloaded from Arweave using transaction ID from Story 0.1
2. `tech_stack.testing` section parsed to identify required testing frameworks
3. Testing frameworks installed and configured matching client's project architecture:
   - For Rust projects: `tests/` directory created with Cargo test configuration
   - For Node.js projects: Vitest/Jest/Playwright installed with `__tests__/` and/or `e2e/` directories
   - For Python projects: pytest installed with `tests/` directory
   - For other languages: Appropriate testing framework per architecture spec
4. Example passing tests added (proves framework works)
5. Example failing tests temporarily added (proves CI catches failures)
6. Commit with failing tests pushed, CI triggered
7. CI fails as expected (validation system working)
8. Failing tests removed, new commit pushed
9. CI passes successfully
10. Test directory structure follows conventions for the client's project type
11. Payment trigger: Test infrastructure installed, tests run successfully in CI, failure detection proven (failed test caused CI to fail)

---

## Story 0.3: CI/CD Pipeline Setup

As a project creator,
I want an Infrastructure AI node to generate GitHub Actions workflows using the validation commands from my architecture.md,
so that all code changes by AI developer nodes are automatically validated with my project-specific checks.

### Acceptance Criteria

1. Architecture.md downloaded from Arweave
2. `validation_strategy` section parsed to extract project-specific commands
3. `.github/workflows/ci.yml` file generated with commands directly from client's architecture:
   - Unit tests command (e.g., "cargo test", "npm test", "pytest")
   - Linting command (e.g., "cargo clippy -- -D warnings", "npm run lint", "ruff check")
   - Build verification command (e.g., "cargo build --release", "npm run build")
   - Type checking if applicable (e.g., "tsc --noEmit" for TypeScript)
   - Integration/E2E tests if specified in architecture
4. Workflow triggers configured for `push` and `pull_request` events
5. Workflow includes appropriate setup steps for client's tech stack (Rust toolchain, Node.js version, Python version, etc.)
6. Initial test workflow run completes successfully
7. Workflow commands exactly match `architecture.validation_strategy` (no assumptions, fully driven by architecture spec)
8. Branch protection integrates with CI status checks (PR cannot merge if CI fails)
9. Payment trigger: `.github/workflows/ci.yml` exists, commands match architecture exactly, test run succeeds

---

## Story 0.4: Staging Deployment + Subdomain Setup

As a project creator,
I want an Infrastructure AI node to configure deployment infrastructure for my project based on my architecture.md deployment method,
so that token holders can see live progress URLs as AI developer nodes complete stories and epics.

### Acceptance Criteria

1. Architecture.md downloaded from Arweave
2. `deployment.method` and `deployment.artifacts` parsed from architecture
3. Deployment configured based on client's project type:
   - **For CLI tools (`github_releases`):** GitHub Release workflow created, cross-platform binaries built for platforms in `deployment.artifacts` (e.g., Linux x64, macOS ARM64, Windows x64)
   - **For Web apps (`arweave`):** Arweave deployment workflow created using Turbo SDK, static build exported (e.g., `npm run build` for Next.js), uploaded to Arweave (~$0.09 cost), permanent HTTPS URL obtained (`https://arweave.net/{tx-id}`)
   - **For APIs (`akash`):** Akash SDL file generated from architecture, API deployed to Akash Network (~$3/month), provider URL obtained (`https://{provider-hostname}.akash.network`)
4. Deployment workflow tested on development branch (story-level deployment)
5. Deployment URL verified accessible:
   - Web apps: URL returns 200 OK
   - APIs: Health check endpoint responds
   - CLI tools: Release artifacts downloadable
6. Deployment URL posted to Solana smart contract for on-chain tracking (token holders can view)
7. Three-tier deployment strategy operational:
   - Story complete → merge to development → deploy → URL available
   - Epic complete → merge to staging → deploy → staging URL available
   - Project complete → merge to main → deploy → production URL available
8. Deployment cost tracking integrated (Arweave: ~$0.09/frontend, Akash: ~$3/month/backend)
9. Payment trigger: Deployment succeeds for project type, URL accessible, URL posted on-chain

---

## Story 0.5: Automated Validation Webhook

As a project creator,
I want an Infrastructure AI node to create a webhook that posts GitHub Actions results to the Solana smart contract,
so that AI developer nodes automatically receive payment when validation passes, or lose stake after repeated failures.

### Acceptance Criteria

1. Webhook step added to GitHub Actions CI workflow (`.github/workflows/ci.yml`)
2. Webhook endpoint configured to post to Solana smart contract for this project
3. Webhook payload includes:
   - Project ID (Solana account address for this client project)
   - Story ID (which story is being validated)
   - Validation results (which checks passed/failed: tests, linting, build, type-check)
   - Deployment URL (if applicable: Arweave transaction ID for frontends, Akash URL for backends)
   - CI run timestamp and commit SHA
4. Webhook fires on CI completion (both success and failure cases)
5. Solana smart contract receives and parses webhook data successfully
6. `AutomatedValidation` account created on-chain with validation data for this story
7. Smart contract validation logic working:
   - All checks passed → Auto-merge PR + release payment to developer node + return stake
   - Some checks failed → Increment failure count, notify developer node, keep stake locked
   - 3+ consecutive failures → Slash stake (50% to project escrow, 50% burned), close story
8. Test webhook with passing CI run (verify payment and stake return)
9. Test webhook with failing CI run (verify failure counter increments)
10. Token holders can view validation results on-chain for transparency
11. Payment trigger: Webhook posts successfully, AutomatedValidation account created with correct data, smart contract logic verified

---

**Epic 0 Success Criteria:**
- ✅ Client project Git repository configured with 3-tier branch strategy (development/staging/main)
- ✅ Branch protection rules enforced (PRs required, CI status checks must pass)
- ✅ Architecture.md exists on Arweave defining complete tech stack for client's project
- ✅ Test infrastructure matches client's project type (Rust/Node.js/Python/other)
- ✅ CI/CD runs validation commands from architecture.validation_strategy (project-specific)
- ✅ Deployment works for all 3 environments (development/staging/production)
- ✅ Deployment URLs accessible and posted on-chain for token holder visibility
- ✅ Test suite proven to catch failures
- ✅ Validation webhook posts results to Solana (enables autonomous payment)
- ✅ **Infrastructure adapts to client's project type** (NOT one-size-fits-all)

**After Epic 0 completion:** ALL subsequent feature stories for this client project use fully automated validation and deployment as defined in architecture.md.

---
