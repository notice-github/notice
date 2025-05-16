import { langs } from '@uiw/codemirror-extensions-langs'
import { useState } from 'react'
import styled from 'styled-components'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { useOnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { useT } from '../../../hooks/useT'
import InlineCode from '../../InlineCode'
import { CustomCode } from './CustomCode'

export const CustomizationCode = () => {
	const [t] = useT()
	const [project] = useCurrentProject()
	const [workspace] = useCurrentWorkspace()

	const [onPropertyChange] = useOnPropertyChange()
	const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

	const { HEAD = '', JS = '', CSS = '' } = project?.userCode ?? {}

	const htmlHeadPlaceholder = `<title>A Meaningful Page Title</title>
<meta name="description" content="A description of the page">
<meta name="author" content="Author Name">`

	const cssPlaceholder = `
 .your-custom-class {
	width: 100%;
}`

	const jsPlaceholder = `
 function addGlobalFunction() {
	alert("this alert will be
	fired on every page")
 }
`

	function onCodeChange(code: string, name: 'HEAD' | 'CSS' | 'JS') {
		onPropertyChange('userCode', name, code)
	}

	return (
		<FlexColumn ref={setContainerRef} width={containerRef?.offsetWidth}>
			<CustomCode
				SectionTitle={
					<span>
						HTML <InlineCode>{'<head>'}</InlineCode> Code
					</span>
				}
				placeholder={htmlHeadPlaceholder.trim()}
				description={
					<span>
						{t('The code written will be inserted in to the ', 'codeHtmlDesc')}
						<InlineCode>{'<head>'}</InlineCode> {t(' of your notice project.', 'codeHtmlDesc2')}
					</span>
				}
				extensions={[langs.html()]}
				onSave={(val) => {
					onCodeChange(val ?? '', 'HEAD')
				}}
				currentValue={HEAD}
			/>
			<CustomCode
				SectionTitle="CSS Code"
				description={t('Write some CSS code to persist through out the app', 'CSSDesc')}
				placeholder={cssPlaceholder.trim()}
				extensions={[langs.css()]}
				currentValue={CSS}
				onSave={(val) => {
					onCodeChange(val ?? '', 'CSS')
				}}
			/>
			<CustomCode
				SectionTitle="Javascript Code"
				description={t('Write some Javascript code to persist through out the app', 'JavascriptDesc')}
				placeholder={jsPlaceholder.trim()}
				extensions={[langs.javascript()]}
				onSave={(val) => {
					onCodeChange(val ?? '', 'JS')
				}}
				currentValue={JS}
			/>
		</FlexColumn>
	)
}

const FlexColumn = styled.div<{ width?: number }>`
	display: flex;
	flex-direction: column;
	padding: 24px;
	gap: 24px;
	height: calc(100vh - ${({ theme }) => theme.modalMargin} - 85px * 2);
	max-width: ${({ width }) => `${width}px`};
	width: 100%;
	box-sizing: border-box;
	overflow: auto;

	.cm-editor {
		outline: none;
		border-radius: 4px;
	}
	.cm-scroller {
		border-radius: 4px;
	}
`
