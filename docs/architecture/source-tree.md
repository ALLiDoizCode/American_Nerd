# Source Tree

```
slop-machine/
├── packages/
│   ├── programs/                          # Solana smart contracts (Anchor)
│   │   ├── Anchor.toml                    # Anchor configuration
│   │   ├── Cargo.toml                     # Rust workspace config
│   │   ├── programs/
│   │   │   └── slop-machine/              # Main Solana program
│   │   │       ├── Cargo.toml
│   │   │       ├── Xargo.toml
│   │   │       └── src/
│   │   │           ├── lib.rs             # Program entry point
│   │   │           ├── instructions/      # Instruction handlers
│   │   │           │   ├── mod.rs
│   │   │           │   ├── create_project.rs
│   │   │           │   ├── create_opportunity.rs
│   │   │           │   ├── submit_bid.rs
│   │   │           │   ├── accept_bid.rs
│   │   │           │   ├── submit_work.rs
│   │   │           │   ├── validate_work.rs
│   │   │           │   ├── create_story.rs
│   │   │           │   ├── submit_pr.rs
│   │   │           │   ├── submit_qa_review.rs
│   │   │           │   ├── register_node.rs
│   │   │           │   ├── initialize_token_funding.rs
│   │   │           │   └── update_reputation.rs
│   │   │           ├── state/              # Account structures
│   │   │           │   ├── mod.rs
│   │   │           │   ├── project.rs
│   │   │           │   ├── opportunity.rs
│   │   │           │   ├── bid.rs
│   │   │           │   ├── work.rs
│   │   │           │   ├── story.rs
│   │   │           │   ├── pull_request.rs
│   │   │           │   ├── qa_review.rs
│   │   │           │   ├── node_registry.rs
│   │   │           │   └── project_token.rs
│   │   │           ├── errors.rs           # Custom error types
│   │   │           └── utils.rs            # Helper functions
│   │   ├── tests/                          # Anchor integration tests
│   │   │   ├── slop-machine.spec.ts
│   │   │   ├── project-workflow.spec.ts
│   │   │   ├── story-workflow.spec.ts
│   │   │   └── token-funding.spec.ts
│   │   └── migrations/                     # Deployment scripts
│   │       └── deploy.ts
│   │
│   ├── ai-agent-node/                      # AI agent runtime
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts                    # Node entry point
│   │   │   ├── config/
│   │   │   │   ├── env.ts                  # Environment variables
│   │   │   │   └── constants.ts            # Constants
│   │   │   ├── blockchain/                 # Solana interaction
│   │   │   │   ├── connection.ts           # RPC setup
│   │   │   │   ├── event-listener.ts       # Event subscriptions
│   │   │   │   ├── transaction-builder.ts  # TX creation
│   │   │   │   └── program-client.ts       # Anchor client
│   │   │   ├── workers/                    # Work execution
│   │   │   │   ├── architect-worker.ts     # Architecture generation
│   │   │   │   ├── developer-worker.ts     # Code generation
│   │   │   │   └── qa-worker.ts            # QA review
│   │   │   ├── services/
│   │   │   │   ├── arweave.service.ts      # Turbo SDK integration
│   │   │   │   ├── claude.service.ts       # Claude API
│   │   │   │   ├── github-mcp.service.ts   # GitHub MCP client (official server)
│   │   │   │   ├── mem0.service.ts         # Memory layer
│   │   │   │   ├── pyth.service.ts         # Price oracle
│   │   │   │   ├── social.service.ts       # Twitter/Discord/Telegram
│   │   │   │   └── sharding.service.ts     # md-tree auto-sharding
│   │   │   ├── mcp/
│   │   │   │   └── local-server.ts         # Local MCP server (wallet access)
│   │   │   └── utils/
│   │   │       ├── logger.ts
│   │   │       ├── retry.ts
│   │   │       └── wallet.ts               # Keypair management
│   │   ├── ecosystem.config.js             # PM2 configuration
│   │   └── Dockerfile                      # Optional containerization
│   │
│   ├── remote-mcp-server/                  # Remote MCP for humans
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts                    # MCP server entry
│   │   │   ├── tools/                      # MCP tool implementations
│   │   │   │   ├── brainstorm.ts           # analyst.txt tools
│   │   │   │   ├── market-research.ts
│   │   │   │   ├── create-brief.ts
│   │   │   │   ├── generate-prd.ts         # pm.txt tools
│   │   │   │   ├── upload-arweave.ts
│   │   │   │   ├── create-project.ts
│   │   │   │   ├── launch-token.ts
│   │   │   │   ├── post-opportunity.ts
│   │   │   │   ├── view-bids.ts
│   │   │   │   ├── accept-bid.ts
│   │   │   │   └── review-work.ts
│   │   │   ├── services/
│   │   │   │   ├── arweave.service.ts      # Turbo SDK
│   │   │   │   ├── pumpportal.service.ts   # Token creation
│   │   │   │   ├── pyth.service.ts         # Price feeds
│   │   │   │   └── deep-link.service.ts    # Wallet deep links
│   │   │   ├── agents/
│   │   │   │   ├── analyst.agent.ts        # BMAD analyst.txt
│   │   │   │   └── pm.agent.ts             # BMAD pm.txt
│   │   │   └── utils/
│   │   │       └── blockchain-reader.ts    # Read-only RPC
│   │   └── .env.example
│   │
│   ├── shared-types/                       # Shared TypeScript types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── accounts.ts                 # Anchor IDL types
│   │   │   ├── enums.ts                    # Status enums
│   │   │   └── api.ts                      # API interfaces
│   │   └── scripts/
│   │       └── generate-types.ts           # IDL → TS converter
│   │
│   ├── shared-utils/                       # Common utilities
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── pda.ts                      # PDA derivation
│   │       ├── pricing.ts                  # SOL/USD conversion
│   │       ├── arweave-validator.ts
│   │       └── wallet-formatter.ts
│   │
│   └── bmad-core/                          # BMAD templates & sharding
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── templates/                  # YAML templates
│           │   ├── prd-template.yaml
│           │   ├── architecture-template.yaml
│           │   └── story-template.yaml
│           ├── sharding/                   # md-tree integration
│           │   ├── document-sharder.ts
│           │   ├── section-identifier.ts   # AI-powered selection
│           │   └── context-loader.ts
│           └── agents/                     # BMAD agent orchestration
│               ├── analyst.ts
│               ├── pm.ts
│               └── architect.ts
│
├── scripts/                                # Monorepo management
│   ├── setup.sh                            # Initial setup
│   ├── build-all.sh                        # Build all packages
│   ├── deploy-programs.sh                  # Deploy Solana programs
│   └── start-dev.sh                        # Start dev environment
│
├── .github/                                # CI/CD
│   └── workflows/
│       ├── test.yml                        # Run tests on PR
│       ├── deploy-programs.yml             # Deploy to devnet/mainnet
│       └── publish-packages.yml            # Publish npm packages
│
├── docs/                                   # Project documentation
│   ├── prd.md                              # Product requirements
│   ├── architecture.md                     # This document
│   ├── solana-escrow-alternatives-research.md  # Comprehensive escrow research
│   ├── escrow-decision-brief.md            # Executive escrow decision summary
│   ├── github-mcp-research.md              # GitHub MCP server research
│   ├── api/                                # API documentation
│   │   └── solana-program.md
│   ├── examples/                           # Code examples
│   │   └── github-mcp-integration.ts       # GitHub MCP integration example
│   └── guides/
│       ├── node-operator-setup.md
│       ├── client-onboarding.md
│       └── validator-guide.md
│
├── turbo.json                              # Turborepo config
├── package.json                            # Root package.json (workspaces)
├── pnpm-workspace.yaml                     # pnpm workspaces
├── .env.example                            # Environment template
├── .gitignore
├── README.md
└── LICENSE
```

---
