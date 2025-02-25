import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Horizon} from '../target/types/horizon'

describe('horizon', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Horizon as Program<Horizon>

  const horizonKeypair = Keypair.generate()

  it('Initialize Horizon', async () => {
    await program.methods
      .initialize()
      .accounts({
        horizon: horizonKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([horizonKeypair])
      .rpc()

    const currentCount = await program.account.horizon.fetch(horizonKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Horizon', async () => {
    await program.methods.increment().accounts({ horizon: horizonKeypair.publicKey }).rpc()

    const currentCount = await program.account.horizon.fetch(horizonKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Horizon Again', async () => {
    await program.methods.increment().accounts({ horizon: horizonKeypair.publicKey }).rpc()

    const currentCount = await program.account.horizon.fetch(horizonKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Horizon', async () => {
    await program.methods.decrement().accounts({ horizon: horizonKeypair.publicKey }).rpc()

    const currentCount = await program.account.horizon.fetch(horizonKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set horizon value', async () => {
    await program.methods.set(42).accounts({ horizon: horizonKeypair.publicKey }).rpc()

    const currentCount = await program.account.horizon.fetch(horizonKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the horizon account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        horizon: horizonKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.horizon.fetchNullable(horizonKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
