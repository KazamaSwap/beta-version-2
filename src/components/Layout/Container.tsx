import { Box, BoxProps } from '@kazamaswap/uikit'

const Container: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={['16px', '24px']} mx="auto" maxWidth="1225px" {...props}>
    {children}
  </Box>
)

export default Container
