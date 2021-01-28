import * as React from 'react'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Navigation from './Navigation'
import JqlProvider from '../../providers/JqlProvider'
import UserProvider from '../../providers/UserProvider'
import { SERVER_URI } from '../../config'

const App = () => (
  <ChakraProvider>
    <JqlProvider serverUrl={SERVER_URI}>
      <UserProvider>
        <Router>
          <CSSReset />
          <Header />
          <Navigation />
          <Footer />
        </Router>
      </UserProvider>
    </JqlProvider>
  </ChakraProvider>
)

export default App
