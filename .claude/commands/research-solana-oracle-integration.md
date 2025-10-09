# Research: Solana Oracle Integration Solutions

**Command**: `/BMad:research:solana-oracle-integration`

## Purpose

Research viable solutions for integrating real-time SOL/USD price oracles in Solana Anchor programs, specifically resolving Pyth Network SDK dependency conflicts that block production deployment.

## Research Objective

Find a production-ready solution for integrating real-time SOL/USD price feeds into a Solana Anchor 0.29-0.31 program, resolving current Pyth Network SDK dependency conflicts.

## Background Context

**Project**: Slop Machine - Solana-based marketplace with AI node bidding system

**Requirement**: Real-time SOL/USD price conversion for:
- Minimum bid validation ($2.50 USD)
- Dynamic stake calculations based on USD values
- Historical price tracking at bid submission time

**Current Blocker**:
- Pyth Network SDK integration blocked by transitive dependency conflicts
- All Anchor downgrade paths (0.29, 0.30, 0.31) tested and blocked
- Root cause: pyth-solana-receiver-sdk requires anchor-lang 0.30.1, creating version conflicts

**Technical Stack**:
- Anchor Framework: Currently 0.31.1 (willing to downgrade to 0.29.0 if solution works)
- Rust: 1.92.0-nightly (can use stable 1.82.0)
- Solana SDK: Flexible
- Target Networks: Devnet (testing) → Mainnet (production)

**Constraints**:
- Must compile successfully with chosen Anchor version
- Must provide price staleness validation (≤60 seconds)
- Must provide confidence intervals for risk assessment
- Must be production-ready (not experimental)
- Implementation timeline: Needs solution within 1 week

## Research Questions

### Primary Questions (Must Answer)

1. **Working Pyth Integration**: Are there any documented, production-verified configurations for Pyth Network integration with Anchor 0.29.0-0.31.1 that successfully compile and run?
   - Exact Cargo.toml dependency versions
   - Any workspace patches or overrides required
   - Code examples showing actual usage with `Account<PriceUpdateV2>` or equivalent

2. **Alternative Oracle Solutions**: What alternative price oracle solutions work with Anchor 0.29.0-0.31.1 and provide SOL/USD price feeds?
   - **Switchboard V2/V3**: Compatibility, API examples, feature comparison
   - **Chainlink Solana**: Integration status, SOL/USD feed availability
   - **Other oracles**: Flux, DIA, Orca TWAP, etc.
   - Comparison: staleness checks, confidence intervals, update frequency, devnet support

3. **Manual Pyth Parsing**: What is the exact byte layout and deserialization approach for Pyth price accounts without using the SDK?
   - Current Pyth V2 price account structure (October 2025)
   - Rust deserialization code examples
   - Production implementations using this approach
   - Maintenance considerations (format change frequency)

4. **Hybrid Approaches**: Are there intermediate solutions that might work?
   - Off-chain price fetching via Pyth HTTP API + on-chain verification
   - CPI to existing Pyth programs without SDK dependency
   - Price feed aggregators that wrap Pyth
   - Using older pyth-sdk-solana versions (0.7-0.9 range)
   - AccountInfo-based integration patterns that avoid `Account<PriceUpdateV2>`

### Secondary Questions (Nice to Have)

5. **Ecosystem Timeline**: When is Pyth planning to release Anchor 0.31+ compatible SDKs?
   - GitHub issues or PRs tracking this work
   - Pyth team communication on timeline
   - Beta/RC versions available for testing

6. **Anchor Version Strategy**: Would upgrading to Anchor 0.32+ resolve conflicts?
   - Anchor 0.32/0.33 release status
   - Breaking changes from 0.31 → 0.32+
   - Pyth SDK compatibility with newer Anchor versions

7. **Similar Project Solutions**: How have other Solana projects solved this problem?
   - Production Anchor programs using Pyth successfully (2024-2025)
   - GitHub repositories with working examples and CI builds
   - Solana Stack Exchange solutions with verification

