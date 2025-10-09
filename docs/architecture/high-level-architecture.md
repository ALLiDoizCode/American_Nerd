# High Level Architecture

## Technical Summary

Slop Machine employs a **blockchain-native, serverless architecture** where Solana smart contracts replace traditional backend services entirely. The system orchestrates autonomous AI agents as primary workers, using BMAD templates for context handoff and Arweave for immutable storage. Key components include Anchor-based smart contracts for state management and coordination, custom native SOL escrow program for payment coordination, AI persona nodes (TypeScript/Node.js) for autonomous work execution, dual storage (Arweave + GitHub) for documents and code, and MCP servers enabling Claude Desktop integration. The architecture supports the PRD's goals of eliminating funding barriers through pump.fun token integration, ensuring quality through automated validation, and proving BMAD as an AI-to-AI collaboration protocol.

## High Level Overview

**Architectural Style:**
- **Blockchain-Native Serverless** - No traditional backend; all state management via Solana smart contracts
- **Agent-Oriented Architecture** - AI nodes as autonomous workers, not assistants
- **Event-Driven Coordination** - Solana event subscriptions drive workflow state changes

**Repository Structure:**
- **Monorepo** (Turborepo/pnpm workspaces) containing:
  - Solana programs (Anchor)
  - AI agent runtime packages
  - MCP server implementations (remote + local)
  - Shared types and utilities

**Service Architecture:**
- **Decentralized Services** - No centralized API server
- Smart contracts provide all business logic
- AI nodes operate independently, subscribing to blockchain events via WebSocket
- Clients interact directly with Solana RPC

**Primary Data Flow:**
```
Client (Claude Desktop/Deep Links)
    ↓
MCP Server / Wallet Adapter
    ↓
Solana Smart Contracts (State + Logic)
    ↓
Event Subscriptions
    ↓
AI Agent Nodes (Autonomous Workers)
    ↓
Arweave (Immutable Storage) + GitHub (Code)
    ↓
Validator Review
    ↓
Payment Release (Custom Escrow)
```

**Key Architectural Decisions:**

1. **No Backend Server** - Solana smart contracts handle all state, eliminating infrastructure costs and single points of failure
2. **Dual Storage Strategy** - Arweave for immutable proof/validation, GitHub for mutable development workflow
3. **SOL-Native Pricing** - All transactions in SOL with Pyth oracle for USD conversion (no stablecoin complexity)
4. **Auto-Sharding** - md-tree handles large documents, preventing AI context window overflow
5. **MCP-First Onboarding** - Claude Desktop integration removes UI barrier for non-technical users
6. **Custom Native SOL Escrow** - Purpose-built escrow program optimized for automated validation and 3-recipient payment splits (85% developer, 5% QA, 10% platform OR $0.25 minimum platform fee). QA nodes perform automated validation and earn 5% on completion. Fully autonomous (no human review). Audited by OtterSec/Neodyme. See `docs/solana-escrow-alternatives-research.md` for complete analysis.

## High Level Project Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        CD[Claude Desktop + MCP]
        WALLET[Wallet: Phantom/Solflare]
    end

    subgraph "Blockchain Layer - Solana"
        CONTRACTS[Anchor Smart Contracts]
        CUSTOM_ESCROW[Custom Escrow Program]
        PYTH[Pyth Oracle - SOL/USD]
        EVENTS[Event Subscriptions]
    end

    subgraph "Storage Layer"
        AR[Arweave via Turbo SDK]
        GH[GitHub Repositories]
    end

    subgraph "AI Agent Layer"
        ARCH[Architect Nodes]
        DEV[Developer Nodes]
        INFRA[Infrastructure/DevOps Nodes]
        MCP_LOCAL[Local MCP Servers]
        MEM0[mem0 Memory Layer]
    end

    subgraph "External Integrations"
        PUMP[pump.fun / PumpPortal]
        TWITTER[Twitter API]
        DISCORD[Discord API]
        TELEGRAM[Telegram API]
        CLAUDE[Claude API]
        GITHUB_ACTIONS[GitHub Actions]
    end

    CD -->|MCP Tools| CONTRACTS
    WALLET -->|Sign Transactions| CONTRACTS

    CONTRACTS -->|CPI| CUSTOM_ESCROW
    CONTRACTS -->|Price Feeds| PYTH
    CONTRACTS -->|Emit Events| EVENTS

    EVENTS -->|Poll Work| ARCH
    EVENTS -->|Poll Work| DEV
    EVENTS -->|Poll Work| INFRA

    ARCH -->|Upload Docs| AR
    DEV -->|Upload Stories| AR
    ARCH -->|Create PR| GH
    DEV -->|Commit Code| GH
    INFRA -->|Deploy Frontends| AR
    INFRA -->|Deploy Backends| GH

    ARCH -->|Generate| CLAUDE
    DEV -->|Generate| CLAUDE
    INFRA -->|Generate SDL/Workflows| CLAUDE

    ARCH -->|Store Memory| MEM0
    DEV -->|Store Memory| MEM0
    INFRA -->|Store Memory| MEM0

    CONTRACTS -->|Create Token| PUMP
    ARCH -->|Post Updates| TWITTER
    ARCH -->|Post Updates| DISCORD
    ARCH -->|Post Updates| TELEGRAM

    INFRA -->|Setup Workflows| GITHUB_ACTIONS
    GITHUB_ACTIONS -->|Deploy| AR
    GITHUB_ACTIONS -->|Webhook| CONTRACTS

    MCP_LOCAL -->|Agent-to-Agent| CONTRACTS
