import { Currency, Percent, Price } from '@kazamaswap/sdk'
import { Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { ONE_BIPS } from 'config/constants/exchange'
import { AutoColumn } from '../../components/Layout/Column'
import { AutoRow } from '../../components/Layout/Row'
import { Field } from '../../state/mint/actions'

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price<Currency, Currency>
}) {
  const { t } = useTranslation()
  return (
        <>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <Text fontSize="12px">{price?.toSignificant(6) ?? '-'}</Text>
      </div>
      <div>
        <Text fontSize="12px" ml="3px">
          {t('%assetA% per %assetB%', {
            assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
            assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
          })}
        </Text>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "row" }}>
    <div>
    <Text fontSize="12px">{price?.invert()?.toSignificant(6) ?? '-'}</Text>
    </div>
    <div>
        <Text fontSize="12px" ml="3px">
          {t('%assetA% per %assetB%', {
            assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
            assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
          })}
        </Text>
    </div>
    </div>
        </div>
        <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
          <Text fontSize="12px">
        {t('Share of Pool')}
      </Text>
          </div>
          <div>
          <Text fontSize="12px" textAlign="right">
        {noLiquidity && price
          ? '100'
          : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
        %
      </Text>
          </div>
        </div>
      </div>
      </div>
</>
  )
}

export default PoolPriceBar
