# 1. Introduction

## Project Overview

The **American Nerd Marketplace** is a multi-stage expert marketplace platform that monetizes the BMAD (Bmad Subroutine Library) methodology for software project execution. The platform connects clients with specialized experts across six distinct stages: Analyst, PM, Architect, UX, Developer, and QA.

**Core Value Proposition:** Zero-friction project creation through MCP-based conversational brief creation with Analyst agent and automated GitHub repository initialization with complete BMAD Method v4.44.1+ preinstalled.

**Key Differentiators:**
- **MCP-First Client Experience**: Required conversational brief creation via Claude Desktop/Claude.ai/ChatGPT with single Analyst agent conducting brainstorming and building structured brief interactively
- **Six Specialized Marketplaces**: Each stage (Analyst, PM, Architect, UX, Dev, QA) has dedicated experts and workflows
- **Complete BMAD Preinstallation**: Every GitHub repo initialized with .bmad-core/ (agents, tasks, templates, checklists), .claude/ (slash commands), and optional IDE configs
- **Tool-Agnostic Expert Workflow**: Experts use any tool (Claude Code, Cursor, Windsurf, Copilot, Vim) with BMAD method providing methodology guidance
- **Automated GitHub Collaborator Lifecycle**: Platform adds expert write access on bid acceptance, removes on approval/timeout
- **GitHub-Native Deliverable Tracking**: Expert work tracked via commits/PRs, automated quality checks via GitHub Actions
- **Multi-Currency Escrow**: Support for USDC/USDT/ETH (Polygon) and USDC-SPL/SOL (Solana)
- **Dual Interface Architecture**: Web UI for marketplace/project management (required), MCP server for brief creation (required) and marketplace actions (optional)

## Technical Approach

This architecture employs a **monorepo fullstack approach** with:
- **Frontend**: Next.js 14 with App Router for marketplace, project management, and payment UIs (React Server Components + Client Components)
- **Backend**: Express.js REST API with shared service layer
- **MCP Server**: REQUIRED for client brief creation (conversational brainstorming + brief generation), OPTIONAL for marketplace actions - supports NPM package (Claude Desktop), SSE endpoint (Claude.ai), and ChatGPT plugin
- **GitHub Integration**: Automated repo creation with BMAD Method v4.44.1+ installation, collaborator lifecycle management, PR webhook monitoring
- **Smart Contracts**: Solidity (Polygon) + Rust/Anchor (Solana) for non-custodial escrow
- **Infrastructure**: Vercel (frontend) + Railway (API + MCP) + Supabase (PostgreSQL + Auth + Storage)
- **Monorepo Tool**: Turborepo for build orchestration and caching

The architecture prioritizes **API parity** between REST API and MCP server through a shared service layer (`packages/services`), ensuring consistent business logic across interfaces. The **MCP server is required for brief creation** as conversational brainstorming with the Analyst agent is the primary client onboarding flow.

## Starter Template

**N/A - Greenfield Project**

No starter template was used. The architecture is designed from scratch to meet the unique requirements of a multi-stage marketplace with BMAD methodology integration.

---
