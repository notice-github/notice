import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import { useSubscribe } from '../../hooks/api/subscription/useSubscribe'
import { useCollaborators } from '../../hooks/api/useCollaborators'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { GiftIcon } from '../../icons'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { useUser } from '../../hooks/api/useUser'
import { useT } from '../../hooks/useT'

type TimeSpan = 'monthly' | 'yearly'

interface Props {
	timeSpan: TimeSpan
}

export const UpgradeValidation = ({ timeSpan }: Props) => {
	const [t] = useT()
	const theme = useTheme()

	const [workspace, _] = useCurrentWorkspace()
	const collaborators = useCollaborators(workspace.id)
	const subscribe = useSubscribe()

	const [timeSpanSelected, setTimeSpanSelected] = useState<TimeSpan>(timeSpan)
	const [noticeAiSelected, setNoticeAiSelected] = useState(false)

	const user = useUser()

	const noticeAiPrice = timeSpanSelected === 'monthly' ? 7 : 78
	const planPrice = timeSpanSelected === 'monthly' ? 9 : 99
	const collaboratorNb = collaborators?.data?.length ?? 1

	const totalPlanPrice = collaboratorNb * planPrice
	const totalNoticeAIPrice = noticeAiSelected ? collaboratorNb * noticeAiPrice : 0
	const finalPrice = totalNoticeAIPrice + totalPlanPrice

	return (
		<Container>
			<TitleWrapper>
				<RocketLaunch color={theme.colors.textDark} size={26} />
				<Title>{t('Upgrade', 'upgrade')}</Title>
			</TitleWrapper>

			<SectionWrapper>
				<SelectionContainer>
					<Description>{t('Billing period', 'billingPeriod')}</Description>
					<Selection>
						<Card isSelected={timeSpanSelected === 'monthly'} onClick={() => setTimeSpanSelected('monthly')}>
							<CardTitle isSelected={timeSpanSelected === 'monthly'}>{t('Monthly', 'monthly')}</CardTitle>
							<CardDetails>$9/month/collab.</CardDetails>
						</Card>
						<Card isSelected={timeSpanSelected === 'yearly'} onClick={() => setTimeSpanSelected('yearly')}>
							<CardTitle isSelected={timeSpanSelected === 'yearly'}>{t('Yearly', 'yearly')}</CardTitle>
							<IconTextWrapper>
								<GiftIcon color={theme.colors.textGreen} size={9} />
								<CardGift>{t('1 month free', 'oneMonthFree')}</CardGift>
							</IconTextWrapper>
							<CardDetails>$8.25/month/collab.</CardDetails>
						</Card>
					</Selection>
				</SelectionContainer>
			</SectionWrapper>

			<SectionWrapper>
				<SectionTitle>Your plan summary</SectionTitle>
				<FeatureWrapper>
					<FeatureRow>
						<Text14>Team Plan</Text14>
						<Text14>{`$${totalPlanPrice}`}</Text14>
					</FeatureRow>
					<FeatureDetail>{`$${planPrice} per ${
						timeSpanSelected === 'monthly' ? 'month' : 'year'
					}/collaborator`}</FeatureDetail>
				</FeatureWrapper>

				<FeatureWrapper>
					<FeatureRow>
						<Text14 color={theme.colors.textDark}>Total per {timeSpanSelected === 'monthly' ? 'month' : 'year'}</Text14>
						<Text16 color={theme.colors.textGreen}>${finalPrice.toFixed(2)}</Text16>
					</FeatureRow>
				</FeatureWrapper>
			</SectionWrapper>

			<ButtonsWrapper>
				<Button
					padding="8px 16px"
					textColor={theme.colors.textDark}
					color="transparent"
					style={{ border: `1px solid ${theme.colors.border}` }}
					onClick={() => Modals.upgradeValidation.close()}
				>
					Cancel
				</Button>
				<Button
					padding="8px 16px"
					color={theme.colors.primary}
					loader={subscribe.isLoading}
					onClick={async () => {
						if (subscribe.isLoading) return
						const { checkoutUrl } = await subscribe.mutateAsync({
							workspace,
							billingCycle: timeSpanSelected,
							type: 'teams',
						})

						window.location.href = checkoutUrl
					}}
				>
					Upgrade plan
				</Button>
			</ButtonsWrapper>
		</Container>
	)
}

const FeatureWrapper = styled.div``

const FeatureRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

const SectionTitle = styled.p`
	font-size: 16px;
	color: ${({ theme }) => theme.colors.textDark};
	margin-bottom: 4px;
`

const Text14 = styled.p<{ color?: string }>`
	font-size: 14px;
	color: ${({ theme, color }) => (color ? color : theme.colors.textGrey)};
`

const Text16 = styled.p<{ color?: string }>`
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme, color }) => (color ? color : theme.colors.textGrey)};
`

const IconTextWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
`

const FeatureDetail = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLightGrey};
	font-style: italic;
`

const Card = styled.div<{ isSelected: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	width: 170px;
	height: 81px;

	border: ${({ theme, isSelected }) =>
		isSelected ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`};
	border-radius: ${({ theme }) => theme.borderRadius};
	background: ${({ theme, isSelected }) => (isSelected ? `${theme.colors.white} !important` : 'transparent')};

	&:hover {
		background: ${({ theme }) => theme.colors.backgroundHoverGrey};
	}
`

const CardTitle = styled.p<{ isSelected: boolean }>`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme, isSelected }) => (isSelected ? theme.colors.textDark : theme.colors.textGrey)};
`

const CardDetails = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLightGrey};
	margin-top: 6px;
`

const CardGift = styled.p`
	font-size: 11px;
	color: #2fc193;
`

const Container = styled.div`
	padding: 32px 40px;
	width: 434px;
`

const TitleWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	margin-bottom: 18px;
`

const Title = styled.h1`
	font-size: 28px;
	color: ${({ theme }) => theme.colors.textDark};
`

const Description = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const SectionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 24px;
`

const SelectionContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`

const Selection = styled.div`
	display: flex;
	flex-direction: row;
	gap: 28px;
	justify-content: start;
`

const ButtonsWrapper = styled.div`
	display: flex;
	margin-top: 38px;
	flex-direction: row;
	gap: 12px;
	justify-content: end;
`
