import styled from 'styled-components'
import { Button, ButtonProps, ConnectWalletIcon } from '@kazamaswap/uikit'
import { useWallet } from 'hooks/useWallet'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import Trans from './Trans'

const ConnectButton = styled(Button)`
position: relative;
background: #1b2031;
box-sizing: border-box;
font-size: 15px;
border-radius: 13px;
height: 2.75rem;
transition: all .2s ease-in-out;
width: 100%;
`

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const handleActive = useActiveHandle()
  const { onPresentConnectModal } = useWallet()

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      onPresentConnectModal()
    }
  }

  return (
    <ConnectButton onClick={handleClick} {...props}>
       Connect Wallet
    </ConnectButton>
  )
}

export default ConnectWalletButton
