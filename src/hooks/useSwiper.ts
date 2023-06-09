import { useContext } from 'react'
import { useTranslation } from '@kazamaswap/localization'
import { SwiperContext } from '../contexts/SwiperProvider'

const useSwiper = () => {
  const swiperContext = useContext(SwiperContext)
  const { t } = useTranslation()

  if (swiperContext === undefined) {
    throw new Error(t('Swiper not found'))
  }

  return swiperContext
}

export default useSwiper