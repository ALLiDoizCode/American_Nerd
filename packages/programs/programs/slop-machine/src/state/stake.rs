use anchor_lang::prelude::*;

/// Stake account structure
///
/// Manages stake collateral locked by AI nodes when bidding on opportunities.
///
/// **Slashing Trigger:** 3+ consecutive validation failures
/// - Tracked in Work account via `validation_status: ValidationStatus::SomeFailed`
/// - After 3rd failure, escrow program (Story 1.5) executes slash
///
/// **Slashing Distribution (50/50 split):**
/// - 50% to project escrow PDA
/// - 50% to burn address (11111111111111111111111111111112)
///
/// **Stake Return Flow:**
/// - Validation pass → stake returned to node wallet + payment released
/// - Status changes: Locked → Returned
/// - NodeRegistry updated: projects_completed++, tier recalculated
///
/// **PDA Derivation:** seeds = ["stake", opportunity.key(), node.key()]
///
/// **Account Size:** 8 (discriminator) + 103 bytes = 111 bytes total
#[account]
pub struct Stake {
    /// AI node staking funds (32 bytes)
    pub node: Pubkey,
    /// Which opportunity/story being bid on (32 bytes)
    pub opportunity: Pubkey,
    /// Collateral locked (8 bytes)
    pub stake_amount: u64,
    /// Requested payment for work (8 bytes)
    pub bid_amount: u64,
    /// Tier-based multiplier at lock time (4 bytes)
    /// Formula: max(1.0, 5.0 * exp(-0.15 * tier))
    /// Examples: Tier 0 = 5.0x, Tier 5 = 2.36x, Tier 10 = 1.12x, Tier 20+ = 1.0x floor
    pub stake_multiplier: f32,
    /// Current status of stake (1 byte)
    pub status: StakeStatus,
    /// Timestamp when stake was locked (8 bytes)
    pub locked_at: i64,
    /// Timestamp when stake was released or slashed (9 bytes: 1 discriminator + 8 data)
    pub released_at: Option<i64>,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

/// Stake status enumeration
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum StakeStatus {
    /// Stake is currently locked as collateral
    Locked,
    /// Stake has been returned to node wallet
    Returned,
    /// Stake has been slashed (50% to project, 50% burned)
    Slashed,
}

impl Stake {
    /// Calculate slashing distribution (50/50 split)
    ///
    /// **Implementation Note:** Full implementation deferred to Story 1.5 (Custom Escrow)
    ///
    /// # Arguments
    /// * `stake_amount` - Total stake amount to slash (in lamports)
    ///
    /// # Returns
    /// * Tuple of (to_project, burned) amounts in lamports
    ///
    /// # Example
    /// ```
    /// let (to_project, burned) = Stake::calculate_slash_distribution(1_000_000_000);
    /// assert_eq!(to_project, 500_000_000); // 50%
    /// assert_eq!(burned, 500_000_000);     // 50%
    /// ```
    pub fn calculate_slash_distribution(stake_amount: u64) -> (u64, u64) {
        let to_project = stake_amount / 2;
        let burned = stake_amount - to_project; // Handle odd amounts
        (to_project, burned)
    }

    /// Check if node should be slashed based on failure count
    ///
    /// **Implementation Note:** Full implementation deferred to Story 1.5 (Custom Escrow)
    ///
    /// # Arguments
    /// * `failure_count` - Number of consecutive validation failures
    ///
    /// # Returns
    /// * `true` if failure_count >= 3, `false` otherwise
    ///
    /// # Example
    /// ```
    /// assert_eq!(Stake::should_slash(2), false);
    /// assert_eq!(Stake::should_slash(3), true);
    /// assert_eq!(Stake::should_slash(5), true);
    /// ```
    pub fn should_slash(failure_count: u8) -> bool {
        failure_count >= 3
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stake_creation() {
        let stake = Stake {
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            stake_amount: 1_000_000_000, // 1 SOL
            bid_amount: 200_000_000,     // 0.2 SOL
            stake_multiplier: 5.0,       // Tier 0 node
            status: StakeStatus::Locked,
            locked_at: 1234567890,
            released_at: None,
            bump: 255,
        };

        // Verify serialization
        let data = stake.try_to_vec().unwrap();
        assert!(!data.is_empty());

        // Verify deserialization
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.node, stake.node);
        assert_eq!(deserialized.opportunity, stake.opportunity);
        assert_eq!(deserialized.stake_amount, 1_000_000_000);
        assert_eq!(deserialized.bid_amount, 200_000_000);
        assert_eq!(deserialized.stake_multiplier, 5.0);
        assert_eq!(deserialized.status, StakeStatus::Locked);
        assert_eq!(deserialized.locked_at, 1234567890);
        assert_eq!(deserialized.released_at, None);
        assert_eq!(deserialized.bump, 255);
    }

