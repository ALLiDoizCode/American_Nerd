# Epic 9: MCP Server (Milestone 2)

**Duration:** 4 weeks

**Epic Goal:** Build a Model Context Protocol (MCP) server that enables Claude Desktop users to create projects on Slop Machine through natural conversation. The MCP server integrates analyst.txt (brainstorming tools) and pm.txt (PRD generation tools) with 18+ tools that connect directly to Solana and Arweave, supporting both remote mode (deep link payments for humans) and local mode (wallet access for AI agents). This epic creates the zero-friction onboarding experience where users go from idea to funded project in Claude Desktop without leaving the conversation.

---

## Story 9.1: MCP Server Setup

As a platform developer,
I want to set up an MCP server using the official SDK,
so that we have the foundation for integrating Slop Machine tools into Claude Desktop.

### Acceptance Criteria

1. MCP server project initialized with `@modelcontextprotocol/sdk`
2. TypeScript configuration for MCP server:
   - tsconfig.json with ES2022 target
   - Proper type definitions for MCP protocol
3. Server entry point created (`src/index.ts`):
   - Implements MCP server interface
   - Exports tool list
   - Handles tool invocations
4. Basic tools implemented for testing:
   - `ping`: Returns "pong" (health check)
   - `get_server_info`: Returns server version and capabilities
5. Local development setup:
   - `npm run dev`: Runs server in development mode
   - `npm run build`: Compiles TypeScript
   - `npm test`: Runs unit tests
6. Claude Desktop integration testing:
   - Add server to Claude Desktop config
   - Verify tools appear in Claude
   - Test tool invocation
7. Error handling:
   - Invalid tool names
   - Missing required parameters
   - Server crashes (graceful restart)
8. Logging:
   - Log all tool invocations
   - Log errors with stack traces
9. README with setup instructions for developers
10. Unit tests for server initialization

---

## Story 9.2: analyst.txt Integration

As a Claude Desktop user,
I want to use brainstorming and research tools from analyst.txt in my conversations,
so that I can explore project ideas before creating a PRD.

### Acceptance Criteria

1. analyst.txt BMAD agent loaded in MCP server
2. Analyst tools exposed to Claude Desktop:
   - `brainstorm`: Generates ideas using brainstorming techniques
   - `research_market`: Researches market for similar products
   - `analyze_competitors`: Analyzes competitor features and pricing
   - `evaluate_feasibility`: Evaluates technical and business feasibility
3. `brainstorm` tool implementation:
   - Parameters: topic (string), technique (string - optional)
   - Uses techniques from `.bmad-core/data/brainstorming-techniques.md`
   - Returns: List of ideas with descriptions
4. `research_market` tool implementation:
   - Parameters: problem (string), industry (string)
   - Searches for existing solutions
   - Returns: Market landscape summary
5. `analyze_competitors` tool implementation:
   - Parameters: product_type (string), competitors (string[] - optional)
   - Analyzes competitor features, pricing, strengths, weaknesses
   - Returns: Competitive analysis report
6. `evaluate_feasibility` tool implementation:
   - Parameters: idea (string), constraints (string[] - optional)
   - Evaluates technical feasibility, business viability, resource requirements
   - Returns: Feasibility score (0-100) and recommendations
7. Tool output formatting:
   - Markdown formatted for readability in Claude
   - Tables for comparisons
   - Bullet lists for ideas
8. Context persistence:
   - Analyst results saved to MCP context
   - Can be referenced in PM phase
9. Unit tests for each analyst tool
10. Integration test: Use analyst tools in Claude Desktop conversation

---

## Story 9.3: pm.txt Integration

As a Claude Desktop user,
I want to use PRD generation tools from pm.txt in my conversations,
so that I can create complete PRDs through guided dialogue.

### Acceptance Criteria

1. pm.txt BMAD agent loaded in MCP server
2. PM tools exposed to Claude Desktop:
   - `create_prd`: Starts PRD creation workflow
   - `add_requirement`: Adds functional/non-functional requirement
   - `create_epic`: Defines epic with stories
   - `add_story`: Adds story with acceptance criteria
   - `finalize_prd`: Completes and uploads PRD to Arweave
