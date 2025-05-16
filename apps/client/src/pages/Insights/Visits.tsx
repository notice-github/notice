import styled from 'styled-components'
import ContainerHeader from '../../components/Insights/ContainerHeader'
import InsightsLocation from '../../components/Insights/InsightsLocation'
import InsightsTraffic from '../../components/Insights/InsightsTraffic'
import InsightsVisitsGraph from '../../components/Insights/InsightsVisitsGraph'
import { Show } from '../../components/Show'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useInsights } from '../../providers/InsightsProvider'
import { AnalyticsTurnedOffMessage } from './AnalyticsTurnedOffMessage'
import { timeSpan } from './utils'
import { useT } from '../../hooks/useT'

export function Visits() {
	const [t] = useT()
	const { period, setPeriod } = useInsights()
	const [project] = useCurrentProject()

	const { stopUserTracking } = project?.preferences ?? {}

	return (
		<Wrapper>
			<Show when={stopUserTracking}>
				<AnalyticsTurnedOffMessage />
			</Show>

			<FlexColumn shouldBlur={stopUserTracking}>
				<FixedPosition>
					<StyledRow>
						<h1>{t('Statistics', 'statistics')}</h1>
						<Group>
							{timeSpan.map((text, i) => (
								<Button
									key={text}
									isActive={period === text}
									onClick={() => {
										setPeriod(timeSpan[i])
									}}
								>
									{text}
								</Button>
							))}
						</Group>
					</StyledRow>
				</FixedPosition>
				<Main>
					<ContainerHeader
						marginBottom="16px"
						title={t('Visites', 'visits')}
						subtitle={t('stats of visits by time span', 'visitsByTimeSpan')}
					/>
					<InsightsVisitsGraph />
					<ContainerHeader
						title={t('Location', 'location')}
						subtitle={t('visits filtered by visitor location', 'locationDescription')}
					/>
					<InsightsLocation />
					<InsightsTraffic />
				</Main>
			</FlexColumn>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`

const FlexColumn = styled.div<{ shouldBlur: boolean }>`
	position: relative;
	width: 100%;

	display: flex;
	flex-direction: column;

	filter: ${({ shouldBlur }) => (shouldBlur ? 'blur(20px) grayscale(5)' : 'none')};
	pointer-events: ${({ shouldBlur }) => (shouldBlur ? 'none' : undefined)};
	user-select: none;
`

const Group = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	margin-left: auto;
	padding: 0px;
	gap: 6px;
`

const FixedPosition = styled.div`
	position: sticky;
	padding: 16px 0;
	background: white;
	width: 100%;
	top: 0;
	z-index: 1;
`

const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-self: flex-start;
	width: 100%;
`

const Main = styled.div`
	display: flex;
	flex-direction: Column;
	gap: 16px;
	height: 100%;
	width: 100%;
	margin-top: 16px;
`

const Button = styled.button<{ isActive: boolean }>`
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 6px 8px;
	border: ${({ isActive, theme }) =>
		isActive ? `1px solid ${theme.colors.primary}` : `1px solid ${theme.colors.greyDark}`};
	border-radius: 8px;
	background-color: transparent;
	cursor: pointer;

	font-weight: 600;
	font-size: 14px;
	line-height: 18px;
	color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.greyDark)};

	&:hover {
		background-color: ${({ isActive, theme }) => (isActive ? 'transparent' : theme.colors.hover)};
		border-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.greyDark)};
		color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.greyDark)};
	}
`

export default Visits
