import { Box, BoxProps } from '@kazamaswap/uikit'

const TransactionContainer: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={['16px', '24px']} mx="auto" maxWidth="1300px" {...props}>
    {children}
  </Box>
)

export default TransactionContainer
