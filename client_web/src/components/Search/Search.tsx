import React, { ReactElement } from 'react'

import { Box } from '@chakra-ui/react'
import CubingIcon from '../CubingIcon/CubingIcon'
import AlgTag from '../Tags/AlgTag'
import PuzzleTag from '../Tags/PuzzleTag'
import SearchBar from './SearchBar'

export default function Search(): ReactElement {
  return (
    <Box w="100vw">
      <SearchBar />
    </Box>
  )
}
