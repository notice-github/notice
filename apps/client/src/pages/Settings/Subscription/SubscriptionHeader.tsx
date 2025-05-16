import dayjs from 'dayjs'
import styled, { useTheme } from 'styled-components'
import { Button } from '../../../components/Button'
import { Column, Row } from '../../../components/Flex'
import { Show } from '../../../components/Show'
import { SUBSCRIPTION_PLANS } from '../../../data/subscription'
import { useReactivate } from '../../../hooks/api/subscription/useReactivate'
import { useSubscription } from '../../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useSearchParam } from '../../../hooks/useSearchParam'
import { HourglassIcon } from '../../../icons/HourglassIcon'
import SubScriptionSelectorButtons from './SubScriptionSelectorButtons'

const dateFormater = new Intl.DateTimeFormat('en', { dateStyle: 'long' })

export type TimeSpan = 'monthly' | 'yearly'

interface Props {
	timeSpan: TimeSpan
}

const SubscriptionHeader = ({ timeSpan }: Props) => {
	const theme = useTheme()
	const [workspace, _] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)
	const reactivate = useReactivate()
	const [coupon] = useSearchParam('coupon')

	return (
		<Wrapper>
			<StyledRow justify={'flex-end'} align="stretch">
				{' '}
				<div style={{ visibility: 'hidden', width: '25%', padding: '18px' }}></div>
				{SUBSCRIPTION_PLANS.map((plan) => (
					<Padding18Column
						isSelected={plan.id === 'essential' || plan.id === 'enterprise'}
						justify={'center'}
						key={plan.id}
					>
						<Title addMargin={false}>{plan.title}</Title>
						<Padding8Column
							justify="flex-start"
							align="center"
							style={{ minHeight: subscription.data?.isFreeTrial ? '102px' : '82px' }}
						>
							<Font32>
								{plan.price && plan.id !== 'enterprise' && <Font16>$</Font16>}
								{plan.yearlyPrice !== undefined && timeSpan === 'yearly' ? plan.yearlyPrice : plan.price}
								{plan.id !== 'enterprise' && <SmallUnder>/ month</SmallUnder>}
							</Font32>
							<Duration>{plan.description}</Duration>
							{subscription.data?.isFreeTrial && subscription.data?.type === plan.id && (
								<FreeTrial>
									<p className="left-text">Free Trial</p>
									<HourglassIcon className="icon" size={14} color={'#c87a00'} />
									<p className="right-text">
										{dayjs(subscription.data.expiresAt).add(1, 'day').diff(dayjs(), 'day')} days left
									</p>
								</FreeTrial>
							)}
						</Padding8Column>
						<Width100Row align="center" justify="center">
							<Show when={!(plan.id === 'free' && subscription.data?.expiresAt != null)}>
								<SubScriptionSelectorButtons
									id={plan.id}
									currentPlan={subscription.data?.type ?? 'free'}
									timeSpan={timeSpan}
									isFreeTrial={subscription.data?.isFreeTrial}
									coupon={coupon}
								/>
							</Show>
							{subscription.data?.type === plan.id &&
								subscription.data?.expiresAt != null &&
								!subscription.data?.isFreeTrial && (
									<>
										<Duration>{`Ends on ${dateFormater.format(subscription.data.expiresAt)}`}</Duration>
										<br />
										<Button
											style={{ fontWeight: '700', width: '100%' }}
											padding="8px 16px"
											color={theme.colors.primary}
											loader={reactivate.isLoading}
											onClick={async () => {
												if (reactivate.isLoading) return
												await reactivate.mutateAsync({ workspace })
											}}
										>
											Reactivate
										</Button>
									</>
								)}
						</Width100Row>
					</Padding18Column>
				))}
			</StyledRow>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.white};
	position: sticky;
	top: 0;
	z-index: 2;

	border-top-right-radius: 8px;
	border-top-left-radius: 8px;

	box-shadow: rgb(0 0 0 / 12%) 0px 1px 1px;
`

const Title = styled.h3<{ addMargin: boolean }>`
	color: ${({ theme }) => theme.colors.textDark};
	font-size: 20px;
	font-weight: 700;
	margin-top: ${({ addMargin }) => (addMargin ? '40px' : undefined)};
	text-align: center;
	display: flex;
	justify-content: center;
`

const Padding8Column = styled(Column)`
	padding: 8px;
`

const Padding18Column = styled(Column)<{ isSelected: boolean }>`
	padding: 18px;
	width: 25%;

	border-top-right-radius: ${({ isSelected }) => (isSelected ? 'none' : '8px')};
	border-top-left-radius: ${({ isSelected }) => (isSelected ? 'none' : '8px')};
	background: ${({ isSelected, theme }) => (isSelected ? ' #F3F9FF' : theme.colors.white)};
`

const StyledRow = styled(Row)``

const CouponResult = styled.div`
	color: ${({ theme }) => theme.colors.error};
	font-size: 14px;
	font-weight: 700;
	font-style: italic;
	margin-bottom: 2px;
`

const Font32 = styled.div`
	position: relative;
	font-size: 32px;
	font-weight: 700;
	height: 32px;
	color: ${({ theme }) => theme.colors.primary};
	white-space: nowrap;
`

const Font16 = styled.span`
	font-size: 16px;
	font-weight: 400;
`

const Duration = styled.div`
	text-align: center;
	font-size: 12px;
	font-weight: 400;
	padding-top: 8px;
	color: ${({ theme }) => theme.colors.textLightGrey};
	height: 42px;
`

const SmallUnder = styled.span`
	font-size: 11px;
	margin-left: 2px;
`

const Width100Row = styled(Row)`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-top: 8px;
`

const FreeTrial = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	color: #c87a00;
	font-size: 14px;
	white-space: nowrap;
`

export default SubscriptionHeader
