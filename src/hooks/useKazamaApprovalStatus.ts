import { useMemo } from 'react'
import { useWeb3React } from '@kazamaswap/wagmi'
import { useKazama } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useKazamaApprovalStatus = (spender) => {
  const { account } = useWeb3React()
  const { reader: kazamaContract } = useKazama()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account && spender
        ? {
            contract: kazamaContract,
            methodName: 'allowance',
            params: [account, spender],
          }
        : null,
    [account, kazamaContract, spender],
  )

  const { data, mutate } = useSWRContract(key)

  return { isVaultApproved: data ? data.gt(0) : false, setLastUpdated: mutate }
}

export default useKazamaApprovalStatus
