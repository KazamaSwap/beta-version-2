import { HistoryIcon, useModal, IconButton } from '@kazamaswap/uikit'
import styled from 'styled-components'
import TransactionsModal from './TransactionsModal'

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
    height: 45px;
    border-radius: 10px;
    padding-left: 8px;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
    margin-left: 10px;
`

const TransactionButton = styled(IconButton)`
background: transparent;
`

const StyledHistory = styled(HistoryIcon)`
:hover {
  cursor: pointer;
  fill: #93acd3 !important;
}
`

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
    <IconWrapper>
      <TransactionButton scale="sm" variant="text" onClick={onPresentTransactionsModal}>
        <StyledHistory color="textSubtle" width="24px" />
      </TransactionButton>
      </IconWrapper>
    </>
  )
}

export default Transactions
