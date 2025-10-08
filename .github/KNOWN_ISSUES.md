# Known Issues - CI/CD Pipelines

## Anchor IDL Generation Failure (anchor-syn 0.30.1)

**Status:** Workaround Implemented
**Severity:** Medium
**Affected Components:** Build process, CI/CD workflows

### Issue Description

Anchor v0.30.0/0.30.1 has a known bug with IDL generation when using newer versions of the `proc-macro2` crate. The error occurs in `anchor-syn`:

```
error[E0599]: no method named `source_file` found for struct `proc_macro2::Span`
   --> anchor-syn-0.30.1/src/idl/defined.rs:499:66
```

### Root Cause

- The `proc-macro2` crate removed the `source_file()` method in newer versions
- `anchor-syn 0.30.1` still uses the deprecated API
- Downgrading `proc-macro2` is blocked by other dependencies (solana-sdk, pyth-sdk-solana)

### Workaround

**Current Solution:** Build programs with `--no-idl` flag

All CI/CD workflows have been updated to use:
```bash
RUST_LOG=error anchor build --no-idl
```

### Impact

- ✅ **Programs build successfully** without IDL generation
- ✅ **Deployments work** (programs deploy normally)
- ❌ **No auto-generated IDL files** (must create manually if needed)
- ❌ **No TypeScript types from IDL** (must create manually)

### Manual IDL Creation (If Needed)

If you need IDL files for client integration:

```bash
# Create minimal IDL structure
mkdir -p target/idl target/types

# Create JSON IDL
cat > target/idl/slop_machine.json << 'EOF'
{
  "version": "0.1.0",
  "name": "slop_machine",
  "instructions": [],
  "accounts": [],
  "types": [],
  "errors": []
}
EOF

# Create TypeScript types
cat > target/types/slop_machine.ts << 'EOF'
export type SlopMachine = {
  "version": "0.1.0",
  "name": "slopMachine",
  "instructions": [],
  "accounts": [],
  "types": []
};

export const IDL: SlopMachine = {
  "version": "0.1.0",
  "name": "slopMachine",
  "instructions": [],
  "accounts": [],
  "types": []
};
EOF
```

### Permanent Fix (Future)

This issue will be resolved when:

1. **Anchor v0.31+** is released with fixed `anchor-syn` dependency
2. **OR** manually patch `anchor-syn` in `Cargo.toml`:
   ```toml
   [patch.crates-io]
   anchor-syn = { git = "https://github.com/coral-xyz/anchor", branch = "master" }
   ```
3. **OR** wait for `proc-macro2` compatibility fix in Anchor

### Rust Toolchain Version

- **Current:** Rust 1.81.0
- **Reason:** Best compatibility with Anchor 0.30.0 and modern dependencies
- **Previous:** Rust 1.79.0 (had same issue)

### Related Issues

- [Anchor GitHub Issue #????] (if applicable)
- Similar issues reported in Anchor Discord

### Testing Status

- ✅ Programs compile successfully with `--no-idl`
- ✅ CI/CD pipelines pass (lint, build, deploy)
- ⚠️ Integration tests may need manual IDL files

---

**Last Updated:** 2025-10-08
**Affects:** All developers building Slop Machine platform
