import * as React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    {children}
  </ChakraProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

AllProviders.defaultProps = {
  children: {},
}

export { customRender as render }
