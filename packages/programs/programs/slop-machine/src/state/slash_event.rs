use anchor_lang::prelude::*;

/// SlashEvent account structure
///
/// Records stake slashing events when AI nodes fail to deliver quality work.
///
/// **Slashing Trigger:** 3+ consecutive validation failures
/// - Work account tracks `validation_status: ValidationStatus::SomeFailed`
/// - Escrow program (Story 1.5) creates this account when executing slash
///
/// **Slashing Distribution (50/50 split):**
/// - 50% transferred to project escrow PDA
/// - 50% transferred to burn address (11111111111111111111111111111112)
/// - Burn address is Solana's incinerator program (funds permanently removed)
///
/// **PDA Derivation:** seeds = ["slash_event", stake.key(), slashed_at.to_le_bytes()]
///
/// **Account Size:** 8 (discriminator) + 333 bytes = 341 bytes total
#[account]
pub struct SlashEvent {
    /// Reference to slashed Stake account (32 bytes)
    pub stake: Pubkey,
    /// AI node that was slashed (32 bytes)
    pub node: Pubkey,
    /// Opportunity/story where failure occurred (32 bytes)
    pub opportunity: Pubkey,
    /// Total amount slashed (8 bytes)
    pub slashed_amount: u64,
    /// Amount sent to project escrow (50%) (8 bytes)
    pub to_project: u64,
    /// Amount burned (50%) (8 bytes)
    pub burned: u64,
    /// Explanation of why node was slashed (4 + max 200 = 204 bytes)
    /// Max length: 200 characters
    pub reason: String,
    /// Timestamp when slash occurred (8 bytes)
    pub slashed_at: i64,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

impl SlashEvent {
    /// Account size: 8 (discriminator) + 333 bytes = 341 bytes total
    /// Breakdown: 32*3 (pubkeys) + 8*3 (u64s) + 204 (string: 4 + 200) + 8 (i64) + 1 (u8) = 333
    pub const LEN: usize = 8 + 32 * 3  // stake, node, opportunity
                         + 8 * 3       // slashed_amount, to_project, burned
                         + 4 + 200     // reason string (4 bytes length + 200 max chars)
                         + 8           // slashed_at
                         + 1; // bump

    /// Maximum allowed length for reason string (200 characters)
    pub const MAX_REASON_LENGTH: usize = 200;

    /// Validate reason string length
    ///
    /// # Arguments
    /// * `reason` - The reason string to validate
    ///
    /// # Returns
    /// * `true` if valid length, `false` if too long
    pub fn is_valid_reason(reason: &str) -> bool {
        reason.len() <= Self::MAX_REASON_LENGTH
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_slash_event_creation() {
        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: 1_000_000_000,
            to_project: 500_000_000,
            burned: 500_000_000,
            reason: "Failed validation 3 times".to_string(),
            slashed_at: 1234567890,
            bump: 255,
        };

        // Verify serialization
        let data = slash_event.try_to_vec().unwrap();
        assert!(!data.is_empty());

        // Verify deserialization
        let deserialized = SlashEvent::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.stake, slash_event.stake);
        assert_eq!(deserialized.node, slash_event.node);
        assert_eq!(deserialized.opportunity, slash_event.opportunity);
        assert_eq!(deserialized.slashed_amount, 1_000_000_000);
        assert_eq!(deserialized.to_project, 500_000_000);
        assert_eq!(deserialized.burned, 500_000_000);
        assert_eq!(deserialized.reason, "Failed validation 3 times");
        assert_eq!(deserialized.slashed_at, 1234567890);
        assert_eq!(deserialized.bump, 255);
    }

    #[test]
    fn test_slash_event_size_verification() {
        let reason = "Failed validation 3 times".to_string();
        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: 1_000_000_000,
            to_project: 500_000_000,
            burned: 500_000_000,
            reason: reason.clone(),
            slashed_at: 1234567890,
            bump: 255,
        };

