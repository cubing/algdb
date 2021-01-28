import React, { ReactElement } from 'react'
import {
  Tag,
  TagProps,
  TagLabel,
  TagCloseButton,
  TagLabelProps,
} from '@chakra-ui/react'
import CubingIcon from '../CubingIcon/CubingIcon'

interface Props extends TagProps {
  labelProps?: TagLabelProps
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  closeButton?: boolean
  label: string
  eventId: string
}
export default function PuzzleTag({
  labelProps,
  label,
  closeButton = false,
  eventId,
  onClose,
  ...props
}: Props): ReactElement {
  return (
    <Tag colorScheme="orange" size="lg" {...props}>
      <CubingIcon event={eventId as any} ml={-1} mr={2} />
      <TagLabel {...labelProps}>{label}</TagLabel>
      {closeButton && <TagCloseButton onClick={onClose} />}
    </Tag>
  )
}

PuzzleTag.defaultProps = {
  labelProps: {},
  onClose: () => {},
  closeButton: false,
}
