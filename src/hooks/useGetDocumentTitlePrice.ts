import { useEffect } from 'react'
import { useKazamaBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const kazamaPriceBusd = useKazamaBusdPrice()
  useEffect(() => {
    const kazamaPriceBusdString = kazamaPriceBusd ? kazamaPriceBusd.toFixed(4) : ''
    document.title = `KazamaSwap - ${kazamaPriceBusdString}`
  }, [kazamaPriceBusd])
}
export default useGetDocumentTitlePrice
