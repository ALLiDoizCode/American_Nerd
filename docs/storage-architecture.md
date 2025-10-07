# Storage Architecture: What Lives Where

**Version:** 1.0
**Date:** 2025-10-06

---

## Current Design

### Arweave (Permanent Document Storage)

**What's Stored:**
- ✅ **prd.md content** (full PRD text, 10-50KB)
- ✅ **architecture.md content** (full architecture text, 20-100KB)
- ✅ **front-end-spec.md content** (full UI spec text, 20-80KB)
- ✅ **story.md content** (individual story details, 1-5KB each)

**Why Arweave:**
- Permanent (pay once, stored forever)
- Immutable (content never changes, perfect for context)
- Cheap (~$0.001 per 10KB)
- Content-addressable (TX ID = proof of what was delivered)

**What's NOT stored:**
- ❌ Code (goes to GitHub)
- ❌ Metadata (goes to Solana)
- ❌ Images/assets (could use Arweave, but GitHub is fine)

---

### Solana (State Machine & Metadata)

**What's Stored:**
- ✅ **Arweave TX IDs** (references to documents, 43 chars each)
- ✅ **Project metadata** (GitHub repo URL, status)
- ✅ **Opportunity details** (budget, work type, status)
- ✅ **Bids** (amount, node wallet, status)
- ✅ **Escrow state** (funded amount, payment splits)
- ✅ **Work submissions** (Arweave TX reference, validation status)
- ✅ **Reputation scores** (AI node stats)

**Why Solana:**
- Fast state transitions (escrow, bidding, validation)
- Programmable (smart contract logic)
- Native payments (SOL, SPL tokens)
- Event emission (real-time updates)

**What's NOT stored:**
- ❌ Full document content (too expensive, too large)
- ❌ Code diffs (GitHub handles this)
- ❌ Large files (use Arweave)

---

### GitHub (Code & Version Control)

**What's Stored:**
- ✅ **Code implementations** (actual TypeScript/React/etc files)
- ✅ **Pull Requests** (code reviews, diffs)
- ✅ **Commit history** (who changed what when)
- ✅ **Issues** (optional story tracking)
- ✅ **CI/CD results** (test runs, build status)

**Why GitHub:**
- Industry standard for code
- Built-in PR/review workflow
- CI/CD integration
- Developers expect it

**What's NOT stored:**
- ❌ BMAD documents (they go to Arweave for permanence)
- ❌ Payment state (Solana handles escrow)

---

## Data Flow Example (Milestone 0)

### 1. Client Uploads PRD

```typescript
// Client uploads PRD.md to Arweave
const prdContent = `
# My SaaS App PRD
## Goals
- Build analytics dashboard
...
(10,000 words)
`;

const arweaveTx = await uploadToArweave(prdContent, 'text/markdown');
// Returns: "abc123def456..." (43-char TX ID)

// Client posts opportunity on Solana (only stores TX ID)
await program.methods
  .createProject({
    githubRepo: "client/my-saas",
    arweavePrdTx: arweaveTx,  // <- Just the 43-char reference
  })
  .rpc();
```

**Arweave stores:** Full PRD content (10KB, costs ~$0.001)
**Solana stores:** TX ID reference (43 bytes, included in account rent)

---

### 2. AI Architect Downloads PRD

```typescript
// AI node reads Solana to find opportunities
const opportunity = await program.account.opportunity.fetch(oppPubkey);

// Downloads PRD from Arweave using TX ID
const prdContent = await downloadFromArweave(opportunity.requirementsTx);
// Downloads: Full 10KB PRD text from Arweave

// Generates architecture using Claude
const architecture = await generateArchitecture(prdContent);
// Generates: 50KB architecture.md

// Uploads architecture to Arweave
const archTx = await uploadToArweave(architecture, 'text/markdown');
// Returns: "xyz789ghi012..." (new 43-char TX ID)
```

**Arweave stores:** Full architecture.md content (50KB, costs ~$0.005)
**Solana stores:** New TX ID reference (43 bytes)

---

### 3. Validator Reviews

```typescript
// Validator downloads both documents from Arweave
const prd = await downloadFromArweave(project.arweavePrdTx);
const architecture = await downloadFromArweave(work.arweaveArchTx);

// Reviews side-by-side in UI
// Approves on-chain
await program.methods
  .validateWork({
    approved: true,
    feedback: "Excellent architecture, aligns with PRD",
  })
  .rpc();
```

**No new Arweave data** (just reading existing docs)
**Solana stores:** Validation decision + feedback (in Work account)

---

## Storage Costs Breakdown

### Per Project (Milestone 0)

