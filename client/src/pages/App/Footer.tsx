import React, { ReactElement } from 'react'
import {
  Flex,
  useColorModeValue,
  Text,
  Link,
  IconButton,
  Box,
} from '@chakra-ui/react'
import { AiFillGithub } from 'react-icons/ai'
import { FaDiscord } from 'react-icons/fa'

const GitHubIcon = <Box as={AiFillGithub} />
const DiscordIcon = <Box as={FaDiscord} />

export default function Footer(): ReactElement {
  const footer = useColorModeValue('gray.100', 'gray.900')
  return (
    <>
      <Box width="100%" height="40px" />
      <Flex
        as="footer"
        position="absolute"
        bottom={0}
        width="100%"
        height="40px"
        justify="space-between"
        backgroundColor={footer}
      >
        <Flex justify="space-around">
          <Text mr={2}>
            {`Made possible by `}
            <Link href="https://thecubicle.com">TheCubicle</Link>
          </Text>
        </Flex>
        <Flex justify="space-between">
          <IconButton
            variant="gohst"
            fontSize="16px"
            icon={GitHubIcon}
            title="Github"
            onClick={() => {
              window.location.href = 'https://github.com/cubing/algdb'
            }}
            aria-label="Github"
          />
          <IconButton
            variant="ghost"
            fontSize="16px"
            icon={DiscordIcon}
            title="Discord"
            aria-label="Discord"
            onClick={() => {
              window.location.href = ''
            }}
          />
        </Flex>
      </Flex>
    </>
  )
}
