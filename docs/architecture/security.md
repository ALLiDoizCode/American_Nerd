# Security

## Input Validation

- **Validation Library:** `zod` 3.0+ (TypeScript), Anchor built-in (Rust)
- **Validation Location:** API/instruction boundary before processing
- **Required Rules:**
  - All external inputs validated
  - Whitelist approach preferred
  - String length limits enforced

## Authentication & Authorization

- **Auth Method:** Cryptographic signature verification (Solana wallets)
- **Session Management:** Stateless (each transaction signed independently)
- **Required Patterns:**
  - Only account owners can modify accounts
  - MCP Remote NEVER has wallet private keys
  - AI nodes authenticate via wallet signature

## Secrets Management

- **Development:** `.env` files (gitignored)
- **Production:**
  - Encrypted keypair files (AI nodes)
  - Environment variables (MCP server)
- **Code Requirements:**
  - Never hardcode secrets
  - No secrets in logs

## API Security

- **Rate Limiting:** 100 requests/minute per IP (MCP Remote)
- **CORS Policy:** Allow `claude.ai` only
- **Security Headers:** X-Content-Type-Options, X-Frame-Options, HSTS
- **HTTPS Enforcement:** TLS required in production

## Data Protection

- **Encryption at Rest:** AI node keypairs encrypted (AES-256)
- **Encryption in Transit:** All API calls over HTTPS/TLS
- **PII Handling:** No PII on-chain (only wallet addresses)
- **Logging Restrictions:** Never log private keys, full addresses, API keys

## Dependency Security

- **Scanning Tool:** `npm audit`, `cargo audit`, Dependabot
- **Update Policy:**
  - Critical vulnerabilities: 24 hours
  - High severity: 1 week
  - Monthly reviews for medium/low

## Escrow Security (Custom Implementation)

- **Escrow Provider:** Custom native SOL escrow program (purpose-built for marketplace)
- **Integration:** Cross-Program Invocation (CPI) from marketplace contracts
- **Security Measures:**
  - Formal audit by OtterSec or Neodyme (tier-1 Solana auditors, $12K, Week 5-7)
  - 90%+ test coverage before audit submission
  - Gradual rollout with escrow limits ($100 → $500 → $1K → unlimited over 8-12 weeks)
  - Bug bounty program (10% of TVL on Immunefi)
  - Real-time monitoring dashboard with anomaly detection
  - Multisig upgrade authority (prevents unilateral changes)
  - Simple, purpose-built design (~280 lines, minimal attack surface)
  - PDA-based vault (no private key exposure)
  - Checked arithmetic (prevents integer overflow/underflow)
  - Reference: `docs/solana-escrow-alternatives-research.md`, `docs/escrow-decision-brief.md`

---
