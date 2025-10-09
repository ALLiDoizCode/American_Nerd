// Instruction modules - each contains a `handler` function
pub mod accept_bid;
pub mod create_opportunity;
pub mod create_project_escrow;
pub mod lock_payment_and_stake;
pub mod register_node;
pub mod release_payment_and_stake;
pub mod slash_stake_and_refund;
pub mod submit_bid_with_stake;

// Re-export all instruction context structs and types for Anchor #[program] macro
// Note: We allow ambiguous glob re-exports for the handler functions since Anchor
// needs the full module exports, and each instruction is called explicitly in lib.rs
#[allow(ambiguous_glob_reexports)]
pub use accept_bid::*;
#[allow(ambiguous_glob_reexports)]
pub use create_opportunity::*;
#[allow(ambiguous_glob_reexports)]
pub use create_project_escrow::*;
#[allow(ambiguous_glob_reexports)]
pub use lock_payment_and_stake::*;
#[allow(ambiguous_glob_reexports)]
pub use register_node::*;
#[allow(ambiguous_glob_reexports)]
pub use release_payment_and_stake::*;
#[allow(ambiguous_glob_reexports)]
pub use slash_stake_and_refund::*;
#[allow(ambiguous_glob_reexports)]
pub use submit_bid_with_stake::*;
