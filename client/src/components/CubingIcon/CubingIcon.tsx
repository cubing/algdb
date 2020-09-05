import React from 'react'
import { Box, Icon, BoxProps } from '@chakra-ui/core'
import classNames from 'classnames'
import { activityKey } from '../../constants/events'

interface Props extends BoxProps {
  event: keyof typeof activityKey
}

export default function CubingIcon({ event, className, ...props }: Props) {
  return (
    <Box
      className={classNames(`cubing-icon`, `event-${event}`, className)}
      {...props}
    />
  )
}
