import styled from 'styled-components'
import { Card } from '@kazamaswap/uikit'

export const BodyWrapper = styled(Card)`
max-width: 455px;
width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBodyLiq({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
