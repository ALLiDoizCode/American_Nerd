# Slop Machine CI/CD Pipelines

This directory contains GitHub Actions workflows for continuous integration and deployment of the Slop Machine platform.

## 📋 Workflows Overview

### 1. **Solana Program CI** (`solana-ci.yml`)

Continuous integration for Solana programs - runs on every push and pull request.

**Triggers:**
- Push to `main`, `development`, `staging`, or `Epic*` branches
- Pull requests to `main`, `development`, or `staging`
- Only when `packages/programs/**` files change

**Jobs:**
- **Lint & Format Check**: Runs `cargo fmt` and `cargo clippy`
- **Build**: Compiles Anchor programs and uploads artifacts
- **Test**: Runs Anchor tests and integration tests
- **Security Audit**: Scans for known vulnerabilities with `cargo-audit`

**Artifacts:**
- Program builds (`.so` files) - 7 days retention
- IDL files (`.json`) - 7 days retention

---

### 2. **Solana Program Deployment** (`solana-deploy.yml`)

Automated deployment of Solana programs to different clusters based on branch.

**Deployment Strategy:**
| Branch | Cluster | Purpose |
|--------|---------|---------|
| `development` | Devnet | Rapid development iteration |
| `staging` | Testnet | Pre-production validation |
| `main` | Mainnet-beta | Production releases |

**Triggers:**
- Automatic: Push to `development`, `staging`, or `main` branches
- Manual: `workflow_dispatch` with environment selection

**Jobs:**
1. **Determine Environment**: Maps branch to Solana cluster
2. **Pre-Deployment Tests**: Runs full test suite (can be skipped manually)
3. **Deploy**: Deploys programs to target cluster
4. **Post-Deployment Verification**: Runs smoke tests
5. **Notify Deployment Status**: Sends deployment notifications

**Required Secrets:**
- `SOLANA_DEPLOYER_KEYPAIR`: Base58-encoded deployer keypair (JSON format)

**Artifacts:**
- Deployment artifacts (`.so` and `.json` files) - 90 days retention
- Deployment summary with program IDs and explorer links

**Manual Deployment:**
```bash
# Via GitHub UI: Actions → Solana Program Deployment → Run workflow
# Select environment: devnet, testnet, or mainnet-beta
# Optional: Skip tests (not recommended)
```

---

### 3. **Security & Code Quality** (`security-quality.yml`)

Comprehensive security scanning and code quality checks.

**Triggers:**
- Push to any branch
- Pull requests
- Daily at 2 AM UTC (scheduled)
- Manual via `workflow_dispatch`

**Jobs:**
- **Dependency Review**: Scans for vulnerable dependencies (PRs only)
- **Rust Security Audit**: Runs `cargo-audit` and generates report
- **TypeScript Quality**: Lints TypeScript code and checks types
- **Secret Scanning**: Detects leaked secrets with TruffleHog
- **CodeQL Analysis**: Static analysis for security vulnerabilities
- **Solana Program Verification**: Generates reproducible build hashes
- **License Compliance**: Checks all dependency licenses
- **Security Summary**: Aggregates all security check results

**Artifacts:**
- Rust security audit reports - 30 days retention
- Verification reports with build hashes - 90 days retention
- License compliance reports - 30 days retention

---

## 🚀 Getting Started

### Prerequisites

1. **GitHub Secrets Configuration**

You must add the following secrets to your GitHub repository:

```bash
# Settings → Secrets and variables → Actions → New repository secret

# Solana deployer keypair (JSON format)
SOLANA_DEPLOYER_KEYPAIR='[1,2,3,...]'  # Your deployer keypair array
```

**How to generate a deployer keypair:**
```bash
# Generate new keypair
solana-keygen new -o deployer-keypair.json

# Display as JSON array for GitHub secret
cat deployer-keypair.json

# Fund the deployer wallet
solana airdrop 2 <DEPLOYER_PUBLIC_KEY> --url devnet  # For devnet
solana airdrop 2 <DEPLOYER_PUBLIC_KEY> --url testnet # For testnet
# For mainnet: Transfer SOL from your funded wallet
```

2. **GitHub Environments** (Optional but Recommended)

Configure environments for deployment protection:

```bash
# Settings → Environments → New environment

# Create three environments:
- devnet (no protection rules)
- testnet (require reviewers: 1)
- mainnet-beta (require reviewers: 2, restrict to main branch)
```

