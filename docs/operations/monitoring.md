# Slop Machine Monitoring Guide

<!-- Powered by BMAD™ Core -->

## Overview

This guide describes the monitoring setup for the Slop Machine mainnet deployment, including Helius webhooks, alerts, and dashboards.

## Monitoring Architecture

```
Solana Mainnet
    ↓ (program events)
Helius RPC + Webhooks
    ↓ (filtered events)
Alert System
    ↓ (notify on anomalies)
Dashboard + Logs
```

## Helius Webhook Configuration

### 1. Webhook Setup

**Dashboard**: https://dashboard.helius.dev/

**Webhook Configuration**:
```json
{
  "webhookURL": "https://your-monitoring-endpoint.com/webhooks/slop-machine",
  "webhookType": "enhanced",
  "accountAddresses": ["<PROGRAM_ID>"],
  "transactionTypes": ["ANY"],
  "accountFilter": {
    "programId": "<PROGRAM_ID>"
  }
}
```

### 2. Monitored Events

#### OpportunityCreated
**Trigger**: New opportunity posted on-chain
**Data Captured**:
- Opportunity ID
- Project ID
- USD amount
- SOL amount (converted via Pyth)
- Work type (story, epic, architecture)
- Creator address

**Alert Conditions**:
- None (informational only)

#### BidSubmitted
**Trigger**: Node submits bid with stake
**Data Captured**:
- Bid ID
- Opportunity ID
- Node address
- Bid amount (SOL)
- Stake amount (SOL)
- Stake multiplier

**Alert Conditions**:
- Stake amount < minimum for tier → Warning

#### BidAccepted
**Trigger**: Project creator accepts bid
**Data Captured**:
- Bid ID
- Opportunity ID
- Node address
- Escrow lock amount

**Alert Conditions**:
- Escrow lock amount > $100 during Week 1 → Critical
- Escrow lock amount > $500 during Week 2 → Critical
- Escrow lock amount > $1K during Week 3 → Critical

#### PaymentReleased
**Trigger**: Payment released from escrow after validation
**Data Captured**:
- Opportunity ID
- Node address
- Payment amount (SOL)
- Platform fee amount (SOL)
- Stake return amount (SOL)

**Alert Conditions**:
- Payment amount != expected → Critical
- Platform fee != 5% → Warning
- Stake not returned → Critical

#### StakeSlashed
**Trigger**: Stake slashed due to validation failure
**Data Captured**:
- Opportunity ID
- Node address
- Slash amount (SOL)
- Slash reason
- Distribution (50% creator, 50% platform)

**Alert Conditions**:
- Slash rate > 10% of total stakes in 24h → Warning
- Slash distribution != 50/50 → Critical

### 3. Webhook Endpoint Implementation

**Example Express.js webhook receiver**:

```typescript
import express from 'express';
import { validateWebhookSignature } from './utils';

const app = express();

app.post('/webhooks/slop-machine', express.json(), async (req, res) => {
  // Validate Helius webhook signature
  const isValid = validateWebhookSignature(
    req.body,
    req.headers['x-helius-signature']
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process event
  const { type, data } = req.body;

  switch (type) {
    case 'OpportunityCreated':
      await handleOpportunityCreated(data);
      break;
    case 'BidSubmitted':
      await handleBidSubmitted(data);
      break;
    case 'BidAccepted':
      await handleBidAccepted(data);
      break;
    case 'PaymentReleased':
      await handlePaymentReleased(data);
      break;
    case 'StakeSlashed':
      await handleStakeSlashed(data);
      break;
    default:
      console.log(`Unknown event type: ${type}`);
  }

  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook receiver listening on port 3000');
});
```

## Alert System

### Alert Thresholds

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|------------------|-------------------|--------|
| Transaction Failure Rate | 5% | 10% | Investigate RPC issues / Consider rollback |
| Escrow Balance Anomaly | -10% | -20% | Verify escrow logic / Pause if exploit detected |
| No Transactions | 12 hours | 24 hours | Check RPC health / Verify program status |
| Slash Rate | 5% (24h) | 10% (24h) | Review validation logic / Check for gaming |
| Payment Mismatch | Any | Any | Critical bug / Immediate rollback |

### Alert Delivery

