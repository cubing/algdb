import React, { ReactElement } from 'react'
import { Subset, Maybe } from '../../generated/schema'
import { Link } from 'react-router-dom'
import { VISUALIZATION } from '../../constants/jql'

import {
  Box,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Heading,
  HStack,
  Flex,
} from '@chakra-ui/react'
import TransparentTwisty from '../../components/TwistyPlayers/Transparent'

interface Props {
  subsets: Subset[]
}

export default function SubsetRow({ subsets }: Props): ReactElement {
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <Accordion allowToggle defaultIndex={0} onChange={() => setIsOpen(!isOpen)}>
      <AccordionItem defaultIsOpen>
        <AccordionButton>
          <Box flex="1" textAlign={isOpen ? 'center' : 'right'}>
            Subsets
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb="1" px="0">
          <HStack spacing={4} w="100vw" overflow="auto">
            {subsets.map((subset) => (
              <Flex
                as={Link}
                p={5}
                mx={2}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                to={`/puzzle/${subset.puzzle.code}/algset/${subset.code}`}
                alignContent="center"
                justify="center"
                direction="column"
                key={subset.id}
              >
                <Heading
                  _hover={{ textDecoration: 'underline' }}
                  fontSize="l"
                  textAlign="center"
                >
                  {subset.name}
                </Heading>
                <Box
                  as={TransparentTwisty}
                  puzzle={subset.puzzle.name as any}
                  controls="none"
                  pointerEvents="none"
                  m="auto"
                  w="4em"
                  h="4em"
                  // @ts-ignore
                  visualization={VISUALIZATION[subset.visualization]}
                />
              </Flex>
            ))}
          </HStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
