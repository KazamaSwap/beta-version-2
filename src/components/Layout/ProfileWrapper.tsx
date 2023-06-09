import styled from 'styled-components'
import Container from './Container'

const StyledPage = styled(Container)`
  padding-top: 16px;
  padding-bottom: 16px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
}

const ProfileWrapper: React.FC<React.PropsWithChildren<PageProps>> = ({ children, symbol, ...props }) => {
  return (
    <>
      <StyledPage {...props}>
        {children}
      </StyledPage>
    </>
  )
}

export default ProfileWrapper
