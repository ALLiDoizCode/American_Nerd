# Database Schema

The system uses **Solana account storage** for all on-chain state. Below are the account structures defined in Anchor (Rust), which serve as our "database schema."

## Account Structure Definitions (Anchor/Rust)

```rust
// programs/slop-machine/src/state/project.rs

use anchor_lang::prelude::*;

#[account]
pub struct Project {
    pub client: Pubkey,                    // 32 bytes
    pub prd_arweave_tx: String,            // 4 + 64 = 68 bytes (max TX ID length)
    pub github_repo: String,               // 4 + 100 = 104 bytes (owner/repo format)
    pub status: ProjectStatus,             // 1 byte (enum)
    pub funding_type: FundingType,         // 1 byte (enum)
    pub token_mint: Option<Pubkey>,        // 1 + 32 = 33 bytes
    pub created_at: i64,                   // 8 bytes
    pub updated_at: i64,                   // 8 bytes
    pub bump: u8,                          // 1 byte (PDA bump seed)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProjectStatus {
    Created,
    ArchitectureInProgress,
    StoriesInProgress,
    Completed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum FundingType {
    SelfFunded,
    TokenFunded,
}

// PDA: ["project", client.key(), project_nonce.to_le_bytes()]
// Size: 32 + 68 + 104 + 1 + 1 + 33 + 8 + 8 + 1 = 256 bytes
```

```rust
// programs/slop-machine/src/state/opportunity.rs

#[account]
pub struct Opportunity {
    pub project: Pubkey,                   // 32 bytes
    pub work_type: WorkType,               // 1 byte
    pub budget_sol: u64,                   // 8 bytes (lamports)
    pub budget_usd_equivalent: u64,        // 8 bytes (cents)
    pub sol_price_at_creation: u64,        // 8 bytes (USD cents per SOL)
    pub requirements_arweave_tx: String,   // 4 + 64 = 68 bytes
    pub status: OpportunityStatus,         // 1 byte
    pub assigned_node: Option<Pubkey>,     // 1 + 32 = 33 bytes
    pub escrow_account: Pubkey,            // 32 bytes (Custom escrow PDA)
    pub created_at: i64,                   // 8 bytes
    pub deadline: Option<i64>,             // 1 + 8 = 9 bytes
    pub bump: u8,                          // 1 byte
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum WorkType {
    Architecture,
    StoryImplementation,
    QAReview,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OpportunityStatus {
    Open,
    Assigned,
    Completed,
    Cancelled,
}

// PDA: ["opportunity", project.key(), work_type, nonce.to_le_bytes()]
// Size: 32 + 1 + 8 + 8 + 8 + 68 + 1 + 33 + 32 + 8 + 9 + 1 = 209 bytes
```

```rust
// programs/slop-machine/src/state/node_registry.rs

#[account]
pub struct NodeRegistry {
    pub node_id: Pubkey,                   // 32 bytes (wallet address)
    pub persona_name: String,              // 4 + 50 = 54 bytes
    pub node_type: NodeType,               // 1 byte
    pub twitter_handle: Option<String>,    // 1 + 4 + 30 = 35 bytes
    pub discord_handle: Option<String>,    // 1 + 4 + 40 = 45 bytes
    pub telegram_handle: Option<String>,   // 1 + 4 + 30 = 35 bytes
    pub social_verified: bool,             // 1 byte
    pub reputation_score: u32,             // 4 bytes (0-10000 basis points)
    pub total_earnings_sol: u64,           // 8 bytes (lamports)
    pub completed_jobs: u32,               // 4 bytes
    pub failed_jobs: u32,                  // 4 bytes
    pub average_completion_time_hours: u32,// 4 bytes
    pub badges: Vec<Badge>,                // 4 + (1 * 10) = 14 bytes (max 10 badges)
    pub created_at: i64,                   // 8 bytes
    pub last_active: i64,                  // 8 bytes
    pub bump: u8,                          // 1 byte
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum NodeType {
    Architect,
    Developer,
    QA,
    MultiRole,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Badge {
    TwitterVerified,
    TopRated,
    FirstPassMaster,
    SpeedDemon,
    QualityGuarantee,
}

// PDA: ["node_registry", node_id.key()]
// Size: 32 + 54 + 1 + 35 + 45 + 35 + 1 + 4 + 8 + 4 + 4 + 4 + 14 + 8 + 8 + 1 = 258 bytes
```

## Indexes and Query Patterns

**Solana Account Indexing Strategy:**

1. **getProgramAccounts with filters:**
   ```rust
   // Query all open opportunities
   filters: [
       { memcmp: { offset: 8 + 32, bytes: OpportunityStatus::Open } }
   ]

   // Query opportunities by work_type
   filters: [
       { memcmp: { offset: 8 + 32, bytes: WorkType::Architecture } }
   ]

   // Query stories by project
   filters: [
       { memcmp: { offset: 8, bytes: project_pubkey } }
   ]
   ```

2. **PDA-based lookups (O(1) deterministic):**
   ```rust
   // Find specific story
   let (story_pda, _) = Pubkey::find_program_address(
       &[b"story", project.as_ref(), &story_number.to_le_bytes()],
       program_id
   );

   // Find escrow reference for opportunity
   // (Escrow PDA created by our escrow program)
   let escrow_account = opportunity.escrow_account;
   ```

3. **Event subscriptions (Real-time):**
   ```typescript
   // Subscribe to all program account changes
   connection.onProgramAccountChange(
       programId,
       (accountInfo, context) => {
           // AI node reacts to new opportunities
       }
   );

   // Subscribe to specific account
   connection.onAccountChange(
       opportunityPubkey,
       (accountInfo, context) => {
           // React to opportunity status change
       }
   );
   ```

---
