# Test Strategy and Standards

## Testing Philosophy

- **Approach:** Test-driven for critical paths (escrow 90%+ coverage, payment), test-after for features
- **Coverage Goals:**
  - Smart contracts: 90%+
  - TypeScript services: 80%+
  - Integration tests: All critical workflows
- **Test Pyramid:** 60% unit, 30% integration, 10% end-to-end

## Test Types and Organization

### Unit Tests

- **Framework:** Vitest 1.3+ (TypeScript), anchor test (Solana)
- **File Convention:** Colocated `*.test.ts` files
- **Coverage Requirement:** 80% minimum
- **Mocking:** Vitest built-in mocks; mock all external dependencies

### Integration Tests

- **Scope:** Component interactions without mocking internal services
- **Test Infrastructure:**
  - Solana: Local validator via Anchor
  - Arweave: Mock service
  - mem0: In-memory SQLite
  - GitHub: Mocked using `nock`
  - Claude API: Mocked responses

### End-to-End Tests

- **Framework:** Playwright or custom Node.js scripts
- **Scope:** Complete workflows from client perspective
- **Environment:** Devnet
- **Scenarios:** PRD→Architecture, Story implementation, Token-funded projects

---
