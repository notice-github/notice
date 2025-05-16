import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { useT } from '../../../hooks/useT'
import { RocketLaunch } from '../../../icons/RocketLaunch'
import { Pages } from '../../../pages'

interface Props {
	daysLeft: number
}

export const FreeTrialBanner = ({ daysLeft }: Props) => {
	const [t] = useT()
	const navigate = useNavigate()
	const theme = useTheme()

	return (
		<Container>
			<Text>Your free trial will end in {daysLeft} days</Text>
			<UpgradeWrapper onClick={() => navigate(Pages.SETTINGS_SUBSCRIPTION)}>
				<RocketLaunch color={theme.colors.pink} size={16} />
				<UpgradeText>{t('Upgrade', 'upgrade')}</UpgradeText>
			</UpgradeWrapper>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 4px 8px;
	color: #bd7a23;
	background-color: #fbe8ad;
`

const Text = styled.span``

const UpgradeWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	gap: 6px;
	cursor: pointer;
`

const UpgradeText = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.pink};
`
