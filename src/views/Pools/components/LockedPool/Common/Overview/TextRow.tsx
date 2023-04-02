import { Text, Flex } from '@kazamaswap/uikit'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import CrossText from './CrossText'

interface DiffTextPropsType {
  value: string
  newValue?: string
}

const DiffText: React.FC<React.PropsWithChildren<DiffTextPropsType>> = ({ value, newValue }) => {
  if (isUndefinedOrNull(newValue) || isUndefinedOrNull(value) || value === newValue) {
    return (
      <Text bold fontSize="16px">
        {value || '-'}
      </Text>
    )
  }

  return (
    <>
      <CrossText bold fontSize="16px" mr="4px">
        {value}
      </CrossText>
      <Text color="text">
      +
      </Text>
      <Text bold color="text" ml="4px" fontSize="16px">
        {newValue}
      </Text>
    </>
  )
}

interface TextRowPropsType extends DiffTextPropsType {
  title: string
}

const TextRow: React.FC<React.PropsWithChildren<TextRowPropsType>> = ({ title, value, newValue }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffText value={value} newValue={newValue} />
    </Flex>
  </Flex>
)

export default TextRow
