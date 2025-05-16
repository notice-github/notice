// libs
import { ReactNode } from 'react'
import { Editor, Transforms, Range, Element } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled from 'styled-components'
import { NTransforms } from '../noticeEditor'

// types
import { CustomText } from '../types'

// HINT BLOCK
export enum HintSubtypeEnum {
	INFO = 'INFO',
	WARNING = 'WARNING',
	TIP = 'TIP',
	DANGER = 'DANGER',
}

export type HintBlock = {
	type: 'hint'
	children: CustomText[]
	subtype: HintSubtypeEnum
	id?: string
}

interface HintProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: HintBlock
}

const hintSubtypes = {
	[HintSubtypeEnum.INFO]: {
		icon: '📘',
		color: 'primaryDark',
	},
	[HintSubtypeEnum.WARNING]: {
		icon: '⚠️',
		color: 'warning',
	},
	[HintSubtypeEnum.DANGER]: {
		icon: '🚫',
		color: 'error',
	},
	[HintSubtypeEnum.TIP]: {
		icon: '🌱',
		color: 'success',
	},
}

const changeSubType = (editor: Editor, currentSubtype: HintSubtypeEnum, element: Element) => {
	const path = ReactEditor.findPath(editor, element)
	const subtypes = Object.keys(HintSubtypeEnum)
	const subIndex: number = subtypes.findIndex((t) => t === currentSubtype)
	// TODO: fix typing
	// @ts-ignore
	const nextSubtype = subtypes[subtypes.length - 1 === subIndex ? 0 : [subIndex + 1]]
	Transforms.setNodes(editor, { type: 'hint', subtype: nextSubtype }, { at: path })
}

export const withHint = (editor: Editor) => {
	const { insertBreak, deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const [match] = Editor.nodes(editor, {
				match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'hint',
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
			match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'hint',
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

export const Hint = ({ children, attributes, element }: HintProps) => {
	const editor = useSlate()
	const { subtype = HintSubtypeEnum.INFO } = element

	const { icon, color } = hintSubtypes[subtype]
	return (
		<StyledHint color={color}>
			<IconContainer
				contentEditable={false}
				onClick={(e) => {
					changeSubType(editor, subtype, element)
				}}
			>
				{icon}
			</IconContainer>
			<StyledP {...attributes}>{children}</StyledP>
		</StyledHint>
	)
}

const StyledP = styled.p`
	width: 100%;
	cursor: text;
	padding-right: 18px;
	min-width: 0;
`

const IconContainer = styled.div`
	width: 44px;
	margin-left: 16px;
	cursor: pointer;
`

const StyledHint = styled.div<any>`
	padding-top: 16px;
	padding-bottom: 16px;
	margin-bottom: 8px;
	margin-top: 8px;
	background-color: ${({ theme }) => theme.colors.primaryExtraLight};
	box-sizing: border-box;
	display: flex;
	border-left: 4px solid ${({ theme, color }) => theme.colors[color]};
	border-radius: 4px;
`

export const insertHint = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, [{ type: 'hint', subtype: HintSubtypeEnum.INFO, children: [{ text: '' }] }])
}
