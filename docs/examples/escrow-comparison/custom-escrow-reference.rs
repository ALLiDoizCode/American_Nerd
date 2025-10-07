// Custom Escrow Program - Reference Implementation
// Optimized for American Nerd Marketplace
// Single-arbiter, multi-recipient, native SOL escrow

use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("ESCR0Wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod american_nerd_escrow {
    use super::*;

    /// Creates and funds an escrow account
    /// Client deposits SOL to escrow in a single atomic transaction
    pub fn create_and_fund_escrow(
        ctx: Context<CreateAndFundEscrow>,
        project_id: u64,
        opportunity_id: u64,
        amount: u64,
        developer_split_bps: u16,
        qa_split_bps: u16,
        platform_split_bps: u16,
    ) -> Result<()> {
        require!(
            developer_split_bps + qa_split_bps + platform_split_bps == 10000,
            EscrowError::InvalidSplitPercentages
        );
        require!(amount > 0, EscrowError::InvalidAmount);

        let escrow = &mut ctx.accounts.escrow;
        escrow.project_id = project_id;
        escrow.opportunity_id = opportunity_id;
        escrow.client = ctx.accounts.client.key();
        escrow.developer = ctx.accounts.developer.key();
        escrow.qa_reviewer = ctx.accounts.qa_reviewer.key();
        escrow.validator = ctx.accounts.validator.key();
        escrow.platform_wallet = ctx.accounts.platform_wallet.key();
        escrow.amount = amount;
        escrow.developer_split_bps = developer_split_bps;
        escrow.qa_split_bps = qa_split_bps;
        escrow.platform_split_bps = platform_split_bps;
        escrow.state = EscrowState::Funded;
        escrow.created_at = Clock::get()?.unix_timestamp;
        escrow.updated_at = Clock::get()?.unix_timestamp;
        escrow.bump = ctx.bumps.escrow;

        // Transfer SOL from client to escrow PDA
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.client.to_account_info(),
                    to: ctx.accounts.escrow.to_account_info(),
                },
            ),
            amount,
        )?;

        msg!(
            "Escrow created and funded: project={}, opportunity={}, amount={}",
            project_id,
            opportunity_id,
            amount
        );

        Ok(())
    }

    /// Validator approves work and triggers immediate 3-way payment split
    /// 85% developer, 10% QA reviewer, 5% platform (configurable via BPS)
    pub fn approve_and_distribute(ctx: Context<ApproveAndDistribute>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;

        require!(
            escrow.state == EscrowState::Funded || escrow.state == EscrowState::PendingReview,
            EscrowError::InvalidState
        );
        require!(
            ctx.accounts.validator.key() == escrow.validator,
            EscrowError::UnauthorizedValidator
        );

        // Calculate payment splits (using basis points for precision)
        let developer_amount = (escrow.amount as u128)
            .checked_mul(escrow.developer_split_bps as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;

        let qa_amount = (escrow.amount as u128)
            .checked_mul(escrow.qa_split_bps as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;

        let platform_amount = (escrow.amount as u128)
            .checked_mul(escrow.platform_split_bps as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;

        // Ensure we don't lose lamports due to rounding
        let total_distributed = developer_amount + qa_amount + platform_amount;
        require!(
            total_distributed <= escrow.amount,
            EscrowError::DistributionExceedsAmount
        );

        let project_id = escrow.project_id;
        let opportunity_id = escrow.opportunity_id;
        let seeds = &[
            b"escrow",
            project_id.to_le_bytes().as_ref(),
            opportunity_id.to_le_bytes().as_ref(),
            &[escrow.bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer to developer (85%)
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.escrow.to_account_info(),
                    to: ctx.accounts.developer.to_account_info(),
                },
                signer,
            ),
            developer_amount,
        )?;

        // Transfer to QA reviewer (10%)
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.escrow.to_account_info(),
                    to: ctx.accounts.qa_reviewer.to_account_info(),
                },
                signer,
            ),
            qa_amount,
        )?;

        // Transfer to platform (5%)
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.escrow.to_account_info(),
                    to: ctx.accounts.platform_wallet.to_account_info(),
                },
                signer,
            ),
            platform_amount,
        )?;

        escrow.state = EscrowState::Completed;
        escrow.updated_at = Clock::get()?.unix_timestamp;

        msg!(
            "Escrow approved and distributed: dev={}, qa={}, platform={}",
            developer_amount,
            qa_amount,
            platform_amount
        );

        Ok(())
    }

    /// Validator rejects work and refunds client
    pub fn reject_and_refund(ctx: Context<RejectAndRefund>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;

        require!(
            escrow.state == EscrowState::Funded || escrow.state == EscrowState::PendingReview,
            EscrowError::InvalidState
        );
        require!(
            ctx.accounts.validator.key() == escrow.validator,
            EscrowError::UnauthorizedValidator
        );

        let project_id = escrow.project_id;
        let opportunity_id = escrow.opportunity_id;
        let refund_amount = escrow.amount;
        let seeds = &[
            b"escrow",
            project_id.to_le_bytes().as_ref(),
            opportunity_id.to_le_bytes().as_ref(),
            &[escrow.bump],
        ];
        let signer = &[&seeds[..]];

        // Refund to client
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.escrow.to_account_info(),
                    to: ctx.accounts.client.to_account_info(),
                },
                signer,
            ),
            refund_amount,
        )?;

        escrow.state = EscrowState::Refunded;
        escrow.updated_at = Clock::get()?.unix_timestamp;

        msg!("Escrow rejected and refunded: amount={}", refund_amount);

        Ok(())
    }
}

