# Epic List

**Epic 1: Foundation & Core Infrastructure**
**Goal:** Establish project infrastructure, authentication system, and basic platform presence with a deployable "hello world" marketplace, demonstrating end-to-end deployment capability while laying groundwork for all future functionality.

**Epic 2: Brief Creation & AI-Assisted Planning**
**Goal:** Enable clients to create comprehensive project briefs using MCP analyst.txt agent workflow for guided brainstorming and brief generation directly in Claude Desktop/ChatGPT, providing the foundational documentation that drives all downstream marketplace stages and validating core value proposition of quality brief generation.

**Epic 3: PM Marketplace**
**Goal:** Implement Product Manager marketplace where PM experts can bid to create comprehensive PRDs from client briefs, with GitHub-based PRD delivery (sharded using BMAD method) and escrow-protected payments, transforming client ideas into detailed product requirements documentation.

**Epic 4: Architect Marketplace**
**Goal:** Implement Architect marketplace where technical architecture experts can bid to create system specifications from PRDs, with GitHub-based architecture document delivery (sharded using BMAD method) and escrow-protected payments, providing technical foundation for development.

**Epic 5: UX Marketplace**
**Goal:** Implement UX marketplace where user experience experts can bid to create interface and flow designs from PRD and Architecture documentation, with GitHub-based design document delivery and escrow-protected payments, completing the planning phase with comprehensive UX specifications.

**Epic 6: Developer Marketplace & Story Implementation**
**Goal:** Implement Developer marketplace for story bidding and assignment, and GitHub PR-based code delivery workflow. Enable developers to browse available stories (decomposed by PM/Architect experts), submit bids, implement functionality following acceptance criteria, and submit work via Pull Requests with automated quality checks.

**Epic 7: QA Marketplace & Project Completion**
**Goal:** Implement QA Reviewer marketplace for code validation, automated and manual quality review workflows, payment release upon QA approval, and sequential story completion tracking. Complete the end-to-end BMAD workflow from idea to deployed code with quality assurance as the final gate.

**Epic 8: Fiat Payment Infrastructure (Stripe Connect)**
**Goal:** Implement fiat escrow system with Stripe Connect for USD payments, enabling clients to fund opportunities via credit card/ACH and experts to receive automated payouts. Establish platform fee collection ($100 + 5%) and 48-hour payment release SLA, activating all stubbed fiat payments from Epics 3-7.

**Epic 9: EVM Cryptocurrency Payment Infrastructure (Polygon)**
**Goal:** Implement non-custodial smart contract escrow for EVM-based chains (Polygon), supporting USDC/USDT/MATIC payments. Enable Metamask wallet integration, blockchain transaction monitoring via Alchemy, and automated payment release upon QA approval with ultra-low gas fees.

**Epic 10: Solana Cryptocurrency Payment Infrastructure**
**Goal:** Implement Solana program-based escrow for USDC-SPL payments with Phantom wallet integration, enabling global experts to receive payments with negligible gas fees (~$0.0001). Complete multi-currency payment infrastructure supporting USD, USDC, USDT, MATIC, and SOL.

**Epic 11: Reputation, Trust & Multi-Role Support**
**Goal:** Implement multi-dimensional reputation tracking across expert roles, post-project rating system, public expert profiles, and role fluidity features allowing single users to participate as clients, PMs, architects, developers, and QA reviewers with independent reputation scores.

**Epic 12: MCP Server Integration**
**Goal:** Implement Model Context Protocol server with complete API parity, enabling users to create briefs, browse marketplaces, bid on opportunities, fund escrow, submit work, and check project status directly within Claude Desktop or ChatGPT with identical functionality to web platform.
