// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import HorizonIDL from '../target/idl/horizon.json'
import type { Horizon } from '../target/types/horizon'

// Re-export the generated IDL and type
export { Horizon, HorizonIDL }

// The programId is imported from the program IDL.
export const HORIZON_PROGRAM_ID = new PublicKey(HorizonIDL.address)

// This is a helper function to get the Horizon Anchor program.
export function getHorizonProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...HorizonIDL, address: address ? address.toBase58() : HorizonIDL.address } as Horizon, provider)
}

// This is a helper function to get the program ID for the Horizon program depending on the cluster.
export function getHorizonProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Horizon program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return HORIZON_PROGRAM_ID
  }
}
