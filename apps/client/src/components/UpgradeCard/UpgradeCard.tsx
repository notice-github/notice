import { darken } from 'polished'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Pages } from '../../pages'
import { Column, Row } from '../Flex'
import { FloatingRocket } from './FloatingRocket'
import { useT } from '../../hooks/useT'

export const UpgradeCard = () => {
	const [t] = useT()
	const theme = useTheme()
	const navigate = useNavigate()

	return (
		<StickyContainer>
			<Column gap={6}>
				<Row gap={8} justify="start" align="start">
					{/* <RoundIconContainer>
							<RocketLaunch size={16} color={theme.colors.white} />
						</RoundIconContainer> */}
					<FloatingRocket />

					<Column gap={4}>
						<Title>Unleash Notice!!!</Title>
						<Description>create like never before.</Description>
					</Column>
				</Row>
				<UpgradeButton onClick={() => navigate(Pages.SETTINGS_SUBSCRIPTION)}>{t('Upgrade', 'upgrade')}</UpgradeButton>
			</Column>
		</StickyContainer>
	)
}

export const StickyContainer = styled.div`
	position: fixed;
	top: 60px;
	right: 4px;
	background-color: ${({ theme }) => theme.colors.white};
	padding: 8px;

	border-radius: 4px;

	width: 200px;
	height: fit-content;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	user-select: none;
`

const RoundIconContainer = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;

	display: flex;
	justify-content: center;
	align-items: center;

	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: bgGrad 8s ease infinite;

	@keyframes bgGrad {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes bouncing {
		0% {
			transform: translate3d(0px, 0px, 0);
		}
		50% {
			transform: translate3d(2px, 0px, 2px);
		}
		100% {
			transform: translate3d(0px, 0px, 0);
		}
	}
`

const Title = styled.div`
	font-size: 14px;
	font-weight: 600;

	color: ${({ theme }) => darken(0.2, theme.colors.sweetpink)};
`

const Description = styled.div`
	font-size: 12px;
	font-weight: 6400;

	color: ${({ theme }) => theme.colors.twilightGrey};
`

const UpgradeButton = styled.button`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 4px;

	height: fit-content;
	width: 100%;
	font-weight: 600;
	letter-spacing: 1px;

	padding: 6px 12px;
	cursor: pointer;

	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;

	border: none;
	border-radius: 4px;
	color: white;
	text-decoration: none;
	margin: auto;
`
