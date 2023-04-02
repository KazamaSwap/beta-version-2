import { useMemo } from 'react'
import { Flex, useMatchBreakpoints } from '@kazamaswap/uikit'
import KazamaVaultCard from 'views/Pools/components/KazamaVaultCard'
import { usePoolsWithVault } from 'state/pools/hooks'
import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'
import IfoVesting from './IfoVesting/index'

const IfoPoolVaultCard = () => {
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm
  const { pools } = usePoolsWithVault()
  const kazamaPool = useMemo(() => pools.find((pool) => pool.userData && pool.sousId === 0), [pools])

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {isSmallerThanXl ? (
        <IfoPoolVaultCardMobile pool={kazamaPool} />
      ) : (
        <KazamaVaultCard pool={kazamaPool} showStakedOnly={false} showIKazama />
      )}
      <IfoVesting pool={kazamaPool} />
    </Flex>
  )
}

export default IfoPoolVaultCard
