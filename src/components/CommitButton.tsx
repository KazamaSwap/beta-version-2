import styled from 'styled-components'
import { Button, ButtonProps } from '@kazamaswap/uikit'
import { useSwitchNetworkLoading } from 'hooks/useSwitchNetworkLoading'
import { useSetAtom } from 'jotai'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { hideWrongNetworkModalAtom } from './NetworkModal'
import Trans from './Trans'

export const KazamaTextButton = styled(Button)`
color: #fff;
font-weight: 600;
font-size: 14px;
`

const wrongNetworkProps: ButtonProps = {
  variant: 'warning',
  disabled: false,
  children: <Trans>Wrong Network</Trans>,
}

export const CommitButton = (props: ButtonProps) => {
  const { isWrongNetwork } = useActiveChainId()
  const [switchNetworkLoading] = useSwitchNetworkLoading()
  const setHideWrongNetwork = useSetAtom(hideWrongNetworkModalAtom)

  return (
    <KazamaTextButton
      {...props}
      onClick={(e) => {
        if (isWrongNetwork) {
          setHideWrongNetwork(false)
        } else {
          props.onClick?.(e)
        }
      }}
      {...(switchNetworkLoading && { disabled: true })}
      {...(isWrongNetwork && wrongNetworkProps)}
    />
  )
}