3. `create_prd` tool implementation:
   - Parameters: project_name (string), description (string)
   - Initializes PRD structure
   - Returns: PRD ID for subsequent tool calls
4. `add_requirement` tool:
   - Parameters: prd_id, requirement_type ('functional' | 'non-functional'), requirement_text
   - Adds requirement to PRD
   - Auto-generates requirement ID (FR1, FR2, NFR1, etc.)
5. `create_epic` tool:
   - Parameters: prd_id, epic_title, epic_goal (2-3 sentences)
   - Creates epic structure
   - Returns: Epic ID
6. `add_story` tool:
   - Parameters: prd_id, epic_id, story_title, user_type, action, benefit, acceptance_criteria[]
   - Creates user story in format: "As a {user_type}, I want {action}, so that {benefit}"
   - Adds numbered acceptance criteria
7. `finalize_prd` tool:
   - Parameters: prd_id
   - Validates PRD completeness (all required sections present)
   - Formats PRD markdown
   - Uploads to Arweave
   - Returns: Arweave transaction ID
8. PRD validation:
   - All epics have ≥1 story
   - All stories have ≥1 acceptance criterion
   - Epics are sequentially numbered
9. Template compliance:
   - Generated PRD matches `.bmad-core/templates/prd-tmpl.yaml` structure
10. Integration test: Create complete PRD through tool calls in Claude Desktop

---

## Story 9.4: All MCP Tools

As a Claude Desktop user,
I want access to all 18+ Slop Machine tools for the complete workflow,
so that I can create projects, post opportunities, monitor progress, and manage funds without leaving Claude.

### Acceptance Criteria

1. **Project Creation Tools**:
   - `upload_prd`: Upload PRD to Arweave
   - `create_project`: Create project on Solana
   - `fund_project`: Add SOL to project escrow
2. **Opportunity Management Tools**:
   - `post_opportunity`: Post story opportunity
   - `list_bids`: View bids for opportunity
   - `accept_bid`: Accept winning bid
3. **Project Monitoring Tools**:
   - `get_project_status`: View project progress
   - `list_stories`: View all stories and statuses
   - `get_story_details`: View story with acceptance criteria, assigned node, validation results
   - `view_staging_url`: Get staging deployment URL
4. **Token Tools** (Epic 10 integration):
   - `create_token`: Launch pump.fun token
   - `buy_token`: Purchase project token
   - `get_token_price`: Check current token price
5. **Wallet Tools**:
   - `get_balance`: Check SOL balance
   - `get_transaction_history`: View transactions
6. **Analytics Tools**:
   - `get_project_analytics`: View completion %, budget burn rate, quality metrics
   - `get_node_performance`: View AI node statistics
7. **Document Tools**:
   - `view_arweave_doc`: Fetch and display document from Arweave
   - `download_architecture`: Get architecture.md for project
8. Tool organization:
   - Grouped by category (Project, Opportunity, Token, Wallet, Analytics, Documents)
   - Help text for each tool
   - Parameter descriptions with examples
9. Error handling per tool:
   - User-friendly error messages
   - Actionable suggestions (e.g., "Insufficient SOL - add X SOL to wallet")
10. Integration test: Execute all 18 tools in sequence (complete workflow)

---

## Story 9.5: Remote Mode (Deep Link Payments)

As a human Claude Desktop user,
I want to make Solana transactions via deep links that open my wallet app,
so that I can interact with Slop Machine without exposing my private key to the MCP server.

### Acceptance Criteria

1. Deep link generation for Solana transactions:
   - Format: `solana:{action}?{parameters}`
   - Example: `solana:transfer?recipient={address}&amount={lamports}&memo={memo}`
2. MCP tools return deep links instead of executing transactions directly:
   - `create_project` tool returns: "Click to create project: {deep_link}"
   - `fund_project` tool returns: "Click to fund: {deep_link}"
   - `accept_bid` tool returns: "Click to accept bid: {deep_link}"
3. Deep link parameters:
   - Recipient address (program address or node wallet)
   - Amount (lamports)
   - Memo (encodes operation type and parameters)
   - Custom instruction data (for program calls)
