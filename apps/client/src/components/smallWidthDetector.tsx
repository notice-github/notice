import { useState } from 'react'
import { InfoBanner } from './InfoBanner'
import { useTheme } from 'styled-components'

export const SmallWidthDetector = () => {
	const localStoredValue = localStorage.getItem('mobile_warning_closed')
	const [hidden, setHidden] = useState(localStoredValue != null)
	const theme = useTheme()

	return window?.innerWidth < 900 && !hidden ? (
		<InfoBanner
			background={theme.colors.primary}
			textColor="#ffffff"
			content="Notice editor may not work well on narrow screens; use a wider screen for a better experience"
			isClosable
			onClose={() => {
				localStorage.setItem('mobile_warning_closed', 'true')
				setHidden(true)
			}}
			position="static"
		></InfoBanner>
	) : (
		<></>
	)
}
