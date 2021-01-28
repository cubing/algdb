import React from 'react'
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  FlexProps,
  useColorModeValue,
} from '@chakra-ui/react'
import { useHistory, Link } from 'react-router-dom'
import ColorModeSwitcher from '../../components/ColorModeSwitcher/ColorModeSwitcher'
import useUser from '../../hooks/useUser'

const MenuItem = ({ children }: React.PropsWithChildren<{}>) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
)

interface Props extends FlexProps {}

const Header = (props: Props) => {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  const fill = useColorModeValue('black', 'white')
  const header = useColorModeValue('gray.100', 'gray.900')
  const border = useColorModeValue('gray.900', 'gray.100')
  const history = useHistory()
  const { signIn, isLoggedIn, signOut, userInfo } = useUser()
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="0.7rem"
      backgroundColor={header}
      color={fill}
      borderBottom="1px"
      borderColor={border}
      shadow="md"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as={Link} to="/" size="lg" letterSpacing="-.1rem">
          AlgDB
        </Heading>
      </Flex>

      <Box display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
        <svg
          fill={fill}
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ xs: show ? 'block' : 'none', md: 'flex' }}
        flexDirection={{ default: 'inherit', md: 'row' }}
        width={{ xs: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItem>
          <Text as={Link} to="/puzzles" fontWeight="bold" letterSpacing="wide">
            Puzzles
          </Text>
        </MenuItem>
        <MenuItem>
          <Text as={Link} to="/users" fontWeight="bold" letterSpacing="wide">
            Users
          </Text>
        </MenuItem>
        {isLoggedIn() && userInfo?.role?.name === 'ADMIN' && (
          <MenuItem>
            <Text as={Link} to="/admin" fontWeight="bold" letterSpacing="wide">
              Admin
            </Text>
          </MenuItem>
        )}
      </Box>
      <Flex justify="space-around">
        <Box
          display={{ xs: show ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          <Button
            bg="transparent"
            border="1px"
            onClick={() => (isLoggedIn() ? signOut() : signIn())}
          >
            {isLoggedIn() ? 'Sign Out' : 'Sign In'}
          </Button>
        </Box>
        <ColorModeSwitcher
          display={{ xs: show ? 'flex' : 'none', md: 'flex' }}
        />
      </Flex>
    </Flex>
  )
}

export default Header
