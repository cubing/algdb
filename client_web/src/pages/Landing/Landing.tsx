import React, { ReactElement } from 'react'
import {
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Box,
  VStack,
} from '@chakra-ui/react'
import LandingCube from './LandingCube'
import Search from '../../components/Search/Search'
import Trending from './Trending'
import New from './New'

export default function Landing(): ReactElement {
  const color = useColorModeValue('pink.800', 'pink.100')
  return (
    <Box>
      <Flex
        justify="center"
        alignContent="center"
        alignItems="center"
        direction="column"
      >
        <Box display="grid" gridTemplate="1fr / 1fr" placeItems="center">
          <LandingCube />
          <Box
            gridColumn="1 / 1"
            gridRow="1 / 1"
            zIndex={2}
            transform="translateX(-50%)"
          >
            <Heading fontSize="4em" textAlign="center" color={color}>
              AlgDB
            </Heading>
            <Text fontSize="md" textAlign="center" color={color}>
              The Ultimate Cubing Database
            </Text>
          </Box>
        </Box>
        <Search />
      </Flex>
      <VStack spacing={4} align="center">
        <Trending />
        <New />
      </VStack>
    </Box>
  )
}
