import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Navigation from './Navigation'
import JqlProvider from '../../providers/JqlProvider'
import UserProvider from '../../providers/UserProvider'
import { SERVER_URI } from '../../config'

const queryCache = new QueryCache()

const App = () => (
  <ChakraProvider theme={theme}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <JqlProvider serverUrl={SERVER_URI}>
        <UserProvider>
          <Router>
            <Header />
            <Navigation />
            <Footer />
          </Router>
        </UserProvider>
      </JqlProvider>
    </ReactQueryCacheProvider>
  </ChakraProvider>
)

export default App
