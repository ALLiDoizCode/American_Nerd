use crate::errors::ErrorCode;
use crate::state::{
    Bid, BidStatus, NodeRegistry, Opportunity, OpportunityStatus, Stake, StakeStatus,
};
use crate::utils::oracle::{get_sol_price_usd, lamports_to_usd};
use anchor_lang::prelude::*;
use anchor_lang::system_program;

const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

/// Submit bid with stake instruction accounts
#[derive(Accounts)]
#[instruction(bid_amount: u64, _message: String)]
pub struct SubmitBidWithStake<'info> {
    #[account(
        init,
        payer = node,
        space = 8 + 392, // Discriminator + Bid data (384 bytes from bid.rs)
        seeds = [
            b"bid",
            opportunity.key().as_ref(),
            node.key().as_ref(),
            &clock.unix_timestamp.to_le_bytes()
        ],
        bump
    )]
    pub bid: Account<'info, Bid>,

    #[account(
        init,
        payer = node,
        space = 8 + 103, // Discriminator + Stake data
        seeds = [b"stake", opportunity.key().as_ref(), node.key().as_ref()],
        bump
    )]
    pub stake: Account<'info, Stake>,

    #[account(
        mut,
        constraint = opportunity.status == OpportunityStatus::Open @ ErrorCode::OpportunityNotOpen
    )]
    pub opportunity: Account<'info, Opportunity>,

    #[account(
        constraint = node_registry.node_id == node.key() @ ErrorCode::InvalidNodeRegistry
    )]
    pub node_registry: Account<'info, NodeRegistry>,

    /// Pyth SOL/USD price feed account
    /// CHECK: Validated in oracle module via manual parsing
    pub pyth_price_account: AccountInfo<'info>,

    #[account(mut)]
    pub node: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", opportunity.project.as_ref()],
        bump
    )]
    /// CHECK: Escrow PDA for holding stake funds
    pub escrow_pda: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<SubmitBidWithStake>, bid_amount: u64, message: String) -> Result<()> {
    // Task 3: Opportunity status validation is handled by constraint in account struct

    // Validate message length (Bid struct expects max 280 chars)
    require!(message.len() <= 280, ErrorCode::InvalidBidAmount);

    // Task 4: Bid amount validation with Pyth oracle (Story 1.6 - Manual Parsing)
    // Validate minimum USD value ($2.50)
    let bid_usd = lamports_to_usd(
        bid_amount,
        &ctx.accounts.pyth_price_account,
        &ctx.accounts.clock,
    )?;
    require!(bid_usd >= 2.50, ErrorCode::BidBelowMinimumUSD);

    // Validate bid is within opportunity budget
    require!(
        bid_amount <= ctx.accounts.opportunity.budget_sol,
        ErrorCode::InvalidBidAmount
    );

    // Task 5: Tier-based stake calculation
    let tier = ctx.accounts.node_registry.reputation_tier;

    // Calculate stake multiplier: max(1.0, 5.0 * exp(-0.15 * tier))
    let stake_multiplier = f32::max(1.0, 5.0 * f32::exp(-0.15 * tier as f32));

    // Calculate required stake: bid_amount * stake_multiplier
    let calculated_stake_lamports = (bid_amount as f64 * stake_multiplier as f64) as u64;

    // Calculate minimum absolute stake in USD cents
    let min_stake_usd_cents = ((10.0 + (5.0 * (tier as f64 + 1.0).log10())).floor() * 100.0) as u64;

    // Convert minimum stake to lamports using Pyth oracle (Story 1.6 - Manual Parsing)
    let sol_price_data = get_sol_price_usd(&ctx.accounts.pyth_price_account, &ctx.accounts.clock)?;
    let sol_price_usd = sol_price_data.price;
    let min_stake_lamports =
        ((min_stake_usd_cents as f64 / 100.0) / sol_price_usd * LAMPORTS_PER_SOL as f64) as u64;

    // Final stake is max of calculated and minimum absolute
    let final_stake_amount = u64::max(calculated_stake_lamports, min_stake_lamports);

    // Calculate total rent needed for both accounts (Bid + Stake)
    let bid_rent = Rent::get()?.minimum_balance(8 + 392); // Bid account size
    let stake_rent = Rent::get()?.minimum_balance(8 + 103); // Stake account size
    let total_required = final_stake_amount
        .checked_add(bid_rent)
        .ok_or(ErrorCode::InsufficientStake)?
        .checked_add(stake_rent)
        .ok_or(ErrorCode::InsufficientStake)?;

    // Validate node has sufficient balance for stake + rent BEFORE account initialization
    require!(
        ctx.accounts.node.lamports() >= total_required,
        ErrorCode::InsufficientStake
    );

    // Task 6: Transfer stake from node to escrow PDA
    let transfer_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.node.to_account_info(),
            to: ctx.accounts.escrow_pda.to_account_info(),
        },
    );
    system_program::transfer(transfer_ctx, final_stake_amount)?;

    // Task 7: Create Stake account
    let stake = &mut ctx.accounts.stake;
    stake.node = ctx.accounts.node.key();
    stake.opportunity = ctx.accounts.opportunity.key();
    stake.stake_amount = final_stake_amount;
    stake.bid_amount = bid_amount;
    stake.stake_multiplier = stake_multiplier;
    stake.status = StakeStatus::Locked;
    stake.locked_at = ctx.accounts.clock.unix_timestamp;
    stake.released_at = None;
    stake.bump = ctx.bumps.stake;

    // Task 8: Create Bid account with Pyth oracle price (Story 1.6 - Manual Parsing)
    // Note: Current Bid struct has different fields than Story 1.4 spec
    // Mapping Story 1.4 concepts to existing Bid structure:
    // - bid_amount → amount_sol
    // - stake_amount is stored in separate Stake account
    // - node_tier information is in NodeRegistry, not duplicated in Bid
    let bid = &mut ctx.accounts.bid;
    bid.opportunity = ctx.accounts.opportunity.key();
    bid.node = ctx.accounts.node.key();
    bid.amount_sol = bid_amount;
    bid.usd_equivalent = (bid_usd * 100.0) as u64; // USD cents
    bid.sol_price_at_bid = (sol_price_usd * 100.0) as u64; // Price in cents
    bid.estimated_completion_hours = 24; // Default, can be parameterized in future
    bid.message = message;
    bid.status = BidStatus::Pending;
    bid.created_at = ctx.accounts.clock.unix_timestamp;
    bid.bump = ctx.bumps.bid;

    // Task 9: Emit BidSubmitted event
    emit!(BidSubmitted {
        opportunity: ctx.accounts.opportunity.key(),
        node: ctx.accounts.node.key(),
        bid_amount,
        stake_amount: final_stake_amount,
        node_tier: tier,
        created_at: ctx.accounts.clock.unix_timestamp,
    });

    Ok(())
}

/// Event emitted when a bid is successfully submitted with stake locked
#[event]
pub struct BidSubmitted {
    pub opportunity: Pubkey,
    pub node: Pubkey,
    pub bid_amount: u64,
    pub stake_amount: u64,
    pub node_tier: u16,
    pub created_at: i64,
}
