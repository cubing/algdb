import * as React from 'react'
import { ChakraProvider, CSSReset } from '@chakra-ui/core'
import theme from '@chakra-ui/theme'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Navigation from '../Navigation/Navigation'
import { BrowserRouter as Router } from 'react-router-dom'

const App = () => (
	<ChakraProvider theme={theme}>
		<Router>
			<CSSReset />
			<Header />
			<Navigation />
			<Footer />
		</Router>
	</ChakraProvider>
)

export default App
