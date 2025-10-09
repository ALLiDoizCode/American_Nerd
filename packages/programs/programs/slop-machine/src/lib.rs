#![allow(deprecated)]

use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

// Re-export instruction context structs for Anchor macro
pub use instructions::*;

// Devnet program ID (Story 1.8 deployment)
declare_id!("4hPgUuR7S8pyX7WxgaKTunaPCjMQLhEmBgQEyTrTvDNt");

// Suppress Anchor 0.30.0 deprecation warning from #[program] macro
// https://github.com/coral-xyz/anchor/issues/3283
#[allow(deprecated)]
#[program]
pub mod slop_machine {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn submit_bid_with_stake(
        ctx: Context<SubmitBidWithStake>,
        bid_amount: u64,
        message: String,
    ) -> Result<()> {
        instructions::submit_bid_with_stake::handler(ctx, bid_amount, message)
    }

    pub fn create_project_escrow(
        ctx: Context<CreateProjectEscrow>,
        project_id: u64,
        opportunity_id: u64,
        amount: u64,
    ) -> Result<()> {
        instructions::create_project_escrow::handler(ctx, project_id, opportunity_id, amount)
    }

    pub fn lock_payment_and_stake(ctx: Context<LockPaymentAndStake>) -> Result<()> {
        instructions::lock_payment_and_stake::handler(ctx)
    }

    pub fn release_payment_and_stake(ctx: Context<ReleasePaymentAndStake>) -> Result<()> {
        instructions::release_payment_and_stake::handler(ctx)
    }

    pub fn slash_stake_and_refund(
        ctx: Context<SlashStakeAndRefund>,
        failure_count: u8,
    ) -> Result<()> {
        instructions::slash_stake_and_refund::handler(ctx, failure_count)
    }

    pub fn register_node(ctx: Context<RegisterNode>) -> Result<()> {
        instructions::register_node::handler(ctx)
    }

    pub fn create_opportunity(
        ctx: Context<CreateOpportunity>,
        work_type: u8,
        budget_usd: f64,
        requirements_arweave_tx: String,
    ) -> Result<()> {
        instructions::create_opportunity::handler(ctx, work_type, budget_usd, requirements_arweave_tx)
    }

    pub fn accept_bid(ctx: Context<AcceptBid>) -> Result<()> {
        instructions::accept_bid::handler(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