| Item | Size | Arweave Cost | Solana Cost | Total |
|------|------|--------------|-------------|-------|
| PRD.md | 10KB | $0.001 | - | $0.001 |
| architecture.md | 50KB | $0.005 | - | $0.005 |
| Solana accounts (Project, Opportunity, Bid, Escrow, Work) | ~2KB | - | ~0.002 SOL rent (~$0.30, refundable) | $0.30 |
| Solana transactions (create, bid, fund, submit, validate) | - | - | ~0.0005 SOL (~$0.075) | $0.075 |
| **Total** | | **$0.006** | **$0.375** | **$0.381** |

**Note:** Solana rent is refundable when accounts close. Real cost is just transactions (~$0.08)

---

### Per Story (Milestone 1)

| Item | Size | Arweave Cost | Solana Cost | GitHub Cost |
|------|------|--------------|-------------|-------------|
| story.md | 2KB | $0.0002 | - | - |
| Code files (in GitHub) | 10KB | - | - | Free |
| Solana Story/PR/QAReview accounts | ~2KB | - | ~0.002 SOL rent (~$0.30) | - |
| Solana transactions | - | - | ~0.0005 SOL (~$0.075) | - |
| **Total** | | **$0.0002** | **$0.375** | **$0** |

**Per 10-story project:** ~$0.002 Arweave + ~$3.75 Solana = **~$3.75 total**

---

## Alternative Considered: GitHub for Documents

### Why NOT store BMAD docs in GitHub?

**Pros of GitHub:**
- Already using it for code
- Free storage
- Good version control

**Cons of GitHub (why we chose Arweave):**
1. **Not permanent** - GitHub can delete repos, change policies
2. **Mutable** - Files can be edited/deleted, breaks immutability guarantee
3. **Centralized** - GitHub is a company (can ban accounts)
4. **Version confusion** - Need to pin exact commit SHAs (Arweave TX IDs are cleaner)

**BMAD requires immutability** - Once architecture.md is validated and paid for, it must be permanent proof of what was delivered.

**Example problem without Arweave:**
```
Client: "The architecture you delivered was terrible!"
Dev: "No, I delivered X" (shows GitHub commit)
Client: "That's not what I see now" (someone edited the file)
→ No source of truth
```

**With Arweave:**
```
Client: "Architecture is terrible!"
Dev: "I delivered arweave.net/abc123, it's permanent"
→ Immutable proof of delivery
```

---

## Dual Storage Strategy (Our Design)

### Documents Live in BOTH GitHub AND Arweave

```
┌─────────────────────────────────────────────────────────────┐
│  GITHUB (Mutable Working Copy)                              │
│  client-repo/docs/                                          │
│    ├─ prd.md (editable, versioned)                          │
│    ├─ architecture.md (editable, versioned)                 │
│    └─ front-end-spec.md (editable, versioned)               │
│  Purpose: Development, iteration, accessibility             │
│  Cost: Free                                                 │
└─────────────────────────────────────────────────────────────┘
              ↓ (uploaded at milestones)
┌─────────────────────────────────────────────────────────────┐
│  ARWEAVE (Immutable Snapshots)                              │
│    ├─ arweave.net/abc123 (PRD v1.0 - snapshot)              │
│    ├─ arweave.net/def456 (Architecture v1.0 - snapshot)     │
│    └─ arweave.net/ghi789 (Frontend Spec v1.0 - snapshot)    │
│  Purpose: Validation, payment proof, AI context source      │
│  Cost: ~$0.01 per project (one-time)                        │
└─────────────────────────────────────────────────────────────┘
              ↑ (references in smart contracts)
┌─────────────────────────────────────────────────────────────┐
│  SOLANA (State & Coordination)                              │
│  - Arweave TX IDs (abc123, def456, ghi789)                 │
│  - Payment tied to specific Arweave TX                      │
│  - Validation against specific Arweave snapshot             │
│  Cost: ~$0.08 per project (tx fees)                         │
└─────────────────────────────────────────────────────────────┘
```

### Why Both?

**GitHub = Mutable Development Copy**
- Developers work from GitHub version
- Can iterate/update as project evolves
- Easy collaboration, version control
- Free storage

**Arweave = Immutable Legal Record**
- Permanent proof of what was delivered
- Can't be edited after validation/payment
- Source of truth for disputes
- AI agents download from here (not GitHub)

**Solana = Points to Arweave**
- Smart contract references Arweave TX IDs
- Payment tied to specific snapshot
- Validator approves specific Arweave content

### Workflow Example

```
1. Client writes PRD in GitHub
   ├─ client-repo/docs/prd.md (commit abc)

2. Client uploads PRD to Arweave
   ├─ arweave.net/tx123 (permanent snapshot of commit abc)

3. Opportunity posted on Solana
   ├─ References arweave.net/tx123

4. AI Architect downloads from Arweave
   ├─ Reads arweave.net/tx123 (not GitHub!)

5. AI generates architecture
   ├─ Uploads to Arweave: arweave.net/tx456
   └─ Creates GitHub PR: docs/architecture.md

6. Validator reviews
   ├─ Downloads from Arweave: tx456
   └─ Approves → Payment released for tx456 content

7. GitHub PR merged
   ├─ docs/architecture.md now in repo
   └─ Developers use this version for coding

8. If architecture changes later
   ├─ Update in GitHub (new commit)
   ├─ Upload new version to Arweave (tx789)
   └─ New stories reference tx789
```

