import { ReactNode } from 'react'
import { Editor, Element, Range, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { NLanguages } from '../../../../../utils/languages'
import { useNoticeEditorContext } from '../Contexts/NoticeEditor.provider'
import { NTransforms } from '../noticeEditor'
import { CustomText } from '../types'

export const QUOTE_TYPE = 'quote'

export interface QuoteBlock {
	type: typeof QUOTE_TYPE
	children: CustomText[]
	id?: string
}

interface QuoteProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
}

export const Quote = ({ children, attributes }: QuoteProps) => {
	const { lang } = useNoticeEditorContext()
	const isRtl = NLanguages.checkRtl(lang)

	return (
		<StyledQuote {...attributes} isRtl={isRtl}>
			{children}
		</StyledQuote>
	)
}

const StyledQuote = styled.blockquote<{ isRtl?: boolean }>`
	${(props) => props.theme.fonts.editor}
	border-left: ${({ isRtl, theme }) => (isRtl ? '0px solid' : `3px solid ${theme.colors.greyDark}`)};
	border-right: ${({ isRtl, theme }) => (isRtl ? `3px solid ${theme.colors.greyDark}` : '')};

	cursor: text;

	max-width: 100%;
	width: 100%;
	white-space: pre-wrap;
	word-break: break-word;
	caret-color: ${({ theme }) => theme.colors.textDark};
	margin: 4px 0px 4px 0px;
	padding: ${({ isRtl, theme }) => (isRtl ? `2px 14px 2px 0px` : '2px 0px 2px 14px')};
`

export const insertQuoteBlock = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, { type: 'quote', children: [{ text: '' }] })
}

export const withQuote = (editor: Editor) => {
	const { insertBreak, deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const [match] = Editor.nodes(editor, {
				match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'quote',
			})

			// if the block is empty, don't do anything
			if (match && !Editor.string(editor, match?.[1])) {
				return
			}
		}

		deleteBackward(...args)
	}
	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'quote',
		})
		if (match) {
			// we are on a checklist, insert one after the current node
			Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
			return
		}
		insertBreak()
	}

	return editor
}
