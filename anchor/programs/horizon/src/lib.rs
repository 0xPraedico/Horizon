#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod horizon {
    use super::*;

  pub fn close(_ctx: Context<CloseHorizon>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.horizon.count = ctx.accounts.horizon.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.horizon.count = ctx.accounts.horizon.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeHorizon>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.horizon.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeHorizon<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Horizon::INIT_SPACE,
  payer = payer
  )]
  pub horizon: Account<'info, Horizon>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseHorizon<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub horizon: Account<'info, Horizon>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub horizon: Account<'info, Horizon>,
}

#[account]
#[derive(InitSpace)]
pub struct Horizon {
  count: u8,
}
