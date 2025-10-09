# Slop Machine - Solana Programs

Solana smart contracts for the Slop Machine marketplace platform.

## Overview

This package contains the core Anchor programs for managing the decentralized AI agent marketplace on Solana.

## Prerequisites

Before building and testing, ensure you have the following installed:

- **Rust** 1.75+
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

- **Solana CLI** 1.18+
  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
  ```

- **Anchor CLI** 0.30.0
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked --force
  ```

- **Node.js** 20.11.0 LTS
  ```bash
  # Use nvm or download from nodejs.org
  ```

- **pnpm** 8.0+
  ```bash
  npm install -g pnpm
  ```

## Build

Build the Solana program:

```bash
anchor build
```

The compiled program binary will be at `target/deploy/slop_machine.so`.

## Test

Run the test suite with a local validator:

```bash
anchor test
```

Run tests without rebuilding:

```bash
anchor test --skip-build
```

## Deployment

### Devnet

**Current Devnet Deployment** (Story 1.8):
- **Program ID**: `4hPgUuR7S8pyX7WxgaKTunaPCjMQLhEmBgQEyTrTvDNt`
- **Network**: Solana Devnet
- **Status**: ✅ Deployed (Slot 413451864)
- **Explorer**: https://explorer.solana.com/address/4hPgUuR7S8pyX7WxgaKTunaPCjMQLhEmBgQEyTrTvDNt?cluster=devnet

Deploy to Solana devnet:

```bash
# 1. Get devnet SOL for deployment (requires ~3 SOL)
solana airdrop 2 --url devnet
# Repeat 2-3 times or use https://faucet.solana.com

# 2. Build the program
anchor build

# 3. Deploy to devnet
anchor deploy --provider.cluster devnet

# 4. Copy the deployed program ID from output

# 5. Update program ID in code
# Edit programs/slop-machine/src/lib.rs: declare_id!("<PROGRAM_ID>")
# Edit Anchor.toml: [programs.devnet] slop_machine = "<PROGRAM_ID>"

# 6. Rebuild with updated program ID
anchor build

# 7. Sync IDL to devnet
anchor idl init <PROGRAM_ID> --filepath target/idl/slop_machine.json --provider.cluster devnet

# 8. Verify deployment
solana program show <PROGRAM_ID> --url devnet
```

**Run Devnet Integration Tests**:

```bash
# Run comprehensive devnet integration tests
anchor test --provider.cluster devnet --skip-build

# Run with verbose output
RUST_LOG=debug anchor test --provider.cluster devnet --skip-build

# Run specific test file
anchor test --provider.cluster devnet --skip-build --test devnet-integration
```

### Mainnet

Deploy to mainnet (requires `HELIUS_RPC_URL` in `.env`):

```bash
cp .env.example .env
# Edit .env and add your Helius API key

anchor deploy --provider.cluster mainnet
```

**Important**: After deployment, update the program ID in:
- `programs/slop-machine/src/lib.rs` (`declare_id!` macro)
- `Anchor.toml` (under `[programs.devnet]` or `[programs.mainnet]`)

## Project Structure

```
packages/programs/
├── Anchor.toml                 # Anchor workspace configuration
├── Cargo.toml                  # Rust workspace manifest
├── programs/
│   └── slop-machine/           # Main Solana program
│       ├── Cargo.toml          # Program dependencies
│       ├── Xargo.toml          # Cross-compilation config
│       └── src/
│           └── lib.rs          # Program entry point
├── tests/                      # Integration tests
│   └── slop-machine.spec.ts    # Deployment verification tests
├── migrations/                 # Deployment scripts
└── target/                     # Build artifacts (gitignored)
```

## Configuration

### Cluster URLs

Configured in `Anchor.toml`:
- **Localnet**: `Localnet` (default)
- **Devnet**: `https://api.devnet.solana.com`
- **Mainnet**: `${HELIUS_RPC_URL}` (from environment)

### Wallet

The deployment wallet is configured in `Anchor.toml`:
```toml
wallet = "~/.config/solana/id.json"
```

**Security**: Never commit your deployment keypair. Keep it secure and backed up.

## Dependencies

### Rust Crates

- `anchor-lang` 0.30.0 - Core Anchor framework
- `anchor-spl` 0.30.0 - SPL token program integration
- `pyth-sdk-solana` 0.10 - Price oracle client

### TypeScript Packages

- `@coral-xyz/anchor` - Anchor TypeScript client
- `@solana/web3.js` - Solana JavaScript SDK
- `chai` - Test assertions
- `ts-mocha` - TypeScript test runner

## Development

### Linting

Rust code follows `rustfmt` and `clippy` standards:

```bash
cargo fmt
cargo clippy
```

### Testing Standards

- All integration tests in `tests/*.spec.ts`
- Minimum 80% coverage for critical paths (enforced in later stories)
- Tests run against local validator (not devnet)

## Next Steps

After completing this setup:
- Story 1.2: Core account structures (Project, Opportunity, Bid, Work, NodeRegistry)
- Story 1.3: Staking account structures with slashing logic
- Story 1.4: Bidding workflow with stake locking

## Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Program Library](https://spl.solana.com/)

## License

(To be determined)
