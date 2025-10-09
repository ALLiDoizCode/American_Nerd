# Coding Standards

## Core Standards

- **Languages & Runtimes:**
  - Rust 1.75+ (Solana programs)
  - TypeScript 5.3+ (Node packages)
  - Node.js 20.11.0 LTS (runtime)

- **Style & Linting:**
  - TypeScript: ESLint with `@typescript-eslint/recommended` + Prettier
  - Rust: `rustfmt` (default Anchor config) + Clippy

- **Test Organization:**
  - Solana: `packages/programs/tests/*.spec.ts`
  - TypeScript: Colocated `*.test.ts` files
  - Coverage: Minimum 80% for critical paths

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Solana Programs** | snake_case | `create_opportunity`, `submit_bid` |
| **Accounts (Rust)** | PascalCase | `Project`, `NodeRegistry` |
| **TypeScript Classes** | PascalCase | `ArweaveService`, `BlockchainClient` |
| **TypeScript Functions** | camelCase | `uploadToArweave`, `calculateBid` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `PLATFORM_FEE_BPS` |

## Critical Rules

- **Never use `console.log` in production code** - Use winston logger
- **All blockchain transactions MUST be simulated before submission**
- **PDAs MUST be derived using proper seeds, never hardcoded**
- **Private keys MUST never be logged or exposed**
- **All Arweave uploads MUST include metadata tags**
- **Solana transactions MUST include priority fees**
- **MCP tool responses MUST be JSON serializable**
- **All async operations MUST have timeouts**
- **Escrow amounts MUST be validated before transfer** (validated in custom escrow program)
- **All user-provided strings MUST be length-validated**
- **BigInt/u64 arithmetic MUST use checked operations**

---
