import { langs } from '@uiw/codemirror-extensions-langs'
import styled from 'styled-components'
import { CodeHighlighter } from '../../components/CodeHighlighter'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'

export const RestAPI = () => {
	const [project] = useCurrentProject()

	return (
		<>
			<IntegrationTitleBanner title={`REST API`} icon={'/assets/svg/rawjson.svg'} />
			<MarginLeft18>
				<p>Do you need total control over your visual identity? Our REST API is designed to meet your needs!</p>
				<StyledLink target="_blank" rel="noreferrer" href={`https://notice-api.readme.io/reference/overview`}>
					https://notice-api.readme.io/reference/overview
				</StyledLink>
				<p>
					You can follow the documentation provided above to get your project data in the format of your choice. You
					will also need your project ID:
				</p>
				<CodeHighlighter code={project?.id} extensions={[langs.dtd()]} />
			</MarginLeft18>
		</>
	)
}

const MarginLeft18 = styled.div`
	margin-left: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const StyledLink = styled.a`
	color: ${({ theme }) => theme.colors.mariner};
`