## Research Methodology

### Information Sources (Priority Order)

**Primary Sources** (Highest Priority):

1. **Live Code Repositories**: GitHub search for Anchor + Pyth projects with recent commits
   - Search: `"anchor-lang" "pyth" language:rust pushed:>2024-01-01`
   - Look for Cargo.toml + working builds + CI/CD status
   - Clone and verify build if promising

2. **Official Documentation**:
   - Pyth Network Solana docs: https://docs.pyth.network/price-feeds/solana
   - Switchboard docs: https://docs.switchboard.xyz/
   - Chainlink Solana docs: https://docs.chain.link/solana
   - Anchor migration guides

3. **Community Q&A**:
   - Solana Stack Exchange (2024-2025 threads)
   - Pyth Discord #developers channel
   - Anchor Discord #help channel
   - Reddit r/solana developer discussions

**Secondary Sources**:

4. **Technical Specifications**:
   - Pyth price account byte layout documentation
   - Switchboard program IDL and account structures
   - Chainlink Solana technical docs
   - Alternative oracle technical specs

5. **Comparison Resources**:
   - Oracle comparison articles/benchmarks
   - Solana DeFi project tech choices
   - Developer blog posts on oracle integration

### Analysis Framework

**Solution Evaluation Matrix** (Score each option 0-10):

| Criteria | Weight | Pyth (if viable) | Switchboard | Manual Parse | Chainlink | Other |
|----------|--------|------------------|-------------|--------------|-----------|-------|
| **Feasibility** |  |  |  |  |  |  |
| Compiles successfully | 20% | ? | ? | ? | ? | ? |
| Implementation effort (lower = better) | 15% | ? | ? | ? | ? | ? |
| Maintenance burden (lower = better) | 10% | ? | ? | ? | ? | ? |
| **Functionality** |  |  |  |  |  |  |
| Price staleness validation | 15% | ? | ? | ? | ? | ? |
| Confidence intervals | 10% | ? | ? | ? | ? | ? |
| Update frequency | 10% | ? | ? | ? | ? | ? |
| **Production Readiness** |  |  |  |  |  |  |
| Battle-tested in production | 10% | ? | ? | ? | ? | ? |
| Documentation quality | 5% | ? | ? | ? | ? | ? |
| Community support | 5% | ? | ? | ? | ? | ? |
| **TOTAL SCORE** | 100% | ? | ? | ? | ? | ? |

**Risk Assessment Categories**:
- Technical risks (wrong prices, deserialization failures, version conflicts)
- Maintenance risks (breaking changes, deprecated APIs, SDK updates)
- Security risks (oracle manipulation, stale data, MEV attacks)
- Timeline risks (implementation delays, learning curve)

### Data Quality Requirements

**Verification Standards**:
- Code examples must compile (verified by CI badges or manual test)
- Solutions must have production evidence (>10 GitHub stars OR multiple independent confirmations)
- Documentation must be current (2024-2025)
- Dependency versions must be explicit and tested

**Cross-Reference Requirements**:
- Solutions found in multiple independent sources
- Technical claims verified with code inspection
- Community validation (upvotes, confirmations, testimonials)
- Test against actual build errors from Story 1.6

## Expected Deliverables

### Executive Summary (1-2 pages)

**Recommended Solution**:
- Clear recommendation with specific approach
- Confidence level: HIGH (>90%) / MEDIUM (70-90%) / LOW (<70%)
- Timeline estimate: Hours to implementation
- Key tradeoffs accepted

**Alternative Options** (ranked by total score):
- Option 2 with pros/cons vs. recommended
- Option 3 with pros/cons vs. recommended
- Trigger conditions for reconsidering alternatives

**Critical Risks & Mitigations**:
- Top 3 risks of recommended solution
- Specific mitigation strategies for each
- Monitoring/detection approaches

### Detailed Analysis

#### 1. Working Pyth Integration (if found)

