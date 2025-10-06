# 18. Error Handling Strategy

[See detailed error handling strategy document](./architecture/error-handling-strategy.md)

**Summary:**
- **Custom Error Hierarchy:** AppError → ValidationError, NotFoundError, UnauthorizedError, etc.
- **Centralized Error Middleware:** Express error handler maps errors to HTTP responses
- **Frontend Error Boundaries:** React ErrorBoundary catches component crashes
- **Smart Contract Error Parsing:** Translate Solidity reverts to user-friendly messages
- **Retry Logic:** Exponential backoff for GitHub/Alchemy/Helius API failures

---
