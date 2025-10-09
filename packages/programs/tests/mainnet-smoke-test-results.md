# Mainnet Smoke Test Results

<!-- Powered by BMAD™ Core -->

**Story**: 1.9 - Deploy to Mainnet-Beta
**Test Date**: TBD (awaiting mainnet deployment)
**Cluster**: mainnet-beta
**Program ID**: TBD (will be populated after deployment)
**Pyth Price Feed**: H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG (mainnet SOL/USD)

## Test Summary

| Test | Status | Transaction Signature | Explorer Link | Notes |
|------|--------|----------------------|---------------|-------|
| 1. Create Project (0.1 SOL) | ⏳ Pending | TBD | TBD | Create test project with 0.1 SOL budget |
| 2. Create Opportunity ($5) | ⏳ Pending | TBD | TBD | Create test opportunity for $5 story |
| 3. Register Node (Tier 0) | ⏳ Pending | TBD | TBD | Register test node at tier 0 |
| 4. Submit Bid (0.025 SOL + 0.125 SOL stake) | ⏳ Pending | TBD | TBD | Submit bid with stake (5x multiplier) |
| 5. Accept Bid | ⏳ Pending | TBD | TBD | Accept bid and verify escrow lock |
| 6. Release Payment | ⏳ Pending | TBD | TBD | Simulate validation pass, verify payment + stake return |

**Overall Status**: ⏳ Pending Execution
**Tests Passed**: 0/6
**Total SOL Spent**: TBD

## Prerequisites Checklist

- [ ] Program deployed to mainnet: `anchor deploy --provider.cluster mainnet`
- [ ] Anchor.toml updated with mainnet program ID
- [ ] lib.rs `declare_id!` updated with mainnet program ID
- [ ] HELIUS_RPC_URL environment variable configured
- [ ] Test wallet created: `solana-keygen new -o ~/.config/solana/mainnet-test.json`
- [ ] Test wallet funded with 0.5 SOL from exchange/DEX
- [ ] Test wallet balance verified: `solana balance ~/.config/solana/mainnet-test.json --url mainnet-beta`

## Test Execution Commands

### 1. Verify Prerequisites
```bash
# Check HELIUS_RPC_URL configured
echo $HELIUS_RPC_URL

# Check test wallet balance
solana balance ~/.config/solana/mainnet-test.json --url mainnet-beta

# Verify program deployed
solana program show <PROGRAM_ID> --url mainnet-beta
```

### 2. Run Smoke Tests
```bash
# Execute smoke tests on mainnet
anchor test --provider.cluster mainnet --skip-build tests/mainnet-smoke-test.spec.ts
```

### 3. Verify Transactions on Explorer
```bash
# View transaction on solscan.io
open "https://solscan.io/tx/<SIGNATURE>"

# View transaction on solana.fm
open "https://solana.fm/tx/<SIGNATURE>?cluster=mainnet-beta"
```

## Detailed Test Results

### Test 1: Create Project

**Status**: ⏳ Pending
**Transaction Signature**: TBD

**Parameters**:
- Project Name: "Mainnet Smoke Test Project"
- Budget: 0.1 SOL
- Funding Type: Native SOL

**Expected Results**:
- [  ] Project account created
- [  ] Project PDA derived correctly
- [  ] Escrow PDA derived correctly
- [  ] Budget set to 0.1 SOL
- [  ] Creator set to test wallet

**Actual Results**: TBD

**Explorer Links**:
- solscan.io: TBD
- solana.fm: TBD

---

### Test 2: Create Opportunity

**Status**: ⏳ Pending
**Transaction Signature**: TBD

**Parameters**:
- Title: "Mainnet Smoke Test Story"
- Description: "Testing opportunity creation on mainnet with real SOL"
- USD Amount: $5.00
- Work Type: Story

**Expected Results**:
- [  ] Opportunity account created
- [  ] USD amount converted to SOL via Pyth mainnet price feed
- [  ] Opportunity linked to project
- [  ] Title and description set correctly

**Actual Results**: TBD

**Explorer Links**:
- solscan.io: TBD
- solana.fm: TBD

---

### Test 3: Register Node

**Status**: ⏳ Pending
**Transaction Signature**: TBD

**Parameters**:
- Node Type: Developer
- Metadata: "Mainnet smoke test node"
- Expected Tier: 0 (new node)

**Expected Results**:
- [  ] Node registry account created
- [  ] Node registry PDA derived correctly
- [  ] Node tier set to 0
- [  ] Node type set to Developer
- [  ] Completed stories: 0
- [  ] Attempted stories: 0

**Actual Results**: TBD

**Explorer Links**:
- solscan.io: TBD
- solana.fm: TBD

---

### Test 4: Submit Bid with Stake

**Status**: ⏳ Pending
**Transaction Signature**: TBD

**Parameters**:
- Bid Amount: 0.025 SOL
- Stake Amount: ~0.125 SOL (calculated from tier 0 multiplier 5.0x)
- Message: "Mainnet smoke test bid"

**Expected Results**:
- [  ] Bid account created
- [  ] Stake account created
- [  ] Bid amount set to 0.025 SOL
- [  ] Stake multiplier set to 5.0 (tier 0)
- [  ] Stake locked in stake account
- [  ] Bid status set to pending

**Actual Results**: TBD

**Explorer Links**:
- solscan.io: TBD
- solana.fm: TBD

---

### Test 5: Accept Bid

**Status**: ⏳ Pending
**Transaction Signature**: TBD

**Expected Results**:
- [  ] Bid status updated to accepted
- [  ] Opportunity status updated to in progress
- [  ] Opportunity assigned node set to test node
- [  ] Escrow account locked

**Actual Results**: TBD

**Explorer Links**:
- solscan.io: TBD
- solana.fm: TBD

---

### Test 6: Release Payment

**Status**: ⏳ Pending
**Transaction Signature**: TBD

**Expected Results**:
- [  ] Payment released from escrow to node
- [  ] Stake returned to node
- [  ] Stake status updated to released
- [  ] Node wallet balance increased by payment amount + stake
- [  ] Opportunity status updated to completed

**Actual Results**: TBD

**SOL Received by Node**:
- Payment: TBD SOL
- Stake Return: TBD SOL
- Total: TBD SOL

**Explorer Links**:
- solscan.io: TBD
- solana.fm: TBD

---

## Test Environment

**RPC Endpoint**: `${HELIUS_RPC_URL}` (mainnet)
**Program ID**: TBD (will be populated after deployment)
**Test Wallet**: TBD
**Node Wallet**: TBD
**Project Account**: TBD
**Opportunity Account**: TBD

## Issues Encountered

(To be populated during test execution)

## Conclusion

**Overall Assessment**: ⏳ Pending Execution

**Next Steps**:
1. Deploy program to mainnet: `anchor deploy --provider.cluster mainnet`
2. Update configuration files with mainnet program ID
3. Fund test wallet with 0.5 SOL
4. Execute smoke tests: `anchor test --provider.cluster mainnet --skip-build tests/mainnet-smoke-test.spec.ts`
5. Update this document with actual results
6. Verify all transactions on Solana Explorer
7. Document any issues or anomalies

---

**Last Updated**: TBD (awaiting test execution)
**Executed By**: TBD
**Reviewed By**: TBD
