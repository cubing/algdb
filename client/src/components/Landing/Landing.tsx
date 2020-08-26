import React, { ReactElement } from 'react'
import LandingCube from './LandingCube'
import { Flex, Heading, Text, useColorModeValue, Box } from '@chakra-ui/core'
export default function Landing(): ReactElement {
	const color = useColorModeValue('pink.800', 'pink.100')
	return (
		<Flex justify='center' alignContent='center' direction='column'>
			<LandingCube />
			<Box position='absolute' left='50vw' transform='translateX(-50%)'>
				<Heading as='h1' textAlign='center' color={color}>
					AlgDB
				</Heading>
				<Text fontSize='md' textAlign='center' color={color}>
					The Ultimate Cubing Database
				</Text>
			</Box>
		</Flex>
	)
}
