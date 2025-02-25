'use client'

import { getHorizonProgram, getHorizonProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useHorizonProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getHorizonProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getHorizonProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['horizon', 'all', { cluster }],
    queryFn: () => program.account.horizon.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['horizon', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ horizon: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useHorizonProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useHorizonProgram()

  const accountQuery = useQuery({
    queryKey: ['horizon', 'fetch', { cluster, account }],
    queryFn: () => program.account.horizon.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['horizon', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ horizon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['horizon', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ horizon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['horizon', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ horizon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['horizon', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ horizon: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
