import React, { ReactElement } from 'react'
import { TwistyPlayer } from 'react-cubing'
import { TwistyPlayer as TP } from 'cubing/twisty'
import { parse } from 'cubing/alg'
// @ts-ignore
import { css, cx } from 'emotion'
import { useColorModeValue } from '@chakra-ui/core'
const styles = (props: { opacity: string }) => css`
	height: 50vh;
	width: 100vw;
	margin: auto;
	opacity: ${props.opacity};
	z-index: -1;
`

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
		<TwistyPlayer
			className={styles({ opacity })}
			background='none'
			onTwistyInit={onTwistyInit}
			controls='none'
			visualization='PG3D'
		/>
	)
}
