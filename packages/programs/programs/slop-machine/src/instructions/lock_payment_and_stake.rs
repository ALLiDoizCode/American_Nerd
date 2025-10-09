use crate::errors::ErrorCode;
use crate::state::{Escrow, EscrowState, Opportunity, OpportunityStatus, Stake, StakeStatus};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct LockPaymentAndStake<'info> {
    #[account(
        mut,
        constraint = escrow.state == EscrowState::Funded @ ErrorCode::EscrowInvalidState
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        constraint = stake.status == StakeStatus::Locked @ ErrorCode::StakeNotLocked
    )]
    pub stake: Account<'info, Stake>,

    #[account(
        constraint = opportunity.status == OpportunityStatus::Assigned @ ErrorCode::OpportunityNotOpen
    )]
    pub opportunity: Account<'info, Opportunity>,
}

pub fn handler(ctx: Context<LockPaymentAndStake>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let stake = &ctx.accounts.stake;
    let opportunity = &ctx.accounts.opportunity;
    let clock = Clock::get()?;

    // Validate payment amount matches opportunity budget
    require!(
        escrow.amount == opportunity.budget_sol,
        ErrorCode::EscrowAmountMismatch
    );

    // Validate stake amount matches Stake account
    // Note: Stake validation occurs in submit_bid_with_stake (Story 1.4)
    // This is a secondary validation to ensure stake is still locked
    require!(
        stake.status == StakeStatus::Locked,
        ErrorCode::StakeNotLocked
    );

    // Update escrow state: Funded → PendingReview
    escrow.state = EscrowState::PendingReview;
    escrow.updated_at = clock.unix_timestamp;

    msg!("Payment and stake locked: escrow state transitioned to PendingReview");
    msg!(
        "Project: {}, Opportunity: {}",
        escrow.project_id,
        escrow.opportunity_id
    );
    msg!(
        "Payment: {} lamports, Stake: {} lamports",
        escrow.amount,
        stake.stake_amount
    );

    Ok(())
}
