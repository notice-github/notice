import styled from 'styled-components'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import NoticeContainer from './NoticeContainer'
import NoticeScript from './NoticeScript'

export const Wix = () => {
	return (
		<>
			<IntegrationTitleBanner title={``} icon={'/assets/svg/wix.svg'} />
			<MarginLeft18>
				<OLGap24>
					<li>
						<p>{`On the Wix platform`}</p>
						<MarginLeft16List>
							<li>Go to your Wix website in editor mode.</li>
							<li>
								On the left side menu click in the + icon → Embed Code → Popular Embeds → and click on{' '}
								<InlineCode>Embed HTML</InlineCode>.
							</li>
							<li>
								An HTML box will appear inside your page. Select <InlineCode>Code</InlineCode> and copy/paste this code
								inside.
							</li>
							<br />
							<NoticeScript />
							<br />
							<NoticeContainer integrationType="wix-script" />
							<li>
								Click on <InlineCode>update</InlineCode>.
							</li>
							<li>
								Now you just need to resize the <InlineCode>HTML block</InlineCode> until everything is well displayed
								and then click on Publish in the top right corner of the screen.
							</li>
						</MarginLeft16List>
					</li>
				</OLGap24>
			</MarginLeft18>
		</>
	)
}

const MarginLeft18 = styled.div`
	margin-left: 16px;
`

const OLGap24 = styled.ol`
	display: flex;
	flex-direction: column;
	gap: 24px;
	margin-left: 36px;

	li {
		margin-top: 16px;
	}
`

const MarginLeft16List = styled.ul`
	display: flex;
	flex-direction: column;
	margin-left: 16px;
`

export default Wix