4. Phantom wallet deep link support:
   - Format: `https://phantom.app/ul/browse/{encoded_params}`
   - Opens Phantom mobile app or browser extension
5. User flow:
   - User asks Claude to create project
   - Claude calls `create_project` tool (MCP)
   - Tool returns deep link
   - Claude displays: "Click here to sign transaction: [link]"
   - User clicks link
   - Wallet opens with pre-filled transaction
   - User approves
   - Transaction submitted to Solana
6. Transaction status polling:
   - MCP server watches for transaction confirmation
   - Once confirmed, updates project status
   - Claude notifies user: "Project created! ID: {project_id}"
7. Error handling:
   - User rejects transaction (timeout after 5 minutes)
   - Transaction fails (display error from Solana)
8. Multi-step transactions:
   - Some operations require multiple transactions
   - Queue deep links sequentially
9. Unit tests for deep link generation
10. Integration test: Generate deep link, manually approve in wallet, verify transaction

---

## Story 9.6: Local Mode (Wallet Access for AI Agents)

As an AI agent using Claude Desktop,
I want direct wallet access to sign transactions programmatically,
so that I can execute Solana operations autonomously without deep links.

### Acceptance Criteria

1. Wallet configuration for AI agents:
   - MCP server config file: `~/.slop-mcp/config.yaml`
   - Contains Solana wallet private key (encrypted)
   - Permission flag: `allow_autonomous_transactions: true`
2. `loadWallet()` function:
   - Reads encrypted wallet from config
   - Decrypts using system keychain
   - Returns Keypair for signing
3. AI agent transaction execution:
   - `create_project` tool can sign and send transaction directly
   - No deep link needed
   - Returns transaction signature immediately
4. Safety mechanisms:
   - Maximum transaction value per call (e.g., 1 SOL)
   - Daily transaction limit (e.g., 10 SOL)
   - Require explicit user approval in config for autonomous mode
5. Audit logging:
   - Log all autonomous transactions
   - Include: timestamp, operation, amount, signature
   - Viewable by user in MCP dashboard
6. Mode detection:
   - MCP server detects if wallet configured for autonomous mode
   - If yes: Execute transactions directly
   - If no: Return deep links (remote mode from Story 9.5)
7. Wallet security:
   - Private key never logged
   - Encrypted at rest
   - Access controlled by file permissions
8. Transaction confirmation:
   - Wait for transaction confirmation before returning
   - Return signature and confirmation status
9. Unit tests for wallet loading
10. Integration test: AI agent creates project autonomously, verify transaction on Solana

---

## Story 9.7: Agent Orchestration

As a Claude Desktop user,
I want analyst and PM agents to hand off context automatically,
so that I can go from brainstorming to completed PRD in one conversation.

### Acceptance Criteria

1. Context handoff mechanism:
   - Analyst tools store results in MCP context:
     - `brainstorm_results`: List of ideas
     - `market_research`: Market analysis
     - `competitor_analysis`: Competitive insights
   - PM tools can access analyst context
   - PM uses analyst results to inform PRD
2. `start_prd_from_analysis` tool:
   - Parameters: None (uses context from analyst phase)
   - Automatically populates PRD sections:
     - Goals: Derived from selected brainstorm idea
     - Background: Derived from market research
     - Requirements: Suggested based on competitor analysis
   - Returns: Draft PRD for user review
3. Conversation flow:
   ```
   User: I want to build a productivity app
   Claude: *calls brainstorm tool*
          Here are 5 productivity app ideas...

   User: I like idea #3 (AI task manager)
   Claude: *calls research_market tool*
          Here's the market landscape for AI task managers...
          *calls analyze_competitors tool*
          Todoist, TickTick, and Motion.ai are key competitors...

   User: Let's create the PRD
   Claude: *calls start_prd_from_analysis*
          I've started your PRD with context from our analysis...
          *guides user through epic and story creation*
   ```
4. Context persistence across tools:
   - MCP maintains conversation context
   - Previous tool outputs available to later tools
5. Agent persona switching:
   - Analyst persona: Creative, exploratory, asks open questions
   - PM persona: Structured, detailed, asks specific requirements
6. Handoff triggers:
   - Explicit: User says "let's create the PRD"
   - Implicit: After analysis complete, suggest next step
