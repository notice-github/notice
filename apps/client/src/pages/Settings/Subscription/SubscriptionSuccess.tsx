import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Button } from '../../../components/Button'
import { Loader } from '../../../components/Loader'
import { useSubscription } from '../../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { CheckCircle } from '../../../icons'
import { Pages } from '../../../pages'
import { GTM } from '../../../utils/GTM'
import { useT } from '../../../hooks/useT'

export const SubscriptionSuccess = () => {
	const theme = useTheme()
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)
	const [t] = useT()

	useEffect(() => {
		if (!subscription.isFetching && (subscription.data?.type ?? 'free') === 'free') {
			navigate(Pages.EDITOR)
		}

		if (!subscription.isFetching && subscription.data?.billingCycle && (subscription.data?.type ?? 'free') !== 'free') {
			GTM.send({
				event: 'subscription',
				periodicity: subscription.data?.billingCycle,
				plan_name: subscription.data?.type,
			})
		}
	}, [subscription.data, subscription.isFetching])

	if (subscription.isFetching) {
		return (
			<Container>
				<Body>
					<Loader size={64} />
				</Body>
			</Container>
		)
	}

	return (
		<Container>
			<Head>
				<IconWrapper>
					<CheckCircle size={100} color={theme.colors.primary} />
				</IconWrapper>
				<Title>{t('Upgrade Successful', 'subPageUpgradeSucessTitle')}</Title>
			</Head>
			<Body>
				<Text>
					{t(
						'Congratulations! 🎉 Your account has been successfully upgraded. Thank you for choosing Notice to enhance yourexperience!',
						'subPageUpgradeSuccessMsg'
					)}
				</Text>
				<Button onClick={() => navigate(Pages.EDITOR)}>{t('Go back editing', 'subPageGoBack')}</Button>
			</Body>
		</Container>
	)
}

const Container = styled.div`
	min-width: 500px;
	padding: 32px;
`

const Head = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`

const IconWrapper = styled.div``

const Title = styled.h2`
	color: ${({ theme }) => theme.colors.primary};
	font-size: 32px;
`

const Body = styled.div`
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 30px;
`

const Text = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
	max-width: 450px;
	font-size: 14px;
`