    #[test]
    fn test_stake_size_verification() {
        let stake = Stake {
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            stake_amount: 1_000_000_000,
            bid_amount: 200_000_000,
            stake_multiplier: 2.36,
            status: StakeStatus::Locked,
            locked_at: 1234567890,
            released_at: None,
            bump: 255,
        };

        let data = stake.try_to_vec().unwrap();
        // Expected size: 32 (node) + 32 (opportunity) + 8 (stake_amount) + 8 (bid_amount)
        //                + 4 (stake_multiplier f32) + 1 (status) + 8 (locked_at)
        //                + 1 (Option discriminator) + 0 (None) + 1 (bump) = 95 bytes
        // Note: With Anchor's #[account] macro, discriminator adds 8 bytes at runtime
        assert_eq!(data.len(), 95);
    }

    #[test]
    fn test_stake_status_serialization() {
        // Test all StakeStatus variants
        let locked = StakeStatus::Locked;
        let returned = StakeStatus::Returned;
        let slashed = StakeStatus::Slashed;

        let locked_data = locked.try_to_vec().unwrap();
        let returned_data = returned.try_to_vec().unwrap();
        let slashed_data = slashed.try_to_vec().unwrap();

        assert_eq!(
            StakeStatus::try_from_slice(&locked_data).unwrap(),
            StakeStatus::Locked
        );
        assert_eq!(
            StakeStatus::try_from_slice(&returned_data).unwrap(),
            StakeStatus::Returned
        );
        assert_eq!(
            StakeStatus::try_from_slice(&slashed_data).unwrap(),
            StakeStatus::Slashed
        );
    }

    #[test]
    fn test_stake_multiplier_f32_serialization() {
        // Test various tier multipliers
        let tier_0 = Stake {
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            stake_amount: 1_000_000_000,
            bid_amount: 200_000_000,
            stake_multiplier: 5.0,
            status: StakeStatus::Locked,
            locked_at: 1234567890,
            released_at: None,
            bump: 255,
        };

        let tier_5 = Stake {
            stake_multiplier: 2.36,
            ..tier_0
        };

        let tier_10 = Stake {
            stake_multiplier: 1.12,
            ..tier_0
        };

        let tier_20 = Stake {
            stake_multiplier: 1.0,
            ..tier_0
        };

        // Verify f32 serialization and deserialization
        let data = tier_0.try_to_vec().unwrap();
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.stake_multiplier, 5.0);

        let data = tier_5.try_to_vec().unwrap();
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.stake_multiplier, 2.36);

        let data = tier_10.try_to_vec().unwrap();
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.stake_multiplier, 1.12);

        let data = tier_20.try_to_vec().unwrap();
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.stake_multiplier, 1.0);
    }

    #[test]
    fn test_released_at_option_serialization() {
        // Test None case
        let stake_locked = Stake {
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            stake_amount: 1_000_000_000,
            bid_amount: 200_000_000,
            stake_multiplier: 5.0,
            status: StakeStatus::Locked,
            locked_at: 1234567890,
            released_at: None,
            bump: 255,
        };

        let data = stake_locked.try_to_vec().unwrap();
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.released_at, None);

        // Test Some case
        let stake_released = Stake {
            status: StakeStatus::Returned,
            released_at: Some(1234577890),
            ..stake_locked
        };

        let data = stake_released.try_to_vec().unwrap();
        let deserialized = Stake::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.released_at, Some(1234577890));
    }

    #[test]
    fn test_calculate_slash_distribution_even_amount() {
        let stake_amount = 1_000_000_000; // 1 SOL
        let (to_project, burned) = Stake::calculate_slash_distribution(stake_amount);

        assert_eq!(to_project, 500_000_000); // 0.5 SOL
        assert_eq!(burned, 500_000_000); // 0.5 SOL
        assert_eq!(to_project + burned, stake_amount); // No loss
    }

    #[test]
    fn test_calculate_slash_distribution_odd_amount() {
        let stake_amount = 1_000_000_001; // Odd number
        let (to_project, burned) = Stake::calculate_slash_distribution(stake_amount);

        assert_eq!(to_project, 500_000_000);
        assert_eq!(burned, 500_000_001); // Extra lamport goes to burned
        assert_eq!(to_project + burned, stake_amount);
    }

    #[test]
    fn test_calculate_slash_distribution_edge_case_1_lamport() {
        let stake_amount = 1; // Edge case
        let (to_project, burned) = Stake::calculate_slash_distribution(stake_amount);

        assert_eq!(to_project, 0); // 1 / 2 = 0
        assert_eq!(burned, 1); // 1 - 0 = 1
        assert_eq!(to_project + burned, stake_amount);
    }

    #[test]
    fn test_calculate_slash_distribution_edge_case_2_lamports() {
        let stake_amount = 2;
        let (to_project, burned) = Stake::calculate_slash_distribution(stake_amount);

        assert_eq!(to_project, 1);
        assert_eq!(burned, 1);
        assert_eq!(to_project + burned, stake_amount);
    }

    #[test]
    fn test_should_slash_below_threshold() {
        assert!(!Stake::should_slash(0));
        assert!(!Stake::should_slash(1));
        assert!(!Stake::should_slash(2));
    }

    #[test]
    fn test_should_slash_at_threshold() {
        assert!(Stake::should_slash(3));
    }

    #[test]
    fn test_should_slash_above_threshold() {
        assert!(Stake::should_slash(4));
        assert!(Stake::should_slash(5));
        assert!(Stake::should_slash(10));
        assert!(Stake::should_slash(255));
    }
}
