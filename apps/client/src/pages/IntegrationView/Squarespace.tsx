import styled from 'styled-components'
import { AlertBox } from '../../components/AlertBox'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import NoticeContainer from './NoticeContainer'
import NoticeScript from './NoticeScript'

export const Squarespace = () => {
	return (
		<>
			<IntegrationTitleBanner title={`Squarespace`} icon={'/assets/svg/square.svg'} />
			<MarginLeft18>
				<OLGap24>
					<li>
						<b>{`On the Squarespace platform`}</b>
						<MarginLeft16List>
							<li>
								Go to your Squarespace website in <InlineCode>editor mode</InlineCode>
							</li>
							<li>Select the page you want to implement your Notice content or create a new one.</li>
							<li>
								Click inside the editor and select <InlineCode>Edit</InlineCode> to insert a new block.
							</li>
							<li>
								A new modal will be displayed → click in the <InlineCode>+</InlineCode> icon and select{' '}
								<InlineCode>Code</InlineCode>.
							</li>
							<li>
								Be sure<InlineCode>HTML</InlineCode> is selected on Mode.
							</li>
							<li>Copy/Paste the codes below inside the box.</li>
							<br />
							<NoticeScript />
							<br />
							<NoticeContainer integrationType="squarespace-script" />
							<li> Click outside of the box to close it.</li>
							<li>
								Now you just need to resize the HTML block until everything is well displayed and then click on{' '}
								<InlineCode>Publish</InlineCode> in the top right corner of the screen.
							</li>
						</MarginLeft16List>
					</li>
					<AlertBox>
						<h3>
							<b>Note:</b> while editing, the block will be displayed as the image below inside the editor. You are not
							going to be able to see the content inside of it in edition mode. Just when you are done with editing, the
							content will be displayed, just like the second image below.
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

export default Squarespace
