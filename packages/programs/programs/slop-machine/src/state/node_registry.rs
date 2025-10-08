use anchor_lang::prelude::*;

/// NodeRegistry account - AI node registration and infinite tier progression
/// PDA seeds: ["node_registry", node_id.key()]
/// Total size: 8 (discriminator) + 258 bytes = 266 bytes
#[account]
pub struct NodeRegistry {
    /// Node's wallet address (32 bytes)
    pub node_id: Pubkey,
    /// Display name (4+50=54 bytes)
    pub persona_name: String,
    /// Node specialization (1 byte)
    pub node_type: NodeType,
    /// Twitter/X handle (1+4+30=35 bytes)
    pub twitter_handle: Option<String>,
    /// Discord username (1+4+40=45 bytes)
    pub discord_handle: Option<String>,
    /// Telegram username (1+4+30=35 bytes)
    pub telegram_handle: Option<String>,
    /// Social account verified via signature (1 byte)
    pub social_verified: bool,
    /// Calculated tier 0-65535 for infinite progression (2 bytes)
    pub reputation_tier: u16,
    /// Count of successful completions (4 bytes)
    pub projects_completed: u32,
    /// Count of total assignments including slashed (4 bytes)
    pub projects_attempted: u32,
    /// Calculated max story size in USD cents (8 bytes)
    pub max_story_size_usd: u64,
    /// Calculated stake multiplier (100=1.0x, 500=5.0x) (2 bytes)
    pub stake_multiplier_basis_points: u16,
    /// Calculated minimum stake in USD cents (8 bytes)
    pub minimum_absolute_stake_usd: u64,
    /// Aggregate reputation 0-10000 basis points (4 bytes)
    pub reputation_score: u32,
    /// Lifetime earnings in lamports (8 bytes)
    pub total_earnings_sol: u64,
    /// Deprecated - use projects_completed instead (4 bytes)
    pub completed_jobs: u32,
    /// Count of slashed stakes (4 bytes)
    pub failed_jobs: u32,
    /// Average delivery time in hours (4 bytes)
    pub average_completion_time_hours: u32,
    /// Earned badges, max 10 (4+10=14 bytes)
    pub badges: Vec<Badge>,
    /// Registration timestamp (8 bytes)
    pub created_at: i64,
    /// Last activity timestamp (8 bytes)
    pub last_active: i64,
    /// PDA bump seed (1 byte)
    pub bump: u8,
}

impl NodeRegistry {
    /// Calculate tier based on completed projects and success rate
    /// Formula: sqrt(completed) * success_rate
    /// Returns tier 0-65535 (infinite progression)
    /// Full implementation in Story 1.7
    pub fn calculate_tier(&self) -> u16 {
        // Stub implementation
        0
    }

    /// Calculate stake multiplier based on tier
    /// Formula: max(1.0, 5.0 × exp(-0.15 × tier))
    /// Returns basis points (100 = 1.0x, 500 = 5.0x)
    /// Full implementation in Story 1.7
    pub fn calculate_stake_multiplier(&self) -> u16 {
        // Stub: tier 0 gets 5.0x multiplier
        500
    }

    /// Calculate maximum story size based on tier
    /// Formula: 5.0 × (1.4 ^ tier)
    /// Returns USD cents
    /// Full implementation in Story 1.7
    pub fn calculate_max_story_size(&self) -> u64 {
        // Stub: tier 0 gets $5
        500
    }

    /// Calculate minimum absolute stake based on tier
    /// Formula: 10.0 + (5.0 × log10(tier + 1))
    /// Returns USD cents
    /// Full implementation in Story 1.7
    pub fn calculate_minimum_stake(&self) -> u64 {
        // Stub: tier 0 gets $10
        1000
    }

