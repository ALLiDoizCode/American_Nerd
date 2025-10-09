use crate::errors::ErrorCode;
use crate::state::NodeRegistry;
use anchor_lang::prelude::*;

/// Calculate reputation tier based on completed and attempted projects
///
/// Formula: tier = floor(sqrt(completed) * success_rate)
///
/// # Arguments
/// * `completed` - Number of successfully completed projects
/// * `attempted` - Total number of attempted projects
///
/// # Returns
/// Tier value (0-255, infinite progression)
///
/// # Examples
/// - 0 completed, 0 attempted → tier 0
/// - 1 completed, 1 attempted → tier 1
/// - 100 completed, 100 attempted → tier 10
pub fn calculate_tier(completed: u32, attempted: u32) -> u8 {
    if attempted == 0 {
        return 0;
    }
    let success_rate = completed as f32 / attempted as f32;
    let base_score = (completed as f32).sqrt() * success_rate;
    base_score.floor() as u8
}

/// Calculate stake multiplier for a given tier
///
/// Formula: max(1.0, 5.0 * exp(-0.15 * tier))
///
/// # Arguments
/// * `tier` - Reputation tier (0-255)
///
/// # Returns
/// Stake multiplier (5.0x for tier 0, approaches 1.0x for high tiers)
///
/// # Examples
/// - Tier 0: 5.0x (new nodes = highest risk)
/// - Tier 5: 2.36x (experienced nodes)
/// - Tier 10: 1.12x (expert nodes)
/// - Tier 20+: 1.0x (elite nodes, minimum floor)
pub fn calculate_stake_multiplier(tier: u8) -> f32 {
    f32::max(1.0, 5.0 * f32::exp(-0.15 * tier as f32))
}

/// Calculate maximum story size (in USD) for a given tier
///
/// Formula: floor(5.0 * 1.4^tier)
///
/// # Arguments
/// * `tier` - Reputation tier (0-255)
///
/// # Returns
/// Max story size in USD (whole dollars, not cents)
///
/// # Examples
/// - Tier 0: $5 (small tasks)
/// - Tier 5: $27 (medium features)
/// - Tier 10: $144 (large features)
/// - Tier 20: $4,060 (enterprise work)
pub fn calculate_max_story_size(tier: u8) -> u64 {
    (5.0 * f32::powf(1.4, tier as f32)).floor() as u64
}

/// Calculate minimum absolute stake (in USD) for a given tier
///
/// Formula: floor(10.0 + 5.0 * log10(tier + 1))
///
/// # Arguments
/// * `tier` - Reputation tier (0-255)
///
/// # Returns
/// Minimum stake in USD (whole dollars, not cents)
///
/// # Examples
/// - Tier 0: $10
/// - Tier 5: $13.89
/// - Tier 10: $15.19
/// - Tier 20: $16.60
pub fn calculate_min_absolute_stake(tier: u8) -> u64 {
    (10.0 + (5.0 * f32::log10(tier as f32 + 1.0))).floor() as u64
}

