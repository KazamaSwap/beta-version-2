import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import { kazamaSenshisAddress } from '../../constants'
import IndividualKazamaSenshiPage from './KazamaSenshiPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  // For KazamaSenshis tokenId in url is really senshiId
  const { collectionAddress, tokenId } = router.query

  if (router.isFallback) {
    return <PageLoader />
  }

  const isKSCollection = String(collectionAddress).toLowerCase() === kazamaSenshisAddress.toLowerCase()
  if (isKSCollection) {
    return <IndividualKazamaSenshiPage senshiId={String(tokenId)} />
  }

  return <IndividualNFTPage collectionAddress={String(collectionAddress)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