    /// Update all tier-based metrics after story completion/slash
    /// Full implementation in Story 1.7
    pub fn update_tier_metrics(&mut self) {
        // Stub implementation - will update all calculated fields
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum NodeType {
    Architect,
    Developer,
    Infrastructure,
    MultiRole,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum Badge {
    TwitterVerified,
    TopRated,
    FirstPassMaster,
    SpeedDemon,
    QualityGuarantee,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_node_registry_serialization() {
        let registry = NodeRegistry {
            node_id: Pubkey::new_unique(),
            persona_name: "TestNode".to_string(),
            node_type: NodeType::Developer,
            twitter_handle: Some("@testnode".to_string()),
            discord_handle: Some("testnode#1234".to_string()),
            telegram_handle: None,
            social_verified: false,
            reputation_tier: 0,
            projects_completed: 0,
            projects_attempted: 0,
            max_story_size_usd: 500,            // $5
            stake_multiplier_basis_points: 500, // 5.0x
            minimum_absolute_stake_usd: 1000,   // $10
            reputation_score: 0,
            total_earnings_sol: 0,
            completed_jobs: 0,
            failed_jobs: 0,
            average_completion_time_hours: 0,
            badges: vec![],
            created_at: 1234567890,
            last_active: 1234567890,
            bump: 255,
        };

        let data = registry.try_to_vec().unwrap();
        assert!(!data.is_empty(), "Serialization should produce data");

        let deserialized = NodeRegistry::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.node_id, registry.node_id);
        assert_eq!(deserialized.persona_name, registry.persona_name);
        assert_eq!(deserialized.node_type, registry.node_type);
    }

    #[test]
    fn test_node_type_serialization() {
        let node_types = vec![
            NodeType::Architect,
            NodeType::Developer,
            NodeType::Infrastructure,
            NodeType::MultiRole,
        ];

        for node_type in node_types {
            let data = node_type.clone().try_to_vec().unwrap();
            let deserialized = NodeType::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, node_type);
        }
    }

    #[test]
    fn test_badge_serialization() {
        let badges = vec![
            Badge::TwitterVerified,
            Badge::TopRated,
            Badge::FirstPassMaster,
            Badge::SpeedDemon,
            Badge::QualityGuarantee,
        ];

        for badge in badges {
            let data = badge.clone().try_to_vec().unwrap();
            let deserialized = Badge::try_from_slice(&data).unwrap();
            assert_eq!(deserialized, badge);
        }
    }

    #[test]
    fn test_node_registry_with_badges() {
        let registry = NodeRegistry {
            node_id: Pubkey::new_unique(),
            persona_name: "EliteNode".to_string(),
            node_type: NodeType::MultiRole,
            twitter_handle: Some("@elitenode".to_string()),
            discord_handle: Some("elitenode#9999".to_string()),
            telegram_handle: Some("@elitenode".to_string()),
            social_verified: true,
            reputation_tier: 10,
            projects_completed: 100,
            projects_attempted: 105,
            max_story_size_usd: 14400,          // $144
            stake_multiplier_basis_points: 112, // 1.12x
            minimum_absolute_stake_usd: 1519,   // $15.19
            reputation_score: 9500,
            total_earnings_sol: 50_000_000_000, // 50 SOL
            completed_jobs: 100,
            failed_jobs: 5,
            average_completion_time_hours: 18,
            badges: vec![
                Badge::TwitterVerified,
                Badge::TopRated,
                Badge::FirstPassMaster,
            ],
            created_at: 1234567890,
            last_active: 1234567890 + 86400 * 30,
            bump: 255,
        };

        let data = registry.try_to_vec().unwrap();
        let deserialized = NodeRegistry::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.badges.len(), 3);
        assert_eq!(deserialized.reputation_tier, 10);
        assert_eq!(deserialized.projects_completed, 100);
    }

    #[test]
    fn test_calculate_tier_stub() {
        let registry = NodeRegistry {
            node_id: Pubkey::new_unique(),
            persona_name: "TestNode".to_string(),
            node_type: NodeType::Developer,
            twitter_handle: None,
            discord_handle: None,
            telegram_handle: None,
            social_verified: false,
            reputation_tier: 0,
            projects_completed: 0,
            projects_attempted: 0,
            max_story_size_usd: 500,
            stake_multiplier_basis_points: 500,
            minimum_absolute_stake_usd: 1000,
            reputation_score: 0,
            total_earnings_sol: 0,
            completed_jobs: 0,
            failed_jobs: 0,
            average_completion_time_hours: 0,
            badges: vec![],
            created_at: 1234567890,
            last_active: 1234567890,
            bump: 255,
        };

        // Stub methods should return default values
        assert_eq!(registry.calculate_tier(), 0);
        assert_eq!(registry.calculate_stake_multiplier(), 500); // 5.0x
        assert_eq!(registry.calculate_max_story_size(), 500); // $5
        assert_eq!(registry.calculate_minimum_stake(), 1000); // $10
    }

    #[test]
    fn test_node_registry_tier_progression() {
        // Test tier 0 node
        let tier0 = NodeRegistry {
            node_id: Pubkey::new_unique(),
            persona_name: "NewNode".to_string(),
            node_type: NodeType::Developer,
            twitter_handle: None,
            discord_handle: None,
            telegram_handle: None,
            social_verified: false,
            reputation_tier: 0,
            projects_completed: 0,
            projects_attempted: 0,
            max_story_size_usd: 500,            // $5
            stake_multiplier_basis_points: 500, // 5.0x
            minimum_absolute_stake_usd: 1000,   // $10
            reputation_score: 0,
            total_earnings_sol: 0,
            completed_jobs: 0,
            failed_jobs: 0,
            average_completion_time_hours: 0,
            badges: vec![],
            created_at: 1234567890,
            last_active: 1234567890,
            bump: 255,
        };

        let data = tier0.try_to_vec().unwrap();
        let deserialized = NodeRegistry::try_from_slice(&data).unwrap();
        assert_eq!(deserialized.reputation_tier, 0);
        assert_eq!(deserialized.max_story_size_usd, 500);
    }
}