        let data = slash_event.try_to_vec().unwrap();
        // Expected size: 32 (stake) + 32 (node) + 32 (opportunity) + 8 (slashed_amount)
        //                + 8 (to_project) + 8 (burned) + 4 (String length prefix) + reason.len()
        //                + 8 (slashed_at) + 1 (bump)
        let expected_size = 32 + 32 + 32 + 8 + 8 + 8 + 4 + reason.len() + 8 + 1;
        assert_eq!(data.len(), expected_size);
    }

    #[test]
    fn test_slashing_calculation_50_50_split() {
        let stake_amount = 1_000_000_000; // 1 SOL
        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: stake_amount,
            to_project: 500_000_000,
            burned: 500_000_000,
            reason: "Failed validation 3 times".to_string(),
            slashed_at: 1234567890,
            bump: 255,
        };

        // Verify 50/50 split
        assert_eq!(slash_event.to_project, slash_event.slashed_amount / 2);
        assert_eq!(
            slash_event.to_project + slash_event.burned,
            slash_event.slashed_amount
        );
    }

    #[test]
    fn test_slashing_calculation_odd_amount() {
        let stake_amount = 1_000_000_001; // Odd amount
        let to_project = stake_amount / 2; // 500_000_000
        let burned = stake_amount - to_project; // 500_000_001

        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: stake_amount,
            to_project,
            burned,
            reason: "Failed validation 3 times".to_string(),
            slashed_at: 1234567890,
            bump: 255,
        };

        // Verify no loss of lamports
        assert_eq!(
            slash_event.to_project + slash_event.burned,
            slash_event.slashed_amount
        );
    }

    #[test]
    fn test_slashing_calculation_edge_case_1_lamport() {
        let stake_amount = 1;
        let to_project = stake_amount / 2; // 0
        let burned = stake_amount - to_project; // 1

        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: stake_amount,
            to_project,
            burned,
            reason: "Failed validation 3 times".to_string(),
            slashed_at: 1234567890,
            bump: 255,
        };

        assert_eq!(slash_event.to_project, 0);
        assert_eq!(slash_event.burned, 1);
        assert_eq!(slash_event.to_project + slash_event.burned, 1);
    }

    #[test]
    fn test_slashing_calculation_edge_case_2_lamports() {
        let stake_amount = 2;
        let to_project = stake_amount / 2; // 1
        let burned = stake_amount - to_project; // 1

        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: stake_amount,
            to_project,
            burned,
            reason: "Failed validation 3 times".to_string(),
            slashed_at: 1234567890,
            bump: 255,
        };

        assert_eq!(slash_event.to_project, 1);
        assert_eq!(slash_event.burned, 1);
        assert_eq!(slash_event.to_project + slash_event.burned, 2);
    }

    #[test]
    fn test_reason_string_max_length() {
        // Test max length (200 chars)
        let max_reason = "a".repeat(200);
        assert!(SlashEvent::is_valid_reason(&max_reason));

        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: 1_000_000_000,
            to_project: 500_000_000,
            burned: 500_000_000,
            reason: max_reason.clone(),
            slashed_at: 1234567890,
            bump: 255,
        };

        let data = slash_event.try_to_vec().unwrap();
        let deserialized = SlashEvent::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.reason.len(), 200);
        assert_eq!(deserialized.reason, max_reason);
    }

    #[test]
    fn test_reason_string_validation() {
        // Valid lengths
        assert!(SlashEvent::is_valid_reason(""));
        assert!(SlashEvent::is_valid_reason("Failed validation 3 times"));
        assert!(SlashEvent::is_valid_reason(&"a".repeat(200)));

        // Invalid length (201 chars)
        assert!(!SlashEvent::is_valid_reason(&"a".repeat(201)));
        assert!(!SlashEvent::is_valid_reason(&"a".repeat(300)));
    }

    #[test]
    fn test_reason_string_empty() {
        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: 1_000_000_000,
            to_project: 500_000_000,
            burned: 500_000_000,
            reason: "".to_string(),
            slashed_at: 1234567890,
            bump: 255,
        };

        let data = slash_event.try_to_vec().unwrap();
        let deserialized = SlashEvent::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.reason, "");
    }

    #[test]
    fn test_reason_string_typical_examples() {
        let reasons = vec![
            "Failed validation 3 times",
            "Node offline during validation period",
            "Validation errors: syntax, tests, build failures",
            "Repeated timeout failures on automated validation",
        ];

        for reason in reasons {
            assert!(SlashEvent::is_valid_reason(reason));

            let slash_event = SlashEvent {
                stake: Pubkey::new_unique(),
                node: Pubkey::new_unique(),
                opportunity: Pubkey::new_unique(),
                slashed_amount: 1_000_000_000,
                to_project: 500_000_000,
                burned: 500_000_000,
                reason: reason.to_string(),
                slashed_at: 1234567890,
                bump: 255,
            };

            let data = slash_event.try_to_vec().unwrap();
            let deserialized = SlashEvent::try_from_slice(&data).unwrap();
            assert_eq!(deserialized.reason, reason);
        }
    }

    #[test]
    fn test_slash_event_account_size_with_max_reason() {
        // Test account size with maximum reason length
        let max_reason = "a".repeat(200);
        let slash_event = SlashEvent {
            stake: Pubkey::new_unique(),
            node: Pubkey::new_unique(),
            opportunity: Pubkey::new_unique(),
            slashed_amount: 1_000_000_000,
            to_project: 500_000_000,
            burned: 500_000_000,
            reason: max_reason,
            slashed_at: 1234567890,
            bump: 255,
        };

        let data = slash_event.try_to_vec().unwrap();
        // Expected max size: 32 + 32 + 32 + 8 + 8 + 8 + 4 + 200 + 8 + 1 = 333 bytes
        // (Plus 8-byte discriminator at runtime = 341 bytes total)
        assert_eq!(data.len(), 333);
    }
}