---

## 📊 Branch Strategy & Deployment Flow

```
Feature Development (Epic* branches)
  ↓ (CI only - build, test, lint)
  ↓ Merge PR
  ↓
development branch
  ↓ (CI + Deploy to devnet)
  ↓ Merge PR
  ↓
staging branch
  ↓ (CI + Deploy to testnet)
  ↓ Merge PR
  ↓
main branch
  ↓ (CI + Deploy to mainnet-beta)
  ✅ Production Release
```

### Recommended Git Flow

```bash
# Create feature branch
git checkout -b Epic1-feature-name

# Work on feature, push changes
git push origin Epic1-feature-name
# → CI runs: lint, build, test, security checks

# Merge to development (via PR)
git checkout development
git merge Epic1-feature-name
git push origin development
# → CI + Deploy to devnet

# Merge to staging (via PR)
git checkout staging
git merge development
git push origin staging
# → CI + Deploy to testnet

# Merge to main (via PR)
git checkout main
git merge staging
git push origin main
# → CI + Deploy to mainnet-beta
```

---

## 🔧 Customization

### Modifying Solana/Anchor Versions

Edit environment variables in workflow files:

```yaml
env:
  SOLANA_VERSION: '1.18.18'  # Change Solana CLI version
  ANCHOR_VERSION: '0.30.0'   # Change Anchor version
  RUST_TOOLCHAIN: '1.79.0'   # Change Rust version
```

### Adding New Programs

When you add new Anchor programs:

1. Ensure they're in the workspace: `packages/programs/Cargo.toml`
2. CI will automatically detect and build them
3. Update deployment script if custom deployment logic is needed

### Skipping CI

Add to commit message to skip CI:
```bash
git commit -m "docs: update README [skip ci]"
```

---

## 🐛 Troubleshooting

### Deployment Fails: "Insufficient Funds"

**Solution:** Check deployer balance and fund the account:
```bash
solana balance <DEPLOYER_PUBLIC_KEY> --url <cluster>
solana airdrop 5 <DEPLOYER_PUBLIC_KEY> --url devnet
```

### Deployment Fails: "Program Already Deployed"

**Solution:** Use program upgrade instead:
```bash
solana program deploy target/deploy/slop_machine.so \
  --program-id <EXISTING_PROGRAM_ID> \
  --upgrade-authority ~/.config/solana/deployer.json
```

### Build Fails: "Anchor Version Mismatch"

**Solution:** Ensure local Anchor version matches CI:
```bash
anchor --version  # Check current version
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked --force
```

### Tests Fail in CI but Pass Locally

**Common causes:**
- Local validator not cleaned: `solana-test-validator --reset`
- Environment differences: Check Solana/Anchor versions
- Timing issues: Add delays in tests for blockchain confirmations

---

## 📈 Monitoring & Alerts

### Viewing Workflow Runs

- **GitHub UI**: Repository → Actions tab
- **Filter by workflow**: Select specific workflow from sidebar
- **View logs**: Click on workflow run → Click on job → Expand steps

### Deployment Artifacts

All deployments create artifacts with:
- Program binaries (`.so` files)
- IDL files (`.json` files)
- Deployment summary (program IDs, explorer links)
- Verification reports (build hashes for reproducibility)

**Download artifacts:**
```bash
# Via GitHub UI: Actions → Workflow run → Artifacts section
# Or via GitHub CLI:
gh run download <RUN_ID>
```

---

## 🔐 Security Best Practices

1. **Never commit keypairs** - Always use GitHub Secrets
2. **Limit deployer permissions** - Use dedicated deployer wallets
3. **Review dependencies** - Monitor security audit reports
4. **Verify builds** - Use verification reports for reproducibility
5. **Enable branch protection** - Require PR reviews before merging
6. **Rotate credentials** - Update deployer keypairs periodically

---

## 📚 Additional Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana CLI Reference](https://docs.solana.com/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Solana Program Deployment Guide](https://docs.solana.com/cli/deploy-a-program)

---

## 🆘 Support

For issues with CI/CD pipelines:
1. Check workflow logs for detailed error messages
2. Review this documentation
3. Open an issue in the repository with workflow run URL

**Quick Links:**
- [View Workflow Runs](../../actions)
- [Configure Secrets](../../settings/secrets/actions)
- [Configure Environments](../../settings/environments)