**Exact Configuration**:
```toml
[dependencies]
anchor-lang = "X.Y.Z"
anchor-spl = "X.Y.Z"
solana-program = "X.Y.Z"
pyth-solana-receiver-sdk = "X.Y.Z"
pythnet-sdk = "X.Y.Z"
borsh = "X.Y.Z"
# ... complete verified list
```

**Code Example**:
```rust
// Minimal working example showing PriceUpdateV2 usage
// Must be copy-paste ready and compile-tested
```

**Verification Evidence**:
- Link to working GitHub repo (with commit SHA)
- Stack Exchange confirmation (with link)
- Build verification method used

**Known Issues & Workarounds**:
- Any caveats or limitations
- Workarounds for common problems
- Maintenance considerations

#### 2. Alternative Oracle Detailed Comparison

**Per Oracle Option** (Switchboard, Chainlink, etc.):

**Compatibility**:
- Exact Anchor version compatibility (tested)
- Rust/Solana SDK requirements
- Known conflicts or limitations

**API Comparison**:
```rust
// Side-by-side code examples for each oracle
// Pyth example vs Alternative oracle example
```

**Feature Matrix**:
| Feature | Pyth | Switchboard | Chainlink | Other |
|---------|------|-------------|-----------|-------|
| Staleness check | ✓ (customizable) | ? | ? | ? |
| Confidence intervals | ✓ | ? | ? | ? |
| Update frequency | ~400ms | ? | ? | ? |
| Devnet SOL/USD | ✓ | ? | ? | ? |
| Mainnet SOL/USD | ✓ | ? | ? | ? |
| Program ID (devnet) | [...] | ? | ? | ? |
| Program ID (mainnet) | [...] | ? | ? | ? |
| Historical prices | ✓ | ? | ? | ? |
| Batch queries | ✓ | ? | ? | ? |

**Migration Effort Breakdown**:
- Cargo.toml changes: X minutes
- Code changes: Y hours (detailed file list)
- Testing: Z hours
- **Total: XX hours**

**Production Usage Evidence**:
- DeFi protocols using this oracle
- TVL or transaction volume stats
- Security audit status

#### 3. Manual Pyth Parsing Implementation

**Account Structure**:
```rust
#[repr(C)]
pub struct PythPriceAccount {
    // Complete byte layout with offsets and types
    pub magic: u32,         // Offset 0
    pub version: u32,       // Offset 4
    pub account_type: u32,  // Offset 8
    // ... complete structure
}
```

**Deserialization Code**:
```rust
// Complete, production-ready implementation
// Including error handling and validation
```

**Validation & Testing**:
- Staleness check implementation
- Confidence interval extraction
- Test plan with real Pyth accounts
- Edge case handling

**Maintenance Plan**:
- How to detect format changes
- Update frequency expectations
- Monitoring strategy

**Production Examples**:
- Link to repos using this approach
- Success stories and lessons learned

#### 4. Hybrid Approaches Evaluation

For each hybrid option:

**Approach Description**: How it works end-to-end

**Architecture Diagram**: If complex, include visual

**Security Model**:
- Trust assumptions
- Validation mechanisms
- Attack vectors and mitigations

**Implementation Complexity**:
- Component breakdown
- Hour estimates per component
- Dependencies required

**Tradeoffs Analysis**:
| Aspect | Direct Integration | Hybrid Approach |
|--------|-------------------|-----------------|
| Security | ? | ? |
| Latency | ? | ? |
| Complexity | ? | ? |
| Cost | ? | ? |
| Maintenance | ? | ? |

### Supporting Materials

#### A. Complete Code Examples

For EACH viable option:
```
├── Cargo.toml (complete dependencies)
├── lib.rs (program entrypoint)
├── oracle.rs (oracle integration code)
└── tests/ (integration test showing usage)
```

**Verification**: Each example must compile or explain why not

#### B. Dependency Trees

For each proposed configuration:
```bash
# cargo tree output showing:
# - No anchor-lang version conflicts
# - No borsh version conflicts
# - Resolution of known blockers
```

