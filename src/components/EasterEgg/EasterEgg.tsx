import { useState, useCallback, memo } from 'react'
import { FallingSenshisProps, useKonamiCheatCode } from '@kazamaswap/uikit'
import dynamic from 'next/dynamic'

const FallingSenshis = dynamic<FallingSenshisProps>(
  () => import('@kazamaswap/uikit').then((mod) => mod.FallingSenshis),
  { ssr: false },
)

const EasterEgg: React.FC<React.PropsWithChildren<FallingSenshisProps>> = (props) => {
  const [show, setShow] = useState(false)
  const startFalling = useCallback(() => setShow(true), [setShow])
  useKonamiCheatCode(startFalling)

  if (show) {
    return (
      <div onAnimationEnd={() => setShow(false)}>
        <FallingSenshis {...props} />
      </div>
    )
  }
  return null
}

export default memo(EasterEgg)
