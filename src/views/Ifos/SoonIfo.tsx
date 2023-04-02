import { bscTokens, bscTestnetTokens } from '@kazamaswap/tokens'
import IfoContainer from './components/IfoContainer'
import IfoSteps from './components/IfoSteps'
import ComingSoonSection from './components/ComingSoonSection'

const SoonIfo = () => (
  <IfoContainer
    ifoSection={<ComingSoonSection />}
    ifoSteps={
      <IfoSteps isLive={false} hasClaimed={false} isCommitted={false} ifoCurrencyAddress={bscTestnetTokens.kazama.address} />
    }
  />
)

export default SoonIfo
