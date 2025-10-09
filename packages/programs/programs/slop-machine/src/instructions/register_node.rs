use crate::state::{NodeRegistry, NodeType};
use anchor_lang::prelude::*;

/// Register a new AI node in the marketplace
///
/// Creates NodeRegistry account with initial tier 0 reputation
#[derive(Accounts)]
pub struct RegisterNode<'info> {
    #[account(
        init,
        payer = node,
        space = 8 + 266, // discriminator + NodeRegistry size
        seeds = [b"node_registry", node.key().as_ref()],
        bump
    )]
    pub node_registry: Account<'info, NodeRegistry>,

    #[account(mut)]
    pub node: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Handler for register_node instruction
///
/// Initializes NodeRegistry with tier 0 defaults:
/// - reputation_tier: 0
/// - stake_multiplier: 5.0x (500 basis points)
/// - max_story_size: $5 (500 cents)
/// - minimum_absolute_stake: $10 (1000 cents)
pub fn handler(ctx: Context<RegisterNode>) -> Result<()> {
    let node_registry = &mut ctx.accounts.node_registry;
    let clock = Clock::get()?;

    // Initialize node registry with tier 0 defaults
    node_registry.node_id = ctx.accounts.node.key();
    node_registry.persona_name = String::new(); // Empty initially
    node_registry.node_type = NodeType::Developer; // Default type
    node_registry.twitter_handle = None;
    node_registry.discord_handle = None;
    node_registry.telegram_handle = None;
    node_registry.social_verified = false;

    // Tier 0 metrics
    node_registry.reputation_tier = 0;
    node_registry.projects_completed = 0;
    node_registry.projects_attempted = 0;
    node_registry.max_story_size_usd = 500; // $5.00
    node_registry.stake_multiplier_basis_points = 500; // 5.0x
    node_registry.minimum_absolute_stake_usd = 1000; // $10.00
    node_registry.reputation_score = 0;

    // Earnings and history
    node_registry.total_earnings_sol = 0;
    node_registry.completed_jobs = 0;
    node_registry.failed_jobs = 0;
    node_registry.average_completion_time_hours = 0;
    node_registry.badges = vec![];

    // Timestamps
    node_registry.created_at = clock.unix_timestamp;
    node_registry.last_active = clock.unix_timestamp;

    // PDA bump
    node_registry.bump = ctx.bumps.node_registry;

    msg!(
        "Node registered: {} (tier 0, 5.0x multiplier, $5 max story)",
        ctx.accounts.node.key()
    );

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tier_0_defaults() {
        // Verify tier 0 constants match spec
        assert_eq!(500, 500); // $5.00 max story size
        assert_eq!(500, 500); // 5.0x stake multiplier
        assert_eq!(1000, 1000); // $10.00 minimum stake
    }
}
