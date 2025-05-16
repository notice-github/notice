// libs
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue'
import { ReactNode, useState } from 'react'
import AceEditor from 'react-ace'
import { Editor, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled, { useTheme } from 'styled-components'
import { Modals } from '../../../../../../components/Modal'
import { PlayIcon } from '../../../Icons'
import Tooltip from '../../Components/Tooltip'
import { useIsHovered } from '../../hooks/useIsHovered'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'

export interface HTMLBlock {
	type: 'html'
	children: CustomText[]
	codeText?: string
	id?: string
}

interface HTMLProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: HTMLBlock
	id?: string
}

export const HTMLElement = ({ element, attributes, children }: HTMLProps) => {
	const editor = useSlate()

	const { codeText } = element

	const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)
	const isHovered = useIsHovered([parentRef]).some(Boolean)
	const theme = useTheme()

	function onChange(newValue: string) {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { codeText: newValue }, { at: path })
	}

	return (
		<div contentEditable={false} {...attributes}>
			<StyledContainer ref={setParentRef}>
				{isHovered && (
					<OptionsWrapper onClick={() => Modals.previewHTML.open({ html: codeText ?? '' })}>
						<Tooltip content="Click to preview" placement="bottom" offset={[0, 10]}>
							<PlayIcon color={theme.colors.white} size={24} />
						</Tooltip>
					</OptionsWrapper>
				)}
				<AceEditor
					value={codeText}
					style={{ width: '100%', paddingBottom: '25px', borderRadius: '6px' }}
					mode={'html'}
					fontSize={14}
					maxLines={Infinity}
					theme={'tomorrow_night_blue'}
					placeholder="write a html snippet..."
					onChange={onChange}
					showGutter={true}
					readOnly={false}
					wrapEnabled
					showPrintMargin
					highlightActiveLine={false}
					name="notice-html-code-block"
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

const OptionsWrapper = styled.span`
	background-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 4px;
	right: 10px;
	padding: 4px 4px 0px 4px;
	border-radius: 25%;
	z-index: 4;
	transition: 0.3s ease;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.colors.twilightDarkGrey};
	}
`

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

export const insertHTML = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		type: 'html',
		codeText: `
   <style>
       .flex-button {
		  width: 130px;
		  height: 40px;
		  border: none;
		  background-color: #ff3466 !important;
		  color: #FFF !important;
		  border-radius: 6px;
		  font-size: 18px;
		  letter-spacing: 1px;
		  outline: none;
		  cursor: pointer;
          overflow: hidden;
          transition: all 0.2s;
		  margin: auto;
		  display: flex;
          align-items: center;
	    }
	</style>
	<button
		    class='flex-button'
		   onclick="alert('🔥 this button is created with the HTML block 🔥')"
		   role="button">
			 click me 🤩
	</button>`,
		children: [{ text: '' }],
	})
}

export const withHTML = (editor: Editor) => {
	const { insertBreak } = editor

	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'html',
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
