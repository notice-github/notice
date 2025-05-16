import { langs } from '@uiw/codemirror-extensions-langs'
import styled from 'styled-components'
import { CodeHighlighter } from '../../components/CodeHighlighter'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import YoutubeEmbed from '../../components/YoutubeEmbed'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'

export const Shopify = () => {
	const [page] = useCurrentPage()

	return (
		<>
			<IntegrationTitleBanner title={`Shopify`} icon={'/assets/svg/shopify.svg'} />
			<FlexColumn>
				<YoutubeEmbed embedId={'15QcYR155-w'} title={'Web flow integration'} />
				<p>
					We have our own shopify plugin{' '}
					<Link href="https://apps.shopify.com/noticefaq" rel="noreferrer" target="_blank">
						here
					</Link>{' '}
					Please take a look.
				</p>
				<b>Your project id</b>
				<CodeHighlighter code={page?.rootId} extensions={[langs.apl()]} />
				<p>
					For more information read our{' '}
					<Link href="https://integrations.notice.site/shopify-w0z9qblwfr" rel="noreferrer" target="_blank">
						{' '}
						Shopify tutorial here.
					</Link>
				</p>
			</FlexColumn>
		</>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
	margin-left: 36px;
`

const Link = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.colors.mariner};
	&:hover {
		text-decoration: underline;
	}
`

export default Shopify
