import styled from 'styled-components'
// import { useProject } from '../../hooks/useProject'
// import { usePreferences } from '../../providers/PreferencesProvider'
// import { maxSizeImage } from '../../utils/image'

export default function RedirectLogo() {
	// const topLevelBlock = useProject()
	// const preferences = usePreferences()

	// if (!topLevelBlock) return <></>
	// const { logo } = topLevelBlock.metadata || {}

	// if (!logo || !preferences?.displayLogo) return <></>

	return (
		<Wrapper>
			<Placeholder />
			{/* <StyledImg
			src={maxSizeImage(logo, 256)}
			onClick={() => (preferences.websiteUrl ? window.location.assign(preferences.websiteUrl) : null)}
			className="notice-banner__logo"
			alt=""
			/> */}
		</Wrapper>
	)
}

const Placeholder = styled.div`
	height: 32px;
	width: 32px;
	background-color: ${({ theme }) => theme.colors.sweetpink};
	border-radius: 8px;
`

const StyledImg = styled.img`
	margin: 0px;
	padding: 5px;
	width: 40px;
	height: 40px;
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`

const Wrapper = styled.div`
	display: flex;
	justify-content: flex-start;
`
