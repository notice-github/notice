import styled from 'styled-components'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import YoutubeEmbed from '../../components/YoutubeEmbed'
import NoticeContainer from './NoticeContainer'
import NoticeScript from './NoticeScript'

export const WebflowIntegration = () => {
	return (
		<>
			<IntegrationTitleBanner title={'Webflow'} icon={'/assets/svg/webflow.svg'} />
			<MarginLeft16>
				<YoutubeEmbed embedId={'bY78REiHc_k'} title={'Web flow integration'} />
				<MarginTop16>
					<li>
						<p>
							Go to <b>{`Settings > Custom Code.`}</b>
						</p>
					</li>
					<li>
						<p>
							{' '}
							In the <InlineCode>Head Code</InlineCode> section, copy paste this.
						</p>
						<MarginTop16>
							<NoticeScript />
						</MarginTop16>
					</li>
					<li>
						<p>{`You then can create a new Embed element anywhere on your website and copy this, that's it!`}</p>
						<MarginTop16>
							<NoticeContainer integrationType="webflow-script" />
						</MarginTop16>
					</li>
				</MarginTop16>
			</MarginLeft16>
		</>
	)
}

const MarginLeft16 = styled.div`
	margin-left: 16px;
`

const MarginTop16 = styled.ol`
	margin-top: 16px;
	margin-left: 24px;

	display: flex;
	flex-direction: column;
	gap: 16px;
`
