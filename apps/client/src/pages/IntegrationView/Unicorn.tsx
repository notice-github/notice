import styled from 'styled-components'
import { AlertBox } from '../../components/AlertBox'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import NoticeContainer from './NoticeContainer'
import NoticeScript from './NoticeScript'

export const Unicorn = () => {
	return (
		<>
			<IntegrationTitleBanner title={`Unicorn`} icon={'/assets/svg/unicorn.svg'} />
			<MarginLeft18>
				<p>
					Good news: you can integrate your Notice project into the{' '}
					<Link href="https://unicornplatform.com/" target="_blank" rel="noreferrer">
						Unicorn Platform
					</Link>
					using a <b>free subscription !</b>
				</p>
				<OLGap24>
					<li>
						<p>{`Inject Notice Script inside your website.`}</p>
						<MarginLeft16List>
							<li>
								<p>
									Find the <InlineCode>{`<head> custom HTML code`}</InlineCode> in your website configuration and
									copy/paste the code below.
								</p>
							</li>
							<br />
							<NoticeScript />
						</MarginLeft16List>
					</li>
					<li>
						<p>Insert Notice block in your page.</p>
						<MarginLeft16List>
							<li>
								Insert a <InlineCode>CUSTOM HTML</InlineCode> block inside your page.
							</li>
							<li>Copy/Paste this Notice container inside.</li>
							<br />
							<NoticeContainer integrationType="unicorn-script" />
						</MarginLeft16List>
					</li>
					<AlertBox>
						<h3>
							<b>{`Be aware that your Notice won't display directly inside the Unicorn editor`}</b>, only when you
							preview or publish your landing page.
						</h3>
					</AlertBox>
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

const Link = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.colors.mariner};
	&:hover {
		text-decoration: underline;
	}
	margin-right: 4px;
`

export default Unicorn