#### C. Source Documentation

**Primary Sources** (10-15 required):
1. [Repository Name] - Working example (Commit SHA: abc123, Build status: ✓)
   https://github.com/...

2. [Stack Exchange Thread] - Accepted answer with 87 upvotes (Dec 2024)
   https://solana.stackexchange.com/...

3. [Official Docs] - Integration guide (Last updated: 2025-01-15)
   https://docs.pyth.network/...

... (continue for all sources)

**Verification Process**:
- How each source was validated
- Cross-reference confirmations
- Conflicting information resolution

**Source Credibility Ratings**:
- HIGH: Official docs, verified builds, accepted answers
- MEDIUM: Community posts, unverified examples
- LOW: Outdated content, unconfirmed approaches

#### D. Decision Tree

```
┌─ Is Pyth integration viable with current stack?
│
├─ YES ✓
│  └─ Recommended: Use Pyth (lowest migration, best features)
│     ├─ Implementation: X hours
│     ├─ Risk: LOW
│     └─ Follow exact configuration from Section 1
│
└─ NO ✗
   ├─ Is Switchboard compatible with Anchor 0.29-0.31?
   │  ├─ YES ✓ → Use Switchboard (Oracle #2, moderate migration)
   │  │  ├─ Implementation: Y hours
   │  │  ├─ Risk: LOW-MEDIUM
   │  │  └─ Follow exact configuration from Section 2.1
   │  │
   │  └─ NO ✗ → Continue evaluation
   │
   ├─ Is manual parsing feasible within 1 week?
   │  ├─ YES ✓ → Implement custom parser (highest effort, full control)
   │  │  ├─ Implementation: Z hours
   │  │  ├─ Risk: MEDIUM
   │  │  └─ Follow implementation from Section 3
   │  │
   │  └─ NO ✗ → Escalate options
   │
   └─ Fallback Options (choose one):
      ├─ Hybrid approach (if viable from Section 4)
      ├─ Wait for Pyth ecosystem update (timeline: ?)
      ├─ Use stub pricing temporarily (defer feature to v2)
      └─ Block Epic 1 completion (escalate to product)
```

### Risk Register

| Risk ID | Risk Description | Probability | Impact | Score | Mitigation |
|---------|-----------------|-------------|--------|-------|------------|
| RISK-001 | Wrong price due to parsing error | ? | Critical | ? | Comprehensive tests with real data |
| RISK-002 | Oracle service downtime | ? | High | ? | Fallback strategies, monitoring |
| RISK-003 | Breaking changes in SDK updates | ? | Medium | ? | Version pinning, update testing |
| RISK-004 | Dependency conflicts recur | ? | High | ? | Extensive dependency tree validation |
| RISK-005 | Implementation timeline exceeded | ? | Medium | ? | Parallel implementation exploration |

## Success Criteria

The research is successful if it produces:

1. ✅ **Actionable Solution**: At least ONE option implementable within 1 week with 80%+ confidence
2. ✅ **Verified Feasibility**: Solution has worked for others (code evidence, not theoretical)
3. ✅ **Complete Implementation Plan**: Step-by-step guide with copy-paste-ready code
4. ✅ **Risk Documentation**: Known issues with clear mitigation strategies
5. ✅ **Decision Support**: Enough detail to confidently choose and defend approach

**Quality Gates**:
- [ ] Found working code example that compiles
- [ ] Verified in production by at least 2 independent sources
- [ ] Tested against known blockers (anchor-lang conflicts, borsh ambiguity)
- [ ] Implementation estimate ≤40 hours (1 week)
- [ ] Risks identified and mitigated

**Failure Indicators** (trigger re-scoping):
- No viable solutions after 4 hours of research
- All options require >2 weeks implementation
- Solutions lack production verification
- Solutions reintroduce known blockers

## Timeline & Priority

