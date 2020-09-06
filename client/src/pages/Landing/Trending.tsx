import React, { ReactElement } from 'react'
import { Skeleton, Box, Flex } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { QueryGetMultipleUserAlgTagLinkArgs } from '../../generated/jql'
import AlgTag from '../../components/Tags/AlgTag'

const query = {
  paginatorInfo: {
    total: null,
    count: null,
  },
  data: {
    id: null,
    alg: {
      sequence: null,
    },
  },
  __args: {
    id: 'trending',
  },
}

export default function Trending(): ReactElement {
  const { isLoading, data: algs } = useJqlQuery<
    QueryGetMultipleUserAlgTagLinkArgs,
    Error
  >('landing-trending', 'getMultipleUserAlgTagLink', query, {
    refetchOnWindowFocus: false,
  })

  return (
    <Flex direction="column" m={2}>
      <AlgTag label="Trending" size="lg" />
      <Skeleton isLoaded={!isLoading}>
        <Box p={2} width="75vw">
          trending algs
        </Box>
      </Skeleton>
    </Flex>
  )
}
