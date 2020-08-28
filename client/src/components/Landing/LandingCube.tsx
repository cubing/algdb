import React, { ReactElement } from 'react'
import { TwistyPlayer } from 'react-cubing'
import { TwistyPlayer as TP } from 'cubing/twisty'
import { parse } from 'cubing/alg'
import { useColorModeValue, Box } from '@chakra-ui/core'

export default function LandingCube(): ReactElement {
	const [twisty, setTwisty] = React.useState<TP>()
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
			twisty.alg = parse(
				"R U R' U' R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'"
			)
			twisty.timeline.play()
			twisty.timeline.addActionListener(timelineListener)
		}
		return () =>
			twisty && twisty.timeline.removeActionListener(timelineListener)
	}, [twisty])

	const onTwistyInit = (tp: TP) => setTwisty(tp)

	return (
		<Box
			as={TwistyPlayer}
			height='50vh'
			width='100vw'
			margin='auto'
			opacity={opacity}
			zIndex='-1'
			background='none'
			onTwistyInit={onTwistyInit}
			controls='none'
			visualization='PG3D'
		/>
	)
}
