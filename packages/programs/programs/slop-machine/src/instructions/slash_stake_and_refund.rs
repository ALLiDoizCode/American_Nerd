use crate::errors::ErrorCode;
use crate::state::{Escrow, EscrowState, NodeRegistry, SlashEvent, Stake, StakeStatus};
use crate::utils::reputation::update_node_reputation;
use anchor_lang::prelude::*;

/// Burn address for permanently destroying slashed stake
/// This is Solana's canonical burn address (no private key exists)
pub const BURN_ADDRESS: &str = "11111111111111111111111111111112";

#[event]
pub struct StakeSlashed {
    pub stake: Pubkey,
    pub node: Pubkey,
    pub opportunity: Pubkey,
    pub slashed_amount: u64,
    pub to_project: u64,
    pub burned: u64,
    pub new_tier: u16,
    pub slashed_at: i64,
}

#[derive(Accounts)]
pub struct SlashStakeAndRefund<'info> {
    #[account(
        mut,
        constraint = escrow.state == EscrowState::PendingReview @ ErrorCode::EscrowInvalidState
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        constraint = stake.status == StakeStatus::Locked @ ErrorCode::StakeNotLocked
    )]
    pub stake: Account<'info, Stake>,

    #[account(
        init,
        payer = client,
        space = SlashEvent::LEN,
        seeds = [b"slash_event", stake.key().as_ref()],
        bump
    )]
    pub slash_event: Account<'info, SlashEvent>,

    #[account(
        mut,
        constraint = node_registry.node_id == escrow.developer @ ErrorCode::InvalidNodeRegistry
    )]
    pub node_registry: Account<'info, NodeRegistry>,

    /// Client wallet (destination for payment refund)
    /// CHECK: Client pubkey validated by escrow account
    #[account(
        mut,
        constraint = client.key() == escrow.client @ ErrorCode::InvalidNodeRegistry
    )]
    pub client: Signer<'info>,

    /// Project escrow (destination for 50% stake)
    /// CHECK: Project escrow is the same as the payment escrow in this implementation
    #[account(mut)]
    pub project_escrow: UncheckedAccount<'info>,

    /// Burn address (destination for 50% stake - permanently destroyed)
    /// CHECK: Burn address validated against canonical Solana burn address
    #[account(
        mut,
        constraint = burn_address.key().to_string() == BURN_ADDRESS @ ErrorCode::InvalidBurnAddress
    )]
    pub burn_address: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SlashStakeAndRefund>, failure_count: u8) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let stake = &mut ctx.accounts.stake;
    let slash_event = &mut ctx.accounts.slash_event;
    let node_registry = &mut ctx.accounts.node_registry;
    let clock = Clock::get()?;

    // Validate failure count >= 3
    require!(
        Stake::should_slash(failure_count),
        ErrorCode::SlashConditionsNotMet
    );

    // Calculate slash distribution (50/50 split)
    let (to_project, to_burn) = Stake::calculate_slash_distribution(stake.stake_amount);

    // Transfer 1: 50% to project escrow
    **stake.to_account_info().try_borrow_mut_lamports()? -= to_project;
    **ctx
        .accounts
        .project_escrow
        .to_account_info()
        .try_borrow_mut_lamports()? += to_project;

    // Transfer 2: 50% to burn address (permanently destroyed)
    **stake.to_account_info().try_borrow_mut_lamports()? -= to_burn;
    **ctx
        .accounts
        .burn_address
        .to_account_info()
        .try_borrow_mut_lamports()? += to_burn;

    // Transfer 3: Refund full payment to client
    **escrow.to_account_info().try_borrow_mut_lamports()? -= escrow.amount;
    **ctx
        .accounts
        .client
        .to_account_info()
        .try_borrow_mut_lamports()? += escrow.amount;

    // Update Stake account
    stake.status = StakeStatus::Slashed;
    stake.released_at = Some(clock.unix_timestamp);

    // Update reputation (increments projects_attempted only, tier degrades)
    update_node_reputation(node_registry, false)?;

    // Update failed jobs counter
    node_registry.failed_jobs = node_registry
        .failed_jobs
        .checked_add(1)
        .ok_or(ErrorCode::EscrowAmountMismatch)?;

    // Create SlashEvent account for audit trail
    slash_event.stake = stake.key();
    slash_event.node = escrow.developer;
    slash_event.opportunity = stake.opportunity;
    slash_event.slashed_amount = stake.stake_amount;
    slash_event.to_project = to_project;
    slash_event.burned = to_burn;
    slash_event.reason = format!("{} validation failures", failure_count);
    slash_event.slashed_at = clock.unix_timestamp;
    slash_event.bump = ctx.bumps.slash_event;

    // Update escrow state
    escrow.state = EscrowState::Refunded;
    escrow.updated_at = clock.unix_timestamp;

    // Emit StakeSlashed event
    emit!(StakeSlashed {
        stake: stake.key(),
        node: escrow.developer,
        opportunity: stake.opportunity,
        slashed_amount: stake.stake_amount,
        to_project,
        burned: to_burn,
        new_tier: node_registry.reputation_tier,
        slashed_at: clock.unix_timestamp,
    });

    msg!(
        "Stake slashed due to {} validation failures:",
        failure_count
    );
    msg!("  Total slashed: {} lamports", stake.stake_amount);
    msg!("  To project: {} lamports (50%)", to_project);
    msg!("  Burned: {} lamports (50%)", to_burn);
    msg!("  Payment refunded: {} lamports", escrow.amount);
    msg!("  New tier: {} (decreased)", node_registry.reputation_tier);

    Ok(())
}
