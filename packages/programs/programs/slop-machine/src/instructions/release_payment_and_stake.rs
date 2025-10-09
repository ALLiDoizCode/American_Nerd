use crate::errors::ErrorCode;
use crate::state::{Escrow, EscrowState, NodeRegistry, Stake, StakeStatus};
use crate::utils::reputation::update_node_reputation;
use anchor_lang::prelude::*;

#[event]
pub struct PaymentReleased {
    pub opportunity: Pubkey,
    pub developer: Pubkey,
    pub developer_amount: u64,
    pub qa_amount: u64,
    pub platform_amount: u64,
    pub stake_returned: u64,
    pub new_tier: u16,
    pub released_at: i64,
}

#[derive(Accounts)]
pub struct ReleasePaymentAndStake<'info> {
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

    /// Developer wallet (destination for payment)
    /// CHECK: Developer pubkey validated by escrow account
    #[account(
        mut,
        constraint = developer.key() == escrow.developer @ ErrorCode::InvalidNodeRegistry
    )]
    pub developer: UncheckedAccount<'info>,

    /// QA reviewer wallet (destination for QA fee)
    /// CHECK: QA reviewer pubkey validated by escrow account
    #[account(
        mut,
        constraint = qa_reviewer.key() == escrow.qa_reviewer @ ErrorCode::InvalidNodeRegistry
    )]
    pub qa_reviewer: UncheckedAccount<'info>,

    /// Platform fee recipient wallet
    /// CHECK: Platform wallet validated by escrow account
    #[account(
        mut,
        constraint = platform_wallet.key() == escrow.platform_wallet @ ErrorCode::InvalidNodeRegistry
    )]
    pub platform_wallet: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = node_registry.node_id == escrow.developer @ ErrorCode::InvalidNodeRegistry
    )]
    pub node_registry: Account<'info, NodeRegistry>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ReleasePaymentAndStake>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let stake = &mut ctx.accounts.stake;
    let node_registry = &mut ctx.accounts.node_registry;
    let clock = Clock::get()?;

    // Calculate three-way payment split
    let (developer_amount, qa_amount, platform_amount) = escrow.calculate_payments();

    // Validate escrow has sufficient balance
    let total_required = developer_amount
        .checked_add(qa_amount)
        .ok_or(ErrorCode::EscrowAmountMismatch)?
        .checked_add(platform_amount)
        .ok_or(ErrorCode::EscrowAmountMismatch)?;

    require!(
        escrow.to_account_info().lamports() >= total_required,
        ErrorCode::InsufficientEscrowBalance
    );

    // Verify total distribution equals escrow amount exactly (no rounding errors)
    require!(
        total_required == escrow.amount,
        ErrorCode::EscrowAmountMismatch
    );

    // Transfer 1: Developer payment (85% or adjusted if platform fee is minimum)
    **escrow.to_account_info().try_borrow_mut_lamports()? -= developer_amount;
    **ctx
        .accounts
        .developer
        .to_account_info()
        .try_borrow_mut_lamports()? += developer_amount;

    // Transfer 2: QA payment (5%)
    **escrow.to_account_info().try_borrow_mut_lamports()? -= qa_amount;
    **ctx
        .accounts
        .qa_reviewer
        .to_account_info()
        .try_borrow_mut_lamports()? += qa_amount;

    // Transfer 3: Platform fee (10% or $0.25 minimum)
    **escrow.to_account_info().try_borrow_mut_lamports()? -= platform_amount;
    **ctx
        .accounts
        .platform_wallet
        .to_account_info()
        .try_borrow_mut_lamports()? += platform_amount;

    // Transfer 4: Return stake to developer
    **stake.to_account_info().try_borrow_mut_lamports()? -= stake.stake_amount;
    **ctx
        .accounts
        .developer
        .to_account_info()
        .try_borrow_mut_lamports()? += stake.stake_amount;

    // Update Stake account
    stake.status = StakeStatus::Returned;
    stake.released_at = Some(clock.unix_timestamp);

    // Update NodeRegistry earnings
    node_registry.total_earnings_sol = node_registry
        .total_earnings_sol
        .checked_add(developer_amount)
        .ok_or(ErrorCode::EscrowAmountMismatch)?;

    // Update reputation (increments projects_completed, projects_attempted, recalculates tier)
    update_node_reputation(node_registry, true)?;

    // Update escrow state
    escrow.state = EscrowState::Completed;
    escrow.updated_at = clock.unix_timestamp;

    // Emit PaymentReleased event
    emit!(PaymentReleased {
        opportunity: stake.opportunity,
        developer: escrow.developer,
        developer_amount,
        qa_amount,
        platform_amount,
        stake_returned: stake.stake_amount,
        new_tier: node_registry.reputation_tier,
        released_at: clock.unix_timestamp,
    });

    msg!("Payment released successfully:");
    msg!(
        "  Developer: {} lamports ({}%)",
        developer_amount,
        (developer_amount * 100) / escrow.amount
    );
    msg!("  QA: {} lamports (5%)", qa_amount);
    msg!(
        "  Platform: {} lamports ({}%)",
        platform_amount,
        (platform_amount * 100) / escrow.amount
    );
    msg!("  Stake returned: {} lamports", stake.stake_amount);
    msg!("  New tier: {}", node_registry.reputation_tier);

    Ok(())
}
