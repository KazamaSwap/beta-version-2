import { useEffect, useState } from 'react'
import { Flex, useTooltip } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import CountdownCircle from './CountdownCircle'

const UpdateIndicator: React.FC<React.PropsWithChildren<{ isFetchingKazamaSenshis: boolean }>> = ({
  isFetchingKazamaSenshis,
}) => {
  const { t } = useTranslation()
  const [secondsRemaining, setSecondsRemaining] = useState(10)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Items in the table update every 10 seconds'), {
    placement: 'auto',
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!isFetchingKazamaSenshis) {
      setSecondsRemaining(10)
    }
  }, [isFetchingKazamaSenshis])

  return (
    <Flex justifyContent="center" ref={targetRef}>
      <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={isFetchingKazamaSenshis} />
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default UpdateIndicator
