import React, { ReactElement } from 'react'
import { Flex, Heading, Text, useColorModeValue, Box } from '@chakra-ui/core'
import LandingCube from './LandingCube'

export default function Landing(): ReactElement {
	const color = useColorModeValue('pink.800', 'pink.100')
	return (
  <Flex justify='center' alignContent='center' direction='column'>
    <LandingCube />
    <Box position='absolute' left='50vw' transform='translateX(-50%)'>
      <Heading fontSize='4em' textAlign='center' color={color}>
        AlgDB
      </Heading>
      <Text fontSize='md' textAlign='center' color={color}>
        The Ultimate Cubing Database
      </Text>
    </Box>
  </Flex>
	)
}
