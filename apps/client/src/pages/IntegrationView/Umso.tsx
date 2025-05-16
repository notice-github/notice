import styled from 'styled-components'
import { AlertBox } from '../../components/AlertBox'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import NoticeContainer from './NoticeContainer'
import NoticeScript from './NoticeScript'

export const Umso = () => {
	return (
		<>
			<IntegrationTitleBanner title={``} icon={'/assets/svg/umso.svg'} />
			<MarginLeft16>
				<b>
					You will need a paid subscription to{' '}
					<Link href="https://www.umso.com/" target="_blank" rel="noreferrer">
						Umso
					</Link>{' '}
					to implement Notice.
				</b>
				<OLGap24>
					<li>
						<p>
							Update Umso <InlineCode>Header</InlineCode> code.
						</p>
						<MarginLeft16List>
							<li>
								Go to your website → Click on <InlineCode>Integrations</InlineCode> in the top-left corner.
							</li>
							<li>
								Copy/Paste Notice script inside the <InlineCode>Header</InlineCode> code.
							</li>
							<br />
							<NoticeScript />
						</MarginLeft16List>
					</li>
					<li>
						<p>Insert Notice block in your page.</p>
						<MarginLeft16List>
							<li>
								Create a <InlineCode>custom code block</InlineCode>.
							</li>
							<li>Copy/Paste this Notice container inside.</li>
							<br />
							<NoticeContainer integrationType="umso-script" />
						</MarginLeft16List>
					</li>
					<AlertBox margin="24px 0 0">
						<h3>
							<b>{`Be aware that your Notice won't display directly inside the Umso editor`}</b>, only when you preview
							or publish your landing page.
						</h3>
					</AlertBox>
				</OLGap24>
			</MarginLeft16>
		</>
	)
}

const MarginLeft16 = styled.div`
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

const Link = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.colors.mariner};
	&:hover {
		text-decoration: underline;
	}
`

export default Umso
