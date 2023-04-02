import styled from 'styled-components'
import { Flex, IconButton, CogIcon, useModal } from '@kazamaswap/uikit'
import SettingsModal from './SettingsModal'

const IconWrapper = styled.div`
-webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #1b2031;
    box-shadow: inset 0px -2px 0px rgb(0 0 0 / 10%);
    cursor: pointer;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    height: 40px;
    border-radius: 10px;
    padding-left: 8px;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
    margin-left: 10px;
`

const CogButton = styled(IconButton)`
background: transparent;
`

const StyledCog = styled(CogIcon)`
:hover {
  cursor: pointer;
  fill: #93acd3 !important;
}
`

type Props = {
  color?: string
  mr?: string
  mode?: string
}

const SwapSettings = ({ color, mr = '8px', mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
      <CogButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}
      >
        <StyledCog width={20} color={color || 'textSubtle'} />
      </CogButton>
  )
}

export default SwapSettings
