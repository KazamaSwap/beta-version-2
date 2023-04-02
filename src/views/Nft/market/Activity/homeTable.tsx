import { Card, Heading } from '@kazamaswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { useTranslation } from '@kazamaswap/localization'
import ActivityHistory from '../ActivityHistory/ActivityHistory'

const NftHistoryTable = styled(Card)`
background: #292334;
`

const NftHomeTable = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        {/* <Heading as="h1" color="secondary" data-test="nft-activity-title">
          {t('Activity')}
        </Heading> */}
      </PageHeader>
        <Card>
          <ActivityHistory />
        </Card>
    </>
  )
}

export default NftHomeTable