7. Context review before PRD creation:
   - PM agent summarizes analyst findings
   - User can approve or request changes
8. Unit tests for context handoff
9. Integration test: Complete analyst → PM flow in one session

---

## Story 9.8: Deploy Remote MCP Server

As a platform developer,
I want to deploy the MCP server to a public URL (slopmachine.com/mcp),
so that Claude Desktop users can connect without running local server.

### Acceptance Criteria

1. MCP server dockerized:
   - Dockerfile for Node.js MCP server
   - Multi-stage build for optimization
   - Image size <100MB
2. Deployment to production hosting:
   - Hosted on reliable platform (Railway, Render, or Akash)
   - Public URL: `https://slopmachine.com/mcp` or `https://mcp.slopmachine.com`
   - HTTPS enabled with valid certificate
3. Claude Desktop configuration:
   - Remote MCP server URL in Claude config
   - Authentication token (if needed)
   - User adds server via: `claude mcp add https://slopmachine.com/mcp`
4. Rate limiting:
   - Per-user rate limits (e.g., 100 requests/hour)
   - Prevents abuse
   - Returns 429 status if exceeded
5. Monitoring:
   - Uptime monitoring (e.g., UptimeRobot)
   - Error tracking (e.g., Sentry)
   - Performance metrics (response times)
6. Scaling:
   - Auto-scaling for high traffic (if needed)
   - Load balancer if multiple instances
7. Security:
   - CORS configured for Claude Desktop origin
   - Input validation on all tool parameters
   - No wallet private keys on server (deep links only for remote mode)
8. Documentation:
   - Public docs: How to add MCP server to Claude Desktop
   - Tool reference: List of all available tools with examples
9. Health check endpoint:
   - `/health`: Returns server status
   - Used for uptime monitoring
10. Integration test: Connect to remote MCP from Claude Desktop, invoke tools

---

## Story 9.9: Publish npm Package

As a developer,
I want to publish @slop-machine/mcp-server as an npm package,
so that others can run the MCP server locally or contribute improvements.

### Acceptance Criteria

1. Package configuration (`package.json`):
   - Name: `@slop-machine/mcp-server`
   - Version: `1.0.0`
   - Description: "Model Context Protocol server for Slop Machine marketplace"
   - Main entry point: `dist/index.js`
   - TypeScript types: `dist/index.d.ts`
2. Build process:
   - `npm run build`: Compiles TypeScript to JavaScript
   - Output to `dist/` directory
   - Includes type definitions
3. Package contents:
   - Compiled JavaScript
   - Type definitions
   - README.md with usage instructions
   - LICENSE (MIT or Apache 2.0)
4. npm scripts:
   - `start`: Runs MCP server
   - `build`: Compiles TypeScript
   - `test`: Runs test suite
   - `lint`: Runs ESLint
5. Installation instructions:
   ```bash
   npm install -g @slop-machine/mcp-server
   slop-mcp-server --port 3000
   ```
6. CLI options:
   - `--port`: Server port (default: 3000)
   - `--config`: Path to config file
   - `--help`: Show usage info
7. Published to npm registry:
   - Package available at https://npmjs.com/package/@slop-machine/mcp-server
   - Version 1.0.0 or higher
8. Documentation:
   - README with:
     - Installation instructions
     - Configuration guide
     - Tool reference
     - Examples
9. GitHub repository:
   - Source code on GitHub
   - CI/CD for automated publishing
10. Integration test: Install from npm, run server, verify tools work

---

**Epic 9 Success Criteria:**
- ✅ MCP server working locally and remotely
- ✅ analyst.txt integrated with brainstorming and research tools
- ✅ pm.txt integrated with PRD generation tools
- ✅ 18+ tools available in Claude Desktop for complete workflow
- ✅ Remote mode supports human users with deep link payments
- ✅ Local mode supports AI agents with wallet access
- ✅ Agent orchestration enables analyst → PM handoff
- ✅ Remote MCP server deployed at slopmachine.com/mcp
- ✅ npm package published and installable
- ✅ Complete workflow possible in Claude Desktop without leaving conversation
- ✅ Zero-friction onboarding (idea to funded project in <30 minutes)

---
