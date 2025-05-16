import dayjs from 'dayjs'
import { darken } from 'polished'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { NStrings } from '@notice-app/utils'
import { useEffect, useMemo } from 'react'
import { Button } from '../../../components/Button'
import { Show } from '../../../components/Show'
import { useTrackEvent } from '../../../hooks/analytics/useTrackEvent'
import { useSubscription } from '../../../hooks/api/subscription/useSubscription'
import { useBilling } from '../../../hooks/api/useBilling'
import { useBillingDetails } from '../../../hooks/api/useBillingDetails'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useUser } from '../../../hooks/api/useUser'
import { useProjects } from '../../../hooks/bms/project/useProjects'
import { useT } from '../../../hooks/useT'
import { LeaveIcon } from '../../../icons/LeaveIcon'
import { Pages } from '../../../pages'

export const SettingsBillingPage = () => {
	const [t] = useT()
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)
	const projects = useProjects(workspace)
	const navigate = useNavigate()
	const trackEvent = useTrackEvent()
	const user = useUser()
	const billing = useBilling(workspace)
	const billingDetails = useBillingDetails()

	const planName = useMemo(() => {
		const name = NStrings.capitalizeWords(workspace.subscription)
		return name.at(-1) === 's' ? name.slice(0, -1) : name
	}, [workspace.subscription])

	useEffect(() => {
		if (!(workspace.subscription !== 'free' && (workspace.myRole === 'admin' || workspace.myRole === 'owner'))) {
			navigate(Pages.SETTINGS, { replace: true })
		}
	}, [])

	return (
		<>
			<Title>{t('Billing', 'billing')}</Title>
			<Description>{t('BillingDetailsAndInvoices', 'billingDetailsAndInvoices')}</Description>
			<SectionContainer>
				<SectionWrapper>
					<SectionHead>
						<SectionTitle>{t('Overview', 'overview')}</SectionTitle>
					</SectionHead>
					<SectionBody>
						<Show when={subscription.data?.type && subscription.data?.type !== 'free'}>
							<ElementContainerWrapper>
								<ElementContainer>
									<Element>
										<Text16>{t('Current Plan', 'currentPlan')}</Text16>
										<Text14 style={{ color: theme.colors.primary }}>{planName}</Text14>
									</Element>
								</ElementContainer>
								<ElementContainer>
									<Element>
										<Text16>{t('Next billing on', 'nextBillingOn')}</Text16>
										<Text14>
											{billing.data?.upcoming ? dayjs(billing.data.upcoming.date).format('DD/MM/YYYY') : 'N/A'}
										</Text14>
									</Element>
								</ElementContainer>
								<ElementContainer>
									<Element>
										<Text16>{t('Next billing amount', 'nextBillingAmount')}</Text16>
										<Text14>{billing.data?.upcoming ? `$${billing.data.upcoming.total.toFixed(2)}` : 'N/A'}</Text14>
									</Element>
								</ElementContainer>
							</ElementContainerWrapper>
						</Show>

						<Show when={!subscription.data?.type || subscription.data?.type === 'free'}>
							<ElementContainerWrapper>
								<ElementContainer>
									<Element>
										<Text16>{t('Current Plan', 'currentPlan')}</Text16>
										<Text14 style={{ color: theme.colors.primary }}>{subscription.data?.type ?? 'Free'}</Text14>
									</Element>
								</ElementContainer>
								<ElementContainer>
									<Element>
										<Text16>{t('Number of projects', 'numberOfProjects')}</Text16>
										<Text14>{projects.data?.length ?? 0}/2</Text14>
									</Element>
								</ElementContainer>
								<ElementContainer>
									<Element>
										<Text16></Text16>
										<Button
											style={{ letterSpacing: '0.25px', fontWeight: 500 }}
											padding={'8px 12px'}
											onClick={() => {
												navigate(Pages.SETTINGS_SUBSCRIPTION)
											}}
										>
											Upgrade your plan
											{t('Upgrade your plan', 'upgradeYourPlan')}
										</Button>
									</Element>
								</ElementContainer>
							</ElementContainerWrapper>
						</Show>
					</SectionBody>
				</SectionWrapper>

				<Show when={subscription.data?.type && subscription.data?.type !== 'free'}>
					<SectionWrapper>
						<SectionHead>
							<SectionTitle>{t('Billing Information & Payment Methods', 'billingInfoAndPayment')}</SectionTitle>
						</SectionHead>
						<SectionBody>
							<ElementContainerWrapper>
								<ElementContainer>
									<Element>
										<Text14 style={{ color: theme.colors.textLightGrey }}>
											{t('Manage all your billing details and update payments methods here', 'manageAllYourBilling')}
										</Text14>
									</Element>
								</ElementContainer>
								<ElementContainer>
									<Element>
										<Text16></Text16>
										<Button
											loader={billingDetails.isLoading}
											style={{ letterSpacing: '0.25px', fontWeight: 500 }}
											padding={'8px 16px'}
											onClick={async () => {
												if (billingDetails.isLoading) return
												const url = await billingDetails.mutateAsync({ workspace })
												window.location.href = url
											}}
										>
											{t('Manage billing details', 'manageBillingDetails')}
										</Button>
									</Element>
								</ElementContainer>
							</ElementContainerWrapper>
						</SectionBody>
					</SectionWrapper>
				</Show>
			</SectionContainer>

			<SectionWrapper>
				<SectionHead>
					<SectionTitle>{t('Invoices history', 'invoicesHistory')}</SectionTitle>
				</SectionHead>
				<SectionBody>
					<Show when={subscription.data?.type && subscription.data?.type !== 'free'}>
						<RowWrapper>
							<Row>
								<Cell>
									<Text16 color={theme.colors.textLightGrey}>{t('Invoice ID', 'invoiceID')}</Text16>
								</Cell>
								<Cell>
									<Text16 color={theme.colors.textLightGrey}>{t('Date', 'date')}</Text16>
								</Cell>
								<Cell>
									<Text16 color={theme.colors.textLightGrey}>{t('Total', 'total')}</Text16>
								</Cell>
								<Cell>
									<Text16 color={theme.colors.textLightGrey}>{t('Status', 'status')}</Text16>
								</Cell>
								<Cell>
									<Text16 color={theme.colors.textLightGrey}>{t('Invoice/Receipt', 'invoiceReceipt')}</Text16>
								</Cell>
							</Row>
							{billing.data?.invoices ? (
								billing.data.invoices.map((elem, id) => {
									return (
										<Row key={id}>
											<Cell>
												<Text14>#{elem.invoiceId}</Text14>
											</Cell>
											<Cell>{/* <Text14>{dayjs(elem.date).format('DD/MM/YYYY')}</Text14> */}</Cell>
											<Cell>
												<Text14>{`$${elem.total.toFixed(2)}`}</Text14>
											</Cell>
											<Cell>
												<Text14>{elem.status}</Text14>
											</Cell>
											<Cell>
												<DownloadButton
													onClick={() => {
														if (elem?.link) window.open(elem.link, '_blank')
													}}
												>
													{t('Download', 'download')}
													<LeaveIcon size={16} color={theme.colors.primary} />
												</DownloadButton>
											</Cell>
										</Row>
									)
								})
							) : (
								<></>
							)}
						</RowWrapper>
					</Show>

					<Show when={!subscription.data?.type || subscription.data?.type === 'free'}>
						<ElementContainerWrapper>
							<Text16 style={{ color: theme.colors.textLightGrey }}>
								{t('No information available yet', 'noInfoAvailableYet')}
							</Text16>
						</ElementContainerWrapper>
					</Show>
				</SectionBody>
			</SectionWrapper>
		</>
	)
}