**Channels**:
- Email: Send to operations team
- Discord: Post to #alerts channel
- SMS: Send to on-call engineer (critical only)
- PagerDuty: Create incident (critical only)

**Example Alert Configuration**:
```typescript
const alerts = {
  transactionFailureRate: {
    warning: {
      threshold: 0.05,
      channels: ['email', 'discord'],
      message: 'Transaction failure rate above 5%',
    },
    critical: {
      threshold: 0.10,
      channels: ['email', 'discord', 'sms', 'pagerduty'],
      message: 'Transaction failure rate above 10% - CONSIDER ROLLBACK',
    },
  },
  escrowBalanceAnomaly: {
    critical: {
      threshold: -0.20,
      channels: ['email', 'discord', 'sms', 'pagerduty'],
      message: 'Escrow balance 20% below expected - POTENTIAL EXPLOIT',
    },
  },
};
```

## Monitoring Dashboard

### Key Metrics

#### Real-Time Metrics
- **Transaction Count**: Total transactions in last 1h/24h/7d
- **Success Rate**: Percentage of successful transactions
- **Escrow TVL**: Total value locked in all escrow accounts
- **Active Projects**: Number of projects with open opportunities
- **Active Nodes**: Number of registered nodes
- **Active Opportunities**: Number of open opportunities

#### Historical Metrics
- **Transaction Volume**: Daily/weekly/monthly transaction count
- **Payment Volume**: Daily/weekly/monthly SOL distributed
- **Slash Events**: Count and total SOL slashed
- **New Projects**: Daily/weekly/monthly project creation rate
- **New Nodes**: Daily/weekly/monthly node registration rate

#### Performance Metrics
- **RPC Latency**: Average RPC call latency (p50, p95, p99)
- **Transaction Confirmation Time**: Average time to finalize transactions
- **Oracle Price Update Lag**: Time since last Pyth price update

### Dashboard Tools

**Recommended**: Grafana + Prometheus

**Data Sources**:
- Helius webhooks → Prometheus exporter
- On-chain account queries → Prometheus exporter
- Application logs → Loki

**Example Grafana Dashboard**:
```json
{
  "dashboard": {
    "title": "Slop Machine Mainnet Monitoring",
    "panels": [
      {
        "title": "Transaction Success Rate (24h)",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(slop_machine_transactions_success[24h])"
          }
        ]
      },
      {
        "title": "Escrow TVL",
        "type": "stat",
        "targets": [
          {
            "expr": "slop_machine_escrow_tvl_lamports / 1e9"
          }
        ]
      },
      {
        "title": "Active Opportunities",
        "type": "stat",
        "targets": [
          {
            "expr": "slop_machine_opportunities_open_count"
          }
        ]
      }
    ]
  }
}
```

## Daily Reporting

### Automated Daily Report

**Delivery**: Email at 09:00 UTC
**Recipients**: Operations team, stakeholders

**Report Contents**:
```markdown
# Slop Machine Daily Report - YYYY-MM-DD

## Transaction Summary
- Total Transactions: XXX
- Success Rate: XX.X%
- Failed Transactions: XX

## Escrow Summary
- Total Value Locked: XX.XX SOL ($X,XXX USD)
- Payments Released: XX.XX SOL
- Stakes Slashed: XX.XX SOL

## Activity Summary
- New Projects: XX
- New Opportunities: XX
- New Nodes: XX
- Bids Submitted: XX
- Bids Accepted: XX

## Performance
- Average RPC Latency: XXms
- Average Confirmation Time: XXms
- Oracle Price Updates: XX/24h

## Alerts
- Warnings: XX
- Critical: XX

## Top Projects by Volume
1. Project A - XX.XX SOL
2. Project B - XX.XX SOL
3. Project C - XX.XX SOL

## Top Nodes by Earnings
1. Node A - XX.XX SOL
2. Node B - XX.XX SOL
3. Node C - XX.XX SOL
```

### Report Generation Script

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { sendEmail } from './utils';

