import styled, { useTheme } from 'styled-components'

import { Button } from '../../../components/Button'
import { Modals } from '../../../components/Modal'
import { useTrackEvent } from '../../../hooks/analytics/useTrackEvent'
import { useSubscribe } from '../../../hooks/api/subscription/useSubscribe'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useUser } from '../../../hooks/api/useUser'
import { useT } from '../../../hooks/useT'
import { TimeSpan } from './SubscriptionHeader'

const planPriority = ['individual', 'essential', 'teams', 'enterprise']

interface Props {
	id: string
	currentPlan: string
	timeSpan: TimeSpan
	isFreeTrial?: boolean
	coupon?: string | null
}

const SubScriptionSelectorButtons = ({ id, currentPlan, timeSpan, isFreeTrial, coupon }: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const trackEvent = useTrackEvent()
	const user = useUser()
	const subscribe = useSubscribe()
	const [workspace] = useCurrentWorkspace()

	if (currentPlan === id && !isFreeTrial) {
		return <CurrentPlanText>Current Plan</CurrentPlanText>
	}

	switch (id) {
		case 'free':
			return (
				<StyledButton
					padding="8px 16px"
					color={currentPlan === 'free' ? theme.colors.lightGrey : theme.colors.white}
					textColor={theme.colors.textGrey}
					onClick={() => Modals.planUnsubscription.open()}
				>
					{t('Downgrade', 'downgrade')}
				</StyledButton>
			)
		case 'individual':
		case 'essential':
		case 'teams':
			if (!isFreeTrial && planPriority.indexOf(id) < planPriority.indexOf(currentPlan)) {
				return <p style={{ margin: '6px' }}>—</p>
			} else {
				const color = {
					individual: theme.colors.white,
					essential: theme.colors.primary,
					teams: theme.colors.white,
				}

				const textColor = {
					individual: theme.colors.textGrey,
					essential: theme.colors.white,
					teams: theme.colors.textGrey,
				}

				const borderColor = {
					individual: theme.colors.border,
					essential: theme.colors.primary,
					teams: theme.colors.border,
				}

				return (
					<Button
						style={{ fontWeight: '700', width: '100%' }}
						padding="8px 16px"
						color={color[id]}
						textColor={textColor[id]}
						borderColor={borderColor[id]}
						outlined
						onClick={async () => {
							if (subscribe.isLoading) return

							const { checkoutUrl } = await subscribe.mutateAsync({
								workspace,
								billingCycle: timeSpan,
								type: id,
								coupon,
							})

							window.location.href = checkoutUrl
						}}
					>
						{t('Upgrade', 'upgrade')}
					</Button>
				)
			}

		case 'enterprise':
			return (
				<StyledButton
					padding="8px 16px"
					color={currentPlan === 'enterprise' ? theme.colors.lightGrey : theme.colors.white}
					textColor={theme.colors.textGrey}
					onClick={() => window.open('https://calendly.com/quentin-32/notice-custom-plan-onboarding', '_blank')}
				>
					{t('Contact Us', 'contactUs')}
				</StyledButton>
			)
		default:
			return <div></div>
	}
}

const CurrentPlanText = styled.p`
	font-weight: 700;
	padding: 8px 16px;
	text-decoration: underline;
	color: ${({ theme }) => theme.colors.textGrey};
`

const StyledButton = styled(Button)`
	border: 1px solid ${({ theme }) => theme.colors.border};
	font-weight: 700;
	width: 100%;
`

export default SubScriptionSelectorButtons