const SectionContainer = styled.div`
	display: flex;
	flex-direction: row;
	gap: 16px;
`

const Title = styled.h1`
	font-weight: 700;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`

const SectionWrapper = styled.div`
	margin-top: 24px;
	width: 100%;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
`

const SectionHead = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	padding: 12px 18px;
`

const SectionBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 12px 18px;
`

const SectionTitle = styled.h2`
	color: ${({ theme }) => theme.colors.primaryDark};
	font-weight: 700;
	font-size: 16px;
`

const ElementContainerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`
const ElementContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const Element = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const RowWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const Row = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`
const Cell = styled.div`
	width: 20%;
	text-align: left;
`

const Text16 = styled.p<any>`
	font-size: 16px;
	color: ${({ color }) => color ?? '#6B7985'};
`

const Text14 = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.greyDark};
`
const Text13 = styled.p`
	font-size: 13px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const Text12 = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLighterGrey};
	font-style: italic;
`

const TextButton = styled.button`
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
	color: ${({ theme }) => theme.colors.textDark};
	background: transparent;
	cursor: pointer;
	font-size: 14px;
	letter-spacing: 0.35px;
	padding: 8px 16px;
	cursor: ${({ disabled }) => (disabled ? undefined : 'pointer')};

	&:hover {
		background-color: ${({ color, disabled }) => (disabled ? undefined : darken(0.08, color ?? 'white'))};
	}
`

const DownloadButton = styled.button`
	border: none;
	display: flex;
	gap: 5px;
	background-color: transparent;
	text-decoration: none;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	padding: 0;
	color: ${({ theme }) => theme.colors.greyDark};
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`
