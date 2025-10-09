# Mainnet Deployment Checklist

<!-- Powered by BMAD™ Core -->

## Pre-Deployment Verification

### 1. Test Coverage
- [x] **All devnet unit tests passing**: 71/71 tests passed (verified 2025-10-09)
- [x] **All integration tests passing**: 7 integration tests from Story 1.8b
  - bidding-workflow.spec.ts
  - devnet-integration.spec.ts
  - escrow-workflow.spec.ts
  - pyth-oracle-integration.spec.ts
- [x] **QA Gate Status**: PASS with quality score 90/100 (Story 1.8b)

### 2. Security Audit Considerations
- [ ] **Audit Status**: Custom escrow program scheduled for audit (Week 5-7)
  - Note: Gradual rollout with escrow limits will mitigate risk during audit period
- [ ] **Escrow Limits Configured**:
  - Week 1: $100 max per escrow
  - Week 2: $500 max per escrow
  - Week 3: $1K max per escrow
  - Week 4+: Unlimited (after audit complete)
- [ ] **Bug Bounty Program**: Immunefi program configured (10% of TVL)
- [ ] **Monitoring Dashboard**: Real-time transaction monitoring configured

### 3. Upgrade Authority Configuration
- [ ] **Deployer Wallet**: `~/.config/solana/id.json`
- [ ] **Wallet Balance**: ≥ 3 SOL for deployment rent + fees
- [ ] **Upgrade Authority**: Deployer wallet (can be transferred to multisig later)
- [ ] **Upgrade Process Documented**: See "Rollback Strategy" section below

### 4. Emergency Pause Mechanism
- [ ] **v1.0 Status**: NOT IMPLEMENTED (document for v2)
- [ ] **Alternative Mitigation**:
  - Can upgrade program with paused version if critical bug discovered
  - Recovery Time Objective: <30 minutes
  - Rollback procedure: `anchor upgrade` with previous working version

### 5. Pre-Deployment Backup
- [ ] **Program Binary Backup**:
  ```bash
  cp target/deploy/slop_machine.so target/deploy/slop_machine.so.backup-$(date +%Y%m%d)
  ```
- [ ] **Current State Documented**:
  - Devnet program ID: `4hPgUuR7S8pyX7WxgaKTunaPCjMQLhEmBgQEyTrTvDNt`
  - Test results: 71 unit tests, 7 integration tests
  - QA score: 90/100
- [ ] **Rollback Procedure Documented**: See "Rollback Strategy" section below

## Deployment Configuration

### 6. Environment Variables
- [ ] **HELIUS_RPC_URL**: Configured for mainnet
  ```bash
  echo $HELIUS_RPC_URL
  # Expected: https://mainnet.helius-rpc.com/?api-key=<API_KEY>
  ```
- [ ] **RPC Connectivity Test**:
  ```bash
  curl $HELIUS_RPC_URL -X POST -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
  # Expected: {"jsonrpc":"2.0","result":"ok","id":1}
  ```

### 7. Pyth Oracle Mainnet Configuration
- [ ] **Mainnet SOL/USD Feed Address**: `H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG`
- [ ] **Test Files Updated**: All test files use mainnet feed when cluster is mainnet
- [ ] **Oracle Helper Functions**: Already parameterized (no Rust code changes needed)

### 8. Program Configuration Files
- [ ] **Anchor.toml Updated**: Mainnet program ID section configured
- [ ] **lib.rs Updated**: `declare_id!` macro updated with mainnet address
- [ ] **Build Verification**: Program rebuilds successfully with new ID

## Deployment Execution

### 9. Build Program
- [ ] **Build Command**: `anchor build`
- [ ] **Build Success**: No errors or warnings
- [ ] **Binary Size**: Verify `target/deploy/slop_machine.so` exists

### 10. Fund Deployer Wallet
- [ ] **Current Balance Check**:
  ```bash
  solana balance ~/.config/solana/id.json --url mainnet-beta
  ```
- [ ] **Funding Method**:
  - Acquire SOL from centralized exchange (Coinbase, Binance) OR
  - Acquire SOL from DEX (Jupiter, Raydium)
- [ ] **Transfer Complete**: Transfer ≥ 3 SOL to deployer wallet
- [ ] **Balance Verification**: Verify balance ≥ 3 SOL

### 11. Deploy to Mainnet
- [ ] **Deploy Command**: `anchor deploy --provider.cluster mainnet`
- [ ] **Deployment Transaction Signature**: ___________________________________
- [ ] **Deployed Program ID**: ___________________________________
- [ ] **Deployment Timestamp**: ___________________________________

