import { SubscriptionModel } from '@notice-app/models'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Column, Row } from '../../../components/Flex'
import { SUBSCRIPTION_DETAILS } from '../../../data/subscription'
import { useT } from '../../../hooks/useT'
import { GiftIcon } from '../../../icons'
import FeatureOptionSelector from './FeatureOptionSelector'
import SubscriptionHeader, { TimeSpan } from './SubscriptionHeader'

interface Props {
	subscription: SubscriptionModel.full | undefined
}

const SubscriptionTable = ({ subscription }: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(subscription?.billingCycle === 'yearly' ? 'yearly' : 'monthly')

	return (
		<>
			<SwitcherContainer>
				<SwitcherWrapper>
					<SwitchButtonLeft selected={timeSpan === 'monthly'} onClick={() => setTimeSpan('monthly')}>
						{t('Monthly', 'monthly')}
					</SwitchButtonLeft>
					<SwitchButtonRight selected={timeSpan === 'yearly'} onClick={() => setTimeSpan('yearly')}>
						<GiftIcon
							size={12}
							color={timeSpan === 'yearly' ? theme.colors.primary : theme.colors.textLightGrey}
							style={{ transition: '0.3s' }}
						/>
						{t('Yearly', 'yearly')}
					</SwitchButtonRight>
				</SwitcherWrapper>
			</SwitcherContainer>
			<SubscriptionCard>
				<StyledColumn>
					<SubscriptionHeader timeSpan={timeSpan} />
					<CenterAlignColumn>
						{SUBSCRIPTION_DETAILS.map((sub) => (
							<StyledRow align="stretch" justify="center" key={sub.id}>
								<Width25TextAlign>
									{' '}
									<Feature shouldNotCenter>{sub.feature}</Feature>
								</Width25TextAlign>
								<Width25>
									{' '}
									<Feature>
										<FeatureOptionSelector option={sub.forIndividual} />
									</Feature>{' '}
								</Width25>
								<Width25Color>
									{' '}
									<Feature>
										<FeatureOptionSelector option={sub.forEssential} />
									</Feature>{' '}
								</Width25Color>
								<Width25>
									{' '}
									<Feature>
										<FeatureOptionSelector option={sub.forTeams} />
									</Feature>
								</Width25>
								<Width25Color>
									{' '}
									<Feature>
										<FeatureOptionSelector option={sub.forEnterprise} />
									</Feature>
								</Width25Color>
							</StyledRow>
						))}
					</CenterAlignColumn>
				</StyledColumn>
			</SubscriptionCard>
		</>
	)
}

const SwitcherContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 32px;
	margin-bottom: 12px;
	margin-left: 200px;
`

const SwitcherWrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 200px;
	justify-content: center;
	border-radius: 32px;
	background: #e3f0ff;
	position: relative;
	font-size: 15px;
	height: 38px;
	margin-bottom: 16px;
`

const SwitchButtonLeft = styled.button<{ selected: boolean }>`
	border: none;
	border-radius: 24px;
	width: 105px;
	font-weight: 700;
	padding: 4px 14px;
	background: ${({ selected, theme }) => (selected ? '#BFD8F9' : 'transparent')};
	color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.textLightGrey)};
	transition: 0.3s;
	cursor: pointer;
	position: absolute;
	left: 0;
	font-size: 15px;
	height: 100%;
`

const SwitchButtonRight = styled.button<{ selected: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2px;
	border: none;
	font-weight: 700;
	width: 105px;
	font-size: 15px;
	border-radius: 24px;
	padding: 4px 14px;
	background: ${({ selected, theme }) => (selected ? '#BFD8F9' : 'transparent')};
	color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.textLightGrey)};
	transition: 0.3s;
	cursor: pointer;
	position: absolute;
	right: 0;
	height: 100%;
`

const SubscriptionCard = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
	width: 100%;
`

const Width25 = styled.div`
	width: 25%;
`
const Width25TextAlign = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 25%;
`
const Width25Color = styled.div`
	width: 25%;
	background-color: #f3f9ff;
`

const Feature = styled.div<{ shouldNotCenter?: boolean }>`
	padding: 18px;
	text-align: ${({ shouldNotCenter }) => (shouldNotCenter ? 'start' : 'center')};
`

const StyledColumn = styled(Column)`
	width: 100%;
`

const CenterAlignColumn = styled(Column)`
	text-align: center;
`

const StyledRow = styled(Row)`
	border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`

export default SubscriptionTable