**Key Point:** GitHub version can evolve, but Arweave snapshots are permanent proof of what was paid for.

---

## Document Sharding (Future Enhancement)

### Problem: Large Architectures

A complex architecture.md might be:
- 100,000 words
- 500KB file
- $0.05 to store on Arweave (still cheap!)
- But: Too large for single Claude API call (context limits)

### Solution: md-tree Sharding

```bash
# Original
docs/architecture.md (500KB)

# Sharded (stored separately on Arweave)
docs/architecture/tech-stack.md → arweave.net/tx1 (5KB)
docs/architecture/data-models.md → arweave.net/tx2 (50KB)
docs/architecture/api-endpoints.md → arweave.net/tx3 (100KB)
docs/architecture/deployment.md → arweave.net/tx4 (20KB)
```

**Story references specific sections:**
```rust
pub struct Story {
    pub arweave_details_tx: String,  // Story itself
    pub context_references: Vec<String>,  // Relevant architecture sections
    // Example: ["tx2", "tx3"] (data models + API endpoints)
}
```

**Developer AI only downloads what it needs:**
- Story (2KB)
- Relevant architecture sections (150KB total)
- Total context: 152KB (fits in Claude's window)

**All stored on Arweave permanently:**
- Each shard has own TX ID
- Immutable references
- Pay once per shard

---

## Summary: Storage Decision Matrix

| Data Type | Arweave | Solana | GitHub | Rationale |
|-----------|---------|--------|--------|-----------|
| PRD content | ✅ | ❌ | ❌ | Permanent, immutable, complete context |
| Architecture content | ✅ | ❌ | ❌ | Permanent, immutable, complete context |
| Frontend spec content | ✅ | ❌ | ❌ | Permanent, immutable, complete context |
| Story descriptions | ✅ | ❌ | ❌ | Permanent, immutable, validation reference |
| Code files | ❌ | ❌ | ✅ | Version control, PR workflow, CI/CD |
| Arweave TX IDs | ❌ | ✅ | ❌ | On-chain references, escrow logic |
| Project metadata | ❌ | ✅ | ❌ | Fast state changes, bidding, payments |
| Escrow state | ❌ | ✅ | ❌ | Smart contract logic, payment splits |
| Reputation scores | ❌ | ✅ | ❌ | On-chain proof, query performance |
| Validation decisions | ❌ | ✅ | ❌ | Triggers payment, permanent record |

---

## Cost Comparison: Arweave vs Alternatives

### Arweave
- **Cost:** $0.01 per project (one-time)
- **Permanence:** Forever (paid once)
- **Immutability:** Cannot be changed
- **Decentralization:** Fully decentralized
- **Retrieval:** Free, instant (HTTP)

### IPFS
- **Cost:** Free to upload
- **Permanence:** Only if someone pins it (no guarantee)
- **Immutability:** Yes (content-addressed)
- **Decentralization:** Yes
- **Retrieval:** Free if pinned, else may disappear
- **Why NOT:** No permanence guarantee without paid pinning service

### AWS S3
- **Cost:** $0.023 per GB per month (ongoing!)
- **Permanence:** Only if you keep paying
- **Immutability:** Optional (versioning)
- **Decentralization:** No (AWS-controlled)
- **Retrieval:** $0.09 per GB
- **Why NOT:** Ongoing costs, centralized, mutable

### Supabase Storage
- **Cost:** $0.021 per GB per month (ongoing)
- **Permanence:** Only if you keep paying
- **Immutability:** No
- **Decentralization:** No
- **Why NOT:** Same as S3, plus smaller company risk

**Arweave wins for BMAD use case:**
- ✅ One-time payment (not monthly)
- ✅ Permanent (critical for legal/validation proof)
- ✅ Immutable (context cannot change)
- ✅ Decentralized (no single point of failure)
- ✅ Cheap ($0.01 vs $0.25/year on S3)

---

## Open Question: Code Storage

**Current design:** Code lives in GitHub (client's repo)

**Alternative:** Store code on Arweave too?

**Pros:**
- Permanent proof of delivery
- Decentralized (no GitHub dependency)
- Client can't delete/modify

**Cons:**
- No PR workflow (GitHub's killer feature)
- No CI/CD integration
- Developers expect GitHub
- More expensive ($0.05 per 50KB code vs free GitHub)

**Recommendation:** Keep code in GitHub, store BMAD docs on Arweave
- BMAD docs = "what should be built" (permanent reference)
- Code = "what was built" (GitHub for workflow)
- Validator checks code against BMAD docs (both sources of truth)

---

**Does this clarify the storage architecture?** Any concerns with storing documents on Arweave vs keeping everything in GitHub?
