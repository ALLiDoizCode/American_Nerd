# Error Handling Strategy

## General Approach

- **Error Model:** Result/Either pattern for TypeScript; Rust `Result<T, E>` for Solana programs
- **Exception Hierarchy:**
  - Custom error classes extending base `AppError`
  - Solana: Anchor error codes with descriptive messages
  - TypeScript: Error types (BlockchainError, APIError, ValidationError, etc.)
- **Error Propagation:**
  - Solana: Return `Err()` from instructions, propagate to caller
  - TypeScript: Throw custom errors, catch at service boundaries
  - MCP tools: Return error responses (never throw to client)
  - AI agents: Log errors, retry with exponential backoff, mark work as failed if persistent

## Logging Standards

- **Library:**
  - TypeScript: `winston` 5.0+
  - Rust: `env_logger` (Anchor default)
- **Format:** JSON structured logs for production, pretty-print for development
- **Levels:** ERROR (critical failures), WARN (recoverable issues), INFO (important events), DEBUG (detailed flow), TRACE (verbose)
- **Required Context:**
  - **Correlation ID:** UUID per request/workflow (track across services)
  - **Service Context:** Service name, version, node type
  - **User Context:** Wallet address (first 8 chars only), Node ID
  - Never log private keys or sensitive data

## Error Handling Patterns

### External API Errors

- **Retry Policy:** Exponential backoff (1s, 2s, 4s, max 3 retries) for transient errors
- **Circuit Breaker:** Track failure rate per service; open circuit if >50% failures in 1 minute
- **Timeout Configuration:**
  - Solana RPC: 30s
  - Arweave upload: 60s
  - Claude API: 120s
  - GitHub API: 30s
  - Pyth oracle: 5s
- **Error Translation:** Map external API errors to domain errors

### Business Logic Errors

- **Custom Exceptions:** Domain-specific error classes (WorkSubmissionError, BidRejectedError, etc.)
- **User-Facing Errors:** Structured error responses with actionable messages
- **Error Codes:** Consistent error code system (VALIDATION_*, BLOCKCHAIN_*, ARWEAVE_*, etc.)

### Data Consistency

- **Transaction Strategy:** Solana atomic transactions; multi-step workflows use idempotent operations
- **Compensation Logic:** Store failed operations for retry; escrow issues handled by validator manual override
- **Idempotency:** All operations check existing state before creating accounts

---
