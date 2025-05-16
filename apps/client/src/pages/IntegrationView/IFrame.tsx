import { useState } from 'react'
import styled from 'styled-components'
import { AlertBox } from '../../components/AlertBox'
import { CodeHighlighter } from '../../components/CodeHighlighter'
import InlineCode from '../../components/InlineCode'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'

const IFrame = () => {
	const [height, setHeight] = useState<number>(100)
	const [width, setWidth] = useState<number>(100)
	const [project] = useCurrentProject()
	const domain = project?.preferences?.domain ?? project?.id

	const Code = `<iframe id="notice-iframe-faq" title="Notice FAQ"
src="${`https:///${domain}.notice.site`}"
style="height: ${height}%; width: ${width}%;" frameborder="0">
</iframe>`

	return (
		<>
			<IntegrationTitleBanner title={`IFrame`} icon={'/assets/svg/iframe.svg'} />
			<FlexColumn>
				<p>
					Easy to use, <b>iframes</b> fit everywhere, even in mobile application.
				</p>
				<p>
					Copy the code below directly in any .html file for it to work, you can change the{' '}
					<InlineCode>width</InlineCode> and <InlineCode>height</InlineCode> property to fit your needs.
				</p>
				<IframeControls>
					<Label14>height : </Label14>
					<BottomBorderInput min={0} type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
					<Label14>width : </Label14>
					<BottomBorderInput type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
				</IframeControls>
				<CodeHighlighter code={Code} />
				<AlertBox margin="24px 0 0">
					<h3>
						<b>Warning :</b> iframes don't provide any SEO for your website, prefer other integrations if you wish your
						content to be referenced by search engines.
					</h3>
				</AlertBox>
				<h5>Iframe preview :</h5>
				<IFrameContainer>
					<iframe
						id="notice-iframe-faq"
						title="Notice FAQ"
						src={`https://${domain}.notice.site`}
						style={{ height: `${height}%`, width: `${width}%` }}
						frameBorder="0"
					></iframe>
				</IFrameContainer>
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

const Label14 = styled.label`
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textGrey};
`

const BottomBorderInput = styled.input`
	border: 1px solid ${({ theme }) => theme.colors.textGrey};
	width: 50px;
	padding: 8px;
	border-radius: 8px;
`

const IFrameContainer = styled.div`
	height: 600px;
	overflow: auto;
	border: 2px dashed #ffcd64;
	padding: 0 20px;
`

const IframeControls = styled.div`
	display: flex;
	flex-direction: row;
	gap: 16px;
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
`

export default IFrame
