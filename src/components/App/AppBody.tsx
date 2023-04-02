import styled from 'styled-components'
import { KazamaFrontCard } from '@kazamaswap/uikit'

export const BodyWrapper = styled(KazamaFrontCard)`
  max-width: 432px;
  width: 100%;
  z-index: 1;
  border-radius: 16px;
  height: 100%;
  background: #141824;
  border-bottom: 2px solid rgba(0, 0, 0, 0.35);
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
