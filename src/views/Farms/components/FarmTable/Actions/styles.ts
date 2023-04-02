import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  border: 0px solid rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  background: #1b2031;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
    /* max-height: 130px; */
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
    /* max-height: 130px; */
  }
`

export const ActionTitles = styled.div`
  display: flex;
  margin-bottom: 8px;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
