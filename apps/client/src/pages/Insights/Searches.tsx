import styled from 'styled-components'
import ContainerHeader from '../../components/Insights/ContainerHeader'
import InsightsSearchPanel from '../../components/Insights/InsightsSearchPanel'
import TextButton from '../../components/Insights/TextButton'
import useInsightsSearches from '../../hooks/analytics/useInsightsSearches'
import FlagIcon from '../../icons/FlagIcon'
import { useInsights } from '../../providers/InsightsProvider'

const Searches = () => {
	const { searchPanel, setSearchPanel } = useInsights()

	const [data, query] = useInsightsSearches({
		projectId: 'a99d22e0-0a30-432c-8529-e93a6b5e3f85', // projectId,
		selectedLanguage: null,
	})

	return (
		<>
			<FixedPosition>
				<StyledRow>
					<h1>Searches</h1>
					<TextButtonGroup>
						<TextButton onClick={() => setSearchPanel('searchedWords')} isActive={searchPanel === 'searchedWords'}>
							Most searched
						</TextButton>
						<TextButton onClick={() => setSearchPanel('unfoundedWords')} isActive={searchPanel === 'unfoundedWords'}>
							Searches not found
						</TextButton>
					</TextButtonGroup>
				</StyledRow>
			</FixedPosition>
			<Wrapper>
				<ContainerHeader
					title={searchPanel === 'searchedWords' ? 'Most Searched Words' : 'Words Not Found'}
					subtitle="list of words searched by your users"
				>
					<FlexRow>
						<FlagIcon />
						<Text>{'english'}</Text>
					</FlexRow>
				</ContainerHeader>
				<>
					<InsightsSearchPanel
						isVisible={searchPanel === 'searchedWords'}
						searchData={data}
						query={query}
						searchPanelType={searchPanel}
					/>
					<InsightsSearchPanel
						isVisible={searchPanel === 'unfoundedWords'}
						searchData={data}
						query={query}
						searchPanelType={searchPanel}
					/>
				</>
			</Wrapper>
		</>
	)
}

const FixedPosition = styled.div`
	position: sticky;
	padding: 16px 0;
	background: white;
	width: 100%;
	top: 0;
`

const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-self: flex-start;
	width: 100%;
`

const Wrapper = styled.div`
	box-sizing: border-box;
	padding-top: 16px;
	background: #ffffff;
	border-radius: 8px;
	width: 100%;
`

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;

	margin: auto 0;
`

const Text = styled.div`
	font-size: 12px;
	line-height: 15px;
`

const TextButtonGroup = styled.div`
	display: flex;
	flex-direction: row;
	gap: 8px;

	margin-top: auto;
	margin-bottom: auto;
`

const SubHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 19px;
	width: 100%;
`

export default Searches
