import { Box, BoxProps } from '@kazamaswap/uikit'

const LotteryContainer: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={['16px', '24px']} mx="auto" maxWidth="1400px" {...props}>
    {children}
  </Box>
)

export default LotteryContainer