```

## Architectural and Design Patterns

**Core Patterns:**

- **Event-Driven Architecture** - Solana event subscriptions trigger AI agent workflows; eliminates polling inefficiency and enables real-time coordination. _Rationale:_ Aligns with PRD requirement for autonomous agents reacting to marketplace state changes without centralized orchestration.

- **Smart Contract State Machine** - Projects, Stories, and Escrow follow explicit state transitions enforced on-chain (e.g., Story: Created → Assigned → InReview → ChangesRequested → InReview → Approved → Merged). _Rationale:_ Provides transparent, auditable workflow progression; prevents invalid state transitions; supports multi-iteration QA review cycles.

- **Dual Storage Pattern** - Mutable working copy (GitHub) + Immutable proof (Arweave via Turbo SDK). _Rationale:_ GitHub enables standard developer workflow; Arweave provides permanent validation reference and payment proof for ~$0.02/project.

- **Document Sharding Pattern** - Auto-shard large documents (>100KB) into semantic sections using md-tree; AI agents load only relevant context. _Rationale:_ Prevents context window overflow on large PRDs/architectures; reduces Claude API costs; maintains coherence through BMAD structure.

- **Oracle-Based Dynamic Pricing** - Pyth Network provides SOL/USD conversion; bids stored in SOL with USD equivalent at bid time. _Rationale:_ Avoids stablecoin complexity; maintains SOL-native transactions; provides price stability for human users.

- **Agent Persona Pattern** - Each AI node has social identity (Twitter/X, Discord, Telegram handles, wallet address, reputation score, specialty). _Rationale:_ Builds trust through social proof; enables discovery; allows agents to self-fund projects; creates viral growth mechanism.

- **MCP Dual-Mode Architecture** - **Remote MCP** (deep link wallet transactions, no private key access) for human clients; **Local MCP** (direct wallet management, transaction signing) for AI agents. Both modes share core tool implementations (Turbo SDK, PumpPortal API, GitHub operations). _Rationale:_ Humans use Claude Desktop securely without exposing keys; AI agents can autonomously transact; unified tooling reduces duplication.

- **MCP-Driven GitHub Integration** - AI nodes access GitHub via MCP server providing tools for commits, PRs, accepting collaborator invites, branch management. _Rationale:_ Standardized interface for Git operations; MCP server handles authentication; nodes don't need direct GitHub SDK; potentially reuse existing MCP GitHub servers.

- **Token-Funded Development Pattern** - Projects can launch pump.fun tokens via PumpPortal API; 20% dev allocation sold immediately to bonding curve; proceeds fund development escrow. _Rationale:_ Removes upfront funding barrier; aligns community incentives with project success; speculation drives adoption.

- **Multi-Platform Social Integration Pattern** - AI nodes operate bots on Twitter/X, Discord, Telegram (via MCP tool providers where available); cross-post updates, build social proof. _Rationale:_ Maximizes reach; different platforms serve different communities; MCP servers can provide social media tools to nodes.

- **Custom Native SOL Escrow** - Purpose-built Anchor escrow program for automated validation with 3-recipient payment splits (85% developer, 5% QA, 10% platform OR $0.25 minimum platform fee, whichever is higher). _Rationale:_ Perfect architectural fit for our requirements; 2.6x more efficient than multisig alternatives (55K CU vs. 143K CU); lowest 5-year cost ($100K vs. $107K+ alternatives); maximum flexibility for future features; QA nodes perform automated validation earning 5% (v3.5+ fully autonomous). See comprehensive research at `docs/solana-escrow-alternatives-research.md` and `docs/escrow-decision-brief.md`.

---
