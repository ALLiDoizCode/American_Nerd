use crate::state::{Escrow, EscrowState};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};

#[derive(Accounts)]
#[instruction(project_id: u64, opportunity_id: u64)]
pub struct CreateProjectEscrow<'info> {
    #[account(
        init,
        payer = client,
        space = Escrow::LEN,
        seeds = [
            b"escrow",
            project_id.to_le_bytes().as_ref(),
            opportunity_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub client: Signer<'info>,

    /// Developer AI node assigned to this opportunity
    /// CHECK: Developer pubkey validated by opportunity assignment logic
    pub developer: UncheckedAccount<'info>,

    /// QA reviewer performing automated validation
    /// CHECK: QA reviewer pubkey provided by platform
    pub qa_reviewer: UncheckedAccount<'info>,

    /// Platform fee recipient wallet
    /// CHECK: Platform wallet is a known constant verified by platform
    pub platform_wallet: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateProjectEscrow>,
    project_id: u64,
    opportunity_id: u64,
    amount: u64,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    // Initialize escrow account
    escrow.project_id = project_id;
    escrow.opportunity_id = opportunity_id;
    escrow.client = ctx.accounts.client.key();
    escrow.developer = ctx.accounts.developer.key();
    escrow.qa_reviewer = ctx.accounts.qa_reviewer.key();
    escrow.validator = ctx.accounts.client.key(); // Validator is client for now (will be automated system in future)
    escrow.platform_wallet = ctx.accounts.platform_wallet.key();
    escrow.amount = amount;

    // Set payment splits (85/5/10 basis points)
    escrow.developer_split_bps = 8500; // 85%
    escrow.qa_split_bps = 500; // 5%
    escrow.platform_split_bps = 1000; // 10%

    // Set minimum platform fee ($0.25 USD = 0.0025 SOL @ $100/SOL = 2,500,000 lamports)
    // Note: This is a stub value based on $100/SOL oracle price
    // Story 1.6 will replace with dynamic Pyth price feed
    escrow.minimum_platform_fee = 2_500_000;

    // Set initial state
    escrow.state = EscrowState::Funded;
    escrow.created_at = clock.unix_timestamp;
    escrow.updated_at = clock.unix_timestamp;
    escrow.bump = ctx.bumps.escrow;

    // Transfer funds from client to escrow PDA
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.client.to_account_info(),
            to: escrow.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, amount)?;

    msg!(
        "Project escrow created: project_id={}, opportunity_id={}, amount={} lamports",
        project_id,
        opportunity_id,
        amount
    );

    Ok(())
}