**Research Duration**: 3-4 hours maximum
- **Hour 1**: GitHub search for working Pyth configurations, clone and test promising examples
- **Hour 2**: Alternative oracles (Switchboard priority, then Chainlink, then others)
- **Hour 3**: Manual parsing investigation + hybrid approaches
- **Hour 4**: Synthesize findings, create decision matrix, write recommendations

**Deliverable Target**: Complete research report within 6 hours of research start

**Priority**: **CRITICAL** - Story 1.6 blocks Epic 1 completion (Stories 1.7-1.8 depend on oracle integration)

## Context: What Has Been Tried

**DO NOT re-investigate these failed attempts**:

| Attempt | Configuration | Result | Error |
|---------|--------------|--------|-------|
| v1.2 | Anchor 0.31.1 + pyth-sdk-solana 0.10 | ❌ FAIL | borsh 0.10/1.5 conflict |
| v1.3 | Anchor 0.31.1 + pyth-solana-receiver-sdk 0.6 | ❌ FAIL | borsh 0.10/1.5 conflict (22 errors) |
| v1.4 | Anchor 0.30.1 + pyth-solana-receiver-sdk 0.3.2 + pythnet-sdk 2.1.0 | ❌ FAIL | spl-tlv-account-resolution trait errors (5 errors) |
| v1.6 | Anchor 0.29.0 + pyth-solana-receiver-sdk 0.3.2 + pythnet-sdk 2.1.0 + borsh ~1.2 | ❌ FAIL | anchor-lang 0.29/0.30 version conflict + PriceUpdateV2 trait errors (32 errors) |

**Key Learnings**:
- pyth-solana-receiver-sdk 0.3.2 has hardcoded anchor-lang 0.30.1 dependency
- pythnet-sdk 2.1.0 has hardcoded anchor-lang 0.30.1 dependency
- Using `Account<PriceUpdateV2>` creates anchor-lang version conflicts
- Cargo.lock patches for borsh don't work (rejected by cargo)

**Focus NEW research on**:
1. AccountInfo-based patterns (avoid Account<> wrapper)
2. Completely different oracle providers
3. Manual parsing without any Pyth SDK
4. Newer Pyth SDK versions (0.7+) with Anchor 0.31
5. Hybrid off-chain + on-chain approaches

## Available Resources

**Comprehensive Analysis**:
- `/Users/jonathangreen/Documents/Slop-Machine/docs/research-results/pyth-oracle-dependency-resolution-report.md`
- Contains 6-path decision matrix (now known to be outdated for Path 1)

**Complete Error Logs**:
- Story 1.6 Change Log has all 4 iteration attempts with full error messages
- Location: `/Users/jonathangreen/Documents/Slop-Machine/docs/stories/1.6.story.md`

**Working Code Structure**:
- `packages/programs/programs/slop-machine/src/utils/oracle.rs` - Ready for any oracle API
- `packages/programs/programs/slop-machine/src/instructions/submit_bid_with_stake.rs` - Ready for integration

## Research Output Location

Save research results to:
```
/Users/jonathangreen/Documents/Slop-Machine/docs/research-results/oracle-integration-solutions-research.md
```

Include:
- Date/time of research
- Researcher credit (AI Agent + model used)
- All sections from Expected Deliverables
- Source citations with verification notes
- Decision tree with recommendation highlighted

## Post-Research Actions

1. **Update Story 1.6**: Add Change Log v1.7 with chosen solution
2. **Update QA Gate**: Reference new research in gate file
3. **Implement Solution**: Follow step-by-step plan from research
4. **Validate Solution**: Build + test to confirm blocker resolved
5. **Request QA Re-review**: Once tests passing

---

## Usage

This command triggers the Task tool with the general-purpose agent to execute comprehensive research following the above specifications.

**Invocation**: `/BMad:research:solana-oracle-integration`

**Agent**: general-purpose (has web search, code search, and multi-step reasoning)

**Expected Duration**: 3-4 hours of research + 1-2 hours for report writing

**Output**: Comprehensive research report with actionable recommendations saved to docs/research-results/
