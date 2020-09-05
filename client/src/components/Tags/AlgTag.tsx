import React, { ReactElement } from 'react'
import {
  Tag,
  TagProps,
  TagLabel,
  TagCloseButton,
  TagLabelProps,
} from '@chakra-ui/core'

interface Props extends TagProps {
  labelProps?: TagLabelProps
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  closeButton?: boolean
  prefix?: string
  label: string
}
export default function AlgTag({
  labelProps = {},
  label,
  closeButton = false,
  onClose = () => {},
  prefix = '#',
  ...props
}: Props): ReactElement {
  return (
    <Tag colorScheme="green" size="lg" {...props}>
      <TagLabel {...labelProps}>
        <b>{prefix}</b>
        {label}
      </TagLabel>
      {closeButton && <TagCloseButton onClick={onClose} />}
    </Tag>
  )
}

AlgTag.defaultProps = {
  labelProps: {},
  prefix: '#',
  closeButton: false,
  onClose: () => {},
}
