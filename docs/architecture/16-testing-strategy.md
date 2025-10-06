# 16. Testing Strategy

[See detailed testing strategy document](./architecture/testing-strategy.md)

**Summary:**
- **Unit Tests:** 80%+ coverage target for services, Vitest for frontend, Jest for backend
- **Integration Tests:** API + database tests with Supertest
- **Smart Contract Tests:** 100% coverage with Hardhat (EVM) and Anchor (Solana)
- **E2E Tests:** Playwright, deferred to post-MVP per PRD
- **Accessibility Tests:** WCAG 2.1 AA compliance (see below)

## Accessibility Testing Requirements

**Compliance Target:** WCAG 2.1 Level AA (per Front-End Spec Section 7)

**Automated Testing:**
- `eslint-plugin-jsx-a11y` - Component accessibility checks during development
- Axe DevTools - Run on all pages during development
- Lighthouse Accessibility audit - Target score 95+ on all major pages

**Manual Testing:**
- Keyboard-only navigation testing for all critical workflows
- Screen reader testing (NVDA on Windows, VoiceOver on macOS)
- Color contrast verification using Contrast Checker
- Focus order verification (logical tab sequence)

**User Testing:**
- Recruit at least 2 users with disabilities for beta testing
- Test with keyboard-only users and screen reader users
- Gather feedback on form completion, navigation, and transaction flows

**Critical Workflows to Test:**
- Expert bidding flow (keyboard navigation through opportunity cards, bid forms)
- Escrow funding (accessible wallet connection prompts)
- QA review interface (side-by-side panels must be keyboard navigable)
- Project dashboard (screen reader-friendly status indicators)

**Reference:** See `docs/front-end-spec.md` Section 7 for complete accessibility requirements and testing strategy.

---