// Account Structures

#[derive(Accounts)]
#[instruction(project_id: u64, opportunity_id: u64)]
pub struct CreateAndFundEscrow<'info> {
    #[account(
        init,
        payer = client,
        space = 8 + Escrow::LEN,
        seeds = [b"escrow", project_id.to_le_bytes().as_ref(), opportunity_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub client: Signer<'info>,

    /// CHECK: Developer wallet to receive payment
    pub developer: UncheckedAccount<'info>,

    /// CHECK: QA reviewer wallet to receive payment
    pub qa_reviewer: UncheckedAccount<'info>,

    /// CHECK: Validator who will approve or reject
    pub validator: UncheckedAccount<'info>,

    /// CHECK: Platform fee wallet
    pub platform_wallet: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveAndDistribute<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.project_id.to_le_bytes().as_ref(), escrow.opportunity_id.to_le_bytes().as_ref()],
        bump = escrow.bump,
        close = client
    )]
    pub escrow: Account<'info, Escrow>,

    pub validator: Signer<'info>,

    /// CHECK: Client receives rent back
    #[account(mut)]
    pub client: UncheckedAccount<'info>,

    /// CHECK: Developer receives 85% payment
    #[account(mut)]
    pub developer: UncheckedAccount<'info>,

    /// CHECK: QA reviewer receives 10% payment
    #[account(mut)]
    pub qa_reviewer: UncheckedAccount<'info>,

    /// CHECK: Platform receives 5% payment
    #[account(mut)]
    pub platform_wallet: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RejectAndRefund<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.project_id.to_le_bytes().as_ref(), escrow.opportunity_id.to_le_bytes().as_ref()],
        bump = escrow.bump,
        close = client
    )]
    pub escrow: Account<'info, Escrow>,

    pub validator: Signer<'info>,

    /// CHECK: Client receives refund and rent
    #[account(mut)]
    pub client: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

// State Account

#[account]
pub struct Escrow {
    pub project_id: u64,           // 8 bytes
    pub opportunity_id: u64,       // 8 bytes
    pub client: Pubkey,            // 32 bytes
    pub developer: Pubkey,         // 32 bytes
    pub qa_reviewer: Pubkey,       // 32 bytes
    pub validator: Pubkey,         // 32 bytes
    pub platform_wallet: Pubkey,   // 32 bytes
    pub amount: u64,               // 8 bytes
    pub developer_split_bps: u16,  // 2 bytes (basis points: 8500 = 85%)
    pub qa_split_bps: u16,         // 2 bytes
    pub platform_split_bps: u16,   // 2 bytes
    pub state: EscrowState,        // 1 byte
    pub created_at: i64,           // 8 bytes
    pub updated_at: i64,           // 8 bytes
    pub bump: u8,                  // 1 byte
}

impl Escrow {
    pub const LEN: usize = 8 + 8 + 32 + 32 + 32 + 32 + 32 + 8 + 2 + 2 + 2 + 1 + 8 + 8 + 1; // 208 bytes
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowState {
    Funded,         // Client has deposited SOL
    PendingReview,  // Work submitted, awaiting validator approval
    Approved,       // Validator approved (brief state before Completed)
    Rejected,       // Validator rejected (brief state before Refunded)
    Completed,      // Funds distributed successfully
    Refunded,       // Funds returned to client
}

// Error Codes

#[error_code]
pub enum EscrowError {
    #[msg("Split percentages must sum to 10000 basis points (100%)")]
    InvalidSplitPercentages,

    #[msg("Amount must be greater than zero")]
    InvalidAmount,

    #[msg("Escrow is not in a valid state for this operation")]
    InvalidState,

    #[msg("Only the designated validator can perform this action")]
    UnauthorizedValidator,

    #[msg("Distribution amounts exceed escrow balance")]
    DistributionExceedsAmount,
}

// Estimated Compute Units:
// - create_and_fund_escrow: ~20,000 CU (account init + 1 transfer)
// - approve_and_distribute: ~35,000 CU (3 transfers + close)
// - reject_and_refund: ~15,000 CU (1 transfer + close)
// Total workflow: ~55,000 CU (well under 65,000 target)

// Estimated Rent Cost:
// - Escrow account: 208 bytes
// - Rent exemption: ~0.0015 SOL (~$0.15 at $100 SOL)
// (Returned to client when escrow closes)
