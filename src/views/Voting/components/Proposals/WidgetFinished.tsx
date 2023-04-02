import { Box, Breadcrumbs, Card, Flex, Heading, Text } from '@kazamaswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@kazamaswap/localization'
import Container from 'components/Layout/Container'
import useSWR from 'swr'
import { ProposalState, ProposalType } from 'state/types'
import { getProposals } from 'state/voting/helpers'
import { FetchStatus } from 'config/constants/types'
import { useSessionStorage } from 'hooks/useSessionStorage'
import { filterProposalsByState, filterProposalsByType } from '../../helpers'
import WidgetLoading from './WidgetLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'
import Filters from './Filters'

const WidgetFinished = () => {
  const { t } = useTranslation()
  const proposalType = ProposalType.ALL
  const filterState = ProposalState.CLOSED

  const { status, data } = useSWR(['proposals', filterState], async () => getProposals(1000, 0, filterState))
  const filteredProposals = filterProposalsByState(filterProposalsByType(data, proposalType), filterState)

  return (
      <Card>
        {/* <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} /> */}
        {/* <Filters
          filterState={filterState}
          onFilterChange={handleFilterChange}
          isLoading={status !== FetchStatus.Fetched}
        /> */}
        {status !== FetchStatus.Fetched && <WidgetLoading />}
        {status === FetchStatus.Fetched &&
          filteredProposals.length > 0 &&
          filteredProposals.map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {status === FetchStatus.Fetched && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No proposals found')}</Heading>
          </Flex>
        )}
      </Card>
  )
}

export default WidgetFinished
