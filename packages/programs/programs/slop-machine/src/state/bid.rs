use anchor_lang::prelude::*;

/// Bid account - AI node's proposal to complete an opportunity
/// PDA seeds: ["bid", opportunity.key(), node.key(), timestamp]
/// Total size: 8 (discriminator) + 384 bytes = 392 bytes
#[account]
pub struct Bid {
    /// Reference to opportunity (32 bytes)
    pub opportunity: Pubkey,
    /// AI node's wallet address (32 bytes)
    pub node: Pubkey,
    /// Bid amount in lamports (8 bytes)
    pub amount_sol: u64,
    /// USD equivalent at bid time in cents (8 bytes)
    pub usd_equivalent: u64,
    /// SOL/USD price from Pyth when bid placed (8 bytes)
    pub sol_price_at_bid: u64,
    /// Estimated completion time in hours (2 bytes)
    pub estimated_completion_hours: u16,
    /// Optional pitch/details, max 280 chars (4+280=284 bytes)
    pub message: String,
    /// Bid status (1 byte)
    pub status: BidStatus,
    /// Bid creation timestamp (8 bytes)
    pub created_at: i64,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum BidStatus {
    Pending,
    Accepted,
    Rejected,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bid_serialization() {
        let bid = Bid {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            amount_sol: 500_000_000, // 0.5 SOL
            usd_equivalent: 7500,    // $75 in cents
            sol_price_at_bid: 15000, // $150 per SOL
            estimated_completion_hours: 24,
            message: "I can complete this work quickly with high quality".to_string(),
            status: BidStatus::Pending,
            created_at: 1234567890,
            bump: 255,
        };

        let data = bid.try_to_vec().unwrap();
        assert!(!data.is_empty(), "Serialization should produce data");

        let deserialized = Bid::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.opportunity, bid.opportunity);
        assert_eq!(deserialized.node, bid.node);
        assert_eq!(deserialized.amount_sol, bid.amount_sol);
        assert_eq!(deserialized.message, bid.message);
    }

    #[test]
    fn test_bid_status_serialization() {
        let statuses = vec![BidStatus::Pending, BidStatus::Accepted, BidStatus::Rejected];

        for status in statuses {
            let data = status.clone().try_to_vec().unwrap();
            let deserialized = BidStatus::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, status);
        }
    }

    #[test]
    fn test_bid_with_max_message_length() {
        let bid = Bid {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            amount_sol: 1_000_000_000,
            usd_equivalent: 15000,
            sol_price_at_bid: 15000,
            estimated_completion_hours: 48,
            message: "a".repeat(280), // Max 280 chars
            status: BidStatus::Pending,
            created_at: 1234567890,
            bump: 255,
        };

        let data = bid.try_to_vec().unwrap();
        let deserialized = Bid::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.message.len(), 280);
        assert_eq!(deserialized.message, bid.message);
    }

    #[test]
    fn test_bid_pricing_calculations() {
        let bid = Bid {
            opportunity: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            amount_sol: 666_666_666, // ~0.67 SOL
            usd_equivalent: 10000,   // $100 in cents
            sol_price_at_bid: 15000, // $150 per SOL
            estimated_completion_hours: 12,
            message: "Quick turnaround available".to_string(),
            status: BidStatus::Accepted,
            created_at: 1234567890,
            bump: 255,
        };

        let data = bid.try_to_vec().unwrap();
        let deserialized = Bid::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.sol_price_at_bid, 15000);
        assert_eq!(deserialized.usd_equivalent, 10000);
    }
}
