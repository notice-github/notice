import styled from 'styled-components'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import NoticeContainer from './NoticeContainer'
import NoticeScript from './NoticeScript'

export const HTMLIntegration = () => {
	return (
		<>
			<IntegrationTitleBanner title={`HTML <script> tag`} icon={'/assets/svg/html.svg'} />
			<FlexColumn>
				<p>{`The go to solution for websites if you don't find your specific framework in our list.`}</p>
				<MarginLeft36OL>
					<li>
						Find the <InlineCode>{`<head>`}</InlineCode> tag inside your html, it is usually inside a file named
						index.html.
					</li>
					<li>
						<span>
							Copy the following code inside the <InlineCode>{`<head>`}</InlineCode>.
						</span>
					</li>
					<NoticeScript />
					<li>
						<span>
							Insert anywhere you want inside your <InlineCode>{`<body>`}</InlineCode> tag this div, this is the place
							where the FAQ will appear.
						</span>
					</li>
					<NoticeContainer integrationType="html-script" />
				</MarginLeft36OL>
			</FlexColumn>
		</>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-left: 36px;
`

const MarginLeft36OL = styled.ol`
	margin-left: 36px;
	gap: 16px;
	display: flex;
	flex-direction: column;
`
