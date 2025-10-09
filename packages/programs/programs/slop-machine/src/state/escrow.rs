use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowState {
    Funded,        // Client deposited payment
    PendingReview, // Validation in progress
    Approved,      // Validation passed (transition to Completed)
    Rejected,      // Validation failed (transition to Refunded)
    Completed,     // Funds distributed successfully
    Refunded,      // Payment returned to client after slash
}

#[account]
pub struct Escrow {
    pub project_id: u64,
    pub opportunity_id: u64,
    pub client: Pubkey,
    pub developer: Pubkey,
    pub qa_reviewer: Pubkey,
    pub validator: Pubkey,
    pub platform_wallet: Pubkey,
    pub amount: u64,
    pub developer_split_bps: u16,
    pub qa_split_bps: u16,
    pub platform_split_bps: u16,
    pub minimum_platform_fee: u64,
    pub state: EscrowState,
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

impl Escrow {
    // 8 (discriminator) + 216 (data) = 224 bytes total
    pub const LEN: usize = 8 + 8         // project_id + opportunity_id
                         + 32 * 5        // client, developer, qa_reviewer, validator, platform_wallet
                         + 8             // amount
                         + 2 * 3         // developer_split_bps, qa_split_bps, platform_split_bps
                         + 8             // minimum_platform_fee
                         + 1             // state (enum)
                         + 8 * 2         // created_at, updated_at
                         + 1; // bump

    /// Calculate three-way payment split
    /// Returns (developer_amount, qa_amount, platform_amount)
    pub fn calculate_payments(&self) -> (u64, u64, u64) {
        // Platform fee is 10% OR minimum ($0.25 SOL), whichever is HIGHER
        let platform_10pct = (self.amount * self.platform_split_bps as u64) / 10000;
        let platform_amount = u64::max(platform_10pct, self.minimum_platform_fee);

        // QA gets 5% of total story payment
        let qa_amount = (self.amount * self.qa_split_bps as u64) / 10000;

        // Developer gets remainder (ensures total = escrow.amount exactly)
        let developer_amount = self.amount - platform_amount - qa_amount;

        (developer_amount, qa_amount, platform_amount)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_payments_normal_story() {
        // $100 story = 1.0 SOL @ $100/SOL stub
        let escrow = Escrow {
            project_id: 1,
            opportunity_id: 1,
            client: Pubkey::default(),
            developer: Pubkey::default(),
            qa_reviewer: Pubkey::default(),
            validator: Pubkey::default(),
            platform_wallet: Pubkey::default(),
            amount: 1_000_000_000,           // 1.0 SOL
            developer_split_bps: 8500,       // 85%
            qa_split_bps: 500,               // 5%
            platform_split_bps: 1000,        // 10%
            minimum_platform_fee: 2_500_000, // $0.25 @ $100/SOL = 0.0025 SOL
            state: EscrowState::Funded,
            created_at: 0,
            updated_at: 0,
            bump: 0,
        };

        let (dev, qa, platform) = escrow.calculate_payments();

        // Expected: 85% dev, 5% QA, 10% platform
        assert_eq!(dev, 850_000_000); // 0.85 SOL
        assert_eq!(qa, 50_000_000); // 0.05 SOL
        assert_eq!(platform, 100_000_000); // 0.1 SOL

        // Verify total equals escrow amount exactly
        assert_eq!(dev + qa + platform, escrow.amount);
    }

    #[test]
    fn test_calculate_payments_minimum_fee() {
        // $2.00 story = 0.02 SOL @ $100/SOL
        let escrow = Escrow {
            project_id: 1,
            opportunity_id: 1,
            client: Pubkey::default(),
            developer: Pubkey::default(),
            qa_reviewer: Pubkey::default(),
            validator: Pubkey::default(),
            platform_wallet: Pubkey::default(),
            amount: 20_000_000, // 0.02 SOL @ $100/SOL = $2
            developer_split_bps: 8500,
            qa_split_bps: 500,
            platform_split_bps: 1000,
            minimum_platform_fee: 2_500_000, // $0.25 @ $100/SOL = 0.0025 SOL
            state: EscrowState::Funded,
            created_at: 0,
            updated_at: 0,
            bump: 0,
        };

        let (dev, qa, platform) = escrow.calculate_payments();

        // Platform gets minimum fee (0.0025 SOL = $0.25), not 10% (0.002 SOL = $0.20)
        assert_eq!(platform, 2_500_000); // 0.0025 SOL ($0.25 minimum)
        assert_eq!(qa, 1_000_000); // 0.001 SOL (5% = $0.10)
        assert_eq!(dev, 16_500_000); // 0.0165 SOL (82.5% = $1.65, adjusted)

        // Verify total equals escrow amount exactly
        assert_eq!(dev + qa + platform, escrow.amount);
    }
}
