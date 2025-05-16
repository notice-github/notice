import { ReactNode } from 'react'
import { Editor, Element, Node, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { EditorOptions } from '../Editor'
import { CustomText } from '../types'

export const PARAGRAPH_TYPE = 'paragraph'

export interface ParagraphBlock {
	type: typeof PARAGRAPH_TYPE
	children: CustomText[]
	id?: string
}

interface ParagraphProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
}

export const Paragraph = ({ children, attributes }: ParagraphProps) => {
	return <StyledParagraph {...attributes}>{children}</StyledParagraph>
}

const StyledParagraph = styled.div`
	${(props) => props.theme.fonts.editor}

	margin: 0;
	cursor: text;

	max-width: 100%;
	width: 100%;
	white-space: pre-wrap;
	word-break: break-word;
	caret-color: var(--ntc-user-font-color);
	padding: var(--ntc-user-block-padding) 0;
	line-height: var(--ntc-user-p-line-height);
	font-weight: 400;
`

export const withParagraphNorm = (editor: Editor, editorOptions: EditorOptions) => {
	const { editOnly } = editorOptions
	const { normalizeNode } = editor

	editor.normalizeNode = (entry) => {
		const [node, path] = entry

		const element = Node.get(editor, [editor.children.length - 1])

		// insert a paragraph at the end of the editor if the end block is not a paragraph
		// it allows user to always have an empty paragraph to select at the bottom
		if (!editOnly && element && Editor.isBlock(editor, element) && element.type !== 'paragraph') {
			Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { at: [editor.children.length] })
		}

		// If the element is a paragraph, ensure its children are valid.
		if (!!editOnly && Element.isElement(node) && node.type === 'paragraph') {
			for (const [child, childPath] of Node.children(editor, path)) {
				if (Element.isElement(child) && !editor.isInline(child)) {
					Transforms.unwrapNodes(editor, { at: childPath })
					return
				}
			}
		}

		// Fall back to the original `normalizeNode` to enforce other constraints.
		normalizeNode(entry)
	}

	return editor
}

export const insertParagraph = (editor: Editor, children?: Array<{ text: string }>) => {
	Transforms.insertNodes(editor, { type: 'paragraph', children: children ?? [{ text: '' }] })
}
