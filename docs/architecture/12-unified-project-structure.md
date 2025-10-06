# 12. Unified Project Structure

**Complete Turborepo Monorepo Structure:**

```
american-nerd/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Run tests on PR
│       ├── deploy-web.yml              # Deploy frontend to Vercel
│       ├── deploy-api.yml              # Deploy backend to Railway
│       └── deploy-mcp.yml              # Deploy MCP server to Railway
├── .bmad-core/                         # BMAD methodology files (this project's own BMAD)
│   ├── agents/
│   ├── checklists/
│   ├── tasks/
│   └── templates/
├── apps/
│   ├── web/                            # Next.js 14 frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/                    # App Router pages
│   │   │   ├── components/             # React components
│   │   │   ├── hooks/                  # Custom hooks
│   │   │   ├── lib/                    # Utils, API client
│   │   │   ├── stores/                 # Zustand stores
│   │   │   └── styles/                 # Global CSS
│   │   ├── .env.local                  # Frontend env vars
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   ├── api/                            # Express.js REST API
│   │   ├── src/
│   │   │   ├── routes/                 # API endpoints
│   │   │   ├── middleware/             # Express middleware
│   │   │   ├── utils/                  # Logger, helpers
│   │   │   ├── app.ts                  # Express app
│   │   │   └── server.ts               # Entry point
│   │   ├── logs/                       # Log files
│   │   ├── .env                        # Backend env vars
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── mcp-server/                     # FastMCP server
│       ├── src/
│       │   ├── index.ts                # MCP server setup
│       │   ├── tools/                  # MCP tools
│       │   ├── prompts/                # MCP prompts
│       │   └── resources/              # MCP resources
│       ├── .env                        # MCP env vars
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── services/                       # Shared business logic
│   │   ├── src/
│   │   │   ├── opportunity-service.ts
│   │   │   ├── story-service.ts
│   │   │   ├── pr-validation-service.ts
│   │   │   ├── github-scaffolding-service.ts
│   │   │   ├── escrow-service.ts
│   │   │   ├── cache-service.ts
│   │   │   ├── metrics.ts
│   │   │   └── errors/
│   │   │       └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── database/                       # Prisma schema and client
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   └── index.ts                # Re-export Prisma client
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── contracts/                      # Smart contracts
│   │   ├── evm/                        # Solidity (Polygon)
│   │   │   ├── contracts/
│   │   │   │   ├── Escrow.sol
│   │   │   │   └── EscrowFactory.sol
│   │   │   ├── test/
│   │   │   │   ├── Escrow.test.ts
│   │   │   │   └── EscrowFactory.test.ts
│   │   │   ├── scripts/
│   │   │   │   └── deploy.ts
│   │   │   ├── typechain-types/        # Generated TypeScript types
│   │   │   ├── hardhat.config.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   └── solana/                     # Rust/Anchor (Solana)
│   │       ├── programs/
│   │       │   └── escrow/
│   │       │       ├── src/
│   │       │       │   └── lib.rs
│   │       │       └── Cargo.toml
│   │       ├── tests/
│   │       │   └── escrow.ts
│   │       ├── Anchor.toml
│   │       ├── Cargo.toml
│   │       └── package.json
│   ├── ui/                             # Shared UI components
│   │   ├── src/
│   │   │   └── components/             # shadcn-ui components
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── config/                         # Shared configs
│   │   ├── eslint/
│   │   │   └── index.js
│   │   ├── typescript/
│   │   │   └── base.json
│   │   └── package.json
│   └── tsconfig/                       # TypeScript configs
│       ├── base.json
│       ├── nextjs.json
│       ├── node.json
│       └── package.json
├── bmad-web/                           # BMAD agent bundles for clients
│   └── agents/
│       ├── analyst.txt
│       ├── bmad-orchestrator.txt
│       ├── pm.txt
│       ├── architect.txt
│       ├── ux-expert.txt
│       ├── dev.txt
│       └── qa.txt
├── docs/
│   ├── prd/                            # Sharded PRD
│   │   ├── index.md
│   │   ├── epic-details.md
│   │   └── ...
│   ├── architecture/                   # Sharded architecture docs
│   │   ├── testing-strategy.md
│   │   ├── coding-standards.md
│   │   ├── error-handling-strategy.md
│   │   └── monitoring-and-observability.md
│   └── architecture.md                 # This file (master architecture doc)
├── infrastructure/                     # IaC and deployment configs
│   ├── datadog/
│   │   ├── alerts.ts
│   │   └── synthetics.ts
│   └── railway/
│       ├── railway.json
│       └── railway.toml
├── scripts/                            # Build and deployment scripts
│   ├── setup-dev.sh
│   └── deploy.sh
├── .env.example                        # Environment variable template
├── .eslintrc.json                      # Root ESLint config
├── .gitignore
├── .prettierrc
├── package.json                        # Root package.json (workspace)
├── turbo.json                          # Turborepo configuration
├── pnpm-workspace.yaml                 # pnpm workspace config
├── tsconfig.json                       # Root TypeScript config
└── README.md
```

**Key Design Decisions:**

1. **Monorepo Benefits**: Shared types, atomic commits, unified CI/CD
2. **Package Organization**: Clear separation between apps (deployed) and packages (libraries)
3. **Service Layer**: `packages/services` ensures REST API and MCP server have identical logic
4. **Smart Contracts Separated by Chain**: EVM and Solana have different toolchains
5. **Agent Bundles**: `bmad-web/agents/` for web-based agent txt files (not in .bmad-core)

---
