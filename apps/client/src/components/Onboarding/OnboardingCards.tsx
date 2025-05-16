import styled, { useTheme } from 'styled-components'
import { Modals } from '../Modal'
import { useUser } from '../../hooks/api/useUser'

export const OnboardingCards = () => {
	const theme = useTheme()
	const user = useUser()

	const onboardingSelectionEvent = (type: string) => (
		<Container>
			<Title>Start using Notice</Title>
			<CardsWrapper>
				<Card
					style={{ borderColor: theme.colors.pink }}
					onClick={() => {
						onboardingSelectionEvent('ai')
						Modals.aiOnboarding.open()
					}}
				>
					<CardImage src="/assets/svg/ob_ai_icon.svg" />
					<CardTitle style={{ color: theme.colors.pink }}>Create with our AI</CardTitle>
					<CardDescription>
						Enter your website and let Notice AI create a ready-to-publish FAQ or article for you
					</CardDescription>
				</Card>
				<Card
					onClick={() => {
						onboardingSelectionEvent('template')
						Modals.projectSelector.open()
					}}
				>
					<CardImage src="/assets/svg/ob_template_icon.svg" />
					<CardTitle>Choose a Template</CardTitle>
					<CardDescription>
						Discover our list of pre-filled templates for a quick start or begin with a blank page
					</CardDescription>
				</Card>
			</CardsWrapper>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 48px;
`

const Title = styled.h1`
	font-size: 48px;
	display: inline;
	margin-bottom: 32px;
	color: ${({ theme }) => theme.colors.primary};
`

const CardsWrapper = styled.div`
	display: flex;
	gap: 16px;
	user-select: none;
`

const Card = styled.div`
	max-width: 275px;
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 16px;
	text-align: center;

	transition: border-color 0.2s ease, background-color 0.2s ease;

	cursor: pointer;
	&:hover {
		border-color: ${({ theme }) => theme.colors.primary} !important;
		background-color: ${({ theme }) => theme.colors.primaryExtraLight};
	}
`

const CardImage = styled.img`
	width: 64px;
	height: 64px;
`

const CardTitle = styled.h2`
	margin-bottom: 6px;
`

const CardDescription = styled.p``
