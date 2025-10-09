use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Opportunity must be in Open status to accept bids")]
    OpportunityNotOpen,

    #[msg("Bid amount is invalid: must be >= $2.50 and <= opportunity max budget")]
    InvalidBidAmount,

    #[msg("Insufficient stake: node wallet lacks SOL for required stake amount")]
    InsufficientStake,

    #[msg("Invalid node registry: node_id does not match signer")]
    InvalidNodeRegistry,

    #[msg("Price feed is stale (> 75 slots / ~30 seconds old)")]
    OraclePriceStale,

    #[msg("Oracle price feed unavailable or invalid")]
    OraclePriceUnavailable,

    #[msg("Bid amount below minimum $2.50 USD")]
    BidBelowMinimumUSD,

    #[msg("Invalid Pyth oracle account provided")]
    OracleAccountInvalid,

    #[msg("Invalid amount: must be > 0 and within safe range")]
    InvalidAmount,

    #[msg("Oracle price out of reasonable range ($20-$500)")]
    OraclePriceOutOfRange,

    // Escrow errors (Story 1.5)
    #[msg("Escrow is not in the expected state for this operation")]
    EscrowInvalidState,

    #[msg("Payment amount does not match escrow amount")]
    EscrowAmountMismatch,

    #[msg("Stake must be in Locked status for this operation")]
    StakeNotLocked,

    #[msg("Escrow PDA has insufficient balance for distribution")]
    InsufficientEscrowBalance,

    #[msg("Invalid burn address: must be 11111111111111111111111111111112")]
    InvalidBurnAddress,

    #[msg("Slash conditions not met: requires 3+ validation failures")]
    SlashConditionsNotMet,
}
