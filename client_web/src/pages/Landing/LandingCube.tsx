import React, { ReactElement } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { parse } from 'cubing/alg'
import { useColorModeValue, Box } from '@chakra-ui/react'
import TransparentTwisty from '../../components/TwistyPlayers/Transparent'

export default function LandingCube(): ReactElement {
  const [twisty, setTwisty] = React.useState<TwistyPlayer>()
  const opacity = useColorModeValue('0.3', '0.1')

  React.useEffect(() => {
    function actionListener(action: any) {
      if (action.locationType === 'End' && twisty) {
        twisty.timeline.setTimestamp(twisty.timeline.minTimestamp())
        twisty.timeline.play()
      }
    }
    const timelineListener = {
      onTimelineAction: actionListener,
    }

    if (twisty) {
      twisty.alg = parse("(R U R' U')5")
      twisty.timeline.play()
      twisty.timeline.addActionListener(timelineListener)
    }
    return () =>
      twisty && twisty.timeline.removeActionListener(timelineListener)
  }, [twisty])

  const onTwistyInit = (tp: TwistyPlayer) => setTwisty(tp)

  return (
    <Box
      as={TransparentTwisty}
      height="25vh"
      width="100vw"
      margin="auto"
      opacity={opacity}
      zIndex="-1"
      onTwistyInit={onTwistyInit}
      controls="none"
      visualization="PG3D"
      background="none"
      gridColumn="1 / 1"
      gridRow="1 / 1"
    />
  )
}