async function generateDailyReport() {
  const connection = new Connection(process.env.HELIUS_RPC_URL!);
  const program = // ... load program

  // Fetch all accounts for the last 24 hours
  const now = Date.now() / 1000;
  const yesterday = now - 86400;

  // Query metrics
  const transactions = await getTransactionCount(yesterday, now);
  const escrowTVL = await getEscrowTVL();
  const newProjects = await getNewProjects(yesterday, now);
  // ... fetch other metrics

  // Generate report markdown
  const report = generateReportMarkdown({
    transactions,
    escrowTVL,
    newProjects,
    // ... other metrics
  });

  // Send via email
  await sendEmail({
    to: ['ops@slopmachine.ai'],
    subject: `Slop Machine Daily Report - ${new Date().toISOString().split('T')[0]}`,
    body: report,
  });
}

// Run at 09:00 UTC daily
cron.schedule('0 9 * * *', generateDailyReport);
```

## Incident Response Playbook

### High Transaction Failure Rate (>10%)

**Steps**:
1. Check Helius RPC status: https://status.helius.dev/
2. Verify program upgrade authority hasn't been compromised
3. Review recent transactions on Solana Explorer
4. Check for malformed transactions or exploit attempts
5. If RPC issue: Switch to backup RPC provider
6. If program bug: Execute rollback procedure (see below)

### Escrow Balance Anomaly

**Steps**:
1. Query all escrow accounts to verify balances
2. Compare expected vs actual balances (based on accepted bids)
3. If discrepancy >20%: **PAUSE ALL NEW BIDS** (manual intervention)
4. Review recent payment/slash transactions for anomalies
5. Investigate potential exploit (reentrancy, integer overflow, etc.)
6. If exploit confirmed: Execute emergency rollback

### Payment Mismatch

**Steps**:
1. Immediately capture transaction signature and affected accounts
2. Verify payment calculation logic against oracle price
3. Check for rounding errors or integer overflow
4. If bug confirmed: **PAUSE ALL PAYMENTS** (manual intervention)
5. Contact affected users (refund if overpaid, supplement if underpaid)
6. Execute rollback and deploy fix

## Rollback Procedure

### Trigger Conditions
- Transaction failure rate >10%
- Critical bug discovered (payment mismatch, escrow exploit)
- Escrow balance anomaly >20%
- Data corruption or account state errors

### Rollback Steps

1. **Identify Backup Version**:
   ```bash
   ls -la target/deploy/slop_machine.so.backup-*
   ```

2. **Verify Backup Binary**:
   ```bash
   solana program show <PROGRAM_ID> --url mainnet-beta
   # Compare hash with backup binary hash
   ```

3. **Execute Rollback**:
   ```bash
   anchor upgrade target/deploy/slop_machine.so.backup-YYYYMMDD \
     --provider.cluster mainnet \
     --program-id <PROGRAM_ID>
   ```

4. **Verify Rollback Success**:
   ```bash
   # Run smoke tests on rolled-back version
   anchor test --provider.cluster mainnet --skip-build tests/mainnet-smoke-test.spec.ts
   ```

5. **Communicate to Users**:
   - Post-mortem on Twitter/Discord within 1 hour
   - Email to affected users within 2 hours
   - GitHub issue with incident details

6. **Fix and Redeploy**:
   - Address bug in development
   - Test on devnet with comprehensive tests
   - QA review before redeployment
   - Deploy fix to mainnet with announcement

### Recovery Time Objective (RTO)

- **Smart Contract Rollback**: <30 minutes
- **RPC Provider Switch**: <10 minutes
- **Monitoring System Recovery**: <5 minutes

## Access and Credentials

### Helius Dashboard
- URL: https://dashboard.helius.dev/
- Credentials: Stored in 1Password vault "Slop Machine Operations"

### Monitoring Dashboard
- URL: TBD (Grafana instance)
- Credentials: Stored in 1Password vault "Slop Machine Operations"

### PagerDuty
- URL: https://slopmachine.pagerduty.com/
- On-Call Schedule: Ops team rotation

### Backup RPC Providers

1. **Helius** (Primary): `${HELIUS_RPC_URL}`
2. **QuickNode** (Backup): `${QUICKNODE_RPC_URL}`
3. **Public RPC** (Emergency): `https://api.mainnet-beta.solana.com`

---

**Last Updated**: TBD (after mainnet deployment)
**Next Review**: After Epic 2 completion
**Maintained By**: Operations Team
