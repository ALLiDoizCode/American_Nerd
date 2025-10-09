# CI/CD Setup Guide for Slop Machine

Quick setup guide to get your CI/CD pipelines running.

## ⚡ Quick Setup (5 minutes)

### Step 1: Generate Deployer Keypair

```bash
# Create a dedicated deployer wallet
solana-keygen new -o deployer-keypair.json --no-bip39-passphrase

# Display public key
solana-keygen pubkey deployer-keypair.json
```

### Step 2: Fund Deployer Wallet

```bash
# Get the public key from step 1
DEPLOYER_KEY=$(solana-keygen pubkey deployer-keypair.json)

# Fund for devnet testing
solana airdrop 5 $DEPLOYER_KEY --url devnet

# Fund for testnet (repeat multiple times if needed)
solana airdrop 2 $DEPLOYER_KEY --url testnet
solana airdrop 2 $DEPLOYER_KEY --url testnet
solana airdrop 2 $DEPLOYER_KEY --url testnet

# For mainnet: Transfer SOL from your main wallet
solana transfer $DEPLOYER_KEY 10 --from ~/.config/solana/your-wallet.json --url mainnet-beta
```

### Step 3: Add GitHub Secret

```bash
# Display keypair as JSON array
cat deployer-keypair.json
```

**Copy the output**, then:

1. Go to your GitHub repository
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `SOLANA_DEPLOYER_KEYPAIR`
5. Value: Paste the JSON array from above
6. Click **Add secret**

### Step 4: Verify Setup

```bash
# Push a change to development branch
git checkout development
git commit --allow-empty -m "test: trigger CI/CD pipeline"
git push origin development
```

Then check: **Repository → Actions tab** to see workflows running.

---

## 🔐 Security Checklist

- [ ] Deployer keypair added to GitHub Secrets (never commit to repo)
- [ ] Deployer wallet funded for devnet (5+ SOL recommended)
- [ ] Deployer wallet funded for testnet (5+ SOL recommended)
- [ ] Deployer wallet funded for mainnet (50+ SOL recommended)
- [ ] Branch protection enabled on `main` branch
- [ ] PR reviews required before merging to `staging` and `main`

---

## 🎯 Optional: GitHub Environments

For additional deployment protection:

### Create Environments

1. Go to: **Settings → Environments**
2. Create three environments:

#### Environment: `devnet`
- No protection rules (fast iteration)

#### Environment: `testnet`
- ✅ Required reviewers: 1 person
- ✅ Wait timer: 5 minutes (optional)

#### Environment: `mainnet-beta`
- ✅ Required reviewers: 2 people
- ✅ Deployment branches: Only `main` branch
- ✅ Wait timer: 30 minutes (recommended)

### Add Environment Secrets (Optional)

If you want different deployer keys per environment:

```bash
# Settings → Environments → [environment] → Add secret
# Secret name: SOLANA_DEPLOYER_KEYPAIR
# Repeat for each environment with different keys
```

---

## 📊 Testing Your Setup

### Test 1: CI Pipeline (No Deployment)

```bash
# Create a feature branch
git checkout -b Epic1-test-ci

# Make a small change
echo "// Test" >> packages/programs/programs/slop-machine/src/lib.rs

# Commit and push
git add .
git commit -m "test: verify CI pipeline"
git push origin Epic1-test-ci
```

**Expected Result:**
- ✅ Lint & format check passes
- ✅ Build completes successfully
- ✅ Tests run and pass
- ✅ Security audit completes
- ❌ No deployment occurs (feature branches don't deploy)

### Test 2: Deployment to Devnet

```bash
# Merge to development
git checkout development
git merge Epic1-test-ci
git push origin development
```

**Expected Result:**
- ✅ All CI checks pass
- ✅ Pre-deployment tests run
- ✅ Program deploys to **devnet**
- ✅ Post-deployment verification passes
- ✅ Artifacts uploaded with program ID

### Test 3: Manual Deployment

1. Go to: **Actions → Solana Program Deployment**
2. Click: **Run workflow**
3. Select branch: `development`
4. Select environment: `devnet`
5. Skip tests: `false`
6. Click: **Run workflow**

**Expected Result:**
- ✅ Workflow runs manually
- ✅ Deployment succeeds

---

## 🐛 Common Setup Issues

### Issue: "Secret not found: SOLANA_DEPLOYER_KEYPAIR"

**Solution:**
```bash
# Verify secret exists
# Go to: Settings → Secrets and variables → Actions
# Ensure SOLANA_DEPLOYER_KEYPAIR is listed

# Re-add if missing (see Step 3 above)
```

### Issue: "Insufficient funds for deployment"

**Solution:**
```bash
# Check deployer balance
solana balance $(solana-keygen pubkey deployer-keypair.json) --url devnet

# Fund if needed
solana airdrop 5 $(solana-keygen pubkey deployer-keypair.json) --url devnet
```

### Issue: "Build failed: Anchor version mismatch"

**Solution:**
```bash
# Update local Anchor to match CI (0.30.0)
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked --force

# Rebuild locally
cd packages/programs
anchor build
```

### Issue: "Tests fail in CI but pass locally"

**Solution:**
```bash
# Reset local validator
solana-test-validator --reset

# Re-run tests
cd packages/programs
anchor test
```

---

## 🎉 Next Steps

Once setup is complete:

1. **Enable Branch Protection**
   - Settings → Branches → Add rule for `main`
   - Require PR reviews before merging
   - Require status checks to pass

2. **Configure Notifications** (Optional)
   - Add Slack/Discord webhooks for deployment notifications
   - Edit `.github/workflows/solana-deploy.yml` notify steps

3. **Review Security Settings**
   - Settings → Code security and analysis
   - Enable Dependabot alerts
   - Enable Secret scanning

4. **Start Developing!**
   ```bash
   git checkout -b Epic1-my-feature
   # Make changes, commit, push
   # CI will automatically run on every push
   ```

---

## 📚 Resources

- [Full CI/CD Documentation](.github/workflows/README.md)
- [Solana CLI Documentation](https://docs.solana.com/cli)
- [GitHub Actions Secrets Guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Anchor Framework Docs](https://www.anchor-lang.com/)

---

**Need Help?** Open an issue or check the [Troubleshooting Guide](.github/workflows/README.md#-troubleshooting).
