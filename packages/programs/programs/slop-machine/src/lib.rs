use anchor_lang::prelude::*;

// Placeholder program ID - will be updated after deployment
declare_id!("DoxwpkBr2cNu2NYxWEZjopYtZwHzQPJuzZFasinMAXKm");

#[program]
pub mod slop_machine {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