### 12. Update Configuration with Mainnet ID
- [ ] **Update Anchor.toml**: `[programs.mainnet]` section
- [ ] **Update lib.rs**: `declare_id!` macro
- [ ] **Rebuild Program**: `anchor build`
- [ ] **Generate IDL**: `anchor build --idl`
- [ ] **Commit Configuration**: Git commit with mainnet program ID

## Post-Deployment Verification

### 13. Smoke Tests
- [ ] **Test Wallet Funded**: 0.5 SOL (0.1 budget + 0.15 bid/stake + 0.05 fees + 0.15 rent)
- [ ] **Test Suite**: `packages/programs/tests/mainnet-smoke-test.spec.ts`
- [ ] **Test Execution**: `anchor test --provider.cluster mainnet --skip-build tests/mainnet-smoke-test.spec.ts`
- [ ] **All Tests Pass**: 6/6 smoke tests passed
- [ ] **Transaction Signatures Captured**: See `mainnet-smoke-test-results.md`
- [ ] **Explorer Verification**: All transactions verified on solscan.io/solana.fm

### 14. Program Verification on Explorers
- [ ] **solscan.io**: Program verified with metadata and IDL
- [ ] **solana.fm**: Program verified with metadata and IDL
- [ ] **Explorer Links Documented**: Added to README.md

### 15. Monitoring Configuration
- [ ] **Helius Webhook**: Configured for program events
  - OpportunityCreated
  - BidSubmitted
  - BidAccepted
  - PaymentReleased
  - StakeSlashed
- [ ] **Alert: Transaction Failure Rate**: Alert if >10%
- [ ] **Alert: Escrow Balance Anomalies**: Alert if balance < expected
- [ ] **Daily Reporting**: Transaction count reporting configured
- [ ] **Monitoring Dashboard**: Documented in `docs/operations/monitoring.md`

### 16. Documentation Updates
- [ ] **README.md**: Mainnet program ID and "Deployed to Mainnet" badge
- [ ] **docs/architecture/tech-stack.md**: Mainnet escrow program ID
- [ ] **docs/architecture/external-apis.md**: Mainnet Pyth feed configuration
- [ ] **CHANGELOG.md**: Mainnet deployment date and version

### 17. Post-Deployment Technical Verification
- [ ] **Upgrade Authority**: Verify correct wallet has authority
- [ ] **Rent-Exempt Balance**: Verify program account has sufficient balance
- [ ] **RPC Calls**: Test read-only calls from multiple providers (Helius, QuickNode, public)
- [ ] **IDL Accessibility**: Verify IDL accessible via RPC `getAccountInfo`

### 18. Announcement
- [ ] **Draft Message**: Program ID, features, getting started guide
- [ ] **Twitter**: Posted (if account configured)
- [ ] **Discord**: Posted (if server configured)
- [ ] **Website**: Landing page updated with mainnet status
- [ ] **Early Adopters**: Notified via email (if mailing list exists)

## Rollback Strategy

### Triggers
- Transaction failure rate >10%
- Critical bug discovered in production
- Escrow payment issues
- Data corruption or account state errors

### Rollback Procedure
1. **Identify Issue**: Monitor dashboard shows anomaly
2. **Decision**: Evaluate if rollback necessary (<5 minutes)
3. **Execute Rollback**:
   ```bash
   # Use backup binary
   anchor upgrade target/deploy/slop_machine.so.backup-YYYYMMDD --provider.cluster mainnet
   ```
4. **Verify**: Run smoke tests on rolled-back version
5. **Communicate**: Post-mortem to community within 1 hour
6. **Fix**: Address issue in development, test on devnet
7. **Redeploy**: Once fix verified, redeploy to mainnet

### Recovery Time Objective
- **Smart Contracts**: <30 minutes
- **RPC Issues**: <10 minutes (switch provider)
- **Monitoring**: <5 minutes (manual verification)

## Known Limitations (v1.0)

Document in deployment announcement:
- [ ] No emergency pause mechanism (v2 feature)
- [ ] Upgrade authority is single wallet (multisig in v2)
- [ ] Escrow limits during gradual rollout ($100 → $500 → $1K → unlimited)
- [ ] Manual monitoring required (automated monitoring in v2)

## Approval Signatures

- [ ] **Developer**: _____________________________________ Date: _____
- [ ] **QA Lead**: _____________________________________ Date: _____
- [ ] **Project Owner**: _____________________________________ Date: _____

---

**Checklist Version**: 1.0
**Last Updated**: 2025-10-09
**Next Review**: After mainnet deployment (Epic 2 start)
