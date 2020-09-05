import React, { ReactElement } from 'react'
import CubingIcon from '../CubingIcon/CubingIcon'
import AlgTag from '../Tags/AlgTag'
import PuzzleTag from '../Tags/PuzzleTag'

export default function Search(): ReactElement {
  return (
    <div>
      <AlgTag label="use" />
      <PuzzleTag label="3x3x3" eventId="333" />
    </div>
  )
}
