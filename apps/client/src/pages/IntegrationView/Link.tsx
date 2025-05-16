import { NUrls } from '@notice-app/utils'
import { langs } from '@uiw/codemirror-extensions-langs'
import styled from 'styled-components'
import { CodeHighlighter } from '../../components/CodeHighlighter'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'

const Link = () => {
	const [project] = useCurrentProject()
	const domain = project?.preferences?.domain ?? project?.id

	const Script = `<a
href="${NUrls.App.previewURL(project?.id ?? '')}">
Link </a>`

	return (
		<>
			<IntegrationTitleBanner title={`Link`} icon={'/assets/svg/link.svg'} />
			<FlexColumn>
				<p>{`In need for an hosted version of your project? Drop this link to anyone in need:`}</p>
				<StyledLink target="_blank" rel="noreferrer" href={`https://${domain}.notice.site`}>
					{`https://${domain}.notice.site`}
				</StyledLink>
				<p>
					You can embed the faq inside a link tag, like this one by copying the code below in any tool that understands
					html (mail clients for example):
				</p>

				<CodeHighlighter code={Script} extensions={[langs.html()]} />
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

const StyledLink = styled.a`
	color: ${({ theme }) => theme.colors.mariner};
`

export default Link
