# Anchor-syn Bug Fix Research Report

**Research Completed:** 2025-10-08
**Project:** Slop Machine Platform
**Issue:** anchor-syn IDL generation failure blocking CI/CD

---

## Executive Summary

### Current Situation

**Problem:**
- Slop Machine CI/CD pipeline experiences build failures due to anchor-syn 0.30.1 bug
- Error: `no method named 'source_file()' found for proc_macro2::Span`
- Impact: IDL generation fails, clippy disabled, TypeScript types not auto-generated

**Current Workaround:**
- Build with `anchor build --no-idl` flag
- Clippy disabled in CI workflows
- Manual IDL creation if needed

### Key Finding: Bug is FIXED ✅

**The anchor-syn bug has been officially fixed in Anchor v0.31.1** (released April 19, 2025)

**Timeline:**
- **April 16, 2025:** proc-macro2 v1.0.95 released with breaking API change
- **April 16, 2025:** Bug reported to Anchor team (Issue #3661)
- **April 17, 2025:** Fix merged (PR #3663)
- **April 19, 2025:** Anchor v0.31.1 released with fix

**Time to Resolution:** 3 days from bug report to release

---

## Recommended Solution

### Primary Recommendation: Upgrade to Anchor 0.31.1

**Rationale:**
- ✅ Official fix from Anchor team
- ✅ Restores full CI/CD functionality (IDL + clippy)
- ✅ Future-proof (aligns with Solana v2 ecosystem)
- ✅ Includes performance improvements (stack memory optimization)
- ✅ Well-tested by community (6 months in production)

**Risk Level:** MEDIUM
- Requires Solana SDK v1 → v2 migration
- Some dependency management complexity
- Comprehensive testing required

**Estimated Effort:** 8.5 hours (realistic) + 2-4 hours QA

**Timeline:** 1-2 working days for single developer

---

## Root Cause Analysis

### Technical Breakdown

**What Happened:**

1. **proc-macro2 Breaking Change:**
   - On April 16, 2025, proc-macro2 v1.0.95 removed the `source_file()` method
   - This was due to upstream Rust nightly compiler changes
   - The old API: `proc_macro2::Span::call_site().source_file().path()`
   - New API: `.file()` and `.local_file()` methods

2. **anchor-syn Dependency:**
   - anchor-syn 0.30.1 used the deprecated `source_file()` API for IDL generation
   - When proc-macro2 updated, anchor-syn broke
   - Error location: `anchor-syn-0.30.1/src/idl/defined.rs:499:66`

3. **Why Downgrade Failed:**
   - Solana SDK and pyth-sdk-solana require proc-macro2 >= 1.0.93
   - Cargo cannot resolve conflicting version requirements
   - Creating a dependency deadlock

### Dependency Conflict Tree

```
slop-machine
├── anchor-lang 0.30.0
│   └── anchor-syn 0.30.1
│       └── proc-macro2 ^1.0.93 (NEEDS v1.0.93+ but wants < 1.0.85 for source_file)
├── pyth-sdk-solana 0.10.6
│   └── solana-program 2.3.0
│       └── solana-sdk-macro 2.2.1
│           └── proc-macro2 ^1.0.93 (BLOCKS downgrade)
└── solana-sdk 1.18.26
    └── [requires proc-macro2 >= 1.0.93]

CONFLICT: anchor-syn needs old API (< 1.0.85) but deps require >= 1.0.93
```

---

## Solution Options Comparison

| Solution | Risk | Effort | Timeline | Maintenance | Score | Rank |
|----------|------|--------|----------|-------------|-------|------|
| **Upgrade to 0.31.1** | Medium | 8.5h | 1-2 days | Low | 8.5/10 | 🥇 1 |
| **Manual anchor-syn Patch** | High | 4h | 1 day | High | 5.2/10 | 🥈 2 |
| **Git Override (main branch)** | Medium-High | 3h | 1 day | Medium | 6.0/10 | 🥉 3 |
| **Continue with --no-idl** | Low | 0h | Indefinite | Low | 4.0/10 | 4 |

### Detailed Solution Analysis

#### Solution 1: Upgrade to Anchor 0.31.1 ⭐ RECOMMENDED

**Description:** Upgrade from Anchor 0.30.0 to 0.31.1, which includes the official fix.

**Pros:**
- ✅ Official solution from Anchor maintainers
- ✅ Includes anchor-syn fix + other bug fixes
- ✅ Performance improvements (stack memory optimization)
- ✅ Future-proof (Solana v2 ecosystem alignment)
- ✅ Well-tested by community (6+ months in production)
- ✅ Restores full CI/CD (IDL generation + clippy)

**Cons:**
- ❌ Requires Solana SDK v1 → v2 migration
- ❌ Need to downgrade Solana CLI (2.3.13 → 2.1.0)
- ❌ Some breaking changes in API (minimal)
- ❌ Requires comprehensive testing

**Implementation Steps:** See [Implementation Guide](#implementation-guide-upgrade-to-anchor-0311) below.

**Risk Assessment:** MEDIUM
- Dependency conflicts with pyth-sdk-solana (manageable)
- Solana CLI version mismatch (requires downgrade)
- Code changes are minimal (mostly import paths)

**Effort:** 8.5 hours (realistic) + 2-4 hours QA

**Maintenance:** LOW - Official release, ongoing support from Anchor team

---

#### Solution 2: Manual Cargo.toml Patch

**Description:** Patch anchor-syn dependency to use a fixed version from Anchor's main branch.

**Implementation:**
```toml
[patch.crates-io]
anchor-syn = { git = "https://github.com/solana-foundation/anchor", rev = "47284f8" }
```

**Pros:**
- ✅ Quick fix (3-4 hours)
- ✅ Minimal code changes
- ✅ Keeps current Anchor 0.30.0

**Cons:**
- ❌ Non-standard approach (maintenance burden)
- ❌ Need to track upstream anchor-syn changes
- ❌ May conflict with future Anchor updates
- ❌ Not recommended by Anchor team

**Risk Assessment:** HIGH
- Using non-release code from main branch
- Potential version conflicts
- Manual tracking of upstream changes

**Effort:** 4 hours

**Maintenance:** HIGH - Must monitor and update patch regularly

---

#### Solution 3: Git Dependency Override

**Description:** Replace anchor-lang dependency with git version pointing to Anchor main/v0.31 branch.

**Implementation:**
```toml
[dependencies]
anchor-lang = { git = "https://github.com/solana-foundation/anchor", tag = "v0.31.1" }
anchor-spl = { git = "https://github.com/solana-foundation/anchor", tag = "v0.31.1" }
```

**Pros:**
- ✅ Uses official fix from Anchor
- ✅ Faster than full upgrade (less testing)
- ✅ Can pin to specific release tag

**Cons:**
- ❌ Non-standard dependency source (not crates.io)
- ❌ Slower builds (git clone + compile)
- ❌ Still requires some Solana v2 alignment
- ❌ Complicates dependency management

**Risk Assessment:** MEDIUM-HIGH
- Git dependencies can break CI/CD if GitHub is down
- Version management complexity

**Effort:** 3 hours

**Maintenance:** MEDIUM - Need to update git tags manually

---

#### Solution 4: Continue with --no-idl Workaround

**Description:** Keep using `anchor build --no-idl` and manually create IDL files if needed.

**Pros:**
- ✅ Zero implementation effort
- ✅ No code changes
- ✅ No risk of breaking existing functionality

**Cons:**
- ❌ No automatic IDL generation
- ❌ No TypeScript types from IDL
- ❌ Clippy remains disabled
- ❌ Reduced developer experience
- ❌ Technical debt accumulates

**Risk Assessment:** LOW (no changes)

**Effort:** 0 hours

**Maintenance:** LOW - But accumulates technical debt

**When to Use:** Only as a temporary measure while planning upgrade

---

## Breaking Changes (0.30.0 → 0.31.1)

### Major Changes

1. **Solana SDK v2 Migration** (CRITICAL)
   - All dependencies must use Solana v2
   - Replace `use solana_program::*` with `use anchor_lang::solana_program::*`

2. **Removed APIs** (if used)
   - `EventData` trait (use `Event` derive macro)
   - `StateCoder` (state accounts deprecated)
   - `EventIndex` (event indexing)
   - SPL `dex` feature flag

3. **TypeScript/Node.js Updates**
   - TypeScript upgraded to v5
   - Node.js minimum: 20.16.0 LTS

### Code Migration Examples

**Before (Anchor 0.30.0):**
```rust
use solana_program::account_info::AccountInfo;
use solana_program::pubkey::Pubkey;
```

**After (Anchor 0.31.1):**
```rust
use anchor_lang::solana_program::account_info::AccountInfo;
use anchor_lang::solana_program::pubkey::Pubkey;
```

---

## Implementation Guide: Upgrade to Anchor 0.31.1

### Prerequisites

- [ ] Rust 1.81.0 installed (already compatible ✅)
- [ ] Git access to Slop Machine repository
- [ ] CI/CD access for workflow updates
- [ ] 1-2 days allocated for migration + testing

### Phase 1: Environment Setup (30-60 min)

**Step 1: Install Anchor Version Manager (AVM)**
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --force
```

**Step 2: Install Anchor 0.31.1**
```bash
avm install 0.31.1
avm use 0.31.1
anchor --version  # Should show: anchor-cli 0.31.1
```

**Step 3: Downgrade Solana CLI to 2.1.0**
```bash
# Current: 2.3.13 → Target: 2.1.0
sh -c "$(curl -sSfL https://release.anza.xyz/v2.1.0/install)"
solana --version  # Should show: solana-cli 2.1.0
```

**Step 4: Verify Rust Version**
```bash
rustc --version  # Should show: 1.81.0 (already compatible ✅)
```

### Phase 2: Update Dependencies (15-30 min)

**Step 5: Update Anchor.toml**

File: `/Users/jonathangreen/Documents/Slop-Machine/packages/programs/Anchor.toml`

```toml
[toolchain]
anchor_version = "0.31.1"
solana_version = "2.1.0"

[features]
resolution = true
skip-lint = false

[programs.localnet]
slop_machine = "DoxwpkBr2cNu2NYxWEZjopYtZwHzQPJuzZFasinMAXKm"

[programs.devnet]
slop_machine = "DoxwpkBr2cNu2NYxWEZjopYtZwHzQPJuzZFasinMAXKm"

[programs.mainnet]
slop_machine = "DoxwpkBr2cNu2NYxWEZjopYtZwHzQPJuzZFasinMAXKm"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[provider.devnet]
cluster = "https://api.devnet.solana.com"
wallet = "~/.config/solana/id.json"

[provider.mainnet]
cluster = "${HELIUS_RPC_URL}"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

**Step 6: Update Cargo.toml**

File: `/Users/jonathangreen/Documents/Slop-Machine/packages/programs/programs/slop-machine/Cargo.toml`

```toml
[package]
name = "slop-machine"
version = "0.1.0"
description = "Slop Machine Solana smart contracts"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "slop_machine"

[features]
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build"]

[dependencies]
anchor-lang = "0.31.1"      # ← CHANGED from 0.30.0
anchor-spl = "0.31.1"       # ← CHANGED from 0.30.0
pyth-sdk-solana = "0.10"
```

**Step 7: Clean Build Cache**
```bash
cd /Users/jonathangreen/Documents/Slop-Machine/packages/programs
cargo clean
rm -rf target/
```

### Phase 3: Code Migration (1-2 hours)

**Step 8: Update Import Statements**

Find and replace all Solana program imports:

```bash
cd /Users/jonathangreen/Documents/Slop-Machine/packages/programs/programs/slop-machine
grep -r "use solana_program" src/
```

**Replace pattern:**
```rust
// OLD (will break)
use solana_program::account_info::AccountInfo;
use solana_program::pubkey::Pubkey;
use solana_program::program_error::ProgramError;

// NEW (correct for 0.31.1)
use anchor_lang::solana_program::account_info::AccountInfo;
use anchor_lang::solana_program::pubkey::Pubkey;
use anchor_lang::solana_program::program_error::ProgramError;
```

**Current Slop Machine Code Review:**

Based on the existing code in `packages/programs/programs/slop-machine/src/lib.rs`, the imports are already using the correct pattern:

```rust
// File: src/lib.rs
use anchor_lang::prelude::*;  // ✅ Correct - already includes solana_program
```

**Action Required:** Verify no direct `use solana_program::*` imports exist elsewhere.

```bash
# Search for any direct solana_program imports
grep -r "^use solana_program" packages/programs/programs/slop-machine/src/

# If any found, replace with anchor_lang::solana_program::*
```

**Step 9: Update pyth-sdk-solana Usage (if applicable)**

If using Pyth price feeds, ensure compatibility:

```rust
// Pyth SDK will automatically use Solana v2 with Anchor 0.31.1
use pyth_sdk_solana::load_price_feed_from_account_info;
```

**Step 10: Review for Deprecated APIs**

Check if code uses any deprecated features (unlikely in current simple program):

- ❌ `EventData` trait → Use `Event` derive macro
- ❌ `StateCoder` → Not used in Slop Machine
- ❌ `EventIndex` → Not used in Slop Machine

**Current Status:** ✅ No deprecated APIs detected in current codebase.

### Phase 4: Build & Test (2-4 hours)

**Step 11: Build Programs**

```bash
cd /Users/jonathangreen/Documents/Slop-Machine/packages/programs

# Clean build
cargo clean
anchor build  # ← Should succeed WITHOUT --no-idl flag!
```

**Expected Success:**
```
   Compiling slop-machine v0.1.0 (/Users/jonathangreen/Documents/Slop-Machine/packages/programs/programs/slop-machine)
    Finished release [optimized] target(s) in 45.2s
```

**Expected Outputs:**
- ✅ `target/deploy/slop_machine.so` (program binary)
- ✅ `target/idl/slop_machine.json` (IDL file - NOW GENERATED!)
- ✅ `target/types/slop_machine.ts` (TypeScript types - NOW GENERATED!)

**If Build Fails:**

Check error message and apply troubleshooting:

```bash
# Error: Dependency conflict
cargo tree -i solana-program
# Should show ONLY solana-program v2.x.x

# Error: IDL generation still fails
anchor build --no-idl  # Temporary fallback
# Report issue with full error output

# Error: Feature flag mismatch
cargo update
cargo clean
anchor build
```

**Step 12: Verify Dependency Tree**

```bash
cargo tree -i solana-program
```

**Expected (Good):**
```
solana-program v2.2.1
├── anchor-lang v0.31.1
├── anchor-spl v0.31.1
└── pyth-sdk-solana v0.10.6
```

**Bad (Multiple Versions):**
```
solana-program v1.18.26  # ❌ BAD - Indicates incomplete migration
solana-program v2.3.0    # ⚠️  WARNING - Version mismatch
```

If multiple versions detected, review and fix Cargo.toml.

**Step 13: Run Unit Tests**

```bash
# Solana program tests
cargo test-sbf

# Anchor tests
anchor test --skip-local-validator
```

**Expected:**
- ✅ All existing tests pass
- ✅ No new compilation errors

**Step 14: Test Clippy (Now Re-enabled!)**

```bash
cargo clippy --all-targets --all-features -- -D warnings
```

**Expected:**
- ✅ Clippy runs successfully (no "custom attribute panicked" error)
- ✅ Only linting warnings (if any), no hard errors

**Step 15: Deploy to Localnet**

```bash
# Terminal 1: Start local validator
solana-test-validator --reset

# Terminal 2: Deploy
cd /Users/jonathangreen/Documents/Slop-Machine/packages/programs
anchor deploy --provider.cluster localnet

# Verify deployment
solana program show <PROGRAM_ID> --url localhost
```

**Expected:**
- ✅ Program deploys successfully
- ✅ Program is executable
- ✅ Deployment transaction confirms

**Step 16: Deploy to Devnet**

```bash
anchor deploy --provider.cluster devnet
```

**Expected:**
- ✅ Deployment succeeds
- ✅ Program ID matches Anchor.toml: `DoxwpkBr2cNu2NYxWEZjopYtZwHzQPJuzZFasinMAXKm`
- ✅ Verify on Solana Explorer

**Step 17: Run Full Integration Tests**

```bash
anchor test
```

**Expected:**
- ✅ All tests pass
- ✅ Test validator starts/stops cleanly

### Phase 5: Update CI/CD Workflows (30-60 min)

**Step 18: Update solana-ci.yml**

File: `.github/workflows/solana-ci.yml`

**Changes:**

```yaml
env:
  SOLANA_VERSION: '2.1.0'    # ← CHANGED from 1.18.18
  ANCHOR_VERSION: '0.31.1'   # ← CHANGED from 0.30.0
  RUST_TOOLCHAIN: '1.81.0'   # ← UNCHANGED (already compatible)

# Line 64-68: RESTORE clippy (remove skip message)
- name: Run cargo clippy
  run: cargo clippy --all-targets --all-features -- -D warnings
  # ← REMOVED: continue-on-error and skip message

# Line 132: REMOVE --no-idl flag
- name: Build Anchor programs
  run: anchor build  # ← REMOVED: --no-idl flag

# Line 237: REMOVE --no-idl flag
- name: Build programs
  run: anchor build  # ← REMOVED: --no-idl flag

# ADD: Upload IDL artifacts (NEW STEP)
- name: Upload IDL artifacts
  uses: actions/upload-artifact@v4
  with:
    name: program-idls
    path: packages/programs/target/idl/*.json
    retention-days: 30
```

**Step 19: Update solana-deploy.yml**

File: `.github/workflows/solana-deploy.yml`

```yaml
env:
  SOLANA_VERSION: '2.1.0'    # ← CHANGED from 1.18.18
  ANCHOR_VERSION: '0.31.1'   # ← CHANGED from 0.30.0
  RUST_TOOLCHAIN: '1.81.0'   # ← UNCHANGED

# Line 128-129: REMOVE --no-idl flag
- name: Build and test
  run: |
    anchor build  # ← REMOVED: --no-idl flag
    anchor test --skip-local-validator

# Line 203: REMOVE --no-idl flag
- name: Build programs
  run: anchor build  # ← REMOVED: --no-idl flag
```

**Step 20: Update security-quality.yml**

File: `.github/workflows/security-quality.yml`

```yaml
# Line 180: REMOVE --no-idl flag
- name: Build for verification
  run: |
    anchor build  # ← REMOVED: --no-idl flag
    echo "✅ Program built for verification"
```

**Step 21: Update KNOWN_ISSUES.md**

File: `.github/KNOWN_ISSUES.md`

**Add resolution notice:**

```markdown
# Known Issues - CI/CD Pipelines

## Anchor IDL Generation Failure (anchor-syn 0.30.1) - ✅ RESOLVED

**Status:** Fixed
**Resolution Date:** 2025-10-08
**Solution:** Upgraded to Anchor 0.31.1

### Previous Issue

The anchor-syn 0.30.1 bug causing `proc_macro2::Span::source_file()` errors has been resolved by upgrading to Anchor 0.31.1.

### Changes Made

- ✅ Upgraded Anchor: 0.30.0 → 0.31.1
- ✅ Updated Solana CLI: 1.18.18 → 2.1.0
- ✅ Migrated to Solana SDK v2
- ✅ Restored IDL generation (removed `--no-idl` flags)
- ✅ Re-enabled cargo clippy in CI
- ✅ Full CI/CD functionality restored

### Implementation Details

- **Commit:** [commit-hash]
- **Pull Request:** [PR link]
- **Testing:** Full devnet deployment tested
- **Documentation:** See `docs/research-results/anchor-syn-bug-fix-report.md`

---

## [Other existing issues remain below...]
```

### Phase 6: Verification & Rollback Plan (1-2 hours)

**Step 22: Commit Changes**

```bash
cd /Users/jonathangreen/Documents/Slop-Machine

git checkout -b upgrade-anchor-0.31.1

git add packages/programs/Cargo.toml
git add packages/programs/Anchor.toml
git add packages/programs/programs/slop-machine/Cargo.toml
git add .github/workflows/solana-ci.yml
git add .github/workflows/solana-deploy.yml
git add .github/workflows/security-quality.yml
git add .github/KNOWN_ISSUES.md

git commit -m "$(cat <<'EOF'
Upgrade to Anchor 0.31.1: Fix anchor-syn IDL generation bug

BREAKING CHANGE: Solana SDK v1 → v2 migration

Changes:
- Upgrade Anchor: 0.30.0 → 0.31.1 (official fix for anchor-syn bug)
- Update Solana CLI: 1.18.18 → 2.1.0 (required for Anchor 0.31.1)
- Migrate to Solana SDK v2 ecosystem
- Remove `--no-idl` build flags (IDL generation now works)
- Re-enable cargo clippy in CI (compilation now succeeds)
- Update CI/CD workflows with new versions

Fixes:
✅ IDL files now auto-generated (target/idl/slop_machine.json)
✅ TypeScript types now auto-generated (target/types/slop_machine.ts)
✅ Clippy linting restored in CI
✅ Full CI/CD functionality operational

Testing:
✅ Local build successful
✅ Unit tests pass
✅ Clippy passes
✅ Localnet deployment verified
✅ Devnet deployment verified

Closes: anchor-syn bug (see docs/research-results/anchor-syn-bug-fix-report.md)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Step 23: Push and Create PR**

```bash
git push origin upgrade-anchor-0.31.1

# Create pull request
gh pr create \
  --title "Upgrade to Anchor 0.31.1: Fix anchor-syn IDL bug" \
  --body "$(cat <<'EOF'
## Summary

Upgrades Anchor framework from 0.30.0 to 0.31.1 to fix the anchor-syn IDL generation bug blocking CI/CD.

## Changes

- ✅ Anchor 0.30.0 → 0.31.1
- ✅ Solana CLI 1.18.18 → 2.1.0
- ✅ Solana SDK v1 → v2 migration
- ✅ IDL generation restored (removed `--no-idl` workarounds)
- ✅ Clippy re-enabled in CI

## Testing

- [x] Local build successful
- [x] Unit tests pass
- [x] Clippy passes
- [x] Localnet deployment verified
- [x] Devnet deployment verified
- [ ] CI/CD pipeline passes (check Actions tab)
- [ ] QA review

## Breaking Changes

**Solana SDK v2 Migration:** All `solana_program` imports now use `anchor_lang::solana_program`.

## Rollback Plan

If issues arise, revert to previous commit:
\`\`\`bash
git revert HEAD
git push origin Epic1
\`\`\`

## Documentation

- Full research report: `docs/research-results/anchor-syn-bug-fix-report.md`
- Updated: `.github/KNOWN_ISSUES.md`

Closes #[issue-number]
EOF
)" \
  --base Epic1
```

**Step 24: Monitor CI/CD Pipeline**

```bash
# Watch CI run
gh run watch

# Or view in browser
open https://github.com/ALLiDoizCode/Slop-Machine/actions
```

**Expected CI Results:**
- ✅ Lint & Format Check: PASS (clippy now works!)
- ✅ Build Solana Programs: PASS (IDL generated!)
- ✅ Run Tests: PASS
- ✅ Security Audit: PASS (or non-blocking warnings)

**Step 25: Rollback Plan (If Needed)**

If critical issues arise:

```bash
# Quick rollback to previous working state
git checkout Epic1
cd /Users/jonathangreen/Documents/Slop-Machine/packages/programs

# Reinstall Anchor 0.30.0
avm use 0.30.0

# Reinstall Solana 1.18.18
solana-install init 1.18.18

# Restore workarounds
git checkout packages/programs/Cargo.toml
git checkout packages/programs/Anchor.toml
git checkout .github/workflows/

# Clean and rebuild
cargo clean
anchor build --no-idl

# Verify working state
anchor test
```

**Time to Rollback:** < 10 minutes

---

## Post-Migration Checklist

### Immediate (Within 24 hours)

- [ ] All CI/CD pipelines passing
- [ ] Devnet deployment successful
- [ ] IDL files generated and valid
- [ ] TypeScript types generated
- [ ] Clippy running in CI
- [ ] No regressions in existing functionality
- [ ] Update documentation to reflect Anchor 0.31.1
- [ ] Communicate changes to team

### Short-term (Within 1 week)

- [ ] Deploy to mainnet (if applicable)
- [ ] Monitor for any edge case issues
- [ ] Update local developer setup docs
- [ ] Archive old workaround documentation
- [ ] Share learnings with Solana community (optional)

### Long-term (Ongoing)

- [ ] Monitor Anchor releases (v1.0 coming soon)
- [ ] Keep Solana CLI updated (within 2.1.x range)
- [ ] Review and update dependencies quarterly
- [ ] Document any new issues encountered

---

## Troubleshooting Guide

### Issue: "failed to select a version for solana-program"

**Symptom:**
```
error: failed to select a version for `solana-program`
  required by package `anchor-spl v0.31.1`
```

**Solution:**
```bash
# 1. Remove explicit solana-program dependency (if any)
# Edit Cargo.toml, remove: solana-program = "..."

# 2. Clean and rebuild
cargo clean
cargo update
anchor build

# 3. Verify single version
cargo tree -i solana-program
```

---

### Issue: "method named file found for reference"

**Symptom:**
```
error[E0599]: no method named `file` found for reference `&proc_macro::Span`
```

**Solution:**
This occurs when using Rust toolchain that's too old or too new.

```bash
# Verify Rust version
rustc --version  # Should be 1.79.0 - 1.86.0

# Update if needed
rustup update stable
rustup default stable

# Rebuild
cargo clean
anchor build
```

---

### Issue: Build succeeds but IDL not generated

**Symptom:**
- Build completes successfully
- But `target/idl/slop_machine.json` is missing

**Solution:**
```bash
# 1. Verify Anchor version
anchor --version  # Must be 0.31.1

# 2. Check for --no-idl flag (shouldn't be there)
grep -r "no-idl" .github/workflows/

# 3. Force IDL generation
anchor build --idl target/idl

# 4. Verify IDL exists
ls -la target/idl/
```

---

### Issue: Tests fail after upgrade

**Symptom:**
```
anchor test
# Tests that previously passed now fail
```

**Solution:**
```bash
# 1. Clean test artifacts
rm -rf .anchor/test-ledger
rm -rf target/deploy/*

# 2. Rebuild from scratch
cargo clean
anchor build

# 3. Re-run tests with verbose output
anchor test -- --nocapture

# 4. Check for API changes in test code
# Review test files for deprecated patterns
```

---

### Issue: CI fails but local build succeeds

**Symptom:**
- Local: `anchor build` succeeds
- CI: Build fails with dependency errors

**Solution:**
```bash
# 1. Verify CI uses correct versions
# Check .github/workflows/solana-ci.yml:
#   SOLANA_VERSION: '2.1.0'
#   ANCHOR_VERSION: '0.31.1'
#   RUST_TOOLCHAIN: '1.81.0'

# 2. Update lockfile and commit
cargo update
git add Cargo.lock
git commit -m "Update Cargo.lock for CI"
git push

# 3. Clear CI cache (if using)
# Delete workflow caches in GitHub Actions settings
```

---

## Community Resources

### Official Documentation
- [Anchor 0.31.1 Release Notes](https://github.com/solana-foundation/anchor/releases/tag/v0.31.1)
- [Anchor CHANGELOG](https://github.com/solana-foundation/anchor/blob/master/CHANGELOG.md)
- [Anchor Migration Guide](https://www.anchor-lang.com/docs/updates/release-notes/0-31-0)

### GitHub Issues
- [Issue #3661: anchor-syn incompatible with proc-macro2 >= 1.0.95](https://github.com/solana-foundation/anchor/issues/3661)
- [PR #3663: Fix proc-macro2 usage](https://github.com/solana-foundation/anchor/pull/3663)

### Community Discussions
- [Stack Exchange: Anchor 0.30 → 0.31 Migration](https://solana.stackexchange.com/questions/20824/what-has-changed-from-anchor-version-0-30-1-to-version-0-31-0)
- [Anchor Discord](https://discord.gg/anchor)

---

## Conclusion

The upgrade to Anchor 0.31.1 provides a **permanent, official fix** for the anchor-syn IDL generation bug that has been blocking full CI/CD functionality.

**Key Benefits:**
- ✅ Restores IDL generation (no more manual workarounds)
- ✅ Re-enables clippy linting in CI
- ✅ Includes performance improvements
- ✅ Future-proof (Solana v2 alignment)
- ✅ Well-tested by community (6+ months in production)

**Implementation:**
- ⏱️ **Effort:** 8.5 hours (realistic) + 2-4 hours QA
- 📅 **Timeline:** 1-2 working days
- ⚠️ **Risk:** Medium (comprehensive testing required)
- 🎯 **Confidence:** High (official solution, proven in production)

**Next Steps:**
1. Review this guide with team
2. Schedule implementation window
3. Execute migration following steps above
4. Comprehensive testing on devnet
5. Deploy to mainnet after validation

---

**Report Prepared:** 2025-10-08
**Maintained By:** Slop Machine Development Team
**Last Updated:** 2025-10-08

---

*For questions or issues during migration, refer to the Troubleshooting Guide or contact the development team.*
