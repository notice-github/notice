import { ReactNode } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor, RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { MenuItem } from '../Components/Menu/MenuItem'
import { MenuSeparator } from '../Components/Menu/MenuSeparator'
import { NTransforms } from '../noticeEditor'
import { CustomText } from '../types'
import { insertParagraph } from './Paragraph'

interface HeaderProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	as: 'h1' | 'h2' | 'h3'
}

export const Header = ({ children, attributes, as = 'h1' }: HeaderProps) => {
	const As = as
	return (
		<StyledTitle>
			<As {...attributes}>{children}</As>
		</StyledTitle>
	)
}

export const withHeader = (editor: Editor) => {
	const { insertBreak } = editor

	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) =>
				!Editor.isEditor(n) && Editor.isBlock(editor, n) && ['header-1', 'header-2', 'header-3'].includes(n.type),
		})
		if (match) {
			insertParagraph(editor)
			return
		}
		insertBreak()
	}

	return editor
}

const StyledTitle = styled.div`
	cursor: text;

	h1 {
		padding: var(--ntc-user-headings-padding);
		span {
			font-size: var(--ntc-user-h1-size);
			font-weight: var(--ntc-user-h1-weight);
		}
	}

	h2 {
		padding: var(--ntc-user-headings-padding);
		span {
			font-size: var(--ntc-user-h2-size);
			font-weight: var(--ntc-user-h2-weight);
		}
	}
	h3 {
		padding: var(--ntc-user-headings-padding);
		span {
			font-size: var(--ntc-user-h3-size);
			padding: var(--ntc-user-headings-padding);
			font-weight: var(--ntc-user-h3-weight);
		}
	}
`

interface BaseHeaderBlock {
	children: CustomText[]
	id?: string
	isSection?: boolean
}

export interface Header1Block extends BaseHeaderBlock {
	type: typeof HEADER1_TYPE
}
export interface Header2Block extends BaseHeaderBlock {
	type: typeof HEADER2_TYPE
}
export interface Header3Block extends BaseHeaderBlock {
	type: typeof HEADER3_TYPE
}

export const HEADER1_TYPE = 'header-1'
export const insertHeader1 = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, { type: HEADER1_TYPE, isSection: false, children: [{ text: '' }] })
}

export const HEADER2_TYPE = 'header-2'
export const insertHeader2 = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, { type: HEADER2_TYPE, isSection: false, children: [{ text: '' }] })
}

export const HEADER3_TYPE = 'header-3'
export const insertHeader3 = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, { type: HEADER3_TYPE, isSection: false, children: [{ text: '' }] })
}

export const headerActionMenu = (editor: Editor, element: any) => {
	const { isSection } = element

	const handleSectionSelection = () => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { isSection: !isSection }, { at: path })
	}

	return [
		<MenuSeparator key={'divider'} />,
		<MenuItem
			text="Mark as section"
			onClick={() => {
				handleSectionSelection()
			}}
			optionSelectable
			isSelected={isSection}
			name="mark as section"
			key="mark as section"
			subtype="MenuItem"
		/>,
	]
}
