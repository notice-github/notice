// ace editor
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-pastel_on_dark'
// languages
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-clojure'
import 'ace-builds/src-noconflict/mode-csharp'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/mode-graphqlschema'
import 'ace-builds/src-noconflict/mode-handlebars'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-ruby'
import 'ace-builds/src-noconflict/mode-rust'
import 'ace-builds/src-noconflict/mode-sass'
import 'ace-builds/src-noconflict/mode-tsx'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/theme-gob'
// theme
import 'ace-builds/src-noconflict/theme-cloud9_night'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-iplastic'
import 'ace-builds/src-noconflict/theme-nord_dark'
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/theme-pastel_on_dark'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-vibrant_ink'

import { ReactNode } from 'react'
import AceEditor from 'react-ace'
import { Editor, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled from 'styled-components'
import { Show } from '../../Components/Show'
import { useNoticeEditorContext } from '../../Contexts/NoticeEditor.provider'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'
import { CodeOptionSelector } from './CodeOptionSelector'
import { LANGUAGES, THEMES } from './data'

/*
LANGUAGES.forEach(async (lang) => React.lazy(await import(`ace-builds/src-noconflict/mode-${lang}`)))

THEMES.forEach((theme) => import(`ace-builds/src-noconflict/theme-${theme}`)) */

export const CODE_BLOCK_TYPE = 'code'
export interface CodeBlock {
	type: typeof CODE_BLOCK_TYPE
	children: CustomText[]
	codeText?: string
	showGutter?: boolean
	codeTheme?: string
	language?: string
	id?: string
}

interface CodeProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: CodeBlock
}

export const CodeElement = ({ element, attributes, children }: CodeProps) => {
	const editor = useSlate()
	const { editOnly, readOnly } = useNoticeEditorContext()

	const { language, codeText, codeTheme } = element

	function onChange(newValue: string) {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { codeText: newValue }, { at: path })
	}

	const handleLangSelection = (value: string) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { language: value }, { at: path })
	}
	const handleThemeSelection = (value: string) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { codeTheme: value }, { at: path })
	}

	return (
		<div {...attributes}>
			<StyledContainer contentEditable={false}>
				<AceEditor
					value={codeText}
					style={{ width: '100%', minHeight: '50px', paddingBottom: '40px', borderRadius: '6px' }}
					mode={language}
					fontSize={14}
					maxLines={Infinity}
					theme={codeTheme}
					placeholder="write code you want to display inside here... (you can also choose languages and themes)"
					onChange={onChange}
					showGutter={true}
					wrapEnabled
					highlightActiveLine={false}
					name="notice-code-block"
					setOptions={{
						cursorStyle: 'smooth',
						tabSize: 2,
					}}
				></AceEditor>
				<div contentEditable={false}>{children}</div>
			</StyledContainer>
			<Show when={!editOnly && !readOnly}>
				<ActionFlex>
					<CodeOptionSelector
						defaultValue={LANGUAGES.find((i) => i.value === language)}
						type={'language'}
						data={LANGUAGES}
						onChange={handleLangSelection}
					/>
					<CodeOptionSelector
						defaultValue={THEMES.find((i) => i.value === codeTheme)}
						type={'theme'}
						data={THEMES}
						onChange={handleThemeSelection}
					/>
				</ActionFlex>
			</Show>
		</div>
	)
}

const StyledContainer = styled.div`
	width: 100%;
	height: auto;
	position: relative;
	margin: var(--ntc-user-block-padding) 0;
	font-family: monospace !important;

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
		margin: 0px;
	}

	.ace_placeholder {
		z-index: 0;
		margin: 0px;
	}

	.ace_print-margin {
		display: none;
	}

	* {
		direction: ltr !important;
	}
`

const ActionFlex = styled.div`
	padding: 4px;
	display: flex;
	flex-direction: row;
	position: absolute;
	bottom: 12px;
	gap: 4px;
	right: 3px;
	width: auto;
	height: auto;
`

export const insertCode = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, [
		{
			type: 'code',
			language: 'plain_text',
			codeTheme: 'one_dark',
			codeText: '// Some code',
			children: [{ text: '' }],
		},
	])
}

export const withCode = (editor: Editor) => {
	const { insertBreak, isVoid } = editor

	editor.isVoid = (element) => (element.type === 'code' ? true : isVoid(element))

	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'code',
		})
		if (match) {
			// we are on a code block, insert a new line instead of a paragraph
			Transforms.insertText(editor, '\n')
			return
		}
		insertBreak()
	}

	return editor
}
