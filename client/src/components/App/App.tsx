import * as React from 'react'
import { ChakraProvider, CSSReset } from '@chakra-ui/core'
import theme from '@chakra-ui/theme'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Navigation from '../Navigation/Navigation'
import { BrowserRouter as Router } from 'react-router-dom'
import JqlProvider from '../../providers/JqlProvider'
import UserProvider from '../../providers/UserProvider'
import { SERVER_URI } from '../../config'

const App = () => (
	<ChakraProvider theme={theme}>
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
