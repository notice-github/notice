// libs
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-idle_fingers'

import { ReactNode } from 'react'
import AceEditor from 'react-ace'
import { Editor, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled from 'styled-components'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'

export interface JavaScriptBlock {
	type: 'javascript'
	children: CustomText[]
	codeText?: string
	id?: string
}

interface JavascriptProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: JavaScriptBlock
}

export const JavascriptElement = ({ element, attributes, children }: JavascriptProps) => {
	const editor = useSlate()

	const { codeText } = element

	function onChange(newValue: string) {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { codeText: newValue }, { at: path })
	}

	return (
		<div contentEditable={false} {...attributes}>
			<StyledContainer>
				<AceEditor
					value={codeText}
					style={{ width: '100%', paddingBottom: '25px', borderRadius: '6px' }}
					mode={'javascript'}
					fontSize={14}
					maxLines={Infinity}
					theme={'idle_fingers'}
					placeholder="write a html snippet..."
					onChange={onChange}
					showGutter={true}
					wrapEnabled
					showPrintMargin
					highlightActiveLine={false}
					name="notice-js-code-block"
					setOptions={{
						cursorStyle: 'smooth',
						tabSize: 2,
					}}
					className="ace-editor"
				/>
			</StyledContainer>
			<div style={{ display: 'none' }}>{children}</div>
		</div>
	)
}

const StyledContainer = styled.div`
	width: 100%;
	height: auto;
	position: relative;
	margin: var(--ntc-user-block-padding) 0;

	font-family: monospace !important;

	.ace-editor * {
		direction: ltr !important;
	}

	div {
		z-index: 0;
	}

	.ace_gutter {
		z-index: 0;
		padding: 0px;
	}
	.ace_content {
		padding: 0px;
	}

	.ace_comment {
		margin: 8px;
	}

	.ace_placeholder {
		z-index: 0;
		margin: 8px;
	}
`

export const insertJavascript = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		type: 'javascript',
		codeText:
			"const LookHereHuman = () => {\nreturn alert('You can put Javascript directly here, it will be executed in your live project.')\n}\n\nLookHereHuman()",
		children: [{ text: '' }],
	})
}

export const withJavascript = (editor: Editor) => {
	const { insertBreak } = editor

	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'javascript',
		})
		if (match) {
			// we are on a hint, insert a new line instead of a paragraph
			Transforms.insertText(editor, '\n')
			return
		}
		insertBreak()
	}

	return editor
}
