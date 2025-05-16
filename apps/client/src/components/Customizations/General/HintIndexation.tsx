import styled, { useTheme } from 'styled-components'
import Cross from '../../../icons/Cross'
import { useState } from 'react'
import { SearchIcon } from '../../../icons'
import { Modals } from '../../Modal'
import { useT } from '../../../hooks/useT'

export function HintIndexation() {
	const [closed, setClosed] = useState(localStorage.getItem('indexation_helper_hidden') === 'true')
	const [t] = useT()

	const closeModal = () => {
		localStorage.setItem('indexation_helper_hidden', 'true')
		setClosed(true)
	}
	if (closed) return null

	const theme = useTheme()
	return (
		<Container>
			<Header>
				<h3>{t('Tell Google your project exists', 'tellGoogleExists')}</h3>
				<CrossContainer onClick={closeModal}>
					<Cross color={theme.colors.greyLight} size={16} />
				</CrossContainer>
			</Header>
			<div>
				{t('To properly index your project, you need to verify your website on', 'tellGoogleExistsDescription')}{' '}
				<b>Google Search Console</b>.{' '}
			</div>
			<FollowGuideLink onClick={() => Modals.googleIndexationGuide.open()}>
				👉 {t('Click here to follow our guide', 'clickHereToFollowOurGuide')} 👈
			</FollowGuideLink>
		</Container>
	)
}

const CrossContainer = styled.div`
	bottom: 4px;
	position: relative;
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
	margin-bottom: -8px;
`

const Header = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
`

const FollowGuideLink = styled.span`
	cursor: pointer;
	:hover {
		text-decoration: underline;
	}
	color: ${({ theme }) => theme.colors.primary};
`

const Container = styled.div`
	position: relative;
	gap: 8px;
	display: flex;
	flex-direction: column;
	padding: 12px;
	background-color: #81f3dc1d;
	border: 1px solid ${({ theme }) => theme.colors.spray};
	border-radius: 8px;
	margin-bottom: 16px;
`
