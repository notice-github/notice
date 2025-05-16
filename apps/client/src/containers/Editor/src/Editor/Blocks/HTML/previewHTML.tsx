import styled from 'styled-components'
import { AlertBox } from '../../../../../../components/AlertBox'

interface Props {
	html: string
}

export const PreviewHTML = ({ html }: Props) => {
	return (
		<Container>
			<Title>HTML Preview</Title>
			<AlertBox>
				<Description>
					<b> This preview does not handle complex scripts.</b> For a complete preview, you need to publish your project
					and then visit the published version.
				</Description>
			</AlertBox>
			<CodePreview dangerouslySetInnerHTML={{ __html: html }} />
		</Container>
	)
}

const Container = styled.div`
	max-width: 650px;
	max-height: 800px;
	padding: 32px 40px;
`

const Description = styled.p`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.dark};
`

const Title = styled.h1`
	font-size: 28px;
	white-space: nowrap;
	color: ${({ theme }) => theme.colors.textDark};
`

const CodePreview = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 40px;

	overflow: auto;
`
