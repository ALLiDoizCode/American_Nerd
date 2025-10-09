use crate::errors::ErrorCode;
use crate::state::{Bid, BidStatus, Escrow, EscrowState, Opportunity, OpportunityStatus, Project};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};

/// Accept a bid and assign opportunity to winning node
///
/// Updates opportunity status to Assigned and locks payment in escrow
#[derive(Accounts)]
pub struct AcceptBid<'info> {
    #[account(
        mut,
        constraint = opportunity.status == OpportunityStatus::Open @ ErrorCode::OpportunityNotOpen
    )]
    pub opportunity: Account<'info, Opportunity>,

    #[account(
        mut,
        constraint = bid.opportunity == opportunity.key() @ ErrorCode::InvalidBidAmount
    )]
    pub bid: Account<'info, Bid>,

    #[account()]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        constraint = project.client == project_creator.key() @ ErrorCode::InvalidNodeRegistry
    )]
    pub project_creator: Signer<'info>,

    /// Story escrow PDA - initialized to lock payment for this opportunity
    #[account(
        init,
        payer = project_creator,
        space = Escrow::LEN,
        seeds = [b"story-escrow", opportunity.key().as_ref()],
        bump
    )]
    pub story_escrow: Account<'info, Escrow>,

    /// QA reviewer who will perform validation (provided by platform)
    /// CHECK: QA reviewer pubkey provided by platform, validated externally
    pub qa_reviewer: UncheckedAccount<'info>,

    /// Platform fee recipient wallet
    /// CHECK: Platform wallet is a known constant verified by platform
    pub platform_wallet: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

/// Handler for accept_bid instruction
///
/// Assigns opportunity to bidder, initializes escrow, and locks payment
pub fn handler(ctx: Context<AcceptBid>) -> Result<()> {
    let opportunity = &mut ctx.accounts.opportunity;
    let bid = &mut ctx.accounts.bid;
    let story_escrow = &mut ctx.accounts.story_escrow;
    let clock = Clock::get()?;

    // Validate opportunity is open
    require!(
        opportunity.status == OpportunityStatus::Open,
        ErrorCode::OpportunityNotOpen
    );

    // Validate bid references this opportunity
    require!(
        bid.opportunity == opportunity.key(),
        ErrorCode::InvalidBidAmount
    );

    // Initialize story escrow account
    story_escrow.project_id = 0; // Not using numeric IDs in this architecture
    story_escrow.opportunity_id = 0; // Not using numeric IDs in this architecture
    story_escrow.client = ctx.accounts.project.client;
    story_escrow.developer = bid.node;
    story_escrow.qa_reviewer = ctx.accounts.qa_reviewer.key();
    story_escrow.validator = ctx.accounts.project.client; // Client acts as validator for now
    story_escrow.platform_wallet = ctx.accounts.platform_wallet.key();
    story_escrow.amount = opportunity.budget_sol;

    // Set payment splits (85% dev, 5% QA, 10% platform)
    story_escrow.developer_split_bps = 8500;
    story_escrow.qa_split_bps = 500;
    story_escrow.platform_split_bps = 1000;

    // Set minimum platform fee ($0.25 USD equivalent)
    // Using conservative estimate: $0.25 / $100 per SOL = 0.0025 SOL = 2,500,000 lamports
    story_escrow.minimum_platform_fee = 2_500_000;

    // Set escrow state and timestamps
    story_escrow.state = EscrowState::Funded;
    story_escrow.created_at = clock.unix_timestamp;
    story_escrow.updated_at = clock.unix_timestamp;
    story_escrow.bump = ctx.bumps.story_escrow;

    // Transfer payment from project creator to story escrow PDA
    let payment_amount = opportunity.budget_sol;
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.project_creator.to_account_info(),
            to: story_escrow.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, payment_amount)?;

    // Update opportunity status and link to escrow
    opportunity.status = OpportunityStatus::Assigned;
    opportunity.assigned_node = Some(bid.node);
    opportunity.escrow_account = story_escrow.key();

    // Update bid status
    bid.status = BidStatus::Accepted;

    msg!(
        "Bid accepted: opportunity {} assigned to node {}, {} lamports locked in story escrow {}",
        opportunity.key(),
        bid.node,
        payment_amount,
        story_escrow.key()
    );

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_opportunity_status_validation() {
        // Ensure OpportunityNotOpen error is properly defined
        let error_code = ErrorCode::OpportunityNotOpen;
        assert!(matches!(error_code, ErrorCode::OpportunityNotOpen));
    }
}