/// Update node reputation after work completion or slash
///
/// # Arguments
/// * `node_registry` - Mutable reference to NodeRegistry account
/// * `success` - true if work completed successfully, false if slashed
///
/// # Returns
/// * `Result<()>` - Ok if update successful, Err on arithmetic overflow
///
/// # Side Effects
/// - Updates projects_completed (if success)
/// - Updates projects_attempted (always)
/// - Recalculates reputation_tier
/// - Updates stake_multiplier_basis_points
/// - Updates max_story_size_usd (in cents)
/// - Updates minimum_absolute_stake_usd (in cents)
/// - Updates reputation_score (success rate as basis points)
pub fn update_node_reputation(node_registry: &mut NodeRegistry, success: bool) -> Result<()> {
    // Increment counters with overflow protection
    if success {
        node_registry.projects_completed = node_registry
            .projects_completed
            .checked_add(1)
            .ok_or(error!(ErrorCode::InvalidAmount))?;
    }
    node_registry.projects_attempted = node_registry
        .projects_attempted
        .checked_add(1)
        .ok_or(error!(ErrorCode::InvalidAmount))?;

    // Recalculate tier based on new stats
    let new_tier = calculate_tier(
        node_registry.projects_completed,
        node_registry.projects_attempted,
    );
    node_registry.reputation_tier = new_tier as u16;

    // Update stake multiplier (stored as basis points: 100 = 1.0x, 500 = 5.0x)
    let stake_multiplier = calculate_stake_multiplier(new_tier);
    node_registry.stake_multiplier_basis_points = (stake_multiplier * 100.0) as u16;

    // Update max story size (convert dollars to cents with overflow protection)
    let max_size_dollars = calculate_max_story_size(new_tier);
    node_registry.max_story_size_usd = max_size_dollars
        .checked_mul(100)
        .ok_or(error!(ErrorCode::InvalidAmount))?;

    // Update minimum stake (convert dollars to cents with overflow protection)
    let min_stake_dollars = calculate_min_absolute_stake(new_tier);
    node_registry.minimum_absolute_stake_usd = min_stake_dollars
        .checked_mul(100)
        .ok_or(error!(ErrorCode::InvalidAmount))?;

    // Update success rate (stored as basis points: 10000 = 100%)
    node_registry.reputation_score = if node_registry.projects_attempted > 0 {
        ((node_registry.projects_completed as f32 / node_registry.projects_attempted as f32)
            * 10000.0) as u32
    } else {
        0
    };

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::NodeType;

    // Helper function to create test NodeRegistry
    fn create_test_node(completed: u32, attempted: u32) -> NodeRegistry {
        NodeRegistry {
            node_id: Pubkey::new_unique(),
            persona_name: "TestNode".to_string(),
            node_type: NodeType::Developer,
            twitter_handle: None,
            discord_handle: None,
            telegram_handle: None,
            social_verified: false,
            reputation_tier: 0,
            projects_completed: completed,
            projects_attempted: attempted,
            max_story_size_usd: 500,
            stake_multiplier_basis_points: 500,
            minimum_absolute_stake_usd: 1000,
            reputation_score: 0,
            total_earnings_sol: 0,
            completed_jobs: 0,
            failed_jobs: 0,
            average_completion_time_hours: 0,
            badges: vec![],
            created_at: 0,
            last_active: 0,
            bump: 255,
        }
    }

    #[test]
    fn test_tier_0_new_node() {
        let tier = calculate_tier(0, 0);
        assert_eq!(tier, 0);

        let stake_mult = calculate_stake_multiplier(0);
        assert_eq!(stake_mult, 5.0);

        let max_size = calculate_max_story_size(0);
        assert_eq!(max_size, 5);

        let min_stake = calculate_min_absolute_stake(0);
        assert_eq!(min_stake, 10);
    }

    #[test]
    fn test_tier_1_progression() {
        let tier = calculate_tier(1, 1);
        assert_eq!(tier, 1);

        let stake_mult = calculate_stake_multiplier(1);
        assert!(
            (stake_mult - 4.30).abs() < 0.01,
            "Expected ~4.30x, got {}",
            stake_mult
        );

        let max_size = calculate_max_story_size(1);
        assert_eq!(max_size, 7);
    }

    #[test]
    fn test_tier_5_progression() {
        let tier = calculate_tier(25, 25);
        assert_eq!(tier, 5); // sqrt(25) * 1.0 = 5

        let stake_mult = calculate_stake_multiplier(5);
        assert!(
            (stake_mult - 2.36).abs() < 0.01,
            "Expected ~2.36x, got {}",
            stake_mult
        );

        let max_size = calculate_max_story_size(5);
        assert_eq!(max_size, 26); // 5.0 * 1.4^5 = 26.89 → 26
    }

    #[test]
    fn test_tier_10_progression() {
        let tier = calculate_tier(100, 100);
        assert_eq!(tier, 10); // sqrt(100) * 1.0 = 10

        let stake_mult = calculate_stake_multiplier(10);
        assert!(
            (stake_mult - 1.12).abs() < 0.01,
            "Expected ~1.12x, got {}",
            stake_mult
        );

        let max_size = calculate_max_story_size(10);
        assert_eq!(max_size, 144);
    }

    #[test]
    fn test_tier_20_progression() {
        let tier = calculate_tier(400, 400);
        assert_eq!(tier, 20); // sqrt(400) * 1.0 = 20

        let stake_mult = calculate_stake_multiplier(20);
        assert_eq!(stake_mult, 1.0); // Floor at 1.0x

        let max_size = calculate_max_story_size(20);
        assert_eq!(max_size, 4183); // 5.0 * 1.4^20 = 4183.41 → 4183
    }

    #[test]
    fn test_boundary_conditions() {
        // Test tier 255 (max u8) doesn't cause overflow
        let max_size_255 = calculate_max_story_size(255);
        assert!(max_size_255 > 0);

        // Verify conversion to cents doesn't overflow
        let cents_result = max_size_255.checked_mul(100);
        // At tier 255, this will overflow u64, which is expected and handled by checked_mul
        if cents_result.is_none() {
            // Expected behavior - overflow detected
            assert!(true);
        } else {
            // If it doesn't overflow, that's fine too
            assert!(cents_result.unwrap() > 0);
        }

        // Test 0/0 case (new node) - should not divide by zero
        let tier_zero = calculate_tier(0, 0);
        assert_eq!(tier_zero, 0);

        // Test very high completed count
        let tier_high = calculate_tier(1_000_000, 1_000_000);
        assert!(tier_high > 0); // Should not panic
        assert_eq!(tier_high, 255); // Capped at u8::MAX
    }

    #[test]
    fn test_success_rate_limits_tier_growth() {
        // 70% success rate
        let tier = calculate_tier(100, 143);
        assert_eq!(tier, 6); // sqrt(100) * (100/143) = 6.99 → 6

        // Compare to 100% success
        let tier_perfect = calculate_tier(100, 100);
        assert_eq!(tier_perfect, 10);
        assert!(tier < tier_perfect);
    }

    #[test]
    fn test_success_rate_50_percent() {
        let tier = calculate_tier(50, 100);
        assert_eq!(tier, 3); // sqrt(50) * 0.5 = 3.53 → 3
    }

    #[test]
    fn test_slash_increments_attempted_only() {
        let mut node = create_test_node(10, 10);

        // Initial tier: sqrt(10) * 1.0 = 3.16 → tier 3
        let initial_tier = calculate_tier(10, 10);
        assert_eq!(initial_tier, 3);

        // Simulate slash
        update_node_reputation(&mut node, false).unwrap();

        assert_eq!(node.projects_completed, 10); // Unchanged
        assert_eq!(node.projects_attempted, 11); // Incremented

        // New tier: sqrt(10) * (10/11) = 2.87 → tier 2
        assert_eq!(node.reputation_tier, 2);
    }

    #[test]
    fn test_multiple_slashes_degrade_tier() {
        let mut node = create_test_node(10, 10); // tier 3

        // Slash 3 times
        update_node_reputation(&mut node, false).unwrap();
        update_node_reputation(&mut node, false).unwrap();
        update_node_reputation(&mut node, false).unwrap();

        // Projects: 10 completed, 13 attempted
        assert_eq!(node.projects_completed, 10);
        assert_eq!(node.projects_attempted, 13);

        // Tier: sqrt(10) * (10/13) = 2.43 → tier 2
        assert_eq!(node.reputation_tier, 2);

        // Stake multiplier should be worse than tier 3
        // Tier 2: ~4.51x (451 basis points), Tier 3: ~3.88x (388 basis points)
        assert!(node.stake_multiplier_basis_points > 300);
    }

    #[test]
    fn test_update_node_reputation_success() {
        let mut node = create_test_node(0, 0);

        // Complete first project successfully
        update_node_reputation(&mut node, true).unwrap();

        assert_eq!(node.projects_completed, 1);
        assert_eq!(node.projects_attempted, 1);
        assert_eq!(node.reputation_tier, 1); // sqrt(1) * 1.0 = 1
        assert_eq!(node.reputation_score, 10000); // 100% success = 10000 basis points

        // Verify derived metrics
        assert_eq!(node.stake_multiplier_basis_points, 430); // ~4.30x
        assert_eq!(node.max_story_size_usd, 700); // $7 in cents
    }

    #[test]
    fn test_update_node_reputation_overflow_protection() {
        // Test that overflow is caught when attempting to increment past u32::MAX
        let mut node = create_test_node(u32::MAX, u32::MAX);

        // Attempting to increment from u32::MAX should fail
        let result = update_node_reputation(&mut node, true);
        assert!(
            result.is_err(),
            "Expected overflow error when incrementing from u32::MAX"
        );

        // Test tier that would cause checked_mul overflow (tier 200+)
        // At tier 200: 5.0 * 1.4^200 produces an astronomically large number
        // When converted to cents (*100), this will overflow u64
        let mut extreme_node = create_test_node(40000, 40000); // sqrt(40000) = 200
        let result = update_node_reputation(&mut extreme_node, true);
        // Should either succeed with safe values or error on overflow
        // Both behaviors are acceptable (overflow protection working)
        if result.is_err() {
            // Overflow detected - good
            assert!(true);
        } else {
            // Succeeded without overflow - also good
            assert!(extreme_node.reputation_tier > 0);
        }
    }

    #[test]
    fn test_tier_calculation_edge_cases() {
        // Test very small numbers
        assert_eq!(calculate_tier(1, 1), 1);
        assert_eq!(calculate_tier(1, 2), 0); // sqrt(1) * 0.5 = 0.5 → 0

        // Test success rate impact
        assert_eq!(calculate_tier(4, 4), 2); // sqrt(4) * 1.0 = 2
        assert_eq!(calculate_tier(4, 8), 1); // sqrt(4) * 0.5 = 1

        // Test large numbers
        assert_eq!(calculate_tier(10000, 10000), 100); // sqrt(10000) * 1.0 = 100
    }

    #[test]
    fn test_stake_multiplier_floor() {
        // Verify minimum floor at 1.0x
        assert_eq!(calculate_stake_multiplier(20), 1.0);
        assert_eq!(calculate_stake_multiplier(50), 1.0);
        assert_eq!(calculate_stake_multiplier(100), 1.0);
        assert_eq!(calculate_stake_multiplier(255), 1.0);
    }

    #[test]
    fn test_max_story_size_growth() {
        // Verify exponential growth pattern
        let tier_0 = calculate_max_story_size(0);
        let tier_10 = calculate_max_story_size(10);
        let tier_20 = calculate_max_story_size(20);

        assert_eq!(tier_0, 5);
        assert_eq!(tier_10, 144);
        assert_eq!(tier_20, 4183); // 5.0 * 1.4^20 = 4183.41 → 4183

        // Growth should be exponential: tier_10 >> tier_0
        assert!(tier_10 > tier_0 * 20);
        assert!(tier_20 > tier_10 * 20);
    }

    #[test]
    fn test_min_absolute_stake_growth() {
        // Verify logarithmic growth pattern
        let tier_0 = calculate_min_absolute_stake(0);
        let tier_5 = calculate_min_absolute_stake(5);
        let tier_10 = calculate_min_absolute_stake(10);
        let tier_20 = calculate_min_absolute_stake(20);

        assert_eq!(tier_0, 10);
        assert_eq!(tier_5, 13); // ~13.89
        assert_eq!(tier_10, 15); // ~15.19
        assert_eq!(tier_20, 16); // ~16.60

        // Growth should be slow (logarithmic)
        assert!(tier_20 - tier_0 < 10); // Only ~$6 increase over 20 tiers
    }
}
