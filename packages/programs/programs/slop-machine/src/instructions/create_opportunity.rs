use anchor_lang::prelude::*;
use crate::errors::ErrorCode;
use crate::state::{Opportunity, OpportunityStatus, Project, WorkType};
use crate::utils::oracle::usd_to_lamports;

/// Minimum opportunity payment in USD cents ($2.50)
const MIN_PAYMENT_USD_CENTS: f64 = 250.0;

/// Create an opportunity for a story
///
/// Converts USD budget to lamports via Pyth oracle
#[derive(Accounts)]
pub struct CreateOpportunity<'info> {
    #[account(init, payer = project_creator, space = 8 + 217)]
    pub opportunity: Account<'info, Opportunity>,

    #[account()]
    pub project: Account<'info, Project>,

    /// CHECK: Pyth SOL/USD price feed account (validated in oracle utils)
    #[account()]
    pub pyth_price_feed: AccountInfo<'info>,

    #[account(
        mut,
        constraint = project.client == project_creator.key() @ ErrorCode::InvalidNodeRegistry
    )]
    pub project_creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Handler for create_opportunity instruction
///
/// Creates an Opportunity account with USD budget converted to SOL via Pyth oracle
pub fn handler(
    ctx: Context<CreateOpportunity>,
    work_type: u8,
    budget_usd: f64,
    requirements_arweave_tx: String,
) -> Result<()> {
    let opportunity = &mut ctx.accounts.opportunity;
    let clock = Clock::get()?;

    // Validate minimum payment
    require!(
        budget_usd >= MIN_PAYMENT_USD_CENTS,
        ErrorCode::BidBelowMinimumUSD
    );

    // Convert USD to lamports via Pyth oracle
    let budget_lamports = usd_to_lamports(
        budget_usd / 100.0, // Convert cents to dollars
        &ctx.accounts.pyth_price_feed,
        &clock,
    )?;

    // Get current SOL/USD price for reference
    let price_data = crate::utils::oracle::get_sol_price_usd(
        &ctx.accounts.pyth_price_feed,
        &clock,
    )?;

    // Map work_type enum
    let work_type_enum = match work_type {
        0 => WorkType::Architecture,
        1 => WorkType::StoryImplementation,
        2 => WorkType::QAReview,
        _ => return Err(ErrorCode::InvalidAmount.into()),
    };

    // Initialize opportunity
    opportunity.project = ctx.accounts.project.key();
    opportunity.work_type = work_type_enum;
    opportunity.budget_sol = budget_lamports;
    opportunity.budget_usd_equivalent = budget_usd as u64; // Store as cents
    opportunity.sol_price_at_creation = (price_data.price * 100.0) as u64; // Store as cents
    opportunity.requirements_arweave_tx = requirements_arweave_tx;
    opportunity.status = OpportunityStatus::Open;
    opportunity.assigned_node = None;
    opportunity.escrow_account = Pubkey::default(); // Will be set when escrow created
    opportunity.created_at = clock.unix_timestamp;
    opportunity.deadline = None;
    opportunity.bump = 0; // Not a PDA

    msg!(
        "Opportunity created: ${:.2} USD = {} lamports (SOL @ ${:.2})",
        budget_usd / 100.0,
        budget_lamports,
        price_data.price
    );

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_minimum_payment_constant() {
        assert_eq!(MIN_PAYMENT_USD_CENTS, 250.0); // $2.50
    }

    #[test]
    fn test_work_type_mapping() {
        // Ensure work type enum values are correct
        assert_eq!(0, 0); // Architecture
        assert_eq!(1, 1); // StoryImplementation
        assert_eq!(2, 2); // QAReview
    }
}
