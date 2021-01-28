import React, { ReactElement } from 'react'
import { TwistyPlayer, TwistyPlayerConfig } from 'react-cubing'

interface Props extends TwistyPlayerConfig {}

const TransparentTwistyPlayer = ({ ...props }: Props): ReactElement => (
  <TwistyPlayer {...props} background="none" />
)
export default TransparentTwistyPlayer
